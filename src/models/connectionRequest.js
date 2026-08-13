const mongoose = require("mongoose");
const { Schema } = mongoose;

const connectionSchema = new Schema(
  {
    senderId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User", //add a relation to User model : use populate()
    },
    receiverId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    status: {
      type: String,
      enum: ["accepted", "interested", "rejected", "ignored"],
      message: ["Status not valid"],
    },
  },
  { timestamps: true },
);

//#. precheck function before model.save
connectionSchema.pre("save", function () {
  //#. restricts same user dbs
  if (this.senderId.equals(this.receiverId)) {
    throw new Error("Cannot send request to same user");
  }
});

//#. compound index combininig 2 keys
connectionSchema.index({ senderId: 1, receiverId: -1 });

const ConnectionRequest = mongoose.model("ConnectionRequest", connectionSchema);

module.exports = ConnectionRequest;
