import lifecycles from './extensions/users-permissions/content-types/user/lifecycles';

export default {
  /**
   * An asynchronous register function that runs before
   * your application is initialized.
   *
   * This gives you an opportunity to extend code.
   */
  register(/*{ strapi }*/) {},

  /**
   * An asynchronous bootstrap function that runs before
   * your application gets started.
   *
   * This gives you an opportunity to set up your data model,
   * run jobs, or perform some special logic.
   */
  async bootstrap({ strapi }) {
    strapi.db.lifecycles.subscribe({
      models: ['plugin::users-permissions.user'],
      ...lifecycles,
    });

    // // const superAdmin = await strapi.db.query('admin::user').findOne({where: {username: 'admin'}});
    // // const superAdmin = await strapi.db.query('admin::user').findOne({where: {email: 'admin@domain.com'}, populate: ['roles']});
    // const superAdmins = await strapi.db.query('admin::user').findMany({
    //   filters: {
    //     roles: {
    //       code: {
    //         $eq: 'strapi-super-admin'
    //         // $eq: 'strapi-editor'
    //         // $eq: 'strapi-author'
    //       }
    //     }
    //   },
    //   // populate: ['role']
    // });
    // strapi.log.info(JSON.stringify(superAdmins));
  },
};
