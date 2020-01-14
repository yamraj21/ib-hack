const mongoose = require("mongoose"),
  express = require("express"),
  router = express.Router(),
  User = require("../models/user");

router.get("/users", (req, res) => {
  User.find({}, "_id username").exec((err, users) => {
    if (err) console.log(err);
    else {
      res.send({ users: users });
    }
  });
});

module.exports = router;
