const mongoose = require("mongoose");
const { Schema } = mongoose;
const validator = require("validator");

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
    },
  },
  { timestamps: true },
);

const User = mongoose.model("User", userSchema);

module.exports = User;
