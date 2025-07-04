import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuthStore } from "@/store/useAuthStore";
import { Inbox, MessageCircle, Settings, Users } from "lucide-react";
import { usePathname } from "next/navigation";
import { useMemo } from "react";

export const useNavigation = () => {
  const pathname = usePathname();
  const { authUser } = useAuthStore();

  const paths = useMemo(
    () => [
      {
        name: "Chat",
        href: "/dashboard/conversation",
        icon: <MessageCircle />,
        active: pathname.startsWith("/dashboard/conversation"),
      },
      {
        name: "Group",
        href: "/dashboard/group",
        icon: <Users />,
        active: pathname === "/dashboard/group",
      },
      {
        name: "Inbox",
        href: "/dashboard/inbox",
        icon: <Inbox />,
        active: pathname === "/dashboard/inbox",
      },
      {
        name: "Setting",
        href: "/dashboard/setting",
        icon: <Settings />,
        active: pathname === "/dashboard/setting",
      },
      {
        name: "profile",
        href: "/dashboard/setting/profile-page",
        icon: (
          <>
            <Avatar className={"w-7 h-7 border-none"}>
              <AvatarImage src={authUser?.profilePic} />
              <AvatarFallback>{authUser?.username.substr(0, 1)}</AvatarFallback>
            </Avatar>
          </>
        ),
        active: pathname === "/dashboard/setting/profile-page",
      },
    ],
    [pathname, authUser]
  );

  return paths;
};
