const express = require("express"),
  router = express.Router({ mergeParams: true }),
  Task = require("../models/task");

router.route("/schedule").get((req, res) => {
  Task.find({})
    .where("assigned_to")
    .in([req.user._id])
    .sort([
      ["due_date", "asc"],
      ["priority", "desc"]
    ]);
});
