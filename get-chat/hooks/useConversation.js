import { useMemo } from "react";
import { useParams } from "next/navigation";

export const useConversation = () => {
    const params = useParams();

    const conversationId = useMemo(() => {
        return params?.conversationid
    },[params?.conversationid])

    const isActive = useMemo(() => !!conversationId, [conversationId])

    return {
        isActive,
        conversationId
    }
};