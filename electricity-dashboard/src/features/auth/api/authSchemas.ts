import { z } from "zod";
import { userSchema } from "@/entities/user/model/user.types";

export const loginRequestSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

export type LoginRequest = z.infer<typeof loginRequestSchema>;

export const loginResponseSchema = z.object({
  user: userSchema,
  token: z.string(),
});

export type LoginResponse = z.infer<typeof loginResponseSchema>;
