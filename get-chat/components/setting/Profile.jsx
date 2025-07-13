import { Card } from "../ui/card";
import {
  Camera,
  CameraOff,
  CircleArrowLeft,
  Eye,
  Loader,
  Pencil,
  PencilOff,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useAuthStore } from "@/store/useAuthStore";
import { Button } from "../ui/button";
import { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import { useSession } from "next-auth/react";

const Profile = () => {
  const { authUser, setUser } = useAuthStore();
  const { update } = useSession();
  const [enableEdit, setEnableEdit] = useState(false);
  const [image, setImage] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [bio, setBio] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [file, setFile] = useState(null);
  const imgInput = useRef(null);
  const { updateUser, isUpdateUser } = useAuthStore();

  useEffect(() => {
    if (authUser) {
      setUsername(authUser?.username || "");
      setBio(authUser?.bio || "");
      setImage(authUser?.profilePic || "");
    }
  }, [authUser]);

  const handleClick = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const previewUrl = URL.createObjectURL(file);
    setImage(previewUrl);
    setFile(file);
  };

  const onSubmit = async () => {
    const hasUsernameChanged = username !== authUser?.username;
    const hasBioChanged = bio !== authUser?.bio;
    const hasNewImage = !!file;

    if (!hasUsernameChanged && !hasBioChanged && !hasNewImage) {
      toast.error("At least one data field must be new");
      return;
    }

    const formData = new FormData();
    formData.append("username", username);
    formData.append("bio", bio);
    formData.append("password", password);
    if (file) {
      formData.append("profilePic", file);
    }

    const updatedData = await updateUser(formData);
    if (updatedData) {
      await update({ updatedUser: updatedData });
      setUser(updatedData);
    }

    setEnableEdit(!enableEdit);
  };

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
            <span className="text-lg font-semibold text-white">Profile</span>
          </div>
          <Button
            size="icon"
            className={"bg-transparent hover:bg-sidebarUserHover"}
            onClick={() => setEnableEdit(!enableEdit)}
            disabled={enableEdit}
          >
            {!enableEdit ? <Pencil /> : <PencilOff />}
          </Button>
        </div>
      </Card>
      <div className="h-full w-full m-1 overflow-y-auto flex flex-col items-center gap-15">
        <div className="relative">
          <div className="relative h-35 w-35 flex justify-center items-center bg-white rounded-full border-1 overflow-hidden">
            <Image
              src={image}
              fill
              className="object-cover overflow-hidden"
              alt="profile picture"
            />
          </div>
          <Button
            className={`bg-secondColor rounded-full absolute right-0 bottom-0 h-fit w-fit p-2 text-firstColor ${!enableEdit ? "opacity-50 cursor-not-allowed" : "hover:bg-firstColor hover:text-secondColor cursor-pointer "}`}
            size="icon"
            disabled={!enableEdit}
            onClick={() => imgInput.current?.click()}
          >
            {enableEdit ? <Camera /> : <CameraOff />}
          </Button>
          <input
            type="file"
            accept="image/*"
            ref={imgInput}
            onChange={handleClick}
            className="hidden"
          />
        </div>
        <div className="h-fit w-full p-3">
          <ul className="h-full w-full flex flex-col gap-10">
            <li className="w-full flex flex-col gap-1">
              <span className="text-white">Username</span>
              <input
                type="text"
                className={`bg-sidebarUserBG w-full rounded-lg px-5 py-1 border-none focus:outline-none ${enableEdit ? "text-white" : "text-[#ababab]"}`}
                disabled={!enableEdit}
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </li>
            <li className="w-full flex flex-col gap-1">
              <span className="text-white">Password</span>
              <div className="relative">
                <input
                  type={showPass ? "text" : "password"}
                  className={`bg-sidebarUserBG w-full rounded-lg px-5 py-1 border-none text-white placeholder:text-[#ababab] focus:outline-none`}
                  disabled={!enableEdit}
                  value={password}
                  placeholder={!enableEdit ? "**********" : ""}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <Button
                  size="icon"
                  className="absolute bg-transparent right-0 bottom-0 hover:bg-transparent cursor-pointer"
                  onClick={() => setShowPass(!showPass)}
                  disabled={!enableEdit}
                >
                  <Eye className="w-5" />
                </Button>
              </div>
            </li>
            <li className="w-full flex flex-col gap-1">
              <span className="text-white">Bio</span>
              <textarea
                rows={5}
                className={`bg-sidebarUserBG w-full rounded-lg px-5 py-1 resize-none border-none focus:outline-none [&::-webkit-scrollbar]:w-2
  [&::-webkit-scrollbar-track]:bg-gray-100
  [&::-webkit-scrollbar-thumb]:bg-gray-300
  dark:[&::-webkit-scrollbar-track]:bg-neutral-700
  dark:[&::-webkit-scrollbar-thumb]:bg-neutral-500 ${enableEdit ? "text-white" : "text-[#ababab]"}`}
                value={bio}
                disabled={!enableEdit}
                onChange={(e) => setBio(e.target.value)}
              ></textarea>
            </li>
          </ul>
        </div>
        <div className="fixed bottom-4">
          <Button
            className={`text-sm font-semibold bg-firstColor text-secondColor border-1 border-secondColor hover:border-firstColor cursor-pointer hover:text-firstColor hover:bg-secondColor ${enableEdit ? "flex" : "hidden"}`}
            onClick={onSubmit}
          >
            {isUpdateUser ? <Loader className="w-4" /> : "Submit"}
          </Button>
        </div>
      </div>
    </>
  );
};

export default Profile;

//
