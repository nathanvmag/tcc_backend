/**
 * is-owner policy
 */

export default async (policyContext, config, { strapi }) => {
    // Add your own logic here.
    strapi.log.info('In is-owner policy.');

    const { state, params } = policyContext;

    if (!state.isAuthenticated)
      return false;

    const api = state.route.info.apiName;

    const controller = api; // assume controller same as api name

    const service = strapi.service(`api::${api}.${controller}`);

    if (!service)
      return false;

    if (!params.id) {
      strapi.log.info('ID parameter was not informed');
      return true;
    }

    const {
      results: [content]
    } = await service.find({
      filters: {
        id: {
          $eq: params.id
        },
        user: {
          id: {
            $eq: state.user.id
          }
        }
      },
    });

    return !!content
};
