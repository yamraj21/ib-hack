const express = require("express"),
  router = express.Router(),
  middleware = require("../middlewares/index"),
  Task = require("../models/task"),
  User = require("../models/user");

router.get("/tasks", middleware.isLoggedIn, (req, res) => {
  Tasks.find({})
    .where("_id")
    .in(req.currentUser.tasks)
    .exec((err, tasks) => {
      if (err) console.log(err);
      else res.render("", { items: items }); // to update
    });
});

router.post("/tasks", middleware.isLoggedIn, (req, res) => {
  let task = req.body.task;
  let user = req.currentUser;
  Task.create(task, (err, task) => {
    if (err) console.log(err);
    else {
      user.tasks.push(task);
      user.save((err, user) => {
        if (err) console.log(err);
        else res.redirect("/tasks");
      });
    }
  });
});

router.get("/tasks/new", middleware.isLoggedIn, (req, res) => {
  res.render("new"); // to update
});

router.get("/tasks/:id", middleware.isLoggedIn, (req, res) => {
  Task.findById(req.params.id, (err, task) => {
    if (err) console.log(err);
    else res.render("task_page"); //to update
  });
});

router.put("/:id", middleware.isLoggedIn, (req, res) => {
  Campground.findByIdAndUpdate(req.params.id, req.body.task, (err, task) => {
    if (err) {
      console.log(err);
    } else {
      res.redirect("/tasks");
    }
  });
});

router.delete("/:id", middleware.isLoggedIn, (req, res) => {
  Campground.findByIdAndDelete(req.params.id, (err, task) => {
    if (err) {
      console.log(err);
    } else {
      res.redirect("/tasks");
    }
  });
});

module.exports = router;
