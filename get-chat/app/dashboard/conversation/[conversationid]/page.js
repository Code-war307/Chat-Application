"use client";
import ConversationContainer from "@/components/conversation/ConversationContainer";
import { useParams } from "next/navigation";
import Header from "./_components/Header";
import Body from "./_components/body/Body";
import ChatInput from "./_components/input/ChatInput";
import { useRouter } from "next/navigation";
import { useChatStore } from "@/store/useChatStore";
import { useEffect } from "react";
import MediaPreview from "../../../../components/conversation/MediaPreview";

const Page = () => {
  const router = useRouter();
  const { conversationid } = useParams();
  const { selectedFriend } = useChatStore();

  useEffect(() => {
    if (!selectedFriend) {
      router.replace("/dashboard/conversation");
    }
  }, [selectedFriend, router]);

  if (!selectedFriend) return null; // or a loading fallback
  return (
    <ConversationContainer>
      <Header />
      <Body conversationId={conversationid} />
      <ChatInput conversationId={conversationid} />
      <MediaPreview />
    </ConversationContainer>
  );
};

export default Page;
