"use client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tooltip, TooltipTrigger } from "@/components/ui/tooltip";
import { useNavigation } from "@/hooks/useNavigation";
import Link from "next/link";

const DesktopNav = () => {
  const paths = useNavigation();
  return (
    <Card
      className={
        "hidden lg:flex lg:flex-col lg:justify-between lg:items-center lg:h-full lg:w-16 lg:px-2 lg:py-4 bg-thirdColor border-none"
      }
    >
      <nav>
        <ul className="flex flex-col items-center gap-4">
          {paths.slice(0, 3).map((path, id) => {
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
                  </Tooltip>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
      <nav>
        <ul className="flex flex-col items-center gap-4">
          {paths.slice(3).map((path, id) => {
            return (
              <li key={id} className="relative hidden">
                <Link href={path.href}>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        name={path.name}
                        size="icon"
                        className={`bg-transparent
                        hover:bg-buttonFirstColor ${path.active ? "bg-buttonFirstColor" : ""}`}
                      >
                        {path.icon}
                      </Button>
                    </TooltipTrigger>
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

export default DesktopNav;
