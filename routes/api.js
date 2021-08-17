'use strict';

module.exports = function (app) {

  app.route('/api/issues/:project')

    .get(function (req, res) {
      let project = req.params.project;
    })

    .post(function (req, res) {
      let project = req.params.project;
      
      // Check required fields
      if (!project.issue_title && !project.issue_text && !project.created_by) {
        res.json({
          error: 'required field(s) missing'
        })
      }
    })

    .put(function (req, res) {
      let project = req.params.project;

    })

    .delete(function (req, res) {
      let project = req.params.project;

    });

};
