import * as z from "zod/v4";

export const SignupSchema = z.object({
  name: z.string(),
  email: z.email(),
  password: z.string(),
});

export const SigninSchema = z.object({
  email: z.email(),
  password: z.string(),
});

export const ChatSchema = z.object({
  roomName: z.string(),
});
