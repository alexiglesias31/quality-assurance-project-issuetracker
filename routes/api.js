'use strict';
const Issue = require('../models/issue')

const getFormattedData = postData => {
  let query = {}

  if (postData._id !== undefined) query._id = postData._id
  if (postData.issue_title !== undefined) query.title = postData.issue_title
  if (postData.issue_text !== undefined) query.text = postData.issue_text
  if (postData.created_by !== undefined) query.createdBy = postData.created_by
  if (postData.assigned_to !== undefined) query.assignedTo = postData.assigned_to
  if (postData.status_text !== undefined) query.statusText = postData.status_text
  if (postData.open !== undefined) query.open = postData.open

  return query
}

module.exports = function (app) {

  app.route('/api/issues/:project')

    .get(async function (req, res) {
      let project = req.params.project;
      let query = getFormattedData(req.query);

      query.project = project

      console.log(query)

      let issues = await Issue.find(query);

      console.log(issues)

      let response = issues.map(issue => {
        return {
          "_id": issue._id,
          "issue_title": issue.title,
          "issue_text": issue.text,
          "created_on": issue.createdOn,
          "updated_on": issue.updatedOn,
          "created_by": issue.createdBy,
          "assigned_to": issue.assignedTo,
          "open": issue.open,
          "status_text": issue.statusText
        }
      })

      res.send(response)
    })

    .post(async function (req, res) {
      let project = req.params.project;
      let postData = getFormattedData(req.body);

      // Check required fields
      if (postData.title === undefined || postData.text === undefined || postData.createdBy === undefined) {
        res.json({
          error: 'required field(s) missing'
        })
        return
      }

      // Creates a new issue
      const newIssue = new Issue({
        project: project,
        title: postData.title,
        text: postData.text,
        createdOn: new Date(),
        updatedOn: new Date(),
        createdBy: postData.createdBy,
        assignedTo: postData.assignedTo !== undefined ? postData.assignedTo : '',
        open: true,
        statusText: postData.statusText !== undefined ? postData.statusText : ''
      })
      const issue = await newIssue.save()

      res.json({
        "_id": issue._id,
        "issue_title": issue.title,
        "issue_text": issue.text,
        "created_on": issue.createdOn,
        "updated_on": issue.updatedOn,
        "created_by": issue.createdBy,
        "assigned_to": issue.assignedTo,
        "open": issue.open,
        "status_text": issue.statusText
      })
    })

    .put(async function (req, res) {
      const postData = getFormattedData(req.body)

      if (postData._id === undefined) {
        res.json({
          error: 'missing _id'
        })
        return
      }

      if (Object.keys(postData).length === 1) {
        res.json({
          error: 'no update field(s) sent',
          _id: postData._id
        })
        return
      }

      postData.updatedOn = new Date()

      const issue = await Issue.findByIdAndUpdate(
        postData._id,
        postData,
        {
          new: true
        })

      if (!issue) {
        res.json({
          error: 'could not update', '_id': postData._id
        })
        return
      }

      res.json({
        result: 'successfully updated',
        _id: issue._id,
      })
    })

    .delete(async function (req, res) {
      let project = req.params.project;
      let postData = getFormattedData(req.body)

      if (postData._id === undefined) {
        res.json({
          error: 'missing _id'
        })
        return
      }

      const issue = await Issue.findByIdAndDelete(postData._id)

      if (!issue) {
        res.json({
          error: 'could not delete',
          _id: postData._id,
        })
        return
      }

      res.json({
        result: 'successfully deleted',
        _id: postData._id
      })
    })

};
