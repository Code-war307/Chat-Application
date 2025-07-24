"use client";
import { useConversation } from "@/hooks/useConversation";
import { cn } from "@/lib/utils";
import { Card } from "../ui/card";

const ItemList = ({ children, title, action: Action, search: Search, extFormator: ExtFormator }) => {
  const { isActive } = useConversation();
  return (
    <Card
      className={cn(
        "hidden h-full w-full bg-itemListColor border-none  lg:flex-none lg:w-80 p-2",
        {
          block: !isActive,
          "lg:block": isActive,
        }
      )}
    >
      <div className="relative mb-4 flex items-center justify-between ">
        <h1 className="text-2xl font-semibold tracking-tight text-white">
          {title}
        </h1>
        <div className="flex justify-center gap-4">
          {ExtFormator ? ExtFormator : null}
          {Action ? Action : null}
          {Search ? Search : null}
        </div>
      </div>
      <div
        className="w-full h-[calc(100%-50px)] flex flex-col items-center justify-start gap-2 p-2 overflow-y-auto
    [&::-webkit-scrollbar]:w-1
    [&::-webkit-scrollbar-track]:rounded-full
    
    [&::-webkit-scrollbar-thumb]:rounded-full
    [&::-webkit-scrollbar-thumb]:bg-gray-300
    dark:[&::-webkit-scrollbar-thumb]:bg-neutral-500"
      >
        {children}
      </div>
    </Card>
  );
};

export default ItemList;
