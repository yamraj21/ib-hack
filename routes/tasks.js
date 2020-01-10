const express = require("express"),
  router = express.Router(),
  middleware = require("../middlewares/index"),
  Task = require("../models/task"),
  User = require("../models/user");

router.use(middleware.isLoggedIn);

router.get("/tasks", (req, res) => {
  Tasks.find({})
    .where("_id")
    .in(req.currentUser.tasks)
    .exec((err, tasks) => {
      if (err) {
        console.log(err);
        res.redirect("/tasks");
      } else {
        res.send({ tasks: tasks });
      }
    });
});

router.post("/tasks", (req, res) => {
  let task = req.body.task;
  let user = req.currentUser;
  Task.create(task, (err, task) => {
    if (err) {
      console.log(err);
      res.redirect("/tasks");
    } else {
      user.tasks.push(task);
      user.save((err, user) => {
        if (err) {
          console.log(err);
          res.redirect("/tasks");
        } else {
          res.redirect("/tasks");
        }
      });
    }
  });
});

router.get("/tasks/new", (req, res) => {
  res.send({});
});

router.get("/tasks/:id", (req, res) => {
  Task.findById(req.params.id, (err, task) => {
    if (err) {
      console.log(err);
      res.redirect("/tasks");
    } else {
      res.send({ task: task });
    }
  });
});

router.get("/tasks/:id/edit", (req, res) => {
  Task.findById(req.params.id, (err, task) => {
    if (err) {
      console.log(err);
      res.redirect("/tasks");
    } else {
      res.send({ task: task });
    }
  });
});

//update route
router.post("tasks/:id", (req, res) => {
  Task.findByIdAndUpdate(req.params.id, req.body.task, (err, task) => {
    if (err) {
      console.log(err);
      res.redirect("/tasks");
    } else {
      res.redirect("/tasks");
    }
  });
});

//delete route
router.post("tasks/delete/:id", (req, res) => {
  Campground.findByIdAndDelete(req.params.id, (err, task) => {
    if (err) {
      console.log(err);
      res.redirect("/tasks");
    } else {
      res.redirect("/tasks");
    }
  });
});

module.exports = router;
