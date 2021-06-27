'use strict';

const { ObjectId, issueModel, projectModel } = require('../models/models');

const createIssue = async (req, res) => {
  const NOW = Date.now();
  const project = req.params.project;
  const { 
    issue_title, 
    issue_text, 
    created_by, 
    assigned_to, 
    status_text 
  } = req.body;

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
      created_on: NOW,
      updated_on: NOW,
    });

    const projectUpdated = await projectModel.findOneAndUpdate(
      { name: project },
      { $push: {
          issues: issueNew
      }},
      { new: true, upsert: true }
    );

    if (projectUpdated) {
      return res.status(200).json(issueNew);
    }
  } catch (error) {
    return res.status(200).json({
      error,
      message: 'Server Error',
    });
  };
};

const getIssues = async (req, res) => {
  const project = req.params.project;
  let filter = {};
    
  if (Object.keys(req.query).length > 0) {
    filter = { 
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
      
      filter.issues.$filter.cond.$and.push({ 
        $eq: [`$$issues.${key}`, value]
      });
    }
  }

  try {
    let projectFound = await projectModel.findOne(
      { name: project },
      filter
    );

    return res.status(200).json(projectFound.issues ? projectFound.issues : []);
  } catch(error) {
    return res.status(200).json({
      error,
      message: 'Server Error',
    });
  };
};

const updateIssue = async (req, res) => {
  const NOW = Date.now();
  const project = req.params.project;
  const { _id, ...bodyFields } = req.body;
  let updateFields = {};

  if (!_id) {
    return res.status(200).json({
      error: 'missing _id',
    });
  }

  if (Object.keys(bodyFields).length === 0) {
    return res.status(200).json({
      error: 'no update field(s) sent',
      _id,
    });
  }    

  for (const key in bodyFields) {
    let value = bodyFields[key];

    if (key === 'open') {
      value = (value === 'true');
    }

    if ([ 'issue_title', 'issue_text', 'created_by', 'assigned_to', 'status_text', 'open' ].includes(key)) {          
      updateFields[`issues.$.${key}`] = value;
    }
  }

  updateFields['issues.$.updated_on'] = NOW;

  try {
    const projectUpdated = await projectModel.findOneAndUpdate(
      { name: project, 'issues._id': new ObjectId(_id) },
      { $set: updateFields },
      { new: true }
    );

    if (!projectUpdated) {
      return res.status(200).json({
        error: 'could not update',
        _id,
      });
    }

    return res.status(200).json({
      result: 'successfully updated',
      _id,
    });
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

  if (Object.keys(req.body).length > 1) {
    return res.status(200).json({
      error: 'could not delete',
      _id,
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

    if (!projectUpdated) {
      return res.status(200).json({
        result: 'successfully deleted',
        _id,
      });
    }

    return res.status(200).json({
      result: 'successfully deleted',
      _id,
    });
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