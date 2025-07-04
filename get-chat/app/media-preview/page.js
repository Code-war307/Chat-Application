"use client";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { useChatStore } from "@/store/useChatStore";
import {
  ArrowLeft,
  EllipsisVertical,
  Save,
  Trash,
  ZoomIn,
  ZoomOut,
} from "lucide-react";
import Image from "next/image";
import { useState } from "react";

const MediaPreview = () => {
  const { previewMedia } = useChatStore();
  console.log(previewMedia);
  const [currentZoom, setCurrentZoom] = useState(1);

  const handleBack = () => {};

  const handleZoomIn = () => {
    setCurrentZoom((prev) => Math.min(prev + 0.2, 3));
  };

  const handleZoomOut = () => {
    setCurrentZoom((prev) => Math.max(prev - 0.2, 1));
  };

  return (
    <div className="h-svh w-full bg-itemListColor flex flex-col">
      <nav className="h-[7%] w-full shadow-sm flex justify-between items-center p-2">
        <div
          className="h-fit w-fit p-2 rounded-full  hover:bg-gray-800/60 cursor-pointer"
          onClick={handleBack}
        >
          <ArrowLeft className="w-5 h-5 text-white" />
        </div>
        <div className="max-w-fit p-2">
          <ul className="flex gap-3">
            <li>
              <Button
                size={"icon"}
                className={
                  "hidden bg-transparent hover:bg-buttonFirstColor cursor-pointer lg:flex"
                }
                onClick={handleZoomIn}
              >
                <ZoomIn />
              </Button>
            </li>
            <li>
              <Button
                size={"icon"}
                className={
                  "hidden bg-transparent hover:bg-buttonFirstColor cursor-pointer lg:flex"
                }
                onClick={handleZoomOut}
              >
                <ZoomOut />
              </Button>
            </li>
            <li>
              <Button
                size={"icon"}
                className={
                  "hidden bg-transparent hover:bg-buttonFirstColor cursor-pointer lg:flex"
                }
              >
                <Trash />
              </Button>
            </li>
            <li>
              <Button
                size={"icon"}
                className={
                  "hidden bg-transparent hover:bg-buttonFirstColor cursor-pointer lg:flex"
                }
              >
                <Save />
              </Button>
            </li>
            <li>
              <Button
                size={"icon"}
                className={
                  "flex bg-transparent hover:bg-buttonFirstColor cursor-pointer lg:hidden"
                }
              >
                <EllipsisVertical />
              </Button>
            </li>
          </ul>
        </div>
      </nav>
      <div className="h-[85%] w-full flex items-center justify-center">
        <Carousel className="w-full max-w-lg p-3">
          <CarouselContent>
            {previewMedia.map((media, index) => (
              <CarouselItem key={index}>
                <div className="p-1 ">
                  <Card className={"bg-transparent border-none shadow-none"}>
                    <CardContent className="relative flex aspect-square items-center justify-center overflow-hidden">
                      {media.resourceTYpe === "image" ? (
                        <Image
                          src={media.url}
                          fill
                          className=" object-contain"
                          style={{ transform: `scale(${currentZoom})` }}
                          alt="hello"
                        />
                      ) : (
                        <video
                          src={media.url}
                          alt="video"
                          className="object-cover"
                          style={{ transform: `scale(${currentZoom})` }}
                          controls
                        />
                      )}
                    </CardContent>
                  </Card>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious />
          <CarouselNext />
        </Carousel>
      </div>
      <footer className="h-[12%] flex items-center p-1 overflow-hidden">
        <div className="group h-full flex gap-2">
          {previewMedia.map((media, idx) => (
            <div
              key={idx}
              className="child relative h-full w-20 rounded-md overflow-hidden border-2 border-transparent transition-all duration-300 cursor-pointer"
            >
              {media.resourceTYpe === "image" ? (
                <Image
                  src={media.url}
                  fill
                  className="object-cover"
                  alt="image"
                />
              ) : (
                <video src={media.url} alt="video" className="object-cover" />
              )}
            </div>
          ))}
        </div>
      </footer>
    </div>
  );
};

export default MediaPreview;
