import { http, HttpResponse, delay } from "msw";
import { getDb } from "../db/db";
import { paginate } from "../utils/paginate";
import { filterItems } from "../utils/filter";
import { sortItems } from "../utils/sort";
import { randomDelay } from "../utils/delay";
import { createOutageTimeline } from "../db/factories/outage.factory";
import type { Outage } from "@/entities/outage/model/outage.types";

export const outagesHandlers = [
  http.get("/api/outages", async ({ request }) => {
    await delay(randomDelay());
    const url = new URL(request.url);
    const page = Number(url.searchParams.get("page")) || 1;
    const pageSize = Number(url.searchParams.get("pageSize")) || 10;
    const sortBy = (url.searchParams.get("sortBy") as keyof Outage) || "startedAt";
    const sortOrder = (url.searchParams.get("sortOrder") as "asc" | "desc") || "desc";

    const filters: Record<string, string | undefined> = {
      status: url.searchParams.get("status") || undefined,
      type: url.searchParams.get("type") || undefined,
      city: url.searchParams.get("city") || undefined,
      regionName: url.searchParams.get("regionName") || undefined,
      severity: url.searchParams.get("severity") || undefined,
    };

    const search = url.searchParams.get("search") || undefined;

    let outages = getDb().outages;

    if (search) {
      outages = outages.filter(
        (o) =>
          o.title.toLowerCase().includes(search.toLowerCase()) ||
          o.city.toLowerCase().includes(search.toLowerCase()) ||
          o.regionName.toLowerCase().includes(search.toLowerCase()),
      );
    }

    outages = filterItems(outages as unknown as Record<string, unknown>[], filters) as unknown as typeof outages;
    outages = sortItems(outages, sortBy, sortOrder);

    const result = paginate(outages, { page, pageSize });
    return HttpResponse.json(result);
  }),

  http.get("/api/outages/:id", async ({ params }) => {
    await delay(randomDelay());
    const { id } = params;
    const outage = getDb().outages.find((o) => o.id === id);

    if (!outage) {
      return HttpResponse.json({ message: "Outage not found", code: "NOT_FOUND", status: 404 }, { status: 404 });
    }

    const timeline = createOutageTimeline(outage.id);
    return HttpResponse.json({ ...outage, timeline });
  }),
];
