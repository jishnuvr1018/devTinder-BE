const User = require("../models/user");
var Jwt = require("jsonwebtoken");

const Auth = async (req, res, next) => {
  try {
    const token = req.cookies?.token;
    if (!token) {
      return res.status(401).send("Unauthorized or Invalid Token!!!!");
    }
    const decoded = Jwt.verify(token, "DevTinder@1018!");
    const user = await User.findById(decoded?._id);
    if (!user) {
      throw new Error("User not found");
    }
    req.user = user;
    next();
  } catch (err) {
    res.status(400).send("Error:" + err.message);
  }
};

module.exports = {
  authMiddleware: Auth,
};
