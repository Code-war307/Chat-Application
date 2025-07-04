"use client";

import { Button } from "@/components/ui/button";
import { CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import { getFilePreviewInfo } from "@/helper/geticon";
import { useChatStore } from "@/store/useChatStore";
import { AnimatePresence, motion } from "framer-motion";
import { FilePlus, Send, Smile, X } from "lucide-react";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { useRef, useState } from "react";

const MediaPreview = () => {
  const { data: session } = useSession();
  const jwtToken = session?.jwtToken;
  const fileInputRef = useRef(null);
  const {
    mediaFiles,
    sendMessages,
    selectedFriend,
    setMediaFiles,
    addMediaFiles,
  } = useChatStore();
  const conversationId = selectedFriend?._id;
  const [text, setText] = useState("");

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files || []);
    files.forEach((file) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        addMediaFiles({
          file,
          previewUrl: reader.result,
          type: file.type,
        });
      };
      reader.readAsDataURL(file);
    });
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!text.trim() && mediaFiles.length === 0) return;

    const formData = new FormData();
    formData.append("text", text.trim());
    mediaFiles.forEach((fileObj) => {
      formData.append("files", fileObj.file);
    });

    try {
      await sendMessages(jwtToken, conversationId, formData);
    } catch (error) {
      console.error("Error sending message:", error);
    }
    setText("");
    setMediaFiles([]);
  };

  const removePreview = (e) => {
    e.preventDefault();
    setMediaFiles([]);
  };

  return (
    <AnimatePresence>
      {mediaFiles.length > 0 && (
        <motion.div
          initial={{ y: "100%" }}
          animate={{ y: 0 }}
          exit={{ y: "100%" }}
          transition={{ type: "spring", stiffness: 100 }}
          className="fixed z-50 inset-0 w-full h-full sm:absolute sm:inset-auto sm:bottom-20  sm:h-[80vh] sm:w-[420px] sm:rounded-xl sm:shadow-xl overflow-hidden flex flex-col bg-chat border border-white/10 backdrop-blur-md"
        >
          <CardHeader className="flex justify-between items-center text-white px-4 py-2 bg-itemListColor sm:bg-chatHeaderColor">
            <h4 className="font-semibold text-sm sm:text-base">
              Media Preview
            </h4>
            <button onClick={removePreview} className="hover:text-red-500">
              <X className="w-5 h-5" />
            </button>
          </CardHeader>

          <CardContent className="flex-1 overflow-y-auto bg-transparent px-3">
            <Carousel className="w-full h-full flex items-center justify-center">
              <CarouselContent className="h-full">
                {mediaFiles.map((file, index) => {
                  const isImage = file.type.startsWith("image");
                  const isVideo = file.type.startsWith("video");
                  const isOther = !isImage && !isVideo;
                  const imgURL = file.file.name.trim()
                  
                  const url = isOther
                    ? getFilePreviewInfo(imgURL)
                    : null;
                   

                  return (
                    <CarouselItem
                      key={index}
                      className="w-full h-[45vh] flex items-center justify-center"
                    >
                      {isImage ? (
                        <img
                          src={file.previewUrl}
                          alt={`preview-${index}`}
                          className="max-w-full max-h-full object-contain rounded-lg"
                        />
                      ) : isVideo ? (
                        <video
                          src={file.previewUrl}
                          controls
                          controlsList="nodownload nofullscreen noremoteplayback"
                          disablePictureInPicture
                          className="max-w-full max-h-full object-contain rounded-lg"
                        />
                      ) : (
                        <div className="w-full h-full flex flex-col items-center justify-center rounded-lg px-4 text-center relative gap-5">
                          <div className="relative w-60 h-60 mb-2">
                            {url && (
                              <Image
                                src={url}
                                alt="File Preview"
                                fill
                                className="object-contain"
                              />
                            )}
                          </div>
                          <p className="text-lg truncate max-w-full text-white font-semibold">
                            {file.file.name}
                          </p>
                        </div>
                      )}
                    </CarouselItem>
                  );
                })}
              </CarouselContent>
            </Carousel>
          </CardContent>

          <CardFooter className="flex flex-col gap-2 p-3 bg-itemListColor sm:gap-1">
            <div className="flex items-center gap-2 w-full">
              <Button
                type="button"
                variant="ghost"
                className="text-white hover:bg-gray-700"
              >
                <Smile size={20} />
              </Button>
              <input
                type="text"
                placeholder="Type a caption..."
                className="flex-1 px-3 py-2 text-sm text-white bg-transparent border-b border-white/20 focus:outline-none"
                value={text}
                onChange={(e) => setText(e.target.value)}
              />
            </div>
            <div className="flex justify-between items-center w-full">
              <Button
                type="button"
                variant="ghost"
                onClick={() => fileInputRef.current?.click()}
                className="text-white hover:bg-gray-700"
              >
                <FilePlus size={20} />
              </Button>
              <input
                type="file"
                accept="image/*, video/*, audio/*, .pdf, .doc, .docx, .txt"
                ref={fileInputRef}
                onChange={handleFileChange}
                className="hidden"
                multiple
              />
              <Button
                onClick={onSubmit}
                className="bg-secondColor text-firstColor border border-firstColor hover:bg-firstColor hover:text-secondColor hover:border-secondColor"
              >
                <Send size={20} />
              </Button>
            </div>
          </CardFooter>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default MediaPreview;
