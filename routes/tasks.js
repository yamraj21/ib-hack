const express = require("express"),
  router = express.Router(),
  middleware = require("../middlewares/index"),
  Project = require("../models/project");
(Task = require("../models/task")), (User = require("../models/user"));

router.use(middleware.isLoggedIn);

router
  .route("/projects/:id/tasks")
  .get((req, res) => {
    Project.findById(req.params.id, (err, project) => {
      Task.find({})
        .in(project.tasks)
        .populate("assigned_to")
        .populate("created_by")
        .exec((err, tasks) => {
          res.send({ tasks: tasks });
        });
    });
  })
  .post((req, res) => {
    let task = req.body.task;
    Project.findById(req.params.id, (err, project) => {
      project.tasks.push(task);
      project.save((err, task) => {
        if (err) {
          console.log(err);
          res.redirect("/tasks");
        } else {
          res.redirect("/tasks");
        }
      });
    });
  });

router
  .route("/projects/:id/tasks/:task_id")
  .get((req, res) => {
    Task.findById(req.params.task_id, (err, task) => {
      if (err) {
        console.log(err);
        res.redirect("/tasks");
      } else {
        res.send({ task: task });
      }
    });
  })
  .post((req, res) => {
    Task.findByIdAndUpdate(req.params.task_id, (err, task) => {
      if (err) {
        console.log(err);
        res.redirect("/tasks");
      } else {
        res.redirect("/tasks");
      }
    });
  });

router.route("/projects/:id/tasks/:task_id/delete").post((req, res) => {
  Task.findByIdAndDelete(req.params.task_id, (err, task) => {
    if (err) {
      console.log(err);
      res.redirect("/tasks");
    } else {
      res.redirect("/tasks");
    }
  });
});

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
