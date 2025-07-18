import { Card } from "../ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import Link from "next/link";
import { useChatStore } from "@/store/useChatStore";
import { useAuthStore } from "@/store/useAuthStore";
import { prefetchDNS } from "react-dom";

const SidebarUser = ({ userInfo }) => {
  const { selectedFriend, setSelectedFriend } = useChatStore();
  const { onlineFriends } = useAuthStore();
  return (
    <Link href={`/dashboard/conversation/${userInfo?._id}`} prefetch={false} className="w-full">
      <Card
        onClick={() => setSelectedFriend(userInfo)}
        className={`w-full p-2 flex flex-row items-center gap-2 border-none bg-sidebarUserBG shadow-md  hover:bg-sidebarUserHover  rounded-lg ${selectedFriend?._id === userInfo?._id ? "bg-sidebarUserHover" : ""}`}
      >
        <div className="flex items-center gap-4 truncate">
          <div className="relative w-fit h-fit">
            <Avatar className={'border-none w-7 h-7'}>
              <AvatarImage src={userInfo?.profilePic} />
              <AvatarFallback>
                {userInfo?.username.substr(0, 1)}
              </AvatarFallback>
            </Avatar>
            {onlineFriends.includes(userInfo?._id) && (
              <div className="absolute bg-green-500 ring-1 ring-zinc-900 size-2 rounded-full z-10 bottom-0 right-0"></div>
            )}
          </div>
          <div className="flex flex-col truncate">
            <h4 className="truncate font-bold text-lg text-white">{userInfo?.username}</h4>
            <p className="text-sm text-muted-foreground truncate">
              {userInfo?.bio}
            </p>
          </div>
        </div>
      </Card>
    </Link>
  );
};

export default SidebarUser;
