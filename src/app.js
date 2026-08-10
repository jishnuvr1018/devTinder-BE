const express = require("express");
var cookieParser = require("cookie-parser");
const { authMiddleware } = require("./middlewares/auth");
const app = express();
const { dbConnect } = require("./config/database");
const User = require("./models/user");

//#. Middleware to parse raw json data && cookie parser middleware
app.use(express.json());
app.use(cookieParser());

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
app.post("/login", async (req, res) => {
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

// #. API to get user profile
app.get("/profile", authMiddleware, async (req, res) => {
  try {
    res.send(req?.user);
  } catch (err) {
    res.status(400).send("Error:" + err.message);
  }
});

//#. send connect request
app.post("/sendConnectionRequest", authMiddleware, async (req, res) => {
  try {
    res.send(req?.user?.firstName + " sended connection request");
  } catch (err) {
    res.status(400).send("Error:" + err.message);
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

    if (req.body?.skills?.length > 10) {
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
