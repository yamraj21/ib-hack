const express = require("express"),
  router = express.Router({ mergeParams: true }),
  Task = require("../models/task"),
  { isLoggedIn } = require("../middlewares/index");

router.use(isLoggedIn);

router.get('/schedule',(req, res) => {
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
        res.redirect("/");
      } else {
        res.send({ tasks: tasks });
      }
    });
});

module.exports = router;
