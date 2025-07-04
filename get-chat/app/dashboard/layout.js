"use client"
import SidebarWrapper from "@/components/sidebar/SidebarWrapper";
import { useAuthStore } from "@/store/useAuthStore";
import { useSession } from "next-auth/react";
import { useEffect } from "react";

export default function DashboardLayout({ children }) {
  const {data: session, status} = useSession();
  const {setUser, connectSocket} = useAuthStore()
  
  useEffect(() => {
    if (status === "authenticated" && session?.user) {
      const storeUserDate = async () => {
        await setUser(session.user);
      };
      storeUserDate();
      connectSocket();
    }
  }, [status, session, setUser, connectSocket]);

  return (
        <SidebarWrapper>{children}</SidebarWrapper>
  );
}
