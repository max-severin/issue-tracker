'use strict';

const mongoose = require('mongoose');
const { Schema } = mongoose;
const { ObjectId } = mongoose.Types;

const issueSchema = new Schema({
  issue_title: { type: String, required: true },
  issue_text: { type: String, required: true },
  created_by: { type: String, required: true },
  assigned_to: { type: String },
  open: { type: Boolean, reqired: true, default: true },
  status_text: { type: String },
}, {
  timestamps: { createdAt: 'created_on', updatedAt: 'updated_on' },
});

const projectSchema = new Schema({
  name: { type: String, required: true },
  issues: [ issueSchema ],
});

const issueModel = mongoose.model('issues', issueSchema);
const projectModel = mongoose.model('project', projectSchema);

module.exports = {
  ObjectId,
  issueModel,
  projectModel,
};
