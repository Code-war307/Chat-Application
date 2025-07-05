import { axiosInstance } from "@/lib/axios";
import { signIn } from "next-auth/react";
import toast from "react-hot-toast";
import { create } from "zustand";
import { io } from "socket.io-client";
import { persist } from "zustand/middleware";

const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5001";
export const useAuthStore = create(
  persist(
    (set, get) => ({
      authUser: null,
      uniqueUsernameMessage: "",
      isCheckingUsername: false,
      isSigningUp: false,
      isLoggingIn: false,
      onlineFriends: [],
      socket: null,

      setUser: (userData) => {
        const data = {
          bio: userData.bio,
          username: userData.username,
          profilePic: userData.profilePic,
          email: userData.email,
        };
        set({ authUser: data });
      },

      clearUser: () => set({ authUser: null }),

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

      connectSocket: () => {
        const { authUser } = get();
        if (!authUser) {
          console.error("User is not authenticated, cannot connect socket.");
          return;
        }
        const socket = io(BASE_URL, {
          query: {
            userId: authUser._id,
          },
        });
        socket.connect();
        set({ socket: socket });

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
      name: "auth-user",
      partialize: (state) => ({authUser: state.authUser}),
    }
  )
);
