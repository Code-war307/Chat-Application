import { fileConvertAllOptions } from "@/helper/file-convertor-opt";
import Image from "next/image";
import Link from "next/link";

const ShowAllOptions = () => {
  const { allOptions } = fileConvertAllOptions();

  return (
    <div className="px-2 h-full w-full scrollbar-hide">
      {/* Heading and Description */}
      <div className="flex flex-col items-center justify-center p-3 gap-2 w-full z-10">
        <h1 className="text-3xl text-firstColor text-center font-semibold">
          GetChat Offers Seamless Built-In File Conversion Tools
        </h1>
        <p className="text-sm text-center max-w-2xl">
          Instantly convert your documents, images, and files from one format to another — directly within the chat interface.
          No need for third-party apps or downloads. Whether you're collaborating, sharing reports, or sending media, enjoy hassle-free conversion in just a few clicks.
        </p>
      </div>

      {/* Responsive Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-2">
        {allOptions.map((item, idx) => (
          <Link
            prefetch={false}
            key={idx}
            href={`/file-convertor/${item.id}`}
            className="hover:scale-105 transition-transform duration-300 ease-in-out shadow-md cursor-pointer"
          >
            <div className="aspect-square w-full max-h-[250px] bg-white rounded flex flex-col items-center justify-center text-center gap-2 p-2">
              <div className="h-12 w-12 relative">
                <Image
                  src={item.image}
                  fill
                  className="object-contain"
                  alt={item.id}
                />
              </div>
              <span className="text-lg font-semibold">{item.name}</span>
              <span className="text-sm font-light">{item.desc}</span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default ShowAllOptions;
