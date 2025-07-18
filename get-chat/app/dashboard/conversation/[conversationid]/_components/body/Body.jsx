"use client";
import NoMessages from "@/components/conversation/NoMessages";
import ChatSkeleton from "@/components/skeleton/ChatSkeleton";
import Message from "../../../../../../components/chat/Message";
import { formatMessageTime } from "@/helper/formatMessageTime";
import { useChatStore } from "@/store/useChatStore";
import { useEffect, useRef, useState } from "react";
import { useAuthStore } from "@/store/useAuthStore";
import TypingIndicator from "@/components/chat/TypingIndicator";
const Body = ({ conversationId }) => {
  const { authUser, jwtToken, socket } = useAuthStore();
  const {
    messages,
    isMessageLoading,
    getMessages,
    subscribeToMessages,
    unsubscribeFromMessages,
    selectedFriend,
  } = useChatStore();
  const [typingUserId, setTypingUserId] = useState(null);
  const typingTimeout = useRef(null);

  useEffect(() => {
    if (jwtToken && conversationId) {
      getMessages(conversationId, jwtToken);
      subscribeToMessages(authUser, socket);
    }
    return () => {
      unsubscribeFromMessages(socket);
    };
  }, [
    conversationId,
    getMessages,
    subscribeToMessages,
    unsubscribeFromMessages,
  ]);

  useEffect(() => {
    if (!socket) return;

    const handleTyping = ( senderId ) => {
      setTypingUserId(senderId);

      clearTimeout(typingTimeout.current);
      typingTimeout.current = setTimeout(() => {
        setTypingUserId(null);
      }, 700);
    };

    socket.on("showTyping", handleTyping);
    return () => socket.off("showTyping", handleTyping);
  }, [socket]);

  const showTypingBubble = typingUserId && selectedFriend?._id === typingUserId;
  return (
    <div className="flex-1 w-full flex overflow-y-scroll flex-col gap-2 px-1 py-2 no-scrollbar">
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
      {showTypingBubble && (
       <TypingIndicator/>
      )}
    </div>
  );
};

export default Body;
