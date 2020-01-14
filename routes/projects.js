const express = require("express"),
  router = express.Router(),
  middleware = require("../middlewares/index"),
  Project = require("../models/project"),
  Task = require("../models/task"),
  User = require("../models/user"),
  _ = require("lodash");

router.use(middleware.isLoggedIn);

router.get("/projects", (req, res) => {
  Project.find({})
    .where("_id")
    .in(req.user.projects)
    .exec((err, projects) => {
      if (err) {
        console.log(err);
        res.redirect("/");
      } else {
        res.send({ projects: projects, user: req.user });
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
      res.redirect("/");
    } else {
      user.projects.push(project);
      user.save((err, user) => {
        if (err) {
          console.log(err);
          res.redirect("/");
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
      res.redirect("/");
    } else {
      if (!project) {
        console.log("project not found");
        res.redirect("/");
      } else res.redirect("/projects/" + project._id + "/tasks");
    }
  });
});

router.put("/projects/:id", middleware.isProjectAccessAllowed, (req, res) => {
  Project.findByIdAndUpdate(req.params.id, req.body.project, (err, project) => {
    if (err) {
      console.log(err);
      res.redirect("/dashboard");
    } else {
      res.redirect("/dashboard");
    }
  });
});

router.delete(
  "/projects/:id",
  middleware.isProjectAccessAllowed,
  (req, res) => {
    Project.findById(req.params.id)
      .populate("members")
      .populate("members.projects")
      .lean()
      .exec((err, project) => {
        if (!project) {
          console.log("project not found");
          res.redirect("/");
        }
        project.members.forEach(member => {
          member.projects = member.projects.filter(
            member_project => !_.isEqual(member_project, project._id)
          );
          User.findByIdAndUpdate(member._id, member, err => {
            if (err) console.log(err);
          });
        });

        Task.deleteMany()
          .where("_id")
          .in(project.tasks)
          .exec(err => {
            if (err) console.log(err);
          });

        Project.findByIdAndDelete(project._id, err => {
          if (err) console.log(err);
          else res.redirect("/dashboard");
        });
      });
  }
);

router.post("/projects/:id/add_members", (req, res) => {
  Project.findById(req.params.id, (err, project) => {
    if (err) console.log(err);
    else {
      if (!project) {
        console.log("project not found");
        res.redirect("/");
      }
      User.findById(req.body.member, (err, user) => {
        if (err) console.log(err);
        else {
          project.members.push(req.body.member);
          user.projects.push(req.params.id);
          project.save((err, project) => {
            if (err) console.log(err);
            else {
              user.save((err, user) => {
                if (err) console.log(err);
                else {
                  res.redirect("/dashboard");
                }
              });
            }
          });
        }
      });
    }
  });
});

module.exports = router;
