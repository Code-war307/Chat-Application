import Message from "../models/message.model.js";
import User from "../models/user.model.js";
import cloudinary from "../lib/cloudinary.js";
import { getReceiverSocketId, io } from "../lib/socket.js";
import fs from "fs";
import { getResourceType } from "../helper/resourceType.js";
import redis from "../lib/redis.js";

export const getUserForSidebar = async (req, res) => {
  try {
    const userId = req.user._id;

    const cacheKey = `user:${userId}`;
    const cachedUser = await redis.get(cacheKey);

    if (cachedUser) {
      const friendList = JSON.parse(cachedUser);
      return res.status(200).json({ success: true, friendList });
    }

    const loginUserFriends = await User.findById(userId)
      .populate("friends", "_id username profilePic bio")
      .lean();

    if (!loginUserFriends) {
      return res
        .status(400)
        .json({ success: false, message: "User not found" });
    }

    const friendList = loginUserFriends.friends;
    await redis.set(cacheKey, JSON.stringify(friendList), { EX: 600 });
    return res.status(200).json({ success: true, friendList });
  } catch (error) {
    console.error("Error in getting friends", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

export const getMessages = async (req, res) => {
  try {
    const { id: userToChatId } = req.params;
    const myId = req.user._id;

    const cacheKey = `messages:${myId}:${userToChatId}`;
    const cachedMessage = await redis.get(cacheKey);
    if (cachedMessage) {
      console.log("serving from cache message");
      return res
        .status(200)
        .json({ success: true, messages: JSON.parse(cachedMessage) });
    }

    const messages = await Message.find({
      $or: [
        { senderId: myId, receiverId: userToChatId },
        { senderId: userToChatId, receiverId: myId },
      ],
    })
      .sort({ createdAt: 1 })
      .populate("senderId", "username profilePic")
      .lean();

    if (messages.length === 0) {
      return res
        .status(404)
        .json({ success: false, message: "None messages found" });
    }

    await redis.set(cacheKey, JSON.stringify(messages), { EX: 600 });

    return res.status(200).json({ success: true, messages });
  } catch (error) {
    console.error("Error in getMessage controller", error);
    return res
      .status(500)
      .json({ success: false, error: "Internal server error" });
  }
};

export const sendMessage = async (req, res) => {
  try {
    const senderId = req.user._id;
    const { id: receiverId } = req.params;
    const { text } = req.body;

    let uploadedFiles = [];

    if (req.files && req.files.length > 0) {
      const uploadAllFiles = req.files.map((file) => {
        const resourceType = getResourceType(file.originalname);
        return cloudinary.uploader
          .upload(file.path, {
            resource_type: resourceType,
            folder: "chat_uploads",
          })
          .then((res) => {
            fs.unlinkSync(file.path);
            return {
              url: res.secure_url,
              resourceType: res.resource_type,
              originalName: file.originalname,
            };
          })
          .catch((error) => {
            fs.unlinkSync(file.path);
            console.error("Error uploading file to Cloudinary", error);
            throw new Error("File upload failed");
          });
      });
      uploadedFiles = await Promise.all(uploadAllFiles);
    }

    const newMessage = new Message({
      senderId,
      receiverId,
      text: text || "",
      files: uploadedFiles,
      isSending: true,
    })
    
    await newMessage.populate("senderId", "username profilePic");

    await newMessage.save();

    const keyA = `messages:${senderId}:${receiverId}`;
    const keyB = `messages:${receiverId}:${senderId}`;
    try {
      await redis.del(keyA, keyB); // non‑blocking, ignore errors
    } catch (cacheErr) {
      console.warn("Redis DEL error:", cacheErr.message);
    }

    // Emit the new message to the receiver's socket
    const receiverSocketId = getReceiverSocketId(receiverId);
    if (receiverSocketId) {
      receiverSocketId.forEach((id) => {
        io.to(id).emit("newMessage", newMessage);
      })
    }

    return res.status(201).json(newMessage);
  } catch (error) {
    console.error("Error in sendMessage controller", error);
    return res
      .status(500)
      .json({ success: false, error: "Internal server error" });
  }
};
