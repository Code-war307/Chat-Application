import { useMemo } from "react";
import { useParams } from "next/navigation";

export const useConversation = () => {
    const params = useParams();

    const queryId = useMemo(() => {
        const query = params?.conversationid || params?.param
        return query
    },[params?.conversationid, params?.param])

    const isActive = useMemo(() => !!queryId, [queryId])

    return {
        isActive,
        queryId
    }
};