import cloudinary from "../lib/cloudinary.js";
import User from "../models/user.model.js";
import bcrypt from "bcryptjs";

export const signup = async (req, res) => {
  const { username, email, password } = req.body;
  try {
    if (!username || !email || !password) {
      return res.status(400).json({ message: "All Fields should be filled" });
    }

    if (password.length < 8) {
      return res
        .status(404)
        .json({ message: "Password must be atleast 8 characters" });
    }

    const existingUserEmail = await User.findOne({ email });
    if (existingUserEmail) {
      return res
        .status(400)
        .json({ message: "You have already account. Please login !!!" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({ username, email, password: hashedPassword, isVerified: true });

    await newUser.save();
    return res
      .status(200)
      .json({ success: true, message: "Signup successfully" });
  } catch (error) {
    console.error("Error in Signup controller", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const isExistingUser = await User.findOne({ email });
    if (!isExistingUser) {
      return res.status(400).json({ success: false, message: "Invalid email" });
    }

    const isValidPassword = await bcrypt.compare(
      password,
      isExistingUser.password
    );
    if (!isValidPassword) {
      return res
        .status(404)
        .json({ success: false, message: "Invalid password" });
    }

    res.status(200).json({ success: true, user: isExistingUser });
  } catch (error) {
    console.log("Error in login controller", error);
    return res
      .status(500)
      .json({ success: false, error: "Internal server error" });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const { username, password, profilePic, bio } = req.body;
    const userId = req.user._id;

    const user = await User.findById({ userId });
    if (!user) {
      return res
        .status(400)
        .json({ success: false, message: "User not found" });
    }

    if (user.username === username) {
      return res.status(400).json({
        success: false,
        message: "This name is already exist. Try new !!",
      });
    }

    const isOldPassword = await bcrypt.compare(user.password, password);
    if (isOldPassword) {
      return res
        .status(400)
        .json({ success: false, message: "Don't use old Password" });
    }

    const uploadResponse = await cloudinary.uploader.upload(profilePic);

    const updateUserProfile = await User.findByIdAndUpdate(
      userId,
      {
        username,
        password,
        profilePic: uploadResponse.secure_url,
        bio,
      },
      { new: true }
    );

    res.status(200).json(updateUserProfile);
  } catch (error) {}
};

export const checkUniqueName = async (req, res) => {
  try {
    const username = req.query.username;
    if(!username || username.length < 3){
      return res.status(404).json({
        success: false,
        message: "Username must be at least 3 characters",
      });
    }

    const existingVerifiedUsername = await User.findOne({
      username: username,
      isVerified: true,
    });
    if (existingVerifiedUsername) {
      return res.status(404).json({
        success: false,
        message: "Username is already taken. Try a new one.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Username is unique",
    });
  } catch (error) {
    console.error("Error in checking username controller", error);
    return res
      .status(500)
      .json({ success: false, error: "Error checking username" });
  }
};
