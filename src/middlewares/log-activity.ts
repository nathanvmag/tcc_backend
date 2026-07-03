/**
 * `log-activity` middleware
 */

import { Strapi } from '@strapi/strapi';

const removePasswords = (key, value) => key === "password" ? undefined : value;

const getGroup = (path) => {
  if (path !== undefined) {
    if (path.includes("service-request")) {
      return "Service Request";
    }

    // if (path.includes("register")) {
    if (path.includes("local/register")) {
      return "Account Registration";
    }

    // if (path.includes("local")) {
    if (path.includes("local")) {
      return "Account Login";
    }

    if (path.includes("service")) {
      return "Service";
    }

    if (path.includes("content-types") || path.includes("content-manager") || path.includes("users")) {
      return "Admin";
    }
  }

  return "Others";
};

const getAction = (method, path) => {
  // if (path !== undefined) {
  if (path !== undefined && path.startsWith('/api')) {
    if (method === "POST" && path.includes("service-request")) {
      return "Created Service Request";
    }

    if (method === "GET" && path.includes("content-manager")) {
      return "View Content";
    }

    if (method === "POST" && path.includes("content-manager")) {
      return "Create Content";
    }

    if (method === "PUT" && path.includes("content-manager")) {
      return "Update Content";
    }

    if (method === "PUT" && path.includes("users/me")) {
      return "Profile Update";
    }

    if (method === "PUT" && path.includes("users") && !path.includes("me")) {
      return "User Update";
    }

    // if (method === "POST" && path.includes("register")) {
    if (method === "POST" && path.includes("local/register")) {
      return "User Register";
    }

    // if (method === "POST" && path.includes("login")) {
    if (method === "POST" && path.includes("local")) {
      return "User Login";
    }

    if (method === "POST" && path.includes("logout")) {
      return "User Logout";
    }

    if (method === "POST" && path.includes("users/batch-delete")) {
      return "User Delete";
    }

    if (method === "POST" && path.includes("renew-token")) {
      return "Renew Token";
    }
  }

  return "Other Activities";
};

const auditMethods = [
  // "GET",
  "POST",
  "PUT",
  "DELETE"
];

const apiModelUid = 'api::audit.audit';

export default (config, { strapi }: { strapi: Strapi }) => {
  // Add your own logic here.
  return async (ctx, next) => {
    strapi.log.info('In log-activity middleware.');

    await next();

    // Log the activity
    try {
      const url = ctx.request.url;
      strapi.log.info(url);

      const method = ctx.request.method.toUpperCase();
      strapi.log.info(method);

      const action = getAction(method, url);
      strapi.log.info(action);

      // strapi.log.info(ctx.response.status);

      if (action !== "Other Activities") {
        if (method !== undefined && ctx.params.model !== apiModelUid && ctx.params.uid !== apiModelUid) {
          let author = {
            id: 'not found',
            email: 'not found'
          };

          if (ctx.state && ctx.state.user) {
            author = {
              id: ctx.state.user.id,
              email: ctx.state.user.email
            };
          }

          let payload = {
            group: getGroup(url),
            action: action,
            content: ctx.response.body,
            author: author,
            request: ctx.request.body,
            method: method,
            url: url,
            params: ctx.params,
            code: ctx.response.status,
          };

          payload = JSON.parse(JSON.stringify(payload, removePasswords));

          if (auditMethods.includes(method) === true) {
            await strapi.query(apiModelUid).create(
              { data: payload }
            );
          }
        }
      }
    } catch (error) {
      // ignore error
      strapi.log.info("Unable to audit");
      strapi.log.error(error);
    }
  };
};
