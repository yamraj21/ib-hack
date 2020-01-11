const express = require("express"),
  router = express.Router({ mergeParams: true }),
  Task = require("../models/task");

router.route("/schedule").get((req, res) => {
  if (req.user) {
    Task.find({})
      .where("assigned_to")
      .in([req.user._id])
      .sort([
        ["due_date", "asc"],
        ["priority", "asc"]
      ])
      .exec((err, tasks) => {
        if (err) {
          console.log(err);
          res.redirect("/projects");
        } else {
          res.send({ tasks: tasks });
        }
      });
  }
});
