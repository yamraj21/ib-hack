const mongoose = require("mongoose"),
  passsportLocalMongoose = require("passport-local-mongoose");

const userSchema = new mongoose.Schema({
  username: String,
  email: String,
  password: String,
  tasks: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Task"
    }
  ]
});

userSchema.plugin(passsportLocalMongoose);

module.exports = mongoose.model("User", userSchema);
