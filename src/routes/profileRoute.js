// #. API to get user profile
const express = require("express");
const profileRouter = express.Router();
const { authMiddleware } = require("../middlewares/auth");
const { validateProfile } = require("../utils/validateProfile");
const { validatePassword } = require("../utils/validatePassword");

// #. API to get user profile
profileRouter.get("/profile/view", authMiddleware, async (req, res) => {
  try {
    res.send(req?.user);
  } catch (err) {
    res.status(400).send("Error:" + err.message);
  }
});

// #. API to edit user profile
profileRouter.patch("/profile/edit", authMiddleware, async (req, res) => {
  try {
    await validateProfile(req.body);
    const editData = req.body;
    const user = req.user;
    Object.keys(editData).forEach((key) => (user[key] = editData[key]));
    await user.save();
    res
      .status(201)
      .json({ message: "Profile Updated successfully", data: user });
  } catch (err) {
    res.status(400).send("Error:" + err.message);
  }
});

// Forgot password API
profileRouter.post("/forgotpassword", authMiddleware, async (req, res) => {
  try {
    const newPassword = req.body.newPassword;
    const confirmPassword = req.body.confirmPassword;
    if (newPassword !== confirmPassword) {
      throw new Error("Passwords do not match");
    }
    await validatePassword(newPassword);
    const user = req.user;
    const hashedPassword = await user.hashPassword(newPassword);
    user.password = hashedPassword;
    await user.save();
    res.status(201).json({ message: "Password updated successfully" });
  } catch (err) {
    res.status(400).send("Error:" + err.message);
  }
});

module.exports = profileRouter;
