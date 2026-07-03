/**
 * collectible router
 */

import { factories } from '@strapi/strapi';

export default factories.createCoreRouter('api::collectible.collectible', {
  config: {
    create: {
      policies: ['api::collectible.collect-artifact-only-once'],
      middlewares: ['global::assign-owner'],
    },
    update: {
      policies: ['global::is-owner']
    },
    delete: {
      policies: ['global::is-owner']
    }
  }
});
