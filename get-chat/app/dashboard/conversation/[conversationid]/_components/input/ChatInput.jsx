"use client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { chatMessageSchema } from "@/schemas/chatMessageSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import TextareaAutosize from "react-textarea-autosize";
import { useRef } from "react";
import { ImageDown, Send } from "lucide-react";
import { useChatStore } from "@/store/useChatStore";
import { dummyMsg } from "@/helper/dummyMsg";
import { useAuthStore } from "@/store/useAuthStore";

const ChatInput = ({ conversationId }) => {
  const fileInputRef = useRef(null);
  const inputRef = useRef(null);
  const typingTimeout = useRef(null)
  const { sendMessages, isMessageSending, addMediaFiles, mediaFiles } =
    useChatStore();
  const { authUser, jwtToken, socket } = useAuthStore();

  const form = useForm({
    resolver: zodResolver(chatMessageSchema),
    defaultValues: {
      content: "",
    },
  });

  const watchedContent = form.watch("content");

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files || []);
    files.forEach((file) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        addMediaFiles({
          file,
          previewUrl: reader.result,
          type: file.type,
        });
      };
      reader.readAsDataURL(file);
    });
  };

  const onSubmit = async (data) => {
    const hasText = data.content.trim().length > 0;

    if (!hasText) return;

    const formData = new FormData();
    formData.append("text", data.content.trim());
    formData.append("files", null);

    const dummyMessage = dummyMsg(
      hasText,
      mediaFiles,
      authUser,
      conversationId
    );

    try {
      await sendMessages(jwtToken, conversationId, formData, dummyMessage);
      form.reset();
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  const emitTypeIndicator = () => {
    if (!socket) return;
    clearTimeout(typingTimeout.current);
    typingTimeout.current = setTimeout(() => {
      socket.emit("typing", {
        receiverId: conversationId,
        senderId: authUser?._id,
      });
    }, 100);
  };

  return (
    <Card className="w-full p-2 rounded-lg border-none shadow-md shadow-black/50 bg-chatHeaderColor">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex gap-2 items-end w-full"
        >
          <Button
            type="button"
            size="icon"
            onClick={() => fileInputRef.current?.click()}
            className={`cursor-pointer bg-transparent ${mediaFiles.length > 0 ? "text-shadow-blue-500" : "text-white"} hover:bg-sidebarUserHover`}
          >
            <ImageDown />
          </Button>

          <input
            type="file"
            accept="image/*, video/*, audio/*, .pdf, .doc, .docx, .txt"
            ref={fileInputRef}
            onChange={handleFileChange}
            className="hidden"
            multiple
          />
          <FormField
            control={form.control}
            name="content"
            render={({ field }) => (
              <FormItem className="h-full w-full">
                <FormControl>
                  <TextareaAutosize
                    ref={inputRef}
                    minRows={1}
                    maxRows={4}
                    {...field}
                    placeholder="Type a message......"
                    className="min-h-full w-full resize-none border-0 outline-0 text-white placeholder:text-white p-1.5 bg-transparent"
                    onKeyDown={async (e) => {
                      if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault();
                        await form.handleSubmit(onSubmit)();
                      }
                    }}
                    onChange={(e) => {
                      field.onChange(e);
                      emitTypeIndicator();
                    }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {watchedContent && watchedContent.trim().length > 0 && (
            <Button
              type="submit"
              disabled={isMessageSending}
              size="icon"
              className="cursor-pointer text-white bg-transparent hover:bg-sidebarUserHover"
            >
              <Send />
            </Button>
          )}
        </form>
      </Form>
    </Card>
  );
};

export default ChatInput;
