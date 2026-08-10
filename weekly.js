/* Weekly outlook page: scores 7 days for all six waters from live NOAA/NWS
   data using the same formula as the dashboard, renders a card per location,
   and offers a copy-ready forum digest. */
(() => {
  "use strict";
  const LOCS = [
    { key: "perdido", name: "Perdido Key, FL", lat: 30.294, lon: -87.44, tide: "8730667", cond: "/perdido-key-fishing-conditions" },
    { key: "pensacola", name: "Pensacola Bay, FL", lat: 30.4, lon: -87.21, tide: "8729909", cond: "/pensacola-fishing-conditions" },
    { key: "orange-beach", name: "Orange Beach, AL", lat: 30.27, lon: -87.57, tide: "8730667", cond: "/orange-beach-fishing-conditions" },
    { key: "gulf-shores", name: "Gulf Shores, AL", lat: 30.246, lon: -87.7, tide: "8731439", cond: "/gulf-shores-fishing-conditions" },
    { key: "mobile", name: "Mobile Bay, AL", lat: 30.44, lon: -88.01, tide: "8735180", cond: "/mobile-bay-fishing-conditions" },
    { key: "dauphin", name: "Dauphin Island, AL", lat: 30.251, lon: -88.109, tide: "8735180", cond: "/dauphin-island-fishing-conditions" }
  ];
  const esc = (v) => String(v ?? "").replace(/[&<>'"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", '"': "&quot;" })[c]);
  const pad = (n) => (n < 10 ? "0" + n : "" + n);
  const ymd = (d) => `${d.getFullYear()}${pad(d.getMonth() + 1)}${pad(d.getDate())}`;
  const isoDay = (d) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
  const DAY = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

  async function getJSON(url) {
    const r = await fetch(url, { headers: { Accept: "application/geo+json, application/json" } });
    if (!r.ok) throw new Error(String(r.status));
    return r.json();
  }
  function scoreParts(range, wind, precip, forecast) {
    const tide = Math.round(Math.max(6, Math.min(40, 24 * range)));
    const w = wind <= 7 ? 35 : Math.round(Math.max(4, 35 - (wind - 7) * 2.4));
    const text = (forecast || "").toLowerCase();
    let sky = /thunder|storm/.test(text) ? 4 : /heavy rain/.test(text) ? 8 : /rain|showers|drizzle/.test(text) ? 12 : /partly|mostly cloudy|overcast|broken|cloud/.test(text) ? 25 : /sunny|clear|fair/.test(text) ? 18 : 16;
    sky = Math.max(0, Math.round(sky - 0.12 * (precip || 0)));
    return Math.max(15, Math.min(97, tide + w + sky));
  }
  function moonName(date) {
    const syn = 29.53058867;
    const known = Date.UTC(2000, 0, 6, 18, 14);
    const age = ((date.getTime() - known) / 864e5 % syn + syn) % syn;
    return ["new moon", "waxing crescent", "first quarter", "waxing gibbous", "full moon", "waning gibbous", "last quarter", "waning crescent"][Math.round(age / syn * 8) % 8];
  }

  async function weekFor(loc) {
    const today = new Date();
    const point = await getJSON(`https://api.weather.gov/points/${loc.lat},${loc.lon}`);
    const daily = await getJSON(point.properties.forecast);
    const curve = await getJSON(`https://api.tidesandcurrents.noaa.gov/api/prod/datagetter?product=predictions&application=gulfcoastbite&station=${loc.tide}&begin_date=${ymd(today)}&range=168&datum=MLLW&units=english&time_zone=lst_ldt&interval=30&format=json`);
    const days = [];
    for (let i = 0; i < 7; i++) {
      const d = new Date(today.getFullYear(), today.getMonth(), today.getDate() + i);
      const iso = isoDay(d);
      const period = daily.properties.periods.find((p) => p.isDaytime && p.startTime.slice(0, 10) === iso) || daily.properties.periods.find((p) => p.startTime.slice(0, 10) === iso);
      const pts = (curve.predictions || []).filter((p) => p.t.slice(0, 10) === iso).map((p) => Number(p.v));
      if (!period && !pts.length) break;
      const range = pts.length ? Math.max(...pts) - Math.min(...pts) : 1.2;
      const wind = Number((period?.windSpeed || "8").match(/\d+/)?.[0] || 8);
      days.push({
        label: i === 0 ? "today" : DAY[d.getDay()],
        score: scoreParts(range, wind, period?.probabilityOfPrecipitation?.value || 0, period?.shortForecast || ""),
        weather: (period?.shortForecast || "").split(/ then /i)[0]
      });
    }
    return days;
  }

  function narrate(loc, days) {
    if (!days.length) return null;
    const ranked = days.map((d, i) => ({ d, i })).sort((a, b) => b.d.score - a.d.score);
    const best = ranked[0], worst = ranked[ranked.length - 1];
    const moon = moonName(new Date());
    let text = `Best morning is ${best.d.label} at ${best.d.score} (${best.d.weather.toLowerCase()}).`;
    if (best.d.score - worst.d.score >= 15) text += ` The one to trade away is ${worst.d.label} at ${worst.d.score}.`;
    else text += ` Scores run close all week; let the wind pick your morning.`;
    if (/full|new/.test(moon)) text += ` The ${moon} means spring tides: strong current and hard, short feeds.`;
    else if (/quarter/.test(moon)) text += ` A ${moon} keeps tides modest, so time the moving hours.`;
    return { best, worst, text };
  }

  async function run() {
    const cards = document.getElementById("wk-cards");
    const status = document.getElementById("wk-status");
    const copyBtn = document.getElementById("wk-copy");
    const digest = [];
    let done = 0;
    for (const loc of LOCS) {
      try {
        const days = await weekFor(loc);
        const n = narrate(loc, days);
        if (!n) continue;
        const div = document.createElement("div");
        div.className = "wk-card";
        div.innerHTML = `<span class="wk-meta">${esc(loc.name)}</span><h3>${esc(n.best.d.label.charAt(0).toUpperCase() + n.best.d.label.slice(1))} · <span class="wk-score">${n.best.d.score}</span></h3><p>${esc(n.text)} <a href="${loc.cond}">Full ${esc(loc.name.split(",")[0])} guide →</a></p>`;
        cards.appendChild(div);
        digest.push(`${loc.name}: best ${n.best.d.label} (${n.best.d.score}). ${n.text.split(". ").slice(1).join(". ")}`);
        done += 1;
        status.textContent = `Scored ${done} of ${LOCS.length} local waters…`;
      } catch (e) { /* skip a failed location */ }
    }
    status.textContent = done ? `Week of ${new Date().toLocaleDateString("en-US", { month: "long", day: "numeric" })} · scored from live NOAA / NWS data.` : "The live feed is unavailable right now; try again shortly.";
    if (done) {
      copyBtn.hidden = false;
      copyBtn.addEventListener("click", () => {
        const head = `WEEK ON THE WATER · ${new Date().toLocaleDateString("en-US", { month: "short", day: "numeric" })} · gulfcoastbite.com`;
        navigator.clipboard.writeText(head + "\n\n" + digest.join("\n\n") + "\n\nLive scores, tides, and solunar windows: https://gulfcoastbite.com").then(() => {
          copyBtn.textContent = "Copied";
          setTimeout(() => { copyBtn.textContent = "Copy for forum post"; }, 1800);
        });
      });
    }
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", run); else run();
})();
