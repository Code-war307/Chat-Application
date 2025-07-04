"use client";
import ItemList from "@/components/itemList/ItemList";
import { useEffect } from "react";
import AddFriend from "./_components/AddFriend";
import SidebarSkeleton from "@/components/skeleton/SidebarSkeleton";
import SidebarUser from "@/components/list/SidebarUser";
import { useChatStore } from "@/store/useChatStore";
import { useSession } from "next-auth/react";

const ConversationLayout = ({ children }) => {
  const { data: session } = useSession();
  const jwtToken = session?.jwtToken;
  const skeletonCount = Array(9).fill(null);
  const { getUserFriends, friends, isFriendsLoading } = useChatStore();

  useEffect(() => {
    if (jwtToken) {
      getUserFriends(jwtToken);
    }
  }, [getUserFriends, jwtToken]);

  return (
    <>
      <ItemList title="Chat" action={<AddFriend />}>
        {isFriendsLoading ? (
          skeletonCount.map((_, index) => <SidebarSkeleton key={index} />)
        ) : friends.length > 0 ? (
          friends.map((friend, index) => (
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
