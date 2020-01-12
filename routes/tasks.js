const express = require("express"),
  router = express.Router(),
  middleware = require("../middlewares/index"),
  Project = require("../models/project"),
  Task = require("../models/task");

router.use(middleware.isLoggedIn);
router.use(middleware.isProjectAccessAllowed);

router.get("/projects/:id/tasks", (req, res) => {
  Project.findById(req.params.id)
    .populate("members")
    .exec((err, project) => {
      if (err) {
        console.log(err);
        res.redirect("/dashboard");
      } else {
        Task.find({})
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
    });
});

router.post("/projects/:id/tasks", (req, res) => {
  let task = req.body.task;
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

// router.get("/tasks", (req, res) => {
//   Tasks.find({})
//     .where("_id")
//     .in(req.currentUser.tasks)
//     .exec((err, tasks) => {
//       if (err) {
//         console.log(err);
//         res.redirect("/tasks");
//       } else {
//         res.send({ tasks: tasks });
//       }
//     });
// });

// router.post("/tasks", (req, res) => {
//   let task = req.body.task;
//   let user = req.currentUser;
//   Task.create(task, (err, task) => {
//     if (err) {
//       console.log(err);
//       res.redirect("/tasks");
//     } else {
//       user.tasks.push(task);
//       user.save((err, user) => {
//         if (err) {
//           console.log(err);
//           res.redirect("/tasks");
//         } else {
//           res.redirect("/tasks");
//         }
//       });
//     }
//   });
// });

// router.get("/tasks/new", (req, res) => {
//   res.send({});
// });

// router.get("/tasks/:id", (req, res) => {
//   Task.findById(req.params.id, (err, task) => {
//     if (err) {
//       console.log(err);
//       res.redirect("/tasks");
//     } else {
//       res.send({ task: task });
//     }
//   });
// });

// router.get("/tasks/:id/edit", (req, res) => {
//   Task.findById(req.params.id, (err, task) => {
//     if (err) {
//       console.log(err);
//       res.redirect("/tasks");
//     } else {
//       res.send({ task: task });
//     }
//   });
// });

// //update route
// router.post("tasks/:id", (req, res) => {
//   Task.findByIdAndUpdate(req.params.id, req.body.task, (err, task) => {
//     if (err) {
//       console.log(err);
//       res.redirect("/tasks");
//     } else {
//       res.redirect("/tasks");
//     }
//   });
// });

// //delete route
// router.post("tasks/delete/:id", (req, res) => {
//   Task.findByIdAndDelete(req.params.id, (err, task) => {
//     if (err) {
//       console.log(err);
//       res.redirect("/tasks");
//     } else {
//       res.redirect("/tasks");
//     }
//   });
// });

module.exports = router;
