const express = require("express"),
  router = express.Router(),
  middleware = require("../middlewares/index"),
  Project = require("../models/project"),
  Task = require("../models/task"),
  _ = require("lodash");

router.use(middleware.isLoggedIn);
router.use(middleware.isProjectAccessAllowed);

router.get("/projects/:id/tasks", (req, res) => {
  Project.findById(req.params.id)
    .populate("members")
    .exec((err, project) => {
      if (!project) {
        console.log("no project found");
        res.redirect("/");
      } else {
        if (err) {
          console.log(err);
          res.redirect("/dashboard");
        } else {
          Task.find({})
            .where("_id")
            .in(project.tasks)
            .populate("assigned_to")
            .populate("created_by")
            .exec((err, tasks) => {
              if (err) {
                console.log(err);
                res.redirect("/dashboard");
              } else {
                res.send({ tasks: tasks, members: project.members });
              }
            });
        }
      }
    });
});

router.post("/projects/:id/tasks", (req, res) => {
  let task = req.body.task;
  task.created_by = req.user._id;
  task.assigned_to = req.user._id;
  task.work_left = task.time_required;
  let date1 = new Date(task.start_date);
  let date2 = new Date(task.due_date);
  task.work_per_day = Math.ceil(
    task.work_left / ((date2.getTime() - date1.getTime()) / (1000 * 3600 * 24))
  );
  if (task.work_per_day == 0 && work_left != 0) task.work_per_day = 1;

  Task.create(task, (err, task) => {
    if (err) {
      console.log(err);
      res.redirect("/dashboard");
    } else {
      Project.findById(req.params.id, (err, project) => {
        if (!project) {
          console.log(err);
          res.redirect("/");
        } else {
          project.tasks.push(task);
          project.save((err, task) => {
            if (err) {
              console.log(err);
              res.redirect("/dashboard");
            } else {
              res.redirect("/dashboard");
            }
          });
        }
      });
    }
  });
});

router.get(
  "/projects/:id/tasks/:task_id",
  middleware.isTaskAccessAllowed,
  (req, res) => {
    Task.findById(req.params.task_id, (err, task) => {
      if (err) {
        console.log(err);
        res.redirect("/dashboard");
      } else if (!task) {
        console.log("no task found");
        res.redirect("/");
      } else {
        res.send({ task: task });
      }
    });
  }
);

router.post(
  "/projects/:id/tasks/:task_id/update",
  middleware.isTaskAccessAllowed,
  (req, res) => {
    Task.findByIdAndUpdate(req.params.task_id, req.body.task, (err, task) => {
      if (err) {
        console.log(err);
        res.redirect("/dashboard");
      } else {
        res.redirect("/dashboard");
      }
    });
  }
);

router.post(
  "/projects/:id/tasks/:task_id/delete",
  middleware.isTaskAccessAllowed,
  (req, res) => {
    Project.findById(req.params.id, (err, project) => {
      if (err) {
        console.log(err);
        res.redirect("/dashboard");
      } else if (!project) {
        console.log("no project found");
        res.reedirect("/");
      } else {
        project.tasks = project.tasks.filter(
          project_task => !_.isEqual(project_task, req.params.task_id)
        );
        project.save((err, project) => {
          if (err) {
            console.log(err);
            res.redirect("/dashboard");
          } else {
            Task.findByIdAndDelete(req.params.task_id, (err, task) => {
              if (err) {
                console.log(err);
                res.redirect("/dashboard");
              } else {
                res.redirect("/dashboard");
              }
            });
          }
        });
      }
    });
  }
);

module.exports = router;
