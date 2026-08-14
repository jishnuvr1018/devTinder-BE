const express = require("express");
const userRouter = express.Router();
const { authMiddleware } = require("../middlewares/auth");
const ConnectionRequest = require("../models/connectionRequest");
const User = require("../models/user");

const FieldsToShow = "firstName lastName age photoUrl gender skills about";

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

//#. feed Api
userRouter.get("/feed", authMiddleware, async (req, res) => {
  try {
    const loggeInUser = req.user;
    const page = parseInt(req.query?.page) || 1;
    const requestedLimit = parseInt(req.query?.limit) || 10;
    const limit = Math.min(Math.max(requestedLimit, 1), 50);
    const skip = (page - 1) * limit;

    const connections = await ConnectionRequest.find({
      $or: [{ senderId: loggeInUser._id }, { receiverId: loggeInUser._id }],
    });

    const formattedData = connections.map((item) => {
      if (item.senderId.equals(loggeInUser._id)) {
        return item.receiverId;
      } else {
        return item.senderId;
      }
    });

    const idsToExclude = [
      ...formattedData.map((id) => id._id),
      loggeInUser._id,
    ];

    const users = await User.find({
      _id: { $nin: idsToExclude },
    })
      .select(FieldsToShow)
      .skip(skip)
      .limit(limit);

    res.json({
      data: users,
    });
  } catch (err) {
    res.status(400).send("Error:" + err);
  }
});

module.exports = userRouter;
