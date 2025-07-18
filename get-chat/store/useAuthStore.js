import { axiosInstance } from "@/lib/axios";
import { signIn } from "next-auth/react";
import toast from "react-hot-toast";
import { create } from "zustand";
import { io } from "socket.io-client";
import { persist } from "zustand/middleware";
import { useChatStore } from "./useChatStore";

const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL;
//const BASE_URL = "http://localhost:5001";
export const useAuthStore = create(
  persist(
    (set, get) => ({
      authUser: null,
      uniqueUsernameMessage: "",
      isCheckingUsername: false,
      isSigningUp: false,
      isLoggingIn: false,
      isUpdateUser: false,
      onlineFriends: [],
      socket: null,
      jwtToken: null,

      setUser: (userData) => {
        const data = {
          _id: userData._id,
          username: userData.username,
          profilePic: userData.profilePic,
          email: userData.email,
          bio: userData.bio,
        };
        set({ authUser: data });
      },

      clearUser: () => set({ authUser: null }),

      setToken: (jwtToken) => set({ jwtToken: jwtToken }),

      checkUniqueUsername: async (debouncedUsername) => {
        try {
          set({
            isCheckingUsername: true,
            uniqueUsernameMessage: "Checking username availability...",
          });
          const response = await axiosInstance.get(
            `/auth/check-unique-username?username=${debouncedUsername}`
          );

          const { message } = response.data;

          set({
            uniqueUsernameMessage: message,
          });
        } catch (error) {
          console.error("Error checking username:", error);
          const message =
            error?.response?.data?.message || "Error checking username.";
          set({ uniqueUsernameMessage: message });
        } finally {
          set({ isCheckingUsername: false });
        }
      },

      signup: async (formData, router) => {
        try {
          set({ isSigningUp: true });
          const response = await axiosInstance.post("/auth/signup", formData);

          const result = await signIn("credentials", {
            redirect: false,
            email: formData.email,
            password: formData.password,
          });
          if (result?.ok) {
            const { message } = response.data;
            router.replace("/dashboard/conversation");
            toast.success(message);
            get().connectSocket();
          } else {
            toast.error(result?.error);
          }
        } catch (error) {
          console.error("Error in signup controller:", error);
          const message =
            error?.response?.data?.message || "Error checking username.";
          toast.error(message);
        } finally {
          set({ isSigningUp: false });
        }
      },

      login: async (formData, router) => {
        try {
          set({ isLoggingIn: true });
          const result = await signIn("credentials", {
            redirect: false,
            email: formData.email,
            password: formData.password,
          });

          if (result?.ok) {
            router.replace("/dashboard/conversation");
            toast.success("Login successful!");

            get().connectSocket();
          } else {
            toast.error(result?.error);
          }
        } catch (error) {
          console.error("Login Error:", error);
        } finally {
          set({ isLoggingIn: false });
        }
      },

      updateUser: async (formData) => {
        const { jwtToken, socket } = get();
        set({ isUpdateUser: true });
        try {
          const response = await axiosInstance.post(
            "/auth/update-profile",
            formData,
            {
              headers: {
                Authorization: `Bearer ${jwtToken}`,
              },
            }
          );
          const newUserData = response.data.updateUserProfile;
          toast.success(response.data.message);
          return newUserData;
        } catch (error) {
          console.error("Error in update controller:", error);
          toast.error(error.response?.data?.error || "Something went wrong");
        } finally {
          set({ isUpdateUser: false });
        }
      },

      connectSocket: () => {
        const { authUser } = get();
        if (!authUser) {
          console.error("User is not authenticated, cannot connect socket.");
          return;
        }
        const socket = io(BASE_URL, {
          autoConnect: false,
          query: {
            userId: authUser._id,
          },
        });
        socket.connect();
        console.log("socket is connected");
        set({ socket: socket });

        socket.on("newProfileUpdate", (newUserData) => {
          get().setUser(newUserData);
        });

        socket.on("friendProfileUpdate", (newUserData) => {
          console.log("Friend profile updated via socket");
          const data = {
            _id : newUserData?._id,
            bio: newUserData?.bio,
            username: newUserData?.username,
            profilePic: newUserData?.profilePic
          }

          const currFriendList = useChatStore.getState().friends || [];
          const updatedList = currFriendList.map(friend => 
            friend._id === data._id ? {...friend , ...data} : friend
          )

          useChatStore.setState({friends: updatedList})
          const setSelectedFriend = useChatStore.getState.setSelectedFriend
          setSelectedFriend(data)
        })

        socket.on("getOnlineUsers", (userIds) => {
          set({ onlineFriends: userIds });
        });
      },

      disconnectSocket: () => {
        // when user logs out, we need to disconnect the socket
        if (get().socket?.connected) {
          get().socket.disconnect();
        }
      },
    }),
    {
      name: "auth-storage",
      partialize: (state) => ({ authUser: state.authUser }),
    }
  )
);
