import { useEffect, useRef } from "react";
import { Pause, Play } from "lucide-react";
import { useChatStore } from "@/store/useChatStore";
const Audio = ({ file, timestamp, fromCurrentUser }) => {
  const audioRef = useRef(null);
  const { isPlaying, duration, currentTime, setIsPlaying, setCurrentTime,  setDuration} =
    useChatStore();

  const togglePlay = () => {
    const audio = audioRef.current;
    if (!audio) return;
    if (isPlaying) {
      audio.pause();
    } else {
      audio.play();
    }
    setIsPlaying(!isPlaying);
  };

  const handleProgressChange = (e) => {
    const audio = audioRef.current;
    if (!audio) return;
    const newTime = parseFloat(e.target.value);
    audio.currentTime = newTime;
    setCurrentTime(newTime);
  };

  const formatTime = (time) => {
    const mins = Math.floor(time / 60)
      .toString()
      .padStart(1, "0");
    const secs = Math.floor(time % 60)
      .toString()
      .padStart(2, "0");
    return `${mins}:${secs}`;
  };

  useEffect(() => {
      const audio = audioRef.current;
      if (!audio) return;
  
      const handleLoadedMetadata = () => setDuration(audio.duration);
      const handleTimeUpdate = () => setCurrentTime(audio.currentTime);
      const handleEnded = () => setIsPlaying(false);
  
      audio.addEventListener("loadedmetadata", handleLoadedMetadata);
      audio.addEventListener("timeupdate", handleTimeUpdate);
      audio.addEventListener("ended", handleEnded);
  
      return () => {
        audio.removeEventListener("loadedmetadata", handleLoadedMetadata);
        audio.removeEventListener("timeupdate", handleTimeUpdate);
        audio.removeEventListener("ended", handleEnded);
      };
    }, []);
  return (
    <div className="w-full p-3 bg-white/10 rounded-lg shadow-md flex flex-col">
      <audio ref={audioRef} src={file.url} preload="metadata" hidden />
      <div className="flex items-center gap-3">
        <button
            onClick={togglePlay}
            className={`border-1 p-2 rounded-full cursor-pointer ${isPlaying ? "bg-firstColor border-secondColor text-secondColor" : "bg-secondColor border-firstColor text-firstColor"}`}
          >
            {isPlaying ? (
              <Pause className="w-4 h-4" />
            ) : (
              <Play className="w-4 h-4" />
            )}
          </button>
        <div className="text-xs text-white">
          {formatTime(currentTime)}
        </div>
        <div className="flex-1">
          <input
            type="range"
            min={0}
            max={duration}
            value={currentTime}
            step="0.1"
            onChange={handleProgressChange}
            className="w-full accent-[#67b0ff] h-1"
          />
        </div>
        <div className="text-xs text-white/70">
          {formatTime(duration)}
        </div>
      </div>
      <p className={`text-[0.6rem] text-white flex mt-2 font-semibold ${fromCurrentUser ? "justify-start":"justify-end" }`}>
        {timestamp}
      </p>
    </div>
  );
};

export default Audio;
