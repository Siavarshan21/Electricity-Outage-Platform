import { httpClient } from "@/shared/api/httpClient";
import { loginResponseSchema, type LoginRequest, type LoginResponse } from "./authSchemas";
import { userSchema } from "@/entities/user/model/user.types";
import type { User } from "@/entities/user/model/user.types";

export const authApi = {
  async login(data: LoginRequest): Promise<LoginResponse> {
    const response = await httpClient.post<LoginResponse>("/auth/login", data);
    return loginResponseSchema.parse(response);
  },

  async logout(): Promise<void> {
    await httpClient.post("/auth/logout");
  },

  async getMe(): Promise<User> {
    const response = await httpClient.get<User>("/auth/me");
    return userSchema.parse(response);
  },
};
