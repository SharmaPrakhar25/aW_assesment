// eslint-disable-next-line no-unused-vars
const resourceController = require('../controller/resource');

module.exports = (app) => {
  app.get('/resources', resourceController.getResources);
};
