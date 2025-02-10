import { UserModel } from "../models/index.js";
import ErrorHandler from "../utills/errorHandle.js";
import catchAsyncError from "../middleware/catchAsyncErrors.js";
import sendToken from "../utills/jwtToken.js";

export const register = catchAsyncError(async (req, res, _next) => {
  const { username, phone, password, email } = req.body;

  const userId = UserModel.findOne({ email: email });
  if (userId) {
    return _next(new ErrorHandler("Email exist", 402));
  }
  const user = await UserModel.create({
    username,
    email,
    password,
  });

  return sendToken(user, 200, res);
});


export const login = catchAsyncError(async (req, res, _next) => {
  const { email, password } = req.body;
  if (!email || !password || email === "" || password === "") {
    return _next(new ErrorHandler("Please enter email/password...", 400));
  }
  const user = await UserModel.findOne({ email }).select("+password");
  if (!user) {
    return _next(new ErrorHandler("Wrong email or password", 401));
  }
  const isPasswordMatched = await user.comparePassword(password);
  if (!isPasswordMatched) {
    return _next(new ErrorHandler("Wrong email or password...", 401));
  }

  if (user.status !== false) {
    return _next(new ErrorHandler("Account is disabled...", 402));
  }

  sendToken(user, 200, res);
});
export const loginWithGoogle = catchAsyncError(async (req, res, _next) => {
  if (!req.body || req.body.length === 0) {
    return res.status(400).json({ message: "Invalid code." });
  }

  const user = await UserModel.findOne({ email: req.body.email });

  if (!user) {
    const user = new UserModel({
      // username: req.body.displayName,
      username: req.body.username,
      email: req.body.email,
      avatar: req.body.avatar,
    });

    await user.save();
  }
  console.log(user);
  return res.status(200).json({
    message: "Login with Google successfully",
    code: 200,
    res: user,
  });
});
export const logout = catchAsyncError(async (req, res, _next) => {
  res.cookie("token", null, {
    expires: new Date(Date.now()),
    httpOnly: true,
  });

  res.status(200).json({
    success: true,
    message: "Logged out successfully!!",
  });
});
