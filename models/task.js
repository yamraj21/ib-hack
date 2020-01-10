const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema({
  title: String,
  description: String,
  start_date: Date,
  dur_date: Date,
  time_required: Number,
  priority: Number
});
