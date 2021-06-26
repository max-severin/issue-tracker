'use strict';

const { getIssues, createIssue } = require('../controllers/controllers');

module.exports = function (app) {

  app.route('/api/issues/:project')
  
    .get(getIssues)
    
    .post(createIssue)
    
    .put(function (req, res){
      let project = req.params.project;
      
    })
    
    .delete(function (req, res){
      let project = req.params.project;
      
    });
    
};
