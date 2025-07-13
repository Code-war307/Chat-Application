import { cn } from "@/lib/utils";
import { Loader } from "lucide-react";

const TextMessage = ({fromCurrentUser, content, timestamp, isSending}) => {
  return (
    <div
      className={cn(
        `bg-secondary px-2 py-1 rounded-md font-semibold `,
        fromCurrentUser
          ? "rounded-br-none bg-secondColor"
          : "rounded-bl-none bg-thirdColor text-white"
      )}
    >
      <p className="whitespace-pre-wrap text-sm">{content}</p>
      <p className={`text-[0.6rem] flex items-center mt-2 font-semibold gap-2 ${fromCurrentUser ? "justify-end" : "justify-start"}`}>{timestamp}{!isSending && <span className=""><Loader className="w-3 animate-spin"/></span>}</p>
    </div>
  );
};

export default TextMessage;
