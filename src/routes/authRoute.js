const express = require("express");
const authRouter = express.Router();
const User = require("../models/user");
const { getUserDetails } = require("../utils/getUserDetails");

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
      about,
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
      about,
    });
    const hashedPassword = await user.hashPassword(password);
    user.password = hashedPassword;
    await user.save();
    const token = await user.generateToken();
    res.cookie("token", token);
    const userData = await getUserDetails(user);
    res
      .status(200)
      .json({ message: "User Created Successfully", data: userData });
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
      const userData = await getUserDetails(user);
      res.status(200).json({ message: "Login succesfull", data: userData });
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
    res.clearCookie("token");
    res.status(200).send("Logout successful");
  } catch (err) {
    res.status(400).send("Error:" + err);
  }
});

module.exports = authRouter;
