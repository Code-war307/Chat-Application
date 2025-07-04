"use client";
import NoMessages from "@/components/conversation/NoMessages";
import ChatSkeleton from "@/components/skeleton/ChatSkeleton";
import Message from "../../../../../../components/chat/Message";
import { useSession } from "next-auth/react";
import { formatMessageTime } from "@/helper/formatMessageTime";
import { useChatStore } from "@/store/useChatStore";
import { useEffect} from "react";
const Body = ({ conversationId }) => {
  const { data: session } = useSession();
  const jwtToken = session?.jwtToken;
  const currUserId = session?.user?._id;
  const {messages, isMessageLoading, getMessages, subscribeToMessages, unsubscribeFromMessages} = useChatStore();
  

  useEffect(() => {
    if (jwtToken && conversationId) {
      getMessages(conversationId, jwtToken);
      subscribeToMessages();
    }
    return () => {
      unsubscribeFromMessages();
    };
  }, [conversationId, getMessages, subscribeToMessages, unsubscribeFromMessages]);
  
  return (
    <div className="flex-1 w-full flex overflow-y-scroll flex-col gap-2 p-3 no-scrollbar">
      {isMessageLoading ? (
        <ChatSkeleton />
      ) : messages.length === 0 ? (
        <NoMessages />
      ) : (
        messages.map((message, idx) => {
          return (
            <Message
              key={idx}
              content={message.text}
              timestamp={formatMessageTime(message.createdAt)}
              fromCurrentUser={message.senderId._id === currUserId}
              senderImg={message.senderId.profilePic}
              senderName={message.senderId.username}
              media={message.files}
            />
          );
        })
      )}
    </div>
  );
};

export default Body;
