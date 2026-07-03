export default {
  routes: [
    {
     method: 'GET',
     path: '/analytics/artifacts',
     handler: 'analytics.getArtifacts',
     config: {
       policies: [],
       middlewares: [],
     },
    },
  ],
};
