import mongoose from "mongoose";
import validator from "validator";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import jwt from "jsonwebtoken";
import { type } from "os";

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      require: true,
    },
    phone: {
      type: String,
      minLenght: 10,
    },
    email: {
      type: String,
      required: [true, "email is required"],
      unique: true,
      validate: [validator.isEmail, "email invalid format"],
    },
    password: {
      type: String,
      require: true,
      minLength: 8,
      select: false,
    },
    role: {
      type: String,
      default: "user",
    },
    avatar: {
      type: String,
      default: "",
    },
    status: {
      type: Boolean,
      default: false,
    },
    resetPasswordToken: String,
    resetPasswordExpire: Date,
  },

  { timestamps: true }
);

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    next();
  }
  this.password = await bcrypt.hash(this.password, 10);
});
userSchema.methods.getJWTToken = function () {
  return jwt.sign({ id: this._id }, process.env.SECRET_KEY_TOKEN, {
    expiresIn: process.env.EXPIRES_IN_SECONDS,
  });
};

userSchema.methods.comparePassword = async function (passwordInput) {
  return await bcrypt.compare(passwordInput, this.password);
};

userSchema.methods.getResetPasswordToken = async function () {
  const resetToken = await crypto.randomBytes(20).toString("hex");
  this.resetPasswordToken = await crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  this.resetPasswordExpire = Date.now() + 15 * 60 * 1000;

  return resetToken;
};
const UserModel = mongoose.model("User", userSchema);

export default UserModel;
