const express = require("express");
const requestRouter = express.Router();
const { authMiddleware } = require("../middlewares/auth");
const ConnectionRequest = require("../models/connectionRequest");
const User = require("../models/user");

//#. Api to send or ignore connect request
requestRouter.post(
  "/send/:status/:receiverId",
  authMiddleware,
  async (req, res) => {
    try {
      const { status, receiverId } = req?.params;
      const userId = req?.user._id;

      const isUserValid = await User.findById(receiverId);
      if (!isUserValid) {
        return res.status(404).send("User not Found");
      }

      const allowedStatus = ["interested", "ignored"];
      if (!allowedStatus?.includes(status)) {
        return res.status(400).send("Invalid Status");
      }

      // 4. Check whether connection already exists
      const existingConnection = await ConnectionRequest.findOne({
        $or: [
          {
            senderId: userId,
            receiverId: receiverId,
          },
          {
            senderId: receiverId,
            receiverId: userId,
          },
        ],
      });

      if (existingConnection) {
        return res.status(400).send("Connection request already exists");
      }

      const request = new ConnectionRequest({
        senderId: userId,
        receiverId: receiverId,
        status: status,
      });
      await request.save();
      res.json({
        message: "Connection request sent successfully",
        data: request,
      });
    } catch (err) {
      res.status(400).send("Error:" + err);
    }
  },
);

//#. Api to accept or reject connection
requestRouter.post(
  "/review/:status/:requestId",
  authMiddleware,
  async (req, res) => {
    const { status, requestId } = req.params;
    const loggedInuser = req.user;
    try {
      const allowedFields = ["accepted", "rejected"];
      if (!allowedFields.includes(status)) {
        return res.status(400).json({ message: "Status not valid" });
      }

      const data = await ConnectionRequest.findOne({
        _id: requestId,
        receiverId: loggedInuser._id,
        status: "interested",
      });

      if (!data) {
        return res.status(400).json({ message: "Record not availabale " });
      }

      data.status = status;
      await data.save();
      res.status(200).json({
        message: `Request ${status} successfully!`,
        data: data,
      });
    } catch (err) {
      res.status(400).send("Error:" + err);
    }
  },
);

module.exports = requestRouter;
