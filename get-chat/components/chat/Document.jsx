import { getFilePreviewInfo } from "@/helper/geticon";
import { Button } from "../ui/button";
import { Loader } from "lucide-react";

const Document = ({file, timestamp, fromCurrentUser, isSending}) => {
    const previewUrl = getFilePreviewInfo(file.url || file.name);
  return (
    <div
      className="bg-white/4 backdrop-blur-md border border-white/20 text-black rounded-lg  shadow-sm shadow-gray-700 px-3 py-3 mb-3 w-full"
    >
      <div className="text-white flex flex-col items-center gap-2 mb-2">
        <img src={previewUrl} alt="PDF" className="w-16 h-16" />
        <span className="font-semibold truncate">{file.originalName}</span>
      </div>
      <div className="flex justify-center gap-2 mt-2">
        <Button
          asChild
          className="text-sm border-1 text-firstColor border-firstColor bg-secondColor hover:bg-firstColor hover:text-secondColor hover:border-secondColor"
        >
          <a href={file.url} target="_blank" rel="noopener noreferrer">
            Open
          </a>
        </Button>
        <Button
          asChild
          className="text-sm border-1  text-firstColor border-firstColor bg-secondColor hover:bg-firstColor hover:text-secondColor hover:border-secondColor"
        >
          <a href={file.url} download>
            Save as
          </a>
        </Button>
      </div>
      <p
        className={`text-[0.6rem] text-white flex items-center mt-2 font-semibold${fromCurrentUser ? "justify-end" : "justify-start"}`}
      >
        <span>{timestamp}</span>{!isSending && <span><Loader className={`absolute w-3 animate-spin ${fromCurrentUser ? "left-2 bottom-2" : "right-2 bottom-2"}`}/></span>}
      </p>
    </div>
  );
};

export default Document;
