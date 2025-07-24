import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuthStore } from "@/store/useAuthStore";
import { File, Inbox, MessageCircle, Settings, Users } from "lucide-react";
import { usePathname } from "next/navigation";
import { useMemo } from "react";

export const useNavigation = () => {
  const {authUser} = useAuthStore()
  const pathname = usePathname();

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
        name: "File Converter",
        href: "/file-convertor",
        icon: <File />,
        active: pathname === "/file-convertor",
      },
      {
        name: "setting",
        href: "/dashboard/setting",
        icon: <Settings />,
        active: pathname === "/dashboard/setting",
      },
      {
        name: "profile",
        href: "/dashboard/setting/profile",
        icon: (
          <>
            <Avatar className={'bg-transparent border-none w-6'}>
              <AvatarImage src={authUser?.profilePic || '/user.png'} className={'object-contain'}/>
              <AvatarFallback>{authUser?.username.substr(0,1)}</AvatarFallback>
            </Avatar>
          </>
        ),
        active: pathname === "/dashboard/setting/profile",
      },
    ],
    [pathname, authUser]
  );

  return paths;
};
