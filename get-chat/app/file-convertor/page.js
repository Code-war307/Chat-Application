'use client'
import { Card } from "@/components/ui/card"
import Image from "next/image"
import { useAuthStore } from "@/store/useAuthStore"
import { useFileConvertNavigation } from "@/hooks/fileConvertNavigation"
import ShowAllOptions from "@/components/file-convert/ShowAllOptions"

const FileExtFormator = () => {
  const {authUser} = useAuthStore()
  const {fileConvertNav} = useFileConvertNavigation()
  return (
    <div className="h-full w-full flex gap-2 p-1.5">
        <Card className={'hidden h-full w-[20%] p-1 lg:grid grid-rows-[220px_1fr] gap-2'}>
          <div className="flex flex-col items-center justify-center gap-4 p-2">
            <div className="relative w-25 h-25">
              <Image src={authUser?.profilePic || '/user.png'} fill className="rounded-lg object-cover" priority alt="Profile Pic"/>
            </div>
            <div className="flex flex-col items-center">
              <span className="text-lg font-semibold text-chatHeaderColor">{authUser?.username}</span>
              <span className="text-sm">{authUser?.email}</span>
            </div>
          </div>
          <div className="flex flex-col gap-4 p-1.5">
            {fileConvertNav.map((nav, idx) => (<div key={idx} className="flex gap-1 p-1.5 border-2 shadow-md rounded-lg cursor-pointer">
              <span>{nav.icon}</span>
              <span>{nav.name}</span>
            </div>))}
          </div>
        </Card>
        <Card className={'h-full lg:w-[80%] w-full p-1 overflow-y-scroll'}>
          <ShowAllOptions/>
        </Card>
    </div>
  )
}

export default FileExtFormator