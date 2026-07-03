/**
 * `project-populate` middleware
 */

import { Strapi } from '@strapi/strapi';

const populate = {
  seasons: {
    populate: {
      collections: {
        populate: {
          artifacts: {
            populate:{
              images:true
            }
          }
        }
      }
    }
  }
};

export default (config, { strapi }: { strapi: Strapi }) => {
  // Add your own logic here.
  return async (ctx, next) => {
    strapi.log.info('In project-populate middleware.');

    // let projectId;

    // if (ctx.state.user) {
    //   const user = await strapi.query('plugin::users-permissions.user').findOne({
    //     // select: ['title', 'description'],
    //     where: { id: ctx.state.user.id },
    //     populate: { project: true },
    //   });

    //   strapi.log.info(JSON.stringify(user));

    //   if (user.project)
    //       projectId = user.project.id;
    // }

    // inject the populate object into the context's query object
    ctx.query = {
      // filters: {
      //   id: {
      //     $eq: projectId
      //   }
      // },
      populate,
      ...ctx.query,
      // ...(projectId && {
      //   filters: {
      //     id: {
      //       $eq: projectId
      //     }
      //   }})
    };

    await next();
  };
};
