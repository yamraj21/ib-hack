const express = require("express"),
  router = express.Router(),
  middleware = require("../middlewares/index"),
  Project = require("../models/project");

router.use(middleware.isLoggedIn);

router
  .route("/projects")
  .get((req, res) => {
    Project.find({})
      .where("_id")
      .in(req.currentUser.projects)
      .exec((err, projects) => {
        if (err) {
          console.log(err);
          res.redirect("/projects");
        } else {
          res.send({ projects: projects });
        }
      });
  }) // show all route
  .post((req, res) => {
    let project = req.body.project;
    let user = req.currentUser;
    Project.create(project, (err, project) => {
      if (err) {
        console.log(err);
        res.redirect("/projects");
      } else {
        user.projects.push(project);
        user.save((err, user) => {
          if (err) {
            console.log(err);
            res.redirect("/projects");
          } else {
            res.redirect("/projects");
          }
        });
      }
    });
  }); // create route

router
  .route("/projects/:id")
  .get((req, res) => {
    Project.findById(req.params.id, (err, project) => {
      if (err) {
        console.log(err);
        res.redirect("/projects");
      } else {
        res.send({ project: project });
      }
    });
  }) //show one route
  .post((req, res) => {
    Project.findByIdAndUpdate(
      req.params.id,
      req.body.project,
      (err, project) => {
        if (err) {
          console.log(err);
          res.redirect("/projects");
        } else {
          res.redirect("/projects");
        }
      }
    );
  }); // update route

router.route("/projects/:id/delete").post((req, res) => {
  Project.findByIdAndDelete(req.params.id, (err, project) => {
    if (err) {
      console.log(err);
      res.redirect("/projects");
    } else {
      res.redirect("/projects");
    }
  });
}); // delete route

module.exports = router;
