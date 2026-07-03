/**
 * collectible controller
 */

import { factories } from '@strapi/strapi'

export default factories.createCoreController('api::collectible.collectible', {
  async find(ctx) {
    console.log(ctx)
    const { user } = ctx.state;
    console.log(user.id);

    ctx.query.filters = {
      ...(ctx.query.filters || {}),
      user: user.id
    };

    return super.find(ctx);
  },

  // async findOne(ctx){
  //   const { user } = ctx.state;
  //   console.log(user);

  //   ctx.query.filters = {
  //     ...(ctx.query.filters || {}),
  //     // user: user.id
  //     // user: {
  //     //   id: {
  //     //     $eq: user.id
  //     //   }
  //     // }
  //     populate: {
  //       user: {
  //         // sort: ['name:asc'],
  //         filters: {
  //           id: {
  //             $eq: user.id,
  //           },
  //         },
  //       },
  //     },
  //   };

  //   return super.findOne(ctx);
  // },

  // https://github.com/strapi/strapi/issues/12208#issuecomment-1438583027
  async findOne(ctx) {
    const user = ctx.state.user;
    const { id } = ctx.params;

    const entity = await strapi.query('api::collectible.collectible').findOne({
      where: {
        id,
        user: user.id
      }
    });
    const sanitizedEntity = await this.sanitizeOutput(entity, ctx);

    return this.transformResponse(sanitizedEntity);
  },
});
