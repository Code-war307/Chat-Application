import mongoose from "mongoose";

const MessageSchema = new mongoose.Schema(
  {
    senderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    receiverId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    text: {
      type: String,
    },
    files: [
      {
        url: {
          type: String,
          required: true,
        },
        resourceType: {
          type: String,
          enum: ["image", "video", "raw"],
          required: true,
        },
        originalName: {
          type: String,
          required: true,
        },
      },
    ],
    isSending: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

const Message =
  mongoose.models.Message || mongoose.model("Message", MessageSchema);
export default Message;
