const express = require("express"),
  User = require("../models/user"),
  passport = require("passport"),
  router = express.Router({ mergeParams: true });

router.get("/", (req, res) => {
  res.redirect("/dashboard");
});

router.get("/login", (req, res) => {
  // res.render("auth");
  res.send({ message: "Login Page" });
});

router.post(
  "/login",
  passport.authenticate("local", {
    successRedirect: "/dashboard",
    failureRedirect: "/login"
  }),
  (req, res) => {}
);

router.post("/register", (req, res) => {
  User.register(
    new User({ username: req.body.username, email: req.body.email }),
    req.body.password,
    (err, user) => {
      if (err) {
        console.log(err);
        res.redirect("/login");
      } else {
        passport.authenticate("local")(req, res, () => {
          res.redirect("/dashboard");
        });
      }
    }
  );
});

router.get("/logout", (req, res) => {
  req.logout();
  res.redirect("/");
});

router.get("/dashboard", (req, res) => {
  // res.render("dashboard");
  res.send({ message: "Dashboard Page", user: req.user });
});

module.exports = router;
