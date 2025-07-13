import { cn } from "@/lib/utils";
import { useMemo } from "react";
import { useRouter } from "next/navigation";
import { useChatStore } from "@/store/useChatStore";
import { Loader } from "lucide-react";

const ROTATION_CACHE = new Map();
const ImgAndVideo = ({
  imagesAndVideos,
  isMultipleMedia,
  hasText,
  timestamp,
  media,
  fromCurrentUser,
  isSending
}) => {
  const router = useRouter();
  const { setPreviewMedias } = useChatStore();

  const rotations = useMemo(() => {
    if (!isMultipleMedia) return [];
    if (ROTATION_CACHE.has(media.length)) {
      return ROTATION_CACHE.get(media.length);
    }
    const newRotations = imagesAndVideos.map(() => Math.random() * 20 - 10);
    ROTATION_CACHE.set(media.length, newRotations);
    return newRotations;
  }, [imagesAndVideos, isMultipleMedia]);

  const previewMedias = () => {
    setPreviewMedias(imagesAndVideos);
    router.push("/media-preview");
  };

  return (
    <div
      className={cn(
        "cursor-pointer",
        isMultipleMedia
          ? "relative w-[13rem] h-[10rem] mb-3"
          : "relative w-[13rem] h-[10rem] mb-3 rounded-md overflow-hidden"
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

        const isImg = file.resourceType === "image" || file.type?.startsWith("image")
        return isImg ? (
          <img
            key={index}
            src={file.url || file?.previewUrl}
            alt={`img-${index}`}
            className={baseClass}
            style={style}
          />
        ) : (
          <video
            key={index}
            src={file.url || file?.previewUrl}
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
          className={`absolute bottom-1 right-2 text-[0.6rem] text-white font-semibold px-2 py-0.5 z-100 flex ${fromCurrentUser ? "justify-end" : "justify-start"}`}
        >
          {timestamp}
        </p>
      )}
      {!isSending && <div
        className="absolute h-full w-full flex items-center justify-center z-100">
        <Loader className="w-7 h-7 animate-spin text-white" />
      </div>}
    </div>
  );
};

export default ImgAndVideo;
