import { FileInput, FileOutput, Files, LayoutPanelLeft } from "lucide-react";

export const useFileConvertNavigation = () => {
  const fileConvertNav = [
    {
      name: "Home",
      icon: <LayoutPanelLeft className="w-4.5"/>,
    },
    {
      name: "All Files",
      icon: <Files className="w-4.5"/>,
    },
    {
      name: "File shared by You",
      icon: <FileInput className="w-4.5"/>,
    },
    {
      name: "File shared with You",
      icon: <FileOutput className="w-4.5"/>,
    },
  ];
  return {fileConvertNav};
};
