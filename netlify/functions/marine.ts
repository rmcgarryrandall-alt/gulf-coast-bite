import type { Config } from "@netlify/functions";

const ALLOWED_STATIONS = new Set(["42012"]);

export default async (request: Request) => {
  const station = new URL(request.url).searchParams.get("station") || "42012";
  if (!ALLOWED_STATIONS.has(station)) return Response.json({ error: "Unknown station" }, { status: 400 });

  try {
    const response = await fetch(`https://www.ndbc.noaa.gov/data/realtime2/${station}.txt`, {
      headers: { "User-Agent": "GulfCoastBite/1.0 (https://gulfcoastbite.com)" }
    });
    if (!response.ok) throw new Error(`NDBC returned ${response.status}`);
    const lines = (await response.text()).trim().split(/\r?\n/);
    const headers = lines[0].replace(/^#/, "").trim().split(/\s+/);
    const rows = lines.slice(2).filter((line) => !line.startsWith("#")).map((line) => line.trim().split(/\s+/));
    const values = rows.find((row) => Number.isFinite(Number(row[headers.indexOf("WVHT")])) && Number.isFinite(Number(row[headers.indexOf("DPD")])))
      || rows.find((row) => Number.isFinite(Number(row[headers.indexOf("WVHT")])) && Number.isFinite(Number(row[headers.indexOf("APD")])))
      || rows.find((row) => Number.isFinite(Number(row[headers.indexOf("WVHT")])));
    if (!values) throw new Error("No valid buoy wave observation available");
    const value = (name: string) => values[headers.indexOf(name)];
    const meters = Number(value("WVHT"));
    const period = Number.isFinite(Number(value("DPD"))) ? Number(value("DPD")) : Number(value("APD"));
    if (!Number.isFinite(meters) || !Number.isFinite(period)) throw new Error("Wave observation unavailable");
    const observed = new Date(Date.UTC(Number(value("YY")), Number(value("MM")) - 1, Number(value("DD")), Number(value("hh")), Number(value("mm"))));
    if (Date.now() - observed.getTime() > 6 * 3600e3) throw new Error("Wave observation is stale");

    return Response.json(
      { height: Math.round(meters * 3.28084 * 10) / 10, period: Math.round(period), station, observed: observed.toISOString() },
      { headers: { "Cache-Control": "public, max-age=300", "Netlify-CDN-Cache-Control": "public, durable, s-maxage=600, stale-while-revalidate=1800" } }
    );
  } catch (error) {
    return Response.json({ error: error instanceof Error ? error.message : "Wave feed unavailable" }, { status: 502 });
  }
};

export const config: Config = {
  path: "/api/waves",
  method: "GET"
};

