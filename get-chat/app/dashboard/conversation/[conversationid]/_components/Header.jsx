"use client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";
import { useAuthStore } from "@/store/useAuthStore";
import { useChatStore } from "@/store/useChatStore";
import { CircleArrowLeft } from "lucide-react";
import Link from "next/link";

const Header = () => {
  const { selectedFriend, setSelectedFriend } = useChatStore();
  const { onlineFriends } = useAuthStore();
  return (
    <Card
      className={
        "w-full flex rounded-lg p-2 justify-between bg-chatHeaderColor border-none shadow-md shadow-black/50 "
      }
    >
      <div className="flex items-center gap-4">
        <Link
          href={"/dashboard/conversation"}
          className="block text-white lg:hidden"
          aria-label="Back to conversations"
          onClick={(e) => {
            e.preventDefault();
            setSelectedFriend(null);
          }}
        >
          <CircleArrowLeft />
        </Link>
        <div className="flex items-center gap-2">
          <Avatar className="w-7 h-7 border-none">
            <AvatarImage
              src={selectedFriend?.profilePic}
              alt={selectedFriend?.username + " profile image"}
            />
            <AvatarFallback className={"w-7 h-7"}>
              {selectedFriend?.username.substring(0, 1).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div className=" flex flex-col">
            <h1 className="font-semibold text-xl truncate text-white h-fit ">
              {selectedFriend?.username}
            </h1>
            <span className="text-[0.65rem] h-fit text-white animate-pulse">
              {onlineFriends.includes(selectedFriend?._id) ? "online" : ""}
            </span>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default Header;
