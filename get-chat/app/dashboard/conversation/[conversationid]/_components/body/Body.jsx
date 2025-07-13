"use client";
import NoMessages from "@/components/conversation/NoMessages";
import ChatSkeleton from "@/components/skeleton/ChatSkeleton";
import Message from "../../../../../../components/chat/Message";
import { formatMessageTime } from "@/helper/formatMessageTime";
import { useChatStore } from "@/store/useChatStore";
import { useEffect} from "react";
import { useAuthStore } from "@/store/useAuthStore";
const Body = ({ conversationId }) => {
  const {authUser, jwtToken, socket} = useAuthStore()
  const {messages, isMessageLoading, getMessages, subscribeToMessages, unsubscribeFromMessages} = useChatStore();
  

  useEffect(() => {
    if (jwtToken && conversationId) {
      getMessages(conversationId, jwtToken);
      subscribeToMessages(authUser, socket);
    }
    return () => {
      unsubscribeFromMessages(socket);
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
              fromCurrentUser={message.senderId._id === authUser._id}
              senderImg={message.senderId.profilePic}
              senderName={message.senderId.username}
              media={message.files}
              isSending={message.isSending}
            />
          );
        })
      )}
    </div>
  );
};

export default Body;
