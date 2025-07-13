import ConversationFallback from "@/components/conversation/ConversationFallback";
import ItemList from "@/components/itemList/ItemList";
import React from "react";
import CreateGroup from "./_components/CreateGroup";

const GroupPage = () => {
  return (
    <>
      <ItemList title="Group" action={<CreateGroup/>}>
      <span className="text-white">This feature is under work</span>
      </ItemList>
      <ConversationFallback/>
    </>
  );
};

export default GroupPage;

export const metadata = {
  title: "Get Chat - Group conversation",
  description: "Group chat page",
};
