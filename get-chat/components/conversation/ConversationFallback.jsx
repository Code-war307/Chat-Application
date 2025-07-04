import { Card } from "../ui/card";
import Image from "next/image";

const ConversationFallback = () => {
  return (
    <Card
      className={
        "hidden lg:flex h-full w-full p-2 items-center justify-center bg-itemListColor border-none"
      }
    >
      <div className="flex flex-col items-center justify-center gap-2">
        <div>
          <Image src={'/messenger.png'} width={70} height={0} alt="Get Chat logo" className="animate-bounce"/>
        </div>
        <div className="flex flex-col items-center justify-center gap-1 text-center">
          <span className="text-3xl font-bold text-white">Welcome to Get Chat</span>
          <span className="text-sm font-semibold text-white">Select a conversation to start chatting</span>
        </div>
      </div>
    </Card>
  );
};

export default ConversationFallback;
