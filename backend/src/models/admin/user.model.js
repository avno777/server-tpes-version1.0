import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    UserName: {
      type: String,
      required: [true, "User required."],
      trim: true,
      unique: true,
    },
    Password: {
      type: String,
      required: [true, "Password required."],
      trim: true,
    },
    Role: {
      type: String,
      required: true,
      trim: true,
    },
    CreateBy: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "customers",
    },
    Organization: [
      {
        type: String,
        trim: true,
      },
    ],
  },
  { timestamps: true }
);
const UserModel = mongoose.model("users", UserSchema);
export default UserModel;

const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  UserName: {
    type: String,
    required: [true, "User required."],
  },
  Password: {
    type: String,
    required: [true, "Password required."],
  }, // Consider using hashed passwords.
  Role: {
    type: String,
    required: true,
  },
  ProjectName: {
    type: String,
    required: true,
  },
  DataBaseName: {
    type: String,
  },
  createdUsers: [String], // Array of UserNames of Level 2 users created by this Level 1 user
});
