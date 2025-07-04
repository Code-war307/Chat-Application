import { cn } from "@/lib/utils";
import { useMemo } from "react";
import { useRouter } from "next/navigation";
import { useChatStore } from "@/store/useChatStore";

const ROTATION_CACHE = new Map();
const ImgAndVideo = ({
  imagesAndVideos,
  isMultipleMedia,
  hasText,
  timestamp,
  media,
  fromCurrentUser,
}) => {
  const router = useRouter();
  const {setPreviewMedias} = useChatStore()

  const rotations = useMemo(() => {
    if (!isMultipleMedia) return [];
    if (ROTATION_CACHE.has(media.length)) {
      return ROTATION_CACHE.get(media.length);
    }
    const newRotations = imagesAndVideos.map(() => Math.random() * 20 - 10);
    ROTATION_CACHE.set(media.length, newRotations);
    return newRotations;
  }, [imagesAndVideos, isMultipleMedia]);

  const previewMedias = async() => {
    await setPreviewMedias(media)
    router.push("/media-preview")
  }

  return (
    <div
      className={cn("cursor-pointer",
        isMultipleMedia
          ? "relative w-[240px] h-[180px] mb-3"
          : "relative w-[220px] h-[160px] mb-3 rounded-md overflow-hidden"
      )}
      onClick={previewMedias}
    >
      {imagesAndVideos.map((file, index) => {
        const rotation = rotations[index];
        const baseClass =
          "absolute w-full h-full object-cover rounded-lg shadow-md top-0 left-0";
        const style = {
          transform: isMultipleMedia
            ? `rotate(${rotation}deg)`
            : "rotate(0deg)",
          zIndex: index * 10,
        };

        return file.resourceType === "image" ? (
          <img
            key={index}
            src={file.url}
            alt={`img-${index}`}
            className={baseClass}
            style={style}
          />
        ) : (
          <video
            key={index}
            src={file.url}
            controls
            controlsList="nodownload nofullscreen noremoteplayback"
            disablePictureInPicture
            className={baseClass}
            style={style}
          />
        );
      })}

      {!hasText && (
        <p
          className={`absolute bottom-1 right-2 text-[0.6rem] text-white font-semibold px-2 py-0.5 flex ${fromCurrentUser ? "justify-end" : "justify-start"}`}
        >
          {timestamp}
        </p>
      )}
    </div>
  );
};

export default ImgAndVideo;
