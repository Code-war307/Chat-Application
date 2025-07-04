import { cn } from "@/lib/utils";

const TextMessage = ({fromCurrentUser, content, timestamp}) => {
  return (
    <div
      className={cn(
        `bg-secondary px-2 py-1 rounded-md font-semibold `,
        fromCurrentUser
          ? "rounded-br-none bg-secondColor"
          : "rounded-bl-none bg-thirdColor text-white"
      )}
    >
      <p className="whitespace-pre-wrap text-sm">{content}</p>
      <p className={`text-[0.6rem] flex mt-2 font-semibold ${fromCurrentUser ? "justify-end" : "justify-start"}`}>{timestamp}</p>
    </div>
  );
};

export default TextMessage;
