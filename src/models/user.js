const mongoose = require("mongoose");
const { Schema } = mongoose;
const validator = require("validator");
var jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const userSchema = new Schema(
  {
    firstName: {
      type: String,
      required: true,
      minlength: [2, "First name must be at least 2 characters long"],
      maxlength: [50, "First name cannot exceed 50 characters"],
    },
    lastName: {
      type: String,
      required: true,
      minlength: [2, "First name must be at least 2 characters long"],
      maxlength: [50, "Last name cannot exceed 50 characters"],
    },
    email: {
      type: String,
      required: true,
      unique: true,
      index: true,
      lowercase: true,
      trim: true,
      validate: {
        validator: function (v) {
          return /^[a-zA-Z0–9._%+-]+@[a-zA-Z0–9.-]+\.[a-zA-Z]{2,}$/.test(v);
        },
        message: (props) => `${props.value} is not a valid email address!`,
      },
    },
    password: {
      type: String,
      required: true,
      validate: {
        validator: function (v) {
          return validator.isStrongPassword(v);
        },
        message: (props) => `${props.value} is not a strong password!`,
      },
    },
    age: {
      type: Number,
      required: true,
      min: [18, "Age must be at least 18"],
    },
    photoUrl: {
      type: String,
      default:
        "https://img.magnific.com/premium-vector/translator-icon_1076610-18679.jpg?semt=ais_test_b&w=740&q=80",
      validate: {
        validator: function (v) {
          return validator.isURL(v);
        },
        message: (props) => `${props.value} is not a valid URL!`,
      },
    },
    gender: {
      type: String,
      enum: ["male", "female", "other"],
    },
    skills: {
      type: [String],
      maxlength: [10, "Skills cannot exceed 10"],
    },
    about: {
      type: String,
      maxlength: [500, "About section cannot exceed 500 characters"],
    },
  },
  { timestamps: true },
);

//#. util method to generate token
userSchema.methods.generateToken = async function () {
  const user = this;
  const token = await jwt.sign({ _id: user._id }, "DevTinder@1018!", {
    expiresIn: "1d",
  });
  return token;
};

//#. util method to validate password
userSchema.methods.validPassword = async function (userPassword) {
  const user = this;
  isPasswordValid = bcrypt.compare(userPassword, user.password);
  return isPasswordValid;
};

//#. util method to hash password
userSchema.methods.hashPassword = async function (userPassword) {
  const user = this;
  const hashedPassword = await bcrypt.hash(userPassword, 10);
  return hashedPassword;
};

const User = mongoose.model("User", userSchema);

module.exports = User;
