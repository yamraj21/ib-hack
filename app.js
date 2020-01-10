const express = require("express"),
  app = express(),
  mongoose = require("mongoose"),
  expressSession = require("express-session"),
  passport = require("passport"),
  LocalStrategy = require("passport-local"),
  User = require("./models/user");

const PORT = process.env.PORT || 3000;

mongoose
  .connect(process.env.DATABASE_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false
  })
  .then(
    () => {
      console.log("mongoose connected");
    },
    err => {
      console.log("mongoose connection failed => " + err);
    }
  );

app.use(express.urlencoded({ extended: true }));
app.use(
  expressSession({
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: false
  })
);

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
  res.locals.currentUser = req.user;
  next();
});

////////////////////Routes///////////////////////
const indexRoutes = require("./routes/index"),
  tasksRoutes = require("./routes/tasks");

app.use("/", indexRoutes);
app.use("/", tasksRoutes);
/////////////////////////////////////////////////

app.listen(PORT, function() {
  console.log(`server connected ${PORT}`);
});
