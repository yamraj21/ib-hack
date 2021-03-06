const Project = require("../models/project");

let middleObj = {};

middleObj.isLoggedIn = (req, res, next) => {
  if (req.isAuthenticated()) return next();
  else {
    res.redirect("/");
  }
};

middleObj.isProjectAccessAllowed = (req, res, next) => {
  next();
  // if (req.isAuthenticated() && req.params.id) {
  //   Project.findById(req.params.id, (err, project) => {
  //     if (err) {
  //       console.log(err);
  //       res.redirect("/");
  //     } else {
  //       if (project.members.indexOf(req.user._id) !== -1) {
  //         next();
  //       } else {
  //         res.redirect("/");
  //       }
  //     }
  //   });
  // } else {
  //   console.log('not authenticated or '+ req.params.id);
  //   res.redirect("/");
  // }
};

middleObj.isTaskAccessAllowed = (req, res, next) => {
  next();
  // if (req.isAuthenticated()) {
  //   Task.findById(req.params.task_id, (err, task) => {
  //     if (err) {
  //       console.log(err);
  //       res.redirect("/tasks");
  //     } else {
  //       if (
  //         task.created_by == req.user._id ||
  //         task.assigned_to == req.user._id
  //       ) {
  //         next();
  //       } else {
  //         res.redirect("/tasks");
  //       }
  //     }
  //   });
  // } else {
  //   res.redirect("/tasks");
  // }
};

module.exports = middleObj;
