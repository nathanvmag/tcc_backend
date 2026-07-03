/**
 * project router
 */

import { factories } from '@strapi/strapi';

export default factories.createCoreRouter('api::project.project', {
  config: {
    find: {
      // policies: ['api::project.is-same-project']
      middlewares: ['api::project.project-populate']
    },
    findOne: {
      // policies: ['api::project.is-same-project']
      middlewares: ['api::project.project-populate']
    },
  }
});
