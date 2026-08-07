const express = require("express");
const { authMiddleware } = require("./middlewares/auth");
const app = express();
const { dbConnect } = require("./config/database");
const User = require("./models/user");

//#. Middleware to parse raw json data
app.use(express.json());

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

// #. Signup API
app.post("/signup", async (req, res) => {
  const user = new User(req.body);
  try {
    await user.save();
    res.status(201).send("User created successfully");
  } catch (err) {
    res.status(400).send("Error while creating user" + err);
  }
});

// #. API to list all users for the feed
app.get("/feed", async (req, res) => {
  try {
    const users = await User.find({});
    res.send(users);
  } catch (err) {
    res.status(400).send("Error while fetching users" + err);
  }
});

// #. API to get user by Email
app.get("/user", async (req, res) => {
  try {
    const user = await User.find({ email: req.body.email });
    if (user.length === 0) {
      res.status(404).send("User not found");
    } else {
      res.send(user);
    }
  } catch (err) {
    res.status(400).send("Error while fetching user" + err);
  }
});

//#. Delete user
app.delete("/user/:id", async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params?.id);
    res.send("User deleted successfully");
  } catch (err) {
    res.status(400).send("Error while deleting user" + err);
  }
});

//#. Update user
app.patch("/user/:id", async (req, res) => {
  try {
    const allowedFields = [
      "firstName",
      "lastName",
      "age",
      "photoUrl",
      "gender",
      "skills",
    ];
    if (!Object.keys(req.body).every((item) => allowedFields.includes(item))) {
      throw new Error("Invalid fields for update");
    }

    if (req.body?.skills.length > 10) {
      throw new Error("Skills cannot exceed 10");
    }
    const user = await User.findByIdAndUpdate(req.params?.id, req.body, {
      runValidators: true,
    });
    res.send("User updated successfully");
  } catch (err) {
    res.status(400).send("Error while updating user" + err);
  }
});
