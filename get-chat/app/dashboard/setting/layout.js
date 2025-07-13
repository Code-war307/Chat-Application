"use client";
import ItemList from "@/components/itemList/ItemList";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useSettingNav } from "@/hooks/settingNavigation";
import { LogOut } from "lucide-react";
import { signOut } from "next-auth/react";
import Link from "next/link";

const SettingLayout = ({ children }) => {
  const navigation = useSettingNav();

  return (
    <>
      <ItemList title="Setting">
        {navigation.map((nav, idx) => {
          return (
            <Link href={nav.href} key={idx} className="w-full">
              <Card
                className={
                  "bg-sidebarUserBG border-none shadow-md p-2 cursor-pointer hover:bg-sidebarUserHover rounded-full"
                }
              >
                <div className="flex items-center gap-2 text-white text-sm">
                  <span>{nav.icon}</span>
                  <span>{nav.name}</span>
                </div>
              </Card>
            </Link>
          );
        })}
        <Card
          className={"w-full h-10 p-0 bg-sidebarUserBG border-0 shadow-md rounded-full"}
        >
          <Button
            className={
              "w-full h-full bg-transparent rounded-full flex justify-start hover:bg-sidebarUserHover overflow-hidden cursor-pointer"
            }
            onClick={() => signOut()}
          >
            <LogOut /><span>Logout</span>
          </Button>
        </Card>
      </ItemList>
      {children}
    </>
  );
};

export default SettingLayout;
