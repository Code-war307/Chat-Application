"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { isAudioFile } from "@/helper/geticon";
import { cn } from "@/lib/utils";
import { useEffect, useRef } from "react";
import Audio from "./Audio";
import Document from "./Document";
import ImgAndVideo from "./ImgAndVideo";
import TextMessage from "./TextMessage";

const Message = ({
  content,
  timestamp,
  fromCurrentUser,
  senderImg,
  senderName,
  media = [],
}) => {
  const messageEndRef = useRef(null);

  const imagesAndVideos = media.filter(
    (file) => file.resourceType === "image" || file.resourceType === "video"
  );

  const documents = media.filter(
    (file) =>
      file.resourceType !== "image" &&
      file.resourceType !== "video" &&
      !isAudioFile(file.originalName)
  );

  const audioFile = media.filter(
    (file) => file.resourceType === "raw" && isAudioFile(file.url)
  );

  const hasText = content && content.trim().length > 0;
  const isMultipleMedia = imagesAndVideos.length > 1;

  useEffect(() => {
    if (messageEndRef.current && (content || media.length > 0)) {
      messageEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [content, media]);

  return (
    <div
      className={cn(
        "w-full flex px-2 mb-4",
        fromCurrentUser ? "justify-end" : "justify-start"
      )}
      ref={messageEndRef}
    >
      <div
        className={cn(
          "flex items-end gap-2 max-w-[75%]",
          fromCurrentUser ? "flex-row-reverse" : "flex-row"
        )}
      >
        <Avatar className="w-8 h-8 shrink-0 border-none">
          <AvatarImage src={senderImg} />
          <AvatarFallback className="w-8 h-8 shrink-0 border-none">
            {senderName?.charAt(0).toUpperCase()}
          </AvatarFallback>
        </Avatar>

        <div
          className={cn(
            "rounded-lg max-w-full break-words flex flex-col",
            isMultipleMedia
              ? "bg-transparent"
              : imagesAndVideos.length
                ? "bg-transparent px-0 py-0"
                : "px-0 py-0",
            fromCurrentUser ? "rounded-br-none" : "rounded-bl-none"
          )}
        >
          {/* work when there is img and video available */}
          {imagesAndVideos.length > 0 && (
            <ImgAndVideo
              imagesAndVideos={imagesAndVideos}
              isMultipleMedia={isMultipleMedia}
              hasText={hasText}
              timestamp={timestamp}
              media={media}
              fromCurrentUser={fromCurrentUser}
            />
          )}

          {/* work when there is document available */}
          {documents.length > 0 &&
            documents.map((file, i) => {
              return <Document key={i} file={file} timestamp={timestamp} />;
            })}

          {/* work when there is audio file available */}
          {audioFile.length > 0 &&
            audioFile.map((file, i) => {
              return (
                <Audio
                  key={i}
                  file={file}
                  timestamp={timestamp}
                  fromCurrentUser={fromCurrentUser}
                />
              );
            })}

          {hasText && (
            <TextMessage
              fromCurrentUser={fromCurrentUser}
              content={content}
              timestamp={timestamp}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default Message;
