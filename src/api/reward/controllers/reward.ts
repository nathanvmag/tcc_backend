const { createCoreController } = require('@strapi/strapi').factories;

module.exports = createCoreController('api::reward.reward', ({ strapi }) => ({
  async findByProject(ctx) {
    try {
      const { projectId } = ctx.params;

      if (!projectId) {
        return ctx.badRequest('Project ID é obrigatório');
      }

      // Busca todos os rewards vinculados ao projeto informado
      const rewards = await strapi.entityService.findMany('api::reward.reward', {
        filters: { project: projectId ,valid:true},
        populate: ['project'],
        sort: { createdAt: 'desc' },
        });

      return rewards;
    } catch (error) {
      console.error('Erro ao buscar rewards por projeto:', error);
      return ctx.internalServerError('Erro interno ao buscar rewards');
    }
  },
}));
