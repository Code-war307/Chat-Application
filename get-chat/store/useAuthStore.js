import { axiosInstance } from "@/lib/axios";
import { signIn, update} from "next-auth/react";
import toast from "react-hot-toast";
import { create } from "zustand";
import { io } from "socket.io-client";
import { persist } from "zustand/middleware";

const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL;
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
        const { jwtToken } = get();
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
          toast.success(response.data.message)
          return newUserData
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
      name: "auth-storage",
      partialize: (state) => ({ authUser: state.authUser }),
    }
  )
);
