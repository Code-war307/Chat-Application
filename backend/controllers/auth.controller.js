import cloudinary from "../lib/cloudinary.js";
import { getReceiverSocketId, io } from "../lib/socket.js";
import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import fs from "fs";

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

    const newUser = new User({
      username,
      email,
      password: hashedPassword,
      isVerified: true,
    });

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
    const { username, password, bio } = req.body;
    const userId = req.user._id;

    if (!username && !password && !bio && !req.file) {
      return res
        .status(400)
        .json({ success: false, message: "Nothing is send to update" });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res
        .status(400)
        .json({ success: false, message: "User not found" });
    }

    const updates = {};

    if (username && username != user.username) {
      if (username.length < 3 || username.length > 25) {
        return res.status(401).json({
          success: false,
          message: "Username length must be in limit",
        });
      }
      if (username.startsWith("_")) {
        return res.status(400).json({
          success: false,
          message: "Username not start with underscore",
        });
      }
      updates.username = username;
    }

    if (password) {
      if (password.length < 6 || password.length > 35) {
        return res.status(401).json({
          success: false,
          message: "Password length must be 6 - 35 characters.",
        });
      }
      const samePass = await bcrypt.compare(user.password, password);
      if (!samePass) {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        updates.password = hashedPassword;
      }
    }

    if (bio != undefined && bio != user.bio) {
      if (bio.length > 100) {
        return res
          .status(400)
          .json({ success: false, message: "Bio must be in 100 characters" });
      }
      updates.bio = bio;
    }

    if (req.file) {
      try {
        const uploadResponse = await cloudinary.uploader.upload(req.file.path, {
          folder: "chat_uploads",
        });

        updates.profilePic = uploadResponse.secure_url;
        fs.unlinkSync(req.file.path);
      } catch (error) {
        fs.unlinkSync(req.file.path);
        console.error("Cloudinary Upload Error:", error);
        return res
          .status(500)
          .json({ success: false, message: "Image upload failed" });
      }
    }

    if (Object.keys(updates).length === 0) {
      return res
        .status(400)
        .json({ success: false, message: "No new changes detected." });
    }

    const updateUserProfile = await User.findByIdAndUpdate(userId, updates, {
      new: true,
      select: "_id username profilePic bio email isVerified",
    });

    const isUserSocketIdExist = getReceiverSocketId(userId)
    if(isUserSocketIdExist){
      isUserSocketIdExist.forEach((id) => io.to(id).emit("newProfileUpdate", updateUserProfile))
    }


    if(user?.friends?.length){
      for(const friendId of user?.friends){
        const friendSocketId = getReceiverSocketId(friendId.toString());
        if(friendSocketId){
          friendSocketId.forEach((id) => {
            io.to(id).emit("friendProfileUpdate", updateUserProfile)
          })
        }
      }
    }

    res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      updateUserProfile,
    });
  } catch (error) {
    console.error("Error in update user profile controller");
    res.status(500).json({
      success: false,
      message: "Error in update user profile controller",
    });
  }
};

export const checkUniqueName = async (req, res) => {
  try {
    const username = req.query.username;
    if (!username || username.length < 3) {
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
