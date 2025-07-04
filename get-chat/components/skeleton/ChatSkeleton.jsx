"use client";

import { Skeleton } from "@/components/ui/skeleton";

const ChatSkeleton = () => {
  return (
    <div className="flex-1 w-full flex flex-col h-4 gap-2 p-3 overflow-y-scroll no-scrollbar">
      {Array.from({ length: 15 }).map((_, index) => {
        const isSender = index % 2 === 0; // alternate between sender & receiver
        return (
          <div
            key={index}
            className={`flex ${
              isSender ? "justify-end" : "justify-start"
            } w-full`}
          >
            <div
              className={`flex items-end gap-2 max-w-[70%] ${
                isSender ? "flex-row-reverse" : "flex-row"
              }`}
            >
              <Skeleton className="w-8 h-8 rounded-full" />
              <div className="flex flex-col gap-2">
                <Skeleton className="h-4 w-[180px] sm:w-[220px] md:w-[250px] rounded-xl" />
                {index % 3 === 0 && (
                  <Skeleton className="h-3 w-[120px] rounded-xl" />
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default ChatSkeleton;
