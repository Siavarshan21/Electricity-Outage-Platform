import { http, HttpResponse, delay } from "msw";
import { getDb } from "../db/db";
import { paginate } from "../utils/paginate";
import { randomDelay } from "../utils/delay";

export const regionsHandlers = [
  http.get("/api/regions", async ({ request }) => {
    await delay(randomDelay());
    const url = new URL(request.url);
    const page = Number(url.searchParams.get("page")) || 1;
    const pageSize = Number(url.searchParams.get("pageSize")) || 10;
    const search = url.searchParams.get("search") || undefined;

    let regions = getDb().regions;

    if (search) {
      regions = regions.filter(
        (r) =>
          r.name.toLowerCase().includes(search.toLowerCase()) ||
          r.code.toLowerCase().includes(search.toLowerCase()),
      );
    }

    const result = paginate(regions, { page, pageSize });
    return HttpResponse.json(result);
  }),

  http.get("/api/regions/:id", async ({ params }) => {
    await delay(randomDelay());
    const { id } = params;
    const region = getDb().regions.find((r) => r.id === id);

    if (!region) {
      return HttpResponse.json({ message: "Region not found", code: "NOT_FOUND", status: 404 }, { status: 404 });
    }

    const outages = getDb().outages.filter((o) => o.regionId === region.id);
    return HttpResponse.json({ ...region, outages });
  }),
];
