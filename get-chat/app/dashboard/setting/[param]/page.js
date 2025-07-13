"use client";
import ConversationContainer from "@/components/conversation/ConversationContainer";
import Chats from "@/components/setting/Chats";
import Personalization from "@/components/setting/Personalization";
import Profile from "@/components/setting/Profile";
import { useParams } from "next/navigation";

const Page = () => {
  const { param } = useParams();

  return (
    <ConversationContainer>
      {param === "profile" ? (
        <Profile />
      ) : param === "chats" ? (
        <Chats />
      ) : (
        <Personalization />
      )}
    </ConversationContainer>
  );
};

export default Page;
