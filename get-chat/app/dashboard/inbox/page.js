"use client";
import ConversationFallback from "@/components/conversation/ConversationFallback";
import ItemList from "@/components/itemList/ItemList";
import { useEffect } from "react";
import { Loader } from "lucide-react";
import Request from "@/components/list/Request";
import { useRequestStore } from "@/store/useRequestStore";
import { useAuthStore } from "@/store/useAuthStore";

const InboxPage = () => {
  const { isRequestsLoading, requests, getFriendRequests, pushNewRequest } =
    useRequestStore();
  const { jwtToken, socket } = useAuthStore();

  useEffect(() => {
    if (jwtToken) {
      getFriendRequests(jwtToken);
    }
  }, [getFriendRequests, jwtToken]);

  useEffect(() => {
    if (!socket) return;

    const handleNewRequest = (friendRequest) => {
      pushNewRequest(friendRequest);
    }

    socket.on("newFriendRequest", handleNewRequest);

    return () => socket.off("newFriendRequest", handleNewRequest);
  }, [socket, pushNewRequest]);

  return (
    <>
      <ItemList title="Inbox">
        {isRequestsLoading ? (
          <Loader className="animate-spin h-8 w-8 text-white" />
        ) : requests.length > 0 ? (
          requests.map((req) => {
            return <Request key={req.receiverId} senderInfo={req.senderId} />;
          })
        ) : (
          <p className="w-full h-full flex items-center justify-center text-white">
            No friend request found
          </p>
        )}
      </ItemList>
      <ConversationFallback />
    </>
  );
};

export default InboxPage;
