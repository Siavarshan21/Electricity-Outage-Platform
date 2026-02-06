import { z } from "zod";
import type { UserId } from "@/shared/types/brand";

export const userRoleEnum = z.enum(["admin", "operator", "viewer"]);
export type UserRole = z.infer<typeof userRoleEnum>;

export const userSchema = z.object({
  id: z.string() as unknown as z.ZodType<UserId>,
  name: z.string(),
  email: z.string().email(),
  role: userRoleEnum,
  avatar: z.string().nullable(),
  createdAt: z.string(),
});

export type User = z.infer<typeof userSchema>;
