/**
 * collect-artifact-only-once policy
 */

export default async (policyContext, config, { strapi }) => {
    // Add your own logic here.
    strapi.log.info('In collect-artifact-only-once policy.');

    const { state, request: { body = {} } } = policyContext;

    if (!state.isAuthenticated) {
      return false;
    }

    if (!body?.data?.artifact) {
      return false;
    }

    const service = strapi.service(`api::collectible.collectible`);

    if (!service) {
      return false;
    }

    const {
      results: [content]
    } = await service.find({
      filters: {
        user: {
          id: {
            $eq: state.user.id
          },
        },
        artifact: {
          id: {
            $eq: body.data.artifact
          }
        }
      },
      populate: {
        artifact: true,
        user: true,
      },
    });

    return !content;
};
