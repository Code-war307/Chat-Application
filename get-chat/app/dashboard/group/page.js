import ConversationFallback from "@/components/conversation/ConversationFallback";
import ItemList from "@/components/itemList/ItemList";
import React from "react";
import CreateGroup from "./_components/CreateGroup";

const GroupPage = () => {
  return (
    <>
      <ItemList title="Group" action={<CreateGroup/>}></ItemList>
      <ConversationFallback/>
    </>
  );
};

export default GroupPage;

// export const metadata = {
//   title: "Group",
//   description: "Group page",
// };
