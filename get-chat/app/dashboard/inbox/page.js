"use client";
import ConversationFallback from "@/components/conversation/ConversationFallback";
import ItemList from "@/components/itemList/ItemList";
import { useEffect } from "react";
import { Loader } from "lucide-react";
import Request from "@/components/list/Request";
import { useRequestStore } from "@/store/useRequestStore";
import { useSession } from "next-auth/react";

const InboxPage = () => {
  const { data: session } = useSession();
    const jwtToken = session?.jwtToken;
  const { isRequestsLoading, requests, getFriendRequests } = useRequestStore();
  useEffect(() => {
    if(jwtToken){
      getFriendRequests(jwtToken);
    }
  }, [getFriendRequests, jwtToken]);

  console.log(requests)

  return (
    <>
      <ItemList title="Inbox">
        {isRequestsLoading ? (
          <Loader className="animate-spin h-8 w-8 text-white" />
        ) : requests.length > 0 ? (
          requests.map((req) => {
            return (
              <Request
                key={req.receiverId}
                senderInfo={req.senderId}
              />
            );
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
