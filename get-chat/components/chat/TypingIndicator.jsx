import { AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import { Avatar } from "../ui/avatar";
import { useChatStore } from "@/store/useChatStore";

const TypingIndicator = () => {
  const { selectedFriend } = useChatStore();
  return (
    <div className="w-full flex px-2 mb-4">
      <div className="flex gap-2">
        <Avatar className="w-8 h-8 shrink-0 border-none">
          <AvatarImage src={selectedFriend?.profilePic} />
          <AvatarFallback className="w-8 h-8 shrink-0 border-none">
            {selectedFriend?.username?.charAt(0).toUpperCase()}
          </AvatarFallback>
        </Avatar>
        <div className="flex  max-w-full bg-thirdColor px-2 py-1 rounded-lg rounded-bl-none gap-1 ">
          <span className="text-white text-[0.8rem] font-light">
            Typing
          </span>
          <div className="flex items-center gap-1">
            <div className="h-[0.15rem] w-[0.15rem] bg-white rounded-full animate-bounce [animation-delay:-0.7s]"></div>
            <div className="h-[0.15rem] w-[0.15rem] bg-white rounded-full animate-bounce [animation-delay:-0.16s]"></div>
            <div className="h-[0.15rem] w-[0.15rem] bg-white rounded-full animate-bounce [animation-delay:-0.25s]"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TypingIndicator;
