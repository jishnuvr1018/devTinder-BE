const express = require("express");
const { authMiddleware } = require("./middlewares/auth");
const app = express();

app.get("/user", authMiddleware);

app.get("/user/:userId", (req, res) => {
  res.send("Dynamic path");
});

app.use("/", (err, res, req, next) => {
  res.status(500).send("Something Went Wrong!...");
});

app.listen(7777, () => {
  console.log("Server running on port 7777.....");
});
