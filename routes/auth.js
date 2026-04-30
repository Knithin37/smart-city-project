const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const fs = require("fs");
const path = require("path");

const router = express.Router();

// 🧠 In-memory database (temporary)
let users = [];
const usersFile = path.join(__dirname, "users.json");
if (fs.existsSync(usersFile)) {
  users = JSON.parse(fs.readFileSync(usersFile, "utf8"));
  console.log(`Loaded ${users.length} users from users.json`);
}

// ✅ REGISTER
router.post("/register", async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // 🔍 validation
    if (!email || !password) {
      return res.status(400).json({ error: "Email and password required" });
    }

    // check if user exists
    const userExists = users.find(u => u.email === email);
    if (userExists) {
      return res.status(400).json({ error: "User already exists" });
    }

    // hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = {
      username: username || "User",
      email,
      password: hashedPassword,
    };

    users.push(newUser);
    fs.writeFileSync(usersFile, JSON.stringify(users, null, 2));

    console.log("Registered Users:", users); // 🔥 debug

    res.json({ message: "User registered successfully ✅" });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Register failed ❌" });
  }
});

// ✅ LOGIN
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log(`📧 Login attempt for ${email}`);

    const user = users.find(u => u.email === email);

    if (!user) {
      return res.status(400).json({ error: "User not found" });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ error: "Wrong password" });
    }

    const token = jwt.sign(
      { email: user.email },
      "secret123",
      { expiresIn: "1h" }
    );

    res.json({
      message: "Login successful ✅",
      token,
      user: {
        email: user.email,
        username: user.username,
      },
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Login failed ❌" });
  }
});

module.exports = router;