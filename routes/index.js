const express = require("express"),
  User = require("../models/user"),
  passport = require("passport"),
  router = express.Router({ mergeParams: true });

router.get("/", (req, res) => {
  res.redirect("/login");
});

router.get("/login", (req, res) => {
  res.send({});
});

router.post(
  "/login",
  passport.authenticate("local", {
    successRedirect: "/tasks",
    failureRedirect: "/login"
  }),
  (req, res) => {}
);

router.get("/register", (req, res) => {
  res.send({});
});

router.post("/register", (req, res) => {
  User.register(
    new User({ username: req.body.username, email: req.body.email }),
    req.body.password,
    (err, user) => {
      if (err) {
        console.log(err);
        return res.redirect("/register");
      } else {
        passport.authenticate("local")(req, res, () => {
          res.redirect("/tasks");
        });
      }
    }
  );
});

router.get("/logout", (req, res) => {
  req.logout();
  res.redirect("/");
});

module.exports = router;
