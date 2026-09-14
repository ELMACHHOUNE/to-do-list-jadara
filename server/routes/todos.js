const express = require("express");
const Todo = require("../models/Todo");
const { protect } = require("../middleware/auth");

const router = express.Router();

router.use(protect);

router.get("/", async (req, res) => {
  try {
    const todos = await Todo.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.status(200).json({ todos });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
});

router.post("/", async (req, res) => {
  try {
    const { title, description } = req.body;

    if (!title || !title.trim()) {
      return res.status(400).json({ message: "Title is required" });
    }

    const todo = await Todo.create({
      title: title.trim(),
      description: description ? description.trim() : "",
      user: req.user._id,
    });

    res.status(201).json({ todo });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
});

router.put("/:id", async (req, res) => {
  try {
    const { title, description, completed } = req.body;

    const todo = await Todo.findOne({ _id: req.params.id, user: req.user._id });
    if (!todo) {
      return res.status(404).json({ message: "Todo not found" });
    }

    if (title !== undefined) todo.title = title.trim() || todo.title;
    if (description !== undefined) todo.description = description;
    if (completed !== undefined) todo.completed = !!completed;

    await todo.save();
    res.status(200).json({ todo });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const todo = await Todo.findOneAndDelete({ _id: req.params.id, user: req.user._id });
    if (!todo) {
      return res.status(404).json({ message: "Todo not found" });
    }
    res.status(200).json({ message: "Todo deleted" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;