const express = require("express");
var cookieParser = require("cookie-parser");
const { authMiddleware } = require("./middlewares/auth");
const { dbConnect } = require("./config/database");
const authRouter = require("./routes/authRoute");
const profileRouter = require("./routes/profileRoute");
const requestRouter = require("./routes/requestRoute");
const userRouter = require("./routes/userRoute");

const app = express();

//#. Middleware to parse raw json data && cookie parser middleware
app.use(express.json()); //otherwise raw json data undefined
app.use(cookieParser()); //otherwise cookies undefined

//#. Runs the route synchronously
app.use("/", authRouter);
app.use("/", profileRouter);
app.use("/", requestRouter);
app.use("/", userRouter);

//#. Connect to DB and start the server
dbConnect()
  .then(() => {
    console.log("DB connection established......");

    app.listen(7777, () => {
      console.log("Server running on port 7777.....");
    });
  })
  .catch((err) => {
    console.log("DB connection Failed......" + err);
  });
