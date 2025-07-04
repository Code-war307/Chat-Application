"use client"
import SidebarWrapper from "@/components/sidebar/SidebarWrapper";
import { useAuthStore } from "@/store/useAuthStore";
import { useSession } from "next-auth/react";
import { useEffect } from "react";

export default function DashboardLayout({ children }) {
  const {data: session, status} = useSession();
  const {setUser, connectSocket, isHydrated} = useAuthStore()
  useEffect(() => {
    if (!isHydrated) return;
    if (status === "authenticated" && session?.user) {
      setUser(session.user);
      connectSocket();
    }
  }, [status, session, setUser, connectSocket, isHydrated]);

  return (
        <SidebarWrapper>{children}</SidebarWrapper>
  );
}
