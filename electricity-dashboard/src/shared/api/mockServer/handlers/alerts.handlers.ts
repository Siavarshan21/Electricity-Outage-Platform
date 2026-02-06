import { http, HttpResponse, delay } from "msw";
import { getDb } from "../db/db";
import { paginate } from "../utils/paginate";
import { randomDelay } from "../utils/delay";

export const alertsHandlers = [
  http.get("/api/alerts", async ({ request }) => {
    await delay(randomDelay());
    const url = new URL(request.url);
    const page = Number(url.searchParams.get("page")) || 1;
    const pageSize = Number(url.searchParams.get("pageSize")) || 10;
    const severity = url.searchParams.get("severity") || undefined;

    let alerts = getDb().alerts;

    if (severity) {
      alerts = alerts.filter((a) => a.severity === severity);
    }

    // Sort by newest first
    alerts = [...alerts].sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    );

    const result = paginate(alerts, { page, pageSize });
    return HttpResponse.json(result);
  }),

  http.get("/api/alerts/:id", async ({ params }) => {
    await delay(randomDelay());
    const { id } = params;
    const alert = getDb().alerts.find((a) => a.id === id);

    if (!alert) {
      return HttpResponse.json({ message: "Alert not found", code: "NOT_FOUND", status: 404 }, { status: 404 });
    }

    return HttpResponse.json(alert);
  }),
];
