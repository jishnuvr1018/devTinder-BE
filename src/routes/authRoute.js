const express = require("express");
const authRouter = express.Router();
const User = require("../models/user");

// #. Signup API
authRouter.post("/signup", async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      email,
      password,
      age,
      photoUrl,
      gender,
      skills,
    } = req.body;
    const user = new User({
      firstName,
      lastName,
      email,
      password: "",
      age,
      photoUrl,
      gender,
      skills,
    });
    const hashedPassword = await user.hashPassword(password);
    user.password = hashedPassword;
    await user.save();
    res.status(201).send("User created successfully");
  } catch (err) {
    res.status(400).send("Error while creating user" + err);
  }
});

// #. Login API
authRouter.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      throw new Error("Credintials are invalid");
    }
    const isPasswordMatch = await user.validPassword(password);
    if (isPasswordMatch) {
      const token = await user.generateToken();
      res.cookie("token", token);
      res.status(200).send("Login successful");
    } else {
      throw new Error("Credintials are invalid");
    }
  } catch (err) {
    res.status(400).send("Error" + err);
  }
});

//#. Logout API
authRouter.post("/logout", async (req, res) => {
  try {
    res.cookie("token", null, { expires: new Date(0) });
    res.status(200).send("Logout successful");
  } catch (err) {
    res.status(400).send("Error:" + err);
  }
});

module.exports = authRouter;
