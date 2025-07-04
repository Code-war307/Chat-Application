"use client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useConversation } from "@/hooks/useConversation";
import { useNavigation } from "@/hooks/useNavigation";
import Link from "next/link";

const MobileNav = () => {
  const paths = useNavigation();
  const { isActive } = useConversation();

  if (isActive) {
    return null;
  }

  return (
    <Card
      className={
        "fixed bottom-2 w-[calc(100%-20px)] flex items-center h-13 p-2 bg-thirdColor border-none lg:hidden"
      }
    >
      <nav className="w-full">
        <ul className="flex justify-evenly items-center">
          {paths.slice(0,3).map((path, id) => {
            return (
              <li key={id} className="relative">
                <Link href={path.href} aria-label={path.name}>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        aria-label={path.name}
                        size="icon"
                        className={`bg-transparent
                        hover:bg-buttonFirstColor ${path.active ? "bg-buttonFirstColor" : ""}`}
                      >
                        {path.icon}
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>{path.name}</TooltipContent>
                  </Tooltip>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </Card>
  );
};

export default MobileNav;
