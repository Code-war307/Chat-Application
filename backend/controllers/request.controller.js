import User from "../models/user.model.js";
import FriendRequest from "../models/friendRequest.model.js";
import { getReceiverSocketId, io } from "../lib/socket.js";
import redis from "../lib/redis.js";

export const sendFriendRequest = async (req, res) => {
  try {
    const senderId = req.user._id;
    const { email } = req.body;
    const isReceiverExist = await User.findOne({ email });
    if (!isReceiverExist) {
      return res
        .status(400)
        .json({ success: false, message: "User not found" });
    }

    const receiverId = isReceiverExist._id.toString();
    if (senderId === receiverId) {
      return res
        .status(400)
        .json({ success: false, message: "Can't send request to yourself" });
    }

    const isAllreadyFriend = await User.findById(senderId);
    if (isAllreadyFriend && isAllreadyFriend.friends.includes(receiverId)) {
      return res
        .status(400)
        .json({ success: false, message: "You are already friends" });
    }

    const existingFriendRequest = await FriendRequest.findOne({
      senderId,
      receiverId,
      status: "pending",
    });
    if (existingFriendRequest) {
      return res
        .status(400)
        .json({ success: false, message: "Friend request already sent" });
    }

    const newFriendRequest = new FriendRequest({
      senderId,
      receiverId,
    });
    await newFriendRequest.save();

    const friendRequest = await FriendRequest.findById(newFriendRequest._id)
      .populate("senderId", "_id username profilePic")
      .sort({ createdAt: -1 });

    const receiverSocketId = getReceiverSocketId(receiverId);
    if (receiverSocketId) {
      receiverSocketId.forEach((id) => {
        io.to(id).emit("newFriendRequest", friendRequest);
      });
    }

    return res
      .status(200)
      .json({ success: true, message: "Friend request sent successfully" });
  } catch (error) {
    console.error("Error adding friend:", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};

export const getFriendRequest = async (req, res) => {
  try {
    const myId = req.user._id;
    const friendRequests = await FriendRequest.find({
      receiverId: myId,
      status: "pending",
    })
      .populate("senderId", "_id username profilePic")
      .sort({ createdAt: -1 });

    return res.status(200).json({ success: true, requests: friendRequests });
  } catch (error) {
    console.error("Error fetching friend requests:", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};

export const acceptFriendRequest = async (req, res) => {
  try {
    const { senderId } = req.body;
    const receiverId = req.user._id;

    const findFriendRequest = await FriendRequest.findOne({
      senderId,
      receiverId,
      status: "pending",
    });

    if (!findFriendRequest) {
      return res
        .status(404)
        .json({ success: false, message: "Friend request not found" });
    }

    const sender = await User.findById(senderId);
    const receiver = await User.findById(receiverId);
    if (!sender || !receiver) {
      return res
        .status(404)
        .json({ success: false, message: "Users not found" });
    }

    // add friend to each other and prevent duplicates
    if (!sender.friends.includes(receiverId)) {
      sender.friends.push(receiverId);
      await sender.save();
    }
    if (!receiver.friends.includes(senderId)) {
      receiver.friends.push(senderId);
      await receiver.save();
    }

    // update friend request status
    findFriendRequest.status = "accepted";
    await findFriendRequest.save();

    const keyA = `user:${senderId}`
    const keyB = `user:${receiverId}`
    try {
      await redis.del(keyA, keyB)
    } catch (error) {
      console.error("Redis error occrur",error.message)
    }

    const senderData = {
      _id : sender?._id,
      profilePic: sender?.profilePic,
      bio: sender?.bio,
      username: sender?.username
    }

    const receiverData = {
      _id : receiver?._id,
      profilePic: receiver?.profilePic,
      bio: receiver?.bio,
      username: receiver?.username
    }

    const senderSocketId = getReceiverSocketId(senderId);
    const receiverSocketId = getReceiverSocketId(receiverId);
    if(senderSocketId){
      senderSocketId.forEach((id) => {
        io.to(id).emit("newFriendAddInList", receiverData)
      })
    }

    if(receiverSocketId){
      receiverSocketId.forEach((id) => {
        io.to(id).emit("newFriendAddInList", senderData)
      })
    }

    return res.status(200).json({ success: true, message: "Request accepted" });
  } catch (error) {
    console.error("Accept friend error", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};

export const rejectFriendRequest = async (req, res) => {
  try {
    const receiverId = req.user._id;
    const { senderId } = req.body;

    const findFriendRequest = await FriendRequest.findOne({
      senderId,
      receiverId,
      status: "pending",
    });
    if (!findFriendRequest) {
      return res.status(404).json({
        success: false,
        message: "Friend request not found or already processed",
      });
    }

    await FriendRequest.deleteOne({ _id: findFriendRequest._id });
    return res
      .status(200)
      .json({ success: true, message: "Friend request rejected" });
  } catch (error) {
    console.error("Reject friend error", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};
