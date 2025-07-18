import { axiosInstance } from "@/lib/axios";
import toast from "react-hot-toast";
import { create } from "zustand";

export const useRequestStore = create((set, get) => ({
  IsRequestSubmiitting: false,
  isRequestsLoading: false,
  isAcceptingRequest: false,
  isRejectingRequest: false,
  requests: [],

  sendFriendRequest: async (jwtToken, email) => {
    set({ IsRequestSubmiitting: true });
    try {
      const response = await axiosInstance.post(
        `/request/send-friend-request/`,
        { email },
        {
          headers: {
            Authorization: `Bearer ${jwtToken}`,
          },
        }
      );
      toast.success(response.data.message);
    } catch (error) {
      console.error("Error sending friend request:", error);
      const message =
        error?.response?.data?.message || "Failed to send request";
      toast.error(message);
    } finally {
      set({ IsRequestSubmiitting: false });
    }
  },

  pushNewRequest: (request) => {
    set((state) => ({ requests: [request, ...state.requests] }));
    toast.success(`${request.senderId?.username} set you a friend request`);
  },

  getFriendRequests: async (jwtToken) => {
    set({ isRequestsLoading: true });
    try {
      const response = await axiosInstance.get("/request/get-freiend-request", {
        headers: {
          Authorization: `Bearer ${jwtToken}`,
        },
      });
      set({ requests: response.data.requests });
    } catch (error) {
      const message =
        error?.response?.data?.message || "No friend request available";
      console.error(message);
    } finally {
      set({ isRequestsLoading: false });
    }
  },

  acceptFriendRequest: async (jwtToken, senderId) => {
    const { requests } = get();
    set({ isAcceptingRequest: true });
    try {
      const response = await axiosInstance.post(
        "/request/accept-friend-request",
        { senderId },
        {
          headers: {
            Authorization: `Bearer ${jwtToken}`,
          },
        }
      );
      toast.success(response.data.message);
      const updatedRequests = requests.filter(
        (req) => req.senderId._id !== senderId
      );

      set({ requests: updatedRequests });
    } catch (error) {
      console.error("Something went wrong ", error);
      const message = error?.response?.data?.message || "Something went wrong";
      toast.error(message);
    } finally {
      set({ isAcceptingRequest: false });
    }
  },

  rejectFriendRequest: async (jwtToken, senderId) => {
    set({ isRejectingRequest: true });
    const { requests } = get();
    try {
      const response = await axiosInstance.post(
        "/request/reject-friend-request",
        { senderId },
        {
          headers: {
            Authorization: `Bearer ${jwtToken}`,
          },
        }
      );
      toast.success(response.data.message);
      const updatedRequests = requests.filter(
        (req) => req.senderId._id !== senderId
      );

      set({ requests: updatedRequests });
    } catch (error) {
      console.error(error);
      const message = error?.response?.data?.message || "Something went wrong";
      toast.error(message);
    } finally {
      set({ isRejectingRequest: false });
    }
  },
}));
