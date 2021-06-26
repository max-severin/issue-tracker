'use strict';

const { createIssue, getIssues, updateIssue } = require('../controllers/controllers');

module.exports = function (app) {

  app.route('/api/issues/:project')
  
    .get(getIssues)
    
    .post(createIssue)
    
    .put(updateIssue)
    
    .delete(function (req, res){
      let project = req.params.project;
      
    });
    
};
