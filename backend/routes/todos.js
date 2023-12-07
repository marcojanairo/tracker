const router = require("express").Router();
let Todo = require("../models/todo.model");

router.route("/").get(async (req, res) => {
    try {
        const todos = await Todo.find();
        res.json(todos);
    } catch (err) {
        res.status(400).json("Error: " + err);
    }
});

router.route("/add").post(async (req, res) => {
    const activity = req.body.activity;
    const completed = req.body.completed;
    // create a new Activity object
    const newTodo = await new Todo({ activity, completed });
    
    try {
        await newTodo.save();
        res.json("Todo added!");
    } catch (err) {
        res.status(400).json("Error: " + err);
    }
});

router.route("/:id").get(async (req, res) => {
    try {
        const todo = await Todo.findById(req.params.id);
        res.json(todo);
    } catch (err) {
        res.status(400).json("Error: " + err);
    }
});
    
router.route("/:id").delete(async (req, res) => {
    try {
        await Todo.findByIdAndDelete(req.params.id);
        res.json("Todo deleted.");
    } catch (err) {
        res.status(400).json("Error: " + err);
    }
});

router.route("/update/:id").post(async (req, res) => {
    try {
        const todo = await Todo.findById(req.params.id);
        todo.activity = req.body.activity;
        todo.completed = req.body.completed;

        await todo.save();


        res.json("Todo updated!");
    } catch (err) {
        res.status(400).json("Error: " + err);
    }
});
    
module.exports = router;