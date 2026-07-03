// https://docs.strapi.io/dev-docs/plugins-extension#within-the-extensions-folder

"use strict";

import _ from "lodash";

const { concat, compact, isArray } = require('lodash/fp');

const {
  errors,
  sanitize,
  yup,
  validateYupSchema,
  contentTypes: {
    getNonWritableAttributes
  },
} = require('@strapi/utils');

const { ApplicationError, ValidationError, ForbiddenError } = errors;

const callbackSchema = yup.object({
  identifier: yup.string().required(),
  password: yup.string().required(),
});

const registerSchema = yup.object({
  email: yup.string().email().required(),
  username: yup.string().optional(),
  password: yup.string().required(),
  project: yup.number().required().positive().integer(),
});

const forgotPasswordSchema = yup.object({
  email: yup.string().email().required(),
}).noUnknown();

const resetPasswordSchema = yup.object({
  password: yup.string().required(),
  passwordConfirmation: yup.string().required(),
  code: yup.string().required(),
}).noUnknown();

const sanitizeUser = (user, ctx) => {
  const { auth } = ctx.state;

  const userSchema = strapi.getModel('plugin::users-permissions.user');

  return sanitize.contentAPI.output(user, userSchema, { auth });
};

module.exports = (plugin) => {
  // override 'login' controller
  plugin.controllers.auth.callback = async (ctx) => {
    console.log('user login override');

    const provider = ctx.params.provider || 'local';

    const params = ctx.request.body;

    const pluginStore = strapi.store({ type: 'plugin', name: 'users-permissions' });

    const grantSettings = await pluginStore.get({ key: 'grant' });

    const grantProvider = provider === 'local' ? 'email' : provider;

    if (!_.get(grantSettings, [grantProvider, 'enabled'])) {
      throw new ApplicationError('Este provedor está desativado');
    }

    if (provider === 'local') {
      await validateYupSchema(callbackSchema)(params);

      const { identifier } = params;

      const user = await strapi.query('plugin::users-permissions.user').findOne({
        where: {
          provider,
          $or: [{ email: identifier.toLowerCase() }, { username: identifier }],
        },
      });

      if (!user) {
        throw new ValidationError('Identificador ou senha inválidos');
      }

      if (!user.password) {
        throw new ValidationError('Identificador ou senha inválidos');
      }

      const validPassword = await strapi.service('plugin::users-permissions.user').validatePassword(
        params.password,
        user.password
      );

      if (!validPassword) {
        throw new ValidationError('Identificador ou senha inválidos');
      }

      const advancedSettings = await pluginStore.get({ key: 'advanced' });

      const requiresConfirmation = _.get(advancedSettings, 'email_confirmation');

      if (requiresConfirmation && user.confirmed !== true) {
        throw new ApplicationError('O e-mail da sua conta não está confirmado');
      }

      if (user.blocked === true) {
        throw new ApplicationError('Sua conta foi bloqueada por um administrador');
      }

      return ctx.send({
        jwt: strapi.service('plugin::users-permissions.jwt').issue({ id: user.id }),
        user: await sanitizeUser(user, ctx),
      });
    }

    try {
      const user = await strapi.service('plugin::users-permissions.providers').connect(provider, ctx.query);

      if (user.blocked) {
        throw new ForbiddenError('Sua conta foi bloqueada por um administrador');
      }

      return ctx.send({
        jwt: strapi.service('plugin::users-permissions.jwt').issue({ id: user.id }),
        user: await sanitizeUser(user, ctx),
      });
    } catch (error) {
      throw new ApplicationError(error.message);
    }
  };

  // override 'register' controller
  plugin.controllers.auth.register = async (ctx) => {
    console.log('user registration override');

    const pluginStore = strapi.store({ type: 'plugin', name: 'users-permissions' });

    const settings: any = await pluginStore.get({ key: 'advanced' });

    if (!settings.allow_register) {
      throw new ApplicationError('A ação de registro está atualmente desativada');
    }

    const { register }: any = strapi.config.get('plugin.users-permissions');

    const alwaysAllowedKeys = ['username', 'password', 'email'];

    const userModel = strapi.contentTypes['plugin::users-permissions.user'];

    const { attributes }: any = userModel;

    const nonWritable = getNonWritableAttributes(userModel);

    const allowedKeys = compact(
      concat(
        alwaysAllowedKeys,
        isArray(register?.allowedFields)
          ? // Note that we do not filter allowedFields in case a user explicitly chooses to allow a private or otherwise omitted field on registration
            register.allowedFields // if null or undefined, compact will remove it
          : // to prevent breaking changes, if allowedFields is not set in config, we only remove private and known dangerous user schema fields
            // TODO V5: allowedFields defaults to [] when undefined and remove this case
            Object.keys(attributes).filter(
              (key) =>
                !nonWritable.includes(key) &&
                !attributes[key].private &&
                ![
                  // many of these are included in nonWritable, but we'll list them again to be safe and since we're removing this code in v5 anyway
                  // Strapi user schema fields
                  'confirmed',
                  'blocked',
                  'confirmationToken',
                  'resetPasswordToken',
                  'provider',
                  'id',
                  'role',
                  // other Strapi fields that might be added
                  'createdAt',
                  'updatedAt',
                  'createdBy',
                  'updatedBy',
                  'publishedAt', // d&p
                  'strapi_reviewWorkflows_stage', // review workflows
                ].includes(key)
            )
      )
    );

    const params = {
      ..._.pick(ctx.request.body, allowedKeys),
      provider: 'local',
    };

    await validateYupSchema(registerSchema)(params);

    const role = await strapi
      .query('plugin::users-permissions.role')
      .findOne({ where: { type: settings.default_role } });

    if (!role) {
      throw new ApplicationError('Não foi possível encontrar o papel padrão');
    }

    let { email, username, provider }: any = params;

    if (!username) {
      username = email.match(/^(.+)@/)[1];
    }

    const identifierFilter = {
      $or: [
        { email: email.toLowerCase() },
        { username: email.toLowerCase() },
        { username },
        { email: username },
      ],
    };

    const conflictingUserCount = await strapi.query('plugin::users-permissions.user').count({
      where: { ...identifierFilter, provider },
    });

    if (conflictingUserCount > 0) {
      throw new ApplicationError('E-mail ou nome de usuário já estão em uso');
    }

    if (settings.unique_email) {
      const conflictingUserCount = await strapi.query('plugin::users-permissions.user').count({
        where: { ...identifierFilter },
      });

      if (conflictingUserCount > 0) {
        throw new ApplicationError('E-mail ou nome de usuário já estão em uso');
      }
    }

    const newUser = {
      ...params,
      role: role.id,
      email: email.toLowerCase(),
      username,
      // username: email.substring(0, email.indexOf("@")).toLowerCase(),
      // username: email.match(/^(.+)@/)[1],
      confirmed: !settings.email_confirmation,
    };

    const user = await strapi.service('plugin::users-permissions.user').add(newUser);

    const sanitizedUser = await sanitizeUser(user, ctx);

    if (settings.email_confirmation) {
      try {
        await strapi.service('plugin::users-permissions.user').sendConfirmationEmail(sanitizedUser);
      } catch (err) {
        throw new ApplicationError(err.message);
      }

      return ctx.send({ user: sanitizedUser });
    }

    const jwt = strapi.service('plugin::users-permissions.jwt').issue(_.pick(user, ['id']));

    return ctx.send({
      jwt,
      user: sanitizedUser,
    });
  };

  // override 'forgotPassword' controller
  plugin.controllers.auth.forgotPassword =   async (ctx) => {
    strapi.log.info('forgot password override');

    const { email } = await validateYupSchema(forgotPasswordSchema)(ctx.request.body);

    if (!email) {
      return ctx.badRequest('Email is missing', {});
    }

    // this can be updated with update instead of RAW query
    const user = await strapi.db.connection.raw(`SELECT id, email FROM up_users WHERE email = '${email}'`)
        .then((result) => result.rows)
        .catch((error) => false);

    if (!user) {
      return ctx.badRequest(`Operation failed`);
    }

    // this can be updated with findOne instead of RAW query
    const results = await strapi.db.connection.raw(`UPDATE up_users
        SET reset_password_token = '${Math.ceil(Math.random() * 100000)}'
        WHERE id = ${user[0].id}
        RETURNING reset_password_token`)
        .then((result) => result.rows)
        .catch((error) => false);

    if (!results) {
      return ctx.badRequest(`Can't update the token`);
    }

    // Make sure you have a template created for forgot password in admin panel
    // @ts-ignore
    const template = strapi.admin.config?.forgotPassword?.emailTemplate;

    if (!template) {
      return ctx.badRequest('Email template not found', {});
    }
    else {
      await strapi.plugins['email'].services.email.sendTemplatedEmail(
          {
              to: user[0].email,
          },
          template,
          {
            // this will replace  %url% with number as token
              url: results[0].reset_password_token
            // change right part of the assesment to anything you need
          }
      );
    }

    return results[0];
  };

  // override 'resetPassword' controller
  plugin.controllers.auth.resetPassword = async (ctx) => {
    strapi.log.info('reset password override');

    const { password, passwordConfirmation, code } = await validateYupSchema(resetPasswordSchema)(ctx.request.body);

    if (password !== passwordConfirmation) {
      throw new ValidationError('As senhas não coincidem');
    }

    const user = await strapi
      .query('plugin::users-permissions.user')
      .findOne({ where: { resetPasswordToken: code }, populate: { project: true }});

    if (!user) {
      throw new ValidationError('Código fornecido incorreto');
    }

    await strapi.service('plugin::users-permissions.user').edit(user.id, {
      resetPasswordToken: null,
      password,
      project: user.project.id
    });

    // Update the user.
    ctx.send({
      jwt: strapi.service('plugin::users-permissions.jwt').issue({ id: user.id }),
      user: await sanitizeUser(user, ctx),
    });
  }

  return plugin;
};
