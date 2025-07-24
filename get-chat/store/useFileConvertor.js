import { axiosInstance } from "@/lib/axios";
import { create } from "zustand";
import { useAuthStore } from "./useAuthStore";
export const useFileConvertorStore = create((set) => ({
  addFilesForConvert: null,
  setAddFilesForConvert: (file) => {
    set({ addFilesForConvert: file });
  },
  removeFileForConvert: () => {
    set({ addFilesForConvert: null });
  },

  submitConversion: async (formData) => {
    const {jwtToken} = useAuthStore.getState();
    try {
      const response = await axiosInstance.post(
        `/file/convert`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${jwtToken}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      console.log("File converted successfully:", response.data);
    } catch (error) {
      console.log(error);
    }
  },
}));
