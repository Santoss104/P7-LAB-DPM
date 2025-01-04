const User = require("../models/users");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

class AuthController {
  async register(req, res) {
    const { username, password, email } = req.body;
    // Logic for user registration
    try {
      // Check if user already exists
      const existingUser = await User.findOne({ username });
      if (existingUser) {
        return res.status(400).json({ message: "Username already exists" });
      }
      // hash password
      const hashedPassword = await bcrypt.hash(password, 10);
      // Create new user
      const newUser = new User({ username, password: hashedPassword, email });
      await newUser.save();
      res.status(201).json({ message: "User registered successfully" });
    } catch (error) {
      res.status(500).json({ message: "Server error", error: error.message });
    }
  }

  async login(req, res) {
    const { username, password } = req.body;
    try {
      const user = await User.findOne({ username });
      if (!user) {
        return res.status(401).json({ message: "Invalid credentials" });
      }
      // Compare the password
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(401).json({ message: "Invalid credentials" });
      }
      const token = jwt.sign(
        { id: user._id, username: user.username },
        process.env.JWT_SECRET,
        {
          expiresIn: "7d",
        }
      );
      res.status(200).json({ message: "Login successful", data: { token } });
    } catch (error) {
      res.status(500).json({ message: "Server error", error: error.message });
    }
  }
}

module.exports = AuthController;