"use client";
import { create } from "zustand";
import { axiosInstance } from "@/lib/axios";
import toast from "react-hot-toast";
import { persist } from "zustand/middleware";

export const useChatStore = create(
  persist(
    (set, get) => ({
      messages: [],
      friends: [],
      filteredFriend: [],
      selectedFriend: null,
      isFriendsLoading: false,
      isMessageLoading: false,
      isMessageSending: false,
      mediaFiles: [],
      isPlaying: false,
      duration: 0,
      currentTime: 0,
      previewMedia: [],
      tempId: null,

      setSelectedFriend: (selectedFriend) => {
        set({ selectedFriend });
      },

      getUserFriends: async (jwtToken) => {
        try {
          set({ isFriendsLoading: true });
          const response = await axiosInstance.get("/message/users", {
            headers: {
              Authorization: `Bearer ${jwtToken}`,
            },
          });

          set({ friends: response.data.friendList });
          set({ filteredFriend: response.data.friendList });
        } catch (error) {
          console.error("Internal server error", error);
        } finally {
          set({ isFriendsLoading: false });
        }
      },

      pushNewFriend: (newFriend) => {
        set((state) => ({ friends: [newFriend, ...state.friends] }));
      },

      setFilteredFriend: (friend) => set({ filteredFriend: friend }),

      getMessages: async (conversationId, jwtToken) => {
        set({ isMessageLoading: true });
        try {
          const response = await axiosInstance.get(
            `/message/${conversationId}`,
            {
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${jwtToken}`,
              },
            }
          );
          set({ messages: response.data.messages });
        } catch (error) {
          console.error(error);
        } finally {
          set({ isMessageLoading: false });
        }
      },

      sendMessages: async (
        jwtToken,
        conversationId,
        formData,
        dummyMessage
      ) => {
        get().addmessage(dummyMessage);
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
          const realMsg = response.data;
          get().replaceMessage(realMsg);
        } catch (error) {
          console.error("Error sending message:", error);
          toast.error(
            error.response?.data?.error ||
              "Max limit exceed. Send 5 media at a time"
          );
          get().deleteDummyMsg();
        } finally {
          set({ isMessageSending: false });
        }
      },

      addmessage: (dummyMessage) => {
        set((state) => ({
          messages: [...state.messages, dummyMessage],
          tempId: dummyMessage._id,
        }));
      },

      replaceMessage: (realMsg) => {
        const { tempId, mediaFiles } = get();

        mediaFiles.forEach((file) => {
          if (file.previewUrl) {
            URL.revokeObjectURL(file.previewUrl);
          }
        });

        set((state) => ({
          messages: state.messages.map((msg) =>
            msg._id === tempId ? realMsg : msg
          ),
          mediaFiles: [],
          tempId: null,
        }));
      },

      deleteDummyMsg: () => {
        const { tempId } = get();
        if (!tempId) return;

        set((state) => ({
          messages: state.messages.filter((m) => m._id !== tempId),
          tempId: null,
        }));
      },

      subscribeToMessages: (authUser, socket) => {
        const { selectedFriend } = get();
        const currentUserId = authUser._id;
        if (!selectedFriend) {
          console.warn("No selected friend to subscribe to messages.");
          return;
        }
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

      unsubscribeFromMessages: (socket) => {
        if (!socket) return;
        socket.off("newMessage");
      },

      setMediaFiles: (files) => set({ mediaFiles: files }),

      addMediaFiles: (file) =>
        set((state) => ({ mediaFiles: [...state.mediaFiles, file] })),

      removeMediaFile: (index) =>
        set((state) => ({
          mediaFiles: state.mediaFiles.filter((_, i) => i !== index),
        })),

      setIsPlaying: (isPlay) => set({ isPlaying: isPlay }),

      setCurrentTime: (time) => set({ currentTime: time }),

      setDuration: (time) => set({ duration: time }),

      setPreviewMedias: (media) => set({ previewMedia: media }),
    }),
    {
      name: "chat-storage",
      partialize: (state) => ({
        selectedFriend: state.selectedFriend,
        previewMedia: state.previewMedia,
        filteredFriend: state.filteredFriend,
      }),
    }
  )
);
