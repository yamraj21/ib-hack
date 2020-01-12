const express = require("express"),
  router = express.Router(),
  middleware = require("../middlewares/index"),
  Project = require("../models/project"),
  Task = require("../models/task"),
  User = require("../models/user");

router.use(middleware.isLoggedIn);

router.get("/projects", (req, res) => {
  Project.find({})
    .where("_id")
    .in(req.user.projects)
    .exec((err, projects) => {
      if (err) {
        console.log(err);
        res.redirect("/dashboard");
      } else {
        res.send({ projects: projects });
      }
    });
});

router.post("/projects", (req, res) => {
  let project = req.body.project;
  let user = req.user;
  project.members = [user._id];

  Project.create(project, (err, project) => {
    if (err) {
      console.log(err);
      res.redirect("/dashboard");
    } else {
      user.projects.push(project);
      user.save((err, user) => {
        if (err) {
          console.log(err);
          res.redirect("/dashboard");
        } else {
          res.redirect("/dashboard");
        }
      });
    }
  });
});

router.get("/projects/:id", middleware.isProjectAccessAllowed, (req, res) => {
  Project.findById(req.params.id, (err, project) => {
    if (err) {
      console.log(err);
      res.redirect("/dashboard");
    } else {
      res.redirect("/projects/" + project._id + "/tasks");
    }
  });
});

router.post(
  "/projects/:id/update",
  middleware.isProjectAccessAllowed,
  (req, res) => {
    Project.findByIdAndUpdate(
      req.params.id,
      req.body.project,
      (err, project) => {
        if (err) {
          console.log(err);
          res.redirect("/dashboard");
        } else {
          res.redirect("/dashboard");
        }
      }
    );
  }
);

router.post(
  "/projects/:id/delete",
  middleware.isProjectAccessAllowed,
  (req, res) => {
    Project.findById(req.params.id)
      .populate("members")
      .exec(async (err, project) => {
        await project.members.forEach(member => {
          member.projects = member.projects.filter(
            member_project => member_project != project._id
          );

          User.findByIdAndUpdate(member._id, member, err => {
            if (err) console.log(err);
          });
        });

        await Task.deleteMany()
          .where("_id")
          .in(project.tasks)
          .exec(err => {
            if (err) console.log(err);
          });

        await Project.findByIdAndDelete(project._id, err => {
          if (err) console.log(err);
        });

        res.render("/dashboard");
      });
    // Project.findByIdAndDelete(req.params.id, (err, project) => {
    //   if (err) {
    //     console.log(err);
    //     res.redirect("/projects");
    //   } else {
    //     res.redirect("/projects");
    //   }
    // });
  }
);

module.exports = router;
