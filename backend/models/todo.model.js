const mongoose = require("mongoose");

// define Schema Class
const Schema = mongoose.Schema;

// Create a Schema object
const todoSchema = new Schema({
    activity: { type: String, required: true },
});

// This Activitry creates the collection called activitymodels
const Todo = mongoose.model("Todo", todoSchema);

module.exports = Todo;