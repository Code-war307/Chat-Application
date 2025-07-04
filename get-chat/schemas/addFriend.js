import {z} from "zod";
export const addFriendSchema = z.object({
  email: z.string().min(1, {message: `This field can't be empty`}).email({ message: "Please enter a valid email" }),
})