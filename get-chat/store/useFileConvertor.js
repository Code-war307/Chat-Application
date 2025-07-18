import { create } from "zustand";
export const useFileConvertorStore = create((set) => ({
  addFilesForConvert: [],
  setAddFilesForConvert: (file) => {
    set((state) => ({
      addFilesForConvert: [file, ...state.addFilesForConvert],
    }));
  },
}));
