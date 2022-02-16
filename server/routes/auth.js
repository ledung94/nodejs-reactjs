const express = require("express");
const router = express.Router();
const argon2 = require("argon2");
const jwt = require("jsonwebtoken");

const User = require("../models/User");
const verifyToken = require("../middleware/auth");

// @route POST api/auth/register
// @desc Register new user
// @access Public

router.post("/register", async (req, res) => {
  const { username, password, role } = req.body;

  if (!username || !password)
    return res
      .status(400)
      .json({ success: false, message: "Missing username or password" });

  try {
    const user = await User.findOne({ username });

    // Check for existing user
    if (user)
      return res
        .status(400)
        .json({ success: false, message: "Username already existed" });

    // All good
    const hashedPassword = await argon2.hash(password);
    const newUser = new User({
      username: username,
      password: hashedPassword,
      role: role,
    });
    await newUser.save();

    // Return token
    const accessToken = jwt.sign(
      { userId: newUser._id },
      process.env.ACCESS_TOKEN_SECRET
    );

    res.json({
      success: true,
      message: "User created successfully",
      accessToken,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
});

// @route POST api/auth/login
// @desc Login new user
// @access Public

router.post("/login", async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password)
    return res
      .status(400)
      .json({ success: false, message: "Missing username or password" });

  try {
    const user = await User.findOne({ username });

    if (!user)
      return res
        .status(400)
        .json({ success: false, message: "Incorrect username or password" });

    const passwordValid = await argon2.verify(user.password, password);
    if (!passwordValid)
      return res
        .status(400)
        .json({ success: false, message: "Incorrect username or password" });

    // All good
    // Return token
    const accessToken = jwt.sign(
      { userId: user._id },
      process.env.ACCESS_TOKEN_SECRET
    );

    res.json({ success: true, message: "Login successfully", accessToken });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
});

// @route PUT api/auth/edit
// @desc edit account info
// @access Public

router.put("/edit", verifyToken, async (req, res) => {
  try {
    const { username, password, role } = req.body;

    if (!username || !password)
      return res
        .status(400)
        .json({ success: false, message: "One or more fields are empty" });

    let editedUser = {
      username: username,
      password: password,
    };

    editedUser = await User.findOneAndUpdate(
      { username: username, id: req.userId },
      editedUser,
      { new: true }
    );

    if (!editedUser)
      return res.json({ success: false, message: "Cannot edit this account" });

    res
      .status(200)
      .json({
        success: true,
        user: editedUser,
        message: "Edited successfully",
      });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
});

module.exports = router;
