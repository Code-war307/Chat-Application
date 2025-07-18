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
        <div class="flex space-x-2 justify-center items-center max-w-full bg-thirdColor px-2 py-1 rounded-lg rounded-bl-none">
          <div class="h-2 w-2 bg-white rounded-full animate-bounce [animation-delay:-0.3s]"></div>
          <div class="h-2 w-2 bg-white rounded-full animate-bounce [animation-delay:-0.10s]"></div>
          <div class="h-2 w-2 bg-white rounded-full animate-bounce [animation-delay:-0.17s]"></div>
          <div class="h-2 w-2 bg-white rounded-full animate-bounce [animation-delay:-0.24s]"></div>
          <div class="h-2 w-2 bg-white rounded-full animate-bounce"></div>
        </div>
      </div>
    </div>
  );
};

export default TypingIndicator;
