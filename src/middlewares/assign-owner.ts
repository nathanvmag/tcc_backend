/**
 * `assign-owner` middleware
 */

import { Strapi } from '@strapi/strapi';

export default (config, { strapi }: { strapi: Strapi }) => {
  // Add your own logic here.
  return async (ctx, next) => {
    strapi.log.info('In assign-owner middleware.');

    ctx.request.body.data.user = ctx.state.user.id

    await next();
  };
};
