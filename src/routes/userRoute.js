const express = require("express");
const userRouter = express.Router();
const { authMiddleware } = require("../middlewares/auth");
const ConnectionRequest = require("../models/connectionRequest");
const User = require("../models/user");

//#. Api to get all request recieved
userRouter.get("/request/recieved", authMiddleware, async (req, res) => {
  try {
    const loggedInUser = req.user;
    const requestsData = await ConnectionRequest.find({
      receiverId: loggedInUser._id,
      status: "interested",
    }).populate("senderId", ["firstName", "lastName"]);

    res.json({
      data: requestsData,
    });
  } catch (err) {
    res.status(400).send("Error:" + err);
  }
});

//#. Api to get all accepted connections
userRouter.get("/connections", authMiddleware, async (req, res) => {
  try {
    const loggedInUser = req.user;
    const connectionData = await ConnectionRequest.find({
      $or: [
        { senderId: loggedInUser._id, status: "accepted" },
        { receiverId: loggedInUser._id, status: "accepted" },
      ],
    })
      .populate("senderId", ["firstName", "lastName"])
      .populate("receiverId", ["firstName", "lastName"]);

    const connections = connectionData.map((connection) => {
      if (connection.senderId._id.equals(loggedInUser._id)) {
        return connection.receiverId;
      } else {
        return connection.senderId;
      }
    });
    res.json({
      data: connections,
    });
  } catch (err) {
    res.status(400).send("Error:" + err);
  }
});

module.exports = userRouter;
