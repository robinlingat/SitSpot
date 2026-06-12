import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  'https://ubitulaunwfnordugruw.supabase.co',
  'sb_secret_ABwUyw0OpwTEtcGU9sKq2g_A4L8Vs-0'
);

const LAT_MIN = 41, LAT_MAX = 52;
const LON_MIN = -6, LON_MAX = 10;
const BATCH   = 500;
const DELAY   = 1200; // ms entre chaque requête Overpass

const sleep = ms => new Promise(r => setTimeout(r, ms));

const HEADERS = {
  'User-Agent': 'SitSpot-Migration/1.0 (sitspot-app; contact@sitspot.fr)',
  'Accept': 'application/json',
};

const ENDPOINT = 'https://overpass.openstreetmap.fr/api/interpreter';

async function fetchCell(lat, lon) {
  const q = `[out:json][timeout:30];node["amenity"="bench"](${lat},${lon},${lat+1},${lon+1});out qt;`;
  const r = await fetch(ENDPOINT, {
    method:  'POST',
    headers: { ...HEADERS, 'Content-Type': 'application/x-www-form-urlencoded' },
    body:    `data=${encodeURIComponent(q)}`,
    signal:  AbortSignal.timeout(35000),
  });
  if (!r.ok) throw new Error(`HTTP ${r.status}`);
  const data = await r.json();
  return data.elements || [];
}

async function insertRows(rows) {
  for (let i = 0; i < rows.length; i += BATCH) {
    const { error } = await supabase
      .from('osm_benches')
      .upsert(rows.slice(i, i + BATCH), { onConflict: 'id' });
    if (error) console.error('  ⚠ insert error:', error.message);
  }
}

async function main() {
  let total = 0;
  const totalCells = (LAT_MAX - LAT_MIN) * (LON_MAX - LON_MIN);
  let done = 0;

  for (let lat = LAT_MIN; lat < LAT_MAX; lat++) {
    for (let lon = LON_MIN; lon < LON_MAX; lon++) {
      done++;
      const cell = `(${lat >= 0 ? '+' : ''}${lat}, ${lon >= 0 ? '+' : ''}${lon})`;
      try {
        const elements = await fetchCell(lat, lon);
        if (elements.length > 0) {
          const rows = elements.map(el => ({
            id:   'osm_' + el.id,
            lat:  el.lat,
            lng:  el.lon,
            tags: el.tags || {},
          }));
          await insertRows(rows);
          total += elements.length;
          console.log(`[${done}/${totalCells}] ${cell} → ${elements.length} bancs  (total: ${total})`);
        } else {
          console.log(`[${done}/${totalCells}] ${cell} → 0`);
        }
      } catch (e) {
        console.error(`[${done}/${totalCells}] ${cell} → ERREUR: ${e.message} (sera ignorée)`);
      }
      await sleep(DELAY);
    }
  }

  console.log(`\n✅ Migration terminée — ${total} bancs importés dans Supabase.`);
}

main();
