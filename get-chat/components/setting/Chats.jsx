import Link from "next/link";
import PageNotBuild from "../page-not-build/PageNotBuild";
import { Card } from "../ui/card";
import { CircleArrowLeft } from "lucide-react";
const Chats = () => {
  return (
    <>
      <Card className={"w-full p-2 border-none bg-sidebarUserBG"}>
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <span>
              <Link href={"/dashboard/setting"}>
                <CircleArrowLeft className="text-white"/>
              </Link>
            </span>
            <span className="text-lg font-semibold text-white">Chat setting</span>
          </div>
          </div>
      </Card>
      <PageNotBuild query={"This page under work"} />
    </>
  )
}

export default Chats