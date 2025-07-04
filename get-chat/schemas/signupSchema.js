import { z } from "zod";

export const usernameValidation = z
  .string()
  .min(3, {message: "username must be at least 3 characters"})
  .max(15, {message: "username must be at most 15 characters"})
  .regex(/^[a-zA-Z0-9_]+$/, {
    message: "username can only contain letters, numbers, and underscores"
  })
  .refine((value) => !value.startsWith("_"), {
    message: "username cannot start with an underscore"
  });

export const signupSchema = z.object({
  username: usernameValidation,
  email: z.string().email("Invalid email address"),
  password: z
    .string()
    .min(6, "Password must be at least 6 characters long")
    .max(25, "Password must be at most 25 characters long")
});
