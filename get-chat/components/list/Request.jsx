import { Card } from "../ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Check, Loader2, X } from "lucide-react";
import { Button } from "../ui/button";
import { useRequestStore } from "@/store/useRequestStore";
import { useAuthStore } from "@/store/useAuthStore";

const Request = ({ senderInfo }) => {
  const {jwtToken} = useAuthStore()
  const {
    isAcceptingRequest,
    isRejectingRequest,
    acceptFriendRequest,
    rejectFriendRequest,
  } = useRequestStore();

  const acceptRequest = () => {
    if (jwtToken) {
      acceptFriendRequest(jwtToken, senderInfo?._id);
    }
  };

  const rejectRequest = () => {
    if (jwtToken) {
      rejectFriendRequest(jwtToken, senderInfo?._id);
    }
  };

  return (
    <Card
      className={"w-full p-2 flex flex-row items-center justify-between gap-2 border-none  bg-sidebarUserBG shadow-md"}
    >
      <div className="flex items-center gap-4 truncate">
        <Avatar className={'border-none'}>
          <AvatarImage
            src={senderInfo?.profilePic}
            alt={senderInfo?.username + "profile image"}
          />
          <AvatarFallback>
            {senderInfo?.username.substring(0, 1).toUpperCase()}
          </AvatarFallback>
        </Avatar>
        <div className="flex flex-col truncate">
          <h4 className="truncate font-bold text-lg text-white">{senderInfo?.username}</h4>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <Button
          size="icon"
          onClick={acceptRequest}
          className={"cursor-pointer bg-transparent hover:bg-buttonFirstColor"}
        >
          {isAcceptingRequest ? (
            <>
              <Loader2 className="h-5 w-5" />
            </>
          ) : (
            <Check size={'icon'}/>
          )}
        </Button>
        <Button
          size="icon"
          onClick={rejectRequest}
          className={"cursor-pointer bg-transparent hover:bg-buttonFirstColor"}
        >
          {isRejectingRequest ? (
            <>
              <Loader2 className="h-5 w-5" />
            </>
          ) : (
            <X className="w-8 h-8" />
          )}
        </Button>
      </div>
    </Card>
  );
};

export default Request;
