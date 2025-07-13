'use client'
import { CircleUserRound, MessageCircle, Pen } from "lucide-react";
import { usePathname } from "next/navigation";
import { useMemo } from "react";

export const useSettingNav = () => {
  const navigate = usePathname();

  const navigation = useMemo(
    () => [
      {
        name: "Profile",
        href: "/dashboard/setting/profile",
        icon: <CircleUserRound className="w-5"/>,
        active: navigate === "/dashboard/setting/profile",
      },
      {
        name: "Chats",
        href: "/dashboard/setting/chats",
        icon: <MessageCircle className="w-5"/>,
        active: navigate === "/dashboard/setting/chats",
      },
      {
        name: "Personalization",
        href: "/dashboard/setting/personalization",
        icon: <Pen className="w-5"/>,
        active: navigate === "/dashboard/setting/personalization",
      }
    ],
    [navigate]
  );
  return navigation;
};
