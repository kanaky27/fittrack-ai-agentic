export default {
  routes: [
    {
      method: 'POST',
      path: '/analyze-food',
      handler: 'api::meal.meal.analyzeFood'
    }
  ]
};
