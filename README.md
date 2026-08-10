# Gulf Coast Bite

Live local fishing conditions for the western Florida Panhandle and coastal Alabama — from Pensacola to Dauphin Island. An explainable morning **bite score** built from NOAA tide and water data plus National Weather Service forecasts, with solunar periods, a species-and-tactics engine, seasonal features, local spots, live-bait shops, regulations, and a community catch board.

Live site: https://gulfcoastbite.com

## What this is

A single-page static site (no build step, no framework) plus two Netlify Functions. Everything is plain HTML, CSS, and vanilla JavaScript that runs in the browser and calls public NOAA / NWS APIs directly. It is designed to be dropped on any static host.

## Layout

```
index.html                         Main dashboard (conditions, bite score, solunar, spots, journal, board)
app.js                             All client logic + the content engine (see below)
styles.css                         Styles (Libre Caslon + Inter; cream & terracotta palette)
methodology.html                   How the bite score and solunar periods are calculated
privacy.html  terms.html           Legal
mod.html                           Unlisted catch-board moderation page
*-fishing-conditions.html          Six location guide pages (SEO)
*-fishing-gulf-coast.html          Five species guide pages (SEO): redfish, trout, flounder, sheepshead, pompano
sitemap.xml  robots.txt  llms.txt  Discovery
favicon.*  og-gulf-coast-bite.*    Icons and social card
fonts/                             Self-hosted Libre Caslon Text (woff2)
netlify.toml                       Publish config + headers
netlify/functions/
  marine.ts                        Buoy wave data proxy (NDBC 42012) -> /api/waves
  catches                          Catch-board API (NOT in this repo — see below)
```

## The content engine (app.js)

The daily reports are generated client-side so no two days read alike. The engine has three parts, all in `app.js`:

- **Species calendar** — nine inshore species weighted by month, location, wind, tide stage, and water temperature, with Florida/Alabama seasonal-closure awareness. Drives the "Target today" card and the species referenced in each report.
- **Copy banks** — 60+ condition-keyed headlines and a five-part field-note composer (opening, tide, wind, seasonal/pressure/moon flavor, backup species, closer). A small `localStorage` history avoids repeating the last few days' headlines.
- **Render modules** — target card, weekly narrative, monthly Season Watch, live beach-cam embed, and the community catch board (Catch of the Week + share-to-board form).

Reports are seeded deterministically per day/location, so a given day always renders the same text.

## Data sources

- NOAA Tides & Currents (predictions, water temperature, air pressure, observed wind)
- National Weather Service (`api.weather.gov`) forecasts, grid data, and marine alerts
- NDBC buoy 42012 for offshore waves (via the `marine.ts` function)
- YouTube live beach cams (embedded, attributed)

All are public endpoints called directly from the browser; there are no API keys in this repo.

## The catch-board function is deployed separately

The `catches` Netlify Function (the catch-board backend: submit, moderate, list, photo storage) is **not** in this repo. Its source lives only on the Netlify deploy. Because of that:

- This repo is the **source of truth for the static site and the `marine.ts` function only.**
- The site is deployed with Netlify's file-digest API so the existing `catches` function is preserved untouched. **Do not connect this repo to Netlify continuous deployment** without first adding the `catches` function source, or the catch board will be dropped on the next git build.

If you want full CI later, reconstruct `catches` as `netlify/functions/catches.mjs` first, then wire up auto-deploy.

## Local preview

No build step. Serve the folder:

```
python3 -m http.server 8000
# open http://localhost:8000
```

The NOAA/NWS calls run against the live public APIs, so conditions load in local preview too. The catch board and `/api/waves` need the Netlify Functions runtime (`netlify dev`) or the live site.

## Deploying

Current method: Netlify file-digest deploy (preserves the `catches` function). The static files here are the deployable set.

---

Owned by R. McGarry CO. Conditions and bite scores are planning aids, not safety forecasts. Always verify marine warnings and fishing regulations with NOAA, the NWS, Florida FWC, and Outdoor Alabama.
