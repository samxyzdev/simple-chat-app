import * as z from "zod/v4";

export const SignupSchema = z
  .object({
    name: z
      .string()
      .min(3, "Name must be atleast 3 characters long")
      .max(16, "Name must be at most 16 charatesrs long")
      .regex(/^[A-Za-z\s]+$/, "Name can only containe letters and spaces"),

    email: z.email().max(254, "Email is too long"),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters long")
      .max(16, "Password must be at most 16 characters long")
      .regex(/^(?=.*[0-9])(?=.*[A-Z])(?=.*[a-z]).*$/, {
        message:
          "Password must container at least one number, one uppercase letter, and one lowercase letter",
      }),
  })
  .strict();

export const SigninSchema = z.object({
  email: z.email().max(254, "Email is too long"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters long")
    .max(16, "Password must be at most 16 characters long")
    .regex(/^(?=.*[0-9])(?=.*[A-Z])(?=.*[a-z]).*$/, {
      message:
        "Password must container at least one number, one uppercase letter, and one lowercase letter",
    }),
});

export const ChatSchema = z
  .object({
    roomName: z.uuid("Room name must be valid UUID"),
  })
  .strict();
