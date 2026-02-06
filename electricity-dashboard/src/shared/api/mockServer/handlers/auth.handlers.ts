import { http, HttpResponse, delay } from "msw";
import { getDb } from "../db/db";
import { randomDelay } from "../utils/delay";

export const authHandlers = [
  http.post("/api/auth/login", async ({ request }) => {
    await delay(randomDelay());
    const body = (await request.json()) as { email?: string; password?: string };

    if (!body.email || !body.password) {
      return HttpResponse.json(
        { message: "Email and password required", code: "VALIDATION_ERROR", status: 400 },
        { status: 400 },
      );
    }

    const user = getDb().users[0];
    return HttpResponse.json({
      user,
      token: "mock_jwt_token_" + Date.now(),
    });
  }),

  http.post("/api/auth/logout", async () => {
    await delay(randomDelay());
    return HttpResponse.json({ success: true });
  }),

  http.get("/api/auth/me", async () => {
    await delay(randomDelay());
    const user = getDb().users[0];
    return HttpResponse.json(user);
  }),
];
