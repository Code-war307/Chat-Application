"use client";
import { create } from "zustand";
import { axiosInstance } from "@/lib/axios";
import toast from "react-hot-toast";
import { useAuthStore } from "./useAuthStore";

export const useChatStore = create((set, get) => ({
  messages: [],
  friends: [],
  selectedFriend: null,
  isFriendsLoading: false,
  isMessageLoading: false,
  isMessageSending: false,
  mediaFiles: [],
  isPlaying: false,
  duration: 0,
  currentTime: 0,
  previewMedia : [],

  getUserFriends: async (jwtToken) => {
    set({ isFriendsLoading: true });
    try {
      const response = await axiosInstance.get("/message/users", {
        headers: {
          Authorization: `Bearer ${jwtToken}`,
        },
      });

      set({ friends: response.data.friendList });
    } catch (error) {
      console.error("Internal server error", error);
    } finally {
      set({ isFriendsLoading: false });
    }
  },

  getMessages: async (conversationId, jwtToken) => {
    set({ isMessageLoading: true });
    try {
      const response = await axiosInstance.get(`/message/${conversationId}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${jwtToken}`,
        },
      });
      set({ messages: response.data.messages });
    } catch (error) {
      console.error(error);
    } finally {
      set({ isMessageLoading: false });
    }
  },

  sendMessages: async (jwtToken, conversationId, formData) => {
    const { messages } = get();
    set({ isMessageSending: true });
    try {
      const response = await axiosInstance.post(
        `/message/send/${conversationId}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${jwtToken}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );
      set({ messages: [...messages, response.data] });
    } catch (error) {
      console.error("Error sending message:", error);
      toast.error(error.response?.data?.error || "Failed to send message");
    } finally {
      set({ isMessageSending: false });
    }
  },

  subscribeToMessages: () => {
    const { selectedFriend } = get();
    const currentUserId = useAuthStore.getState().authUser._id;
    if (!selectedFriend) {
      console.warn("No selected friend to subscribe to messages.");
      return;
    }
    const socket = useAuthStore.getState().socket;
    socket.on("newMessage", (message) => {
      const isFromSelectedFriend =
        (message.senderId._id === selectedFriend._id &&
          message.receiverId === currentUserId) ||
        (message.senderId._id === currentUserId &&
          message.receiverId === selectedFriend._id);
      if (!isFromSelectedFriend) return;
      set((state) => ({
        messages: [...state.messages, message],
      }));
    });
  },

  unsubscribeFromMessages: () => {
    const socket = useAuthStore.getState().socket;
    socket.off("newMessage");
  },

  setSelectedFriend: (selectedFriend) => set({ selectedFriend }),

  setMediaFiles: (files) => set({ mediaFiles: files }),

  addMediaFiles: (file) =>
    set((state) => ({ mediaFiles: [...state.mediaFiles, file] })),

  removeMediaFile: (index) =>
    set((state) => ({
      mediaFiles: state.mediaFiles.filter((_, i) => i !== index),
    })),

  setIsPlaying: (isPlay) => set({ isPlaying: isPlay }),

  setCurrentTime: (time) => set({currentTime : time}),

  setDuration : (time) => set({duration: time}),

  setPreviewMedias : (media) => set({previewMedia : media})
}));
