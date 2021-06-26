'use strict';

const { issueModel, projectModel } = require('../models/models');

const getIssues = async (req, res) => {
  try {
    const project = req.params.project;

    let filterObj = {};
    
    if (Object.keys(req.query).length > 0) {
      filterObj = { 
        issues: {
          $filter: {
            input: "$issues",
            as: "issues",
            cond: {
              $and: []
            }
          }
        }
      };

      for (const key in req.query) {
        let value = req.query[key];

        if (key === 'open') {
          value = (value === 'true');
        }
        
        filterObj.issues.$filter.cond.$and.push({ 
          $eq: [`$$issues.${key}`, value]
        });
      }
    }

    let projectObj = await projectModel.findOne(
      { name: project },
      filterObj
    );

    res.status(200).json(projectObj.issues ? projectObj.issues : []);

  } catch (error) {
    console.error(error);

    res.status(500).json({
      error,
      message: 'Server Error',
    });
  }
};

const createIssue = async (req, res) => {
  try {
    const project = req.params.project;
    const { issue_title, issue_text, created_by, assigned_to, status_text } = req.body;

    if (!issue_title || !issue_text || !created_by) {
      return res.status(200).json({
        error: 'required field(s) missing',
      });
    }

    const now = Date.now();

    const issueNew = new issueModel({
      issue_title: issue_title,
      issue_text: issue_text,
      created_on: now,
      updated_on: now,
      created_by: created_by,
      assigned_to: assigned_to ? assigned_to : '',
      status_text: status_text ? status_text : '',
    });

    let projectObj = await projectModel.findOne({ name: project });

    if (projectObj) {
      projectObj.issues.push(issueNew);
    } else {
      projectObj = new projectModel({
        name: project,
        issues: [ issueNew ]
      });
    }
    
    await projectObj.save();

    res.status(200).json(issueNew);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      error,
      message: 'Server Error',
    });
  }
};

module.exports = {
  getIssues,
  createIssue,
};