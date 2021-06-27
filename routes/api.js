'use strict';

const { createIssue, getIssues, updateIssue, deleteIssue } = require('../controllers/controllers');

module.exports = function (app) {

  app.route('/api/issues/:project')
  
    .get(getIssues)
    
    .post(createIssue)
    
    .put(updateIssue)
    
    .delete(deleteIssue);
    
};
