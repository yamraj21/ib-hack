const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema({
  title: String,
  description: String,
  start_date: Date,
  due_date: Date,
  time_required: Number,
  priority: Number,
  assigned_to: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },
  created_by: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  }
});

module.exports = mongoose.model("Task", taskSchema);
