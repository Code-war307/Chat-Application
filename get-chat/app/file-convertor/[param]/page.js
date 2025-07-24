"use client";
import { CloudUpload, LoaderCircle, X } from "lucide-react";
import { useRef } from "react";
import { useFileConvertorStore } from "@/store/useFileConvertor";
import toast from "react-hot-toast";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { getFilePreviewInfo } from "@/helper/geticon";
import { useParams } from "next/navigation";

const MAX_FILE_SIZE_MB = 5;

const Formator = () => {
  const fileInputRef = useRef();
  const { param } = useParams();
  const { addFilesForConvert, setAddFilesForConvert, removeFileForConvert, submitConversion,  } = useFileConvertorStore();

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const fileSizeMB = file.size / 1024 / 1024; // Convert bytes to MB
    if (fileSizeMB > MAX_FILE_SIZE_MB) {
      toast.error(`File size exceeds ${MAX_FILE_SIZE_MB} MB limit.`);
      return;
    }

    setAddFilesForConvert(file);
  };

  const onSubmit = () => {
    if(!addFilesForConvert)return

    const formData = new FormData();
    formData.append('file', addFilesForConvert);
    formData.append('targetFormat', param.split("-").pop())

    submitConversion(formData)
  }

  return (
    <div className="h-full w-full flex flex-col items-center gap-5 p-2">
      <div className="h-[30%] w-full lg:w-[50%] flex flex-col items-center justify-center gap-3 bg-[#ceecfc] border-2 border-dashed border-black rounded-lg p-2">
        <div>
          <CloudUpload size={"icon"} className="w-15" />
        </div>
        <div>Drag you files here, file size should be less than 5 MB or</div>
        <div>
          <input
            type="file"
            accept={param ? `.${param.split("-")[0]}` : "*"}
            ref={fileInputRef}
            onChange={handleFileChange}
            className="hidden"
            
          />
          <Button
            className="bg-secondColor border-1 border-firstColor text-firstColor font-semibold hover:bg-firstColor hover:text-secondColor hover:border-secondColor cursor-pointer"
            onClick={() => fileInputRef.current?.click()}
          >
            Browse file
          </Button>
        </div>
      </div>
      <div className="w-full flex flex-col gap-3 overflow-y-auto">
        {addFilesForConvert ? (
          <div
              className="grid grid-cols-[50%_25%_25%] justify-between items-center p-2 rounded shadow-sm"
            >
              <div className="flex gap-2 items-center">
                <div className="relative h-10 w-10 flex items-center">
                  <Image
                    src={getFilePreviewInfo(addFilesForConvert?.name)}
                    fill
                    className="object-contain"
                    alt="file image"
                  />
                </div>
                <div className="truncate text-sm">{addFilesForConvert?.name}</div>
                <div className="text-sm">{`(${(addFilesForConvert.size / 1024 / 1024).toFixed(2)}MB)`}</div>
              </div>
              <div className="flex items-center justify-center gap-2">
                {/* {isConverted ? (<span>Converted</span>): (<div className="flex gap-2"><span><LoaderCircle className="w-4.5 animate-spin"/></span><span>Converting...</span></div>)} */}
              </div>
              <div className="flex items-center justify-end"><X className="w-4.5 cursor-pointer" onClick={() => removeFileForConvert(addFilesForConvert)} /></div>
            </div>
        ) : (
          <div className=" h-100 w-full flex flex-col items-center justify-center gap-3 ">
            <div className="h-30 w-30 relative">
              <Image src="/icons/no-file-select.png" alt="No files" fill />
            </div>
            <span className="text-gray-400 text-md text-center">
              No files added yet.
            </span>
          </div>
        )}
        {addFilesForConvert && (
          <div className="flex justify-end">
          <Button onClick={onSubmit}>Convert</Button></div>
        )}
      </div>
    </div>
  );
};

export default Formator;
