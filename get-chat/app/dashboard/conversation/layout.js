"use client";
import ItemList from "@/components/itemList/ItemList";
import SidebarSkeleton from "@/components/skeleton/SidebarSkeleton";
import SidebarUser from "@/components/list/SidebarUser";
import { useChatStore } from "@/store/useChatStore";
import { useAuthStore } from "@/store/useAuthStore";
import { useEffect } from "react";
import AddFriend from "./[conversationid]/_components/add-friend/AddFriend";
import SearchUser from "@/components/search-user/SearchUser";
import { Settings } from "lucide-react";
import Link from "next/link";

const ConversationLayout = ({ children }) => {
  const skeletonCount = Array(9).fill(null);
  const { getUserFriends, filteredFriend, isFriendsLoading, pushNewFriend } = useChatStore();
  const {socket, jwtToken } = useAuthStore();

  useEffect(() => {
    if (jwtToken) {
      getUserFriends(jwtToken);
    }
  }, [getUserFriends, jwtToken]);

  useEffect(() => {
    if(!socket)return;

    const handleNewFriend = (newFriend)=>{
      pushNewFriend(newFriend)
    }

    socket.on("newFriendAddInList", handleNewFriend)

    return () => socket.off("newFriendAddInList", handleNewFriend);
  },[socket, pushNewFriend])

  return (
    <>
      <ItemList title="Chat" action={<AddFriend />} search={<SearchUser/>} extFormator={<Link href={'/dashboard/setting'} className="flex items-center mr-4"><Settings className="w-4.5 text-white"/></Link>}>
        {isFriendsLoading ? (
          skeletonCount.map((_, index) => <SidebarSkeleton key={index} />)
        ) : filteredFriend ? (
          filteredFriend.map((friend, index) => (
            <SidebarUser key={friend?._id || index} userInfo={friend} />
          ))
        ) : (
          <p className="text-white">No friends found.</p>
        )}
      </ItemList>
      {children}
    </>
  );
};

export default ConversationLayout;
