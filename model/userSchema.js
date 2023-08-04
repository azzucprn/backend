const mongoose = require("mongoose");

const userSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please enter the user name"],
    },
    email: {
      type: String,
      required: [true, "Email required."],
      unique: [true, "Account already exist with same username."],
    },
    password: {
      type: String,
      required: [true, "please add the user password"],
    },
  },
  { timestamps: true }
);

// Modal is what we used to perform all the operation upon.
module.exports = mongoose.model("User", userSchema);
