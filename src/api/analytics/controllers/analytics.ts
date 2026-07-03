/**
 * A set of functions called "actions" for `analytics`
 */

export default {
  getArtifacts: async (ctx, next) => {
    try {
      const data = await strapi
        .service("api::analytics.analytics")
        .getArtifacts();

      // console.log("Data", data);
      console.log(JSON.stringify({
        data,
        user: ctx.state.user,
        auth: ctx.state.auth
      }));

      ctx.body = data;
    } catch (err) {
      ctx.badRequest("Analytics controller error", { moreDetails: err });
    }
  }

  // exampleAction: async (ctx, next) => {
  //   try {
  //     ctx.body = 'ok';
  //   } catch (err) {
  //     ctx.body = err;
  //   }
  // }
};
