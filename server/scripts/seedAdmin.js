const dotenv = require("dotenv");
dotenv.config();

const connectDB = require("../config/db");
const User = require("../models/User");

const seedAdmin = async () => {
  await connectDB();

  const existing = await User.findOne({ email: "admin@jadara.local" });
  if (existing) {
    console.log("Admin user already exists, skipping...");
    process.exit(0);
  }

  await User.create({
    name: "Jadara Admin",
    email: "admin@jadara.local",
    password: "admin123",
    role: "admin",
  });

  console.log("Admin user created:");
  console.log("  email:    admin@jadara.local");
  console.log("  password: admin123");
  process.exit(0);
};

seedAdmin();