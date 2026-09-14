const express = require("express");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const { protect } = require("../middleware/auth");

const router = express.Router();

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN });
};

const validate = (email, password, name) => {
  if (!email || !password) return "Email and password are required";
  if (name && name.trim().length === 0) return "Name is required";
  if (password.length < 6) return "Password must be at least 6 characters";
  if (!/^\S+@\S+\.\S+$/.test(email)) return "Email format is invalid";
  return null;
};

router.post("/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const validationError = validate(email, password, name);
    if (validationError) {
      return res.status(400).json({ message: validationError });
    }

    const existing = await User.findOne({ email: email.toLowerCase() });
    if (existing) {
      return res.status(400).json({ message: "User already exists with this email" });
    }

    const userCount = await User.countDocuments();
    const role = userCount === 0 ? "admin" : "user";

    const user = await User.create({
      name: name.trim(),
      email: email.toLowerCase(),
      password,
      role,
    });

    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      token: generateToken(user._id),
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    const user = await User.findOne({ email: email.toLowerCase() }).select("+password");
    if (!user || !(await user.matchPassword(password))) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    res.status(200).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      token: generateToken(user._id),
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
});

router.get("/me", protect, async (req, res) => {
  res.status(200).json({ user: req.user });
});

module.exports = router;