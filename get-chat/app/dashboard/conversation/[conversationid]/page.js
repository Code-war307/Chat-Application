"use client";
import ConversationContainer from "@/components/conversation/ConversationContainer";
import Header from "./_components/Header";
import Body from "./_components/body/Body";
import ChatInput from "./_components/input/ChatInput";
import { useRouter } from "next/navigation";
import { useChatStore } from "@/store/useChatStore";
import { useEffect } from "react";
import MediaPreview from "../../../../components/conversation/MediaPreview";

const Page = () => {
  const router = useRouter();
  const { selectedFriend } = useChatStore();

  useEffect(() => {
    if (!selectedFriend) {
      router.replace("/dashboard/conversation");
    }
  }, [selectedFriend, router]);

  if (!selectedFriend) return null;
  return (
    <ConversationContainer>
      <Header />
      <Body conversationId={selectedFriend._id} />
      <ChatInput conversationId={selectedFriend._id} />
      <MediaPreview />
    </ConversationContainer>
  );
};

export default Page;
