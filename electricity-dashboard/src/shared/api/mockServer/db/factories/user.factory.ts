import type { User } from "@/entities/user/model/user.types";
import type { UserId } from "@/shared/types/brand";

export function createUser(): User {
  return {
    id: "user_1" as UserId,
    name: "Ahmed Al-Rashid",
    email: "ahmed@electricity.gov",
    role: "admin",
    avatar: null,
    createdAt: new Date().toISOString(),
  };
}
