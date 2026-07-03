module.exports = {
  routes: [
    {
      method: 'GET',
      path: '/rewards/project/:projectId',
      handler: 'reward.findByProject',
      config: {
        auth: false, // coloque true se quiser exigir autenticação
      },
    },
  ],
};