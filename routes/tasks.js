const express = require("express"),
  router = express.Router(),
  middleware = require("../middlewares/index"),
  Project = require("../models/project"),
  Task = require("../models/task"),
  User = require("../models/user");

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
  task.created_by = req.params.id;
  task.assigned_to = req.params.id;
  task.work_left = task.time_required;
  let date1 = new Date(task.start_date);
  let date2 = new Date(task.due_date);
  task.work_per_day = Math.ceil(
    task.work_left / (date2.getTime() - date1.getTime() / (1000 * 3600 * 24))
  );

  Task.create(task, (err, task) => {
    if (err) {
      console.log(err);
      // res.redirect("/projects/" + req.params.id + "/tasks");
      res.redirect("/dashboard");
    } else {
      Project.findById(req.params.id, (err, project) => {
        project.tasks.push(task);
        project.save((err, task) => {
          if (err) {
            console.log(err);
            res.redirect("/dashboard");
          } else {
            res.redirect("/dashboard");
          }
        });
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
    Project.findById(req.params.id, async (err, project) => {
      if (err) {
        console.log(err);
        res.redirect("/dashboard");
      } else {
        project.tasks = await project.tasks.filter(
          project_task => project_task != req.params.task_id
        );
        await project.findByIdAndUpdate(project._id, project, err => {
          if (err) console.log(err);
        });
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
);

module.exports = router;
