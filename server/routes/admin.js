const express = require("express");
const User = require("../models/User");
const Todo = require("../models/Todo");
const { protect, adminOnly } = require("../middleware/auth");

const router = express.Router();

router.use(protect, adminOnly);

router.get("/users", async (req, res) => {
  try {
    const users = await User.find({}).sort({ createdAt: 1 });
    res.status(200).json({ users });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
});

router.get("/stats", async (req, res) => {
  try {
    const [totalUsers, adminCount, totalTodos, completedTodos] = await Promise.all([
      User.countDocuments(),
      User.countDocuments({ role: "admin" }),
      Todo.countDocuments(),
      Todo.countDocuments({ completed: true }),
    ]);

    res.status(200).json({
      stats: {
        totalUsers,
        adminCount,
        userCount: totalUsers - adminCount,
        totalTodos,
        completedTodos,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
});

router.put("/users/:id", async (req, res) => {
  try {
    const { name, role, password } = req.body;
    const targetUser = await User.findById(req.params.id);

    if (!targetUser) {
      return res.status(404).json({ message: "User not found" });
    }

    if (name !== undefined) targetUser.name = name;
    if (role !== undefined) {
      if (!["user", "admin"].includes(role)) {
        return res.status(400).json({ message: "Invalid role" });
      }

      const adminCount = await User.countDocuments({ role: "admin" });
      if (targetUser.role === "admin" && role !== "admin" && adminCount <= 1) {
        return res.status(400).json({ message: "Cannot demote the last admin" });
      }

      targetUser.role = role;
    }
    if (password !== undefined) {
      if (password.length < 6) {
        return res.status(400).json({ message: "Password must be at least 6 characters" });
      }
      targetUser.password = password;
    }

    await targetUser.save();
    res.status(200).json({ user: targetUser });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
});

router.delete("/users/:id", async (req, res) => {
  try {
    const targetUser = await User.findById(req.params.id);
    if (!targetUser) {
      return res.status(404).json({ message: "User not found" });
    }

    if (targetUser._id.toString() === req.user._id.toString()) {
      return res.status(400).json({ message: "You cannot delete your own account" });
    }

    if (targetUser.role === "admin") {
      const adminCount = await User.countDocuments({ role: "admin" });
      if (adminCount <= 1) {
        return res.status(400).json({ message: "Cannot delete the last admin" });
      }
    }

    await Todo.deleteMany({ user: targetUser._id });
    await targetUser.deleteOne();

    res.status(200).json({ message: "User and their todos deleted" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;