"use client";
import { addFriendSchema } from "@/schemas/addFriend.js";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Tooltip, TooltipTrigger } from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import { Loader2, UserPlus } from "lucide-react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useRequestStore } from "@/store/useRequestStore";
import { useAuthStore } from "@/store/useAuthStore";
const AddFriend = () => {
  const {jwtToken} = useAuthStore()
  const { IsRequestSubmiitting, sendFriendRequest } = useRequestStore();

  const form = useForm({
    resolver: zodResolver(addFriendSchema),
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = (data) => {
    if (jwtToken) {
      const email = data.email;
      sendFriendRequest(jwtToken, email);
    }
  };

  return (
    <Dialog>
      <Tooltip>
        <TooltipTrigger>
          <DialogTrigger asChild>
              <UserPlus className="text-white w-4 cursor-pointer" />
            </DialogTrigger>
        </TooltipTrigger>
      </Tooltip>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Friend</DialogTitle>
          <DialogDescription>
            Send request to connect with your friend!
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email*</FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      placeholder="Enter your email"
                      className="transition-all duration-300 ease-in-out focus:ring-2 focus:ring-blue-500 focus:outline-none"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button
                type="submit"
                disabled={IsRequestSubmiitting}
                className="w-fit bg-gradient-to-r from-gray-700 to-black hover:from-black hover:to-gray-700 text-white font-semibold py-2 px-4 rounded-md transition-all duration-300 ease-in-out"
              >
                {IsRequestSubmiitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Please
                    wait
                  </>
                ) : (
                  "Send"
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default AddFriend;
