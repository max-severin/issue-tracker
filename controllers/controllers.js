'use strict';

const { ObjectId, issueModel, projectModel } = require('../models/models');

const createIssue = async (req, res) => {
  const project = req.params.project;
  const { issue_title, issue_text, created_by, assigned_to, status_text } = req.body;
  const now = Date.now();

  if (!issue_title || !issue_text || !created_by) {
    return res.status(200).json({
      error: 'required field(s) missing',
    });
  }

  try {
    const issueNew = new issueModel({
      issue_title,
      issue_text,
      created_by,
      assigned_to: assigned_to ? assigned_to : '',
      status_text: status_text ? status_text : '',
      created_on: now,
      updated_on: now,
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

    return res.status(200).json(issueNew);
  } catch (error) {
    return res.status(500).json({
      error,
      message: 'Server Error',
    });
  };
};

const getIssues = async (req, res) => {
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

      if (key === '_id') {
        value = new ObjectId(value);
      }
      
      filterObj.issues.$filter.cond.$and.push({ 
        $eq: [`$$issues.${key}`, value]
      });
    }
  }

  try {
    let projectObj = await projectModel.findOne(
      { name: project },
      filterObj
    );

    return res.status(200).json(projectObj.issues ? projectObj.issues : []);
  } catch(error) {
    return res.status(500).json({
      error,
      message: 'Server Error',
    });
  };
};

const updateIssue = async (req, res) => {
  const project = req.params.project;
  const { _id, ...issueFields } = req.body;
  let setObj = {};

  if (!_id) {
    return res.status(200).json({
      error: 'missing _id',
    });
  }

  if (Object.keys(issueFields).length === 0) {
    return res.status(200).json({
      error: 'no update field(s) sent',
      _id,
    });
  }    

  for (const key in issueFields) {
    let value = issueFields[key];

    if (key === 'open') {
      value = (value === 'true');
    }

    if ([ 'issue_title', 'issue_text', 'created_by', 'assigned_to', 'status_text', 'open' ].includes(key)) {          
      setObj[`issues.$.${key}`] = value;
    }
  }

  setObj['issues.$.updated_on'] = new Date();

  try {
    const projectUpdated = await projectModel.findOneAndUpdate(
      { name: project, 'issues._id': new ObjectId(_id) },
      { $set: setObj },
      { new: true }
    );

    if (projectUpdated) {
      return res.status(200).json({
        result: 'successfully updated',
        _id,
      });
    }
  } catch(error) {
    return res.status(200).json({
      error: 'could not update',
      _id,
    });
  };
};

const deleteIssue = async (req, res) => {
  const project = req.params.project;
  const { _id } = req.body;

  if (!_id) {
    return res.status(200).json({
      error: 'missing _id',
    });
  }

  try {
    const projectUpdated = await projectModel.findOneAndUpdate(
      { name: project },
      { $pull: {
          issues: { 
            _id: new ObjectId(_id)
          } 
      }},
      { new: true }
    );

    if (projectUpdated) {
      return res.status(200).json({
        result: 'successfully deleted',
        _id,
      });
    }
  } catch(error) {
    return res.status(200).json({
      error: 'could not delete',
      _id,
    });
  }

};

module.exports = {
  createIssue,
  getIssues,
  updateIssue,
  deleteIssue,
};