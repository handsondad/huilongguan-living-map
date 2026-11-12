// 从 OpenStreetMap 抓回龙观的边界、道路、轨道、绿地和水系，算成首页卡通地图用的 SVG 数据，写进 src/map/geo.json。
// 数据 © OpenStreetMap contributors，ODbL 1.0：页面上必须显示署名。
//
//   npm run osm            缺哪份缓存就抓哪份，然后重新生成 geo.json
//   npm run osm -- --fresh 全部重新抓
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";

const CACHE = new URL("./.cache/osm/", import.meta.url);
const OUT = new URL("../src/map/geo.json", import.meta.url);

/** 首页地图看到的范围 */
const VIEW = { west: 116.2, east: 116.43, south: 40.038, north: 40.142 };
/** 1 个 SVG 单位 = 10 米 */
const UNIT = 10;
const BBOX = "40.034,116.196,40.146,116.434";

const OURS = { 20233755: "回龙观街道", 20233754: "龙泽园街道", 20233756: "史各庄街道" };
const NEIGHBORS = {
  20233753: "霍营街道", 20233749: "东小口镇", 20233748: "沙河镇", 18250342: "西三旗街道",
  18250343: "清河街道", 18250338: "西北旺镇", 20233746: "北七家镇", 18250344: "上地街道",
};

const QUERIES = {
  bounds: `[out:json][timeout:120];relation(id:${[...Object.keys(OURS), ...Object.keys(NEIGHBORS)].join(",")});out geom;`,
  roads: `[out:json][timeout:120];(way["highway"~"^(motorway|trunk|primary|secondary)$"](${BBOX});way["highway"="cycleway"]["name"](${BBOX}););out tags geom;`,
  rail: `[out:json][timeout:120];(way["railway"~"^(subway|rail|light_rail)$"](${BBOX});node["railway"="station"](${BBOX}););out tags geom;relation["route"="subway"](${BBOX});out geom(${BBOX});`,
  green: `[out:json][timeout:120];(way["leisure"="park"](${BBOX});way["landuse"="forest"](${BBOX});way["natural"~"^(water|wood)$"](${BBOX});way["waterway"~"^(river|canal|stream)$"](${BBOX}););out tags geom;(relation["leisure"="park"](${BBOX});relation["natural"="water"](${BBOX}););out geom(${BBOX});`,
  homes: `[out:json][timeout:120];way["landuse"="residential"](${BBOX});out tags geom;`,
};

const SERVERS = [
  "https://overpass-api.de/api/interpreter",
  "https://maps.mail.ru/osm/tools/overpass/api/interpreter",
  "https://overpass.kumi.systems/api/interpreter",
];

async function overpass(query) {
  for (let round = 0; round < 5; round++) {
    for (const url of SERVERS) {
      try {
        const res = await fetch(url, {
          method: "POST",
          headers: { "content-type": "application/x-www-form-urlencoded", "user-agent": "huilongguan-living-map (github.com/handsondad)" },
          body: "data=" + encodeURIComponent(query),
          signal: AbortSignal.timeout(150_000),
        });
        const text = await res.text();
        if (res.ok && text.startsWith("{")) return text;
        console.warn(`  ${url} → ${res.status}`);
      } catch (e) {
        console.warn(`  ${url} → ${e.name}`);
      }
    }
    // Overpass 忙的时候会拒绝请求，隔一会儿再试
    await new Promise((r) => setTimeout(r, 20_000 * (round + 1)));
  }
  throw new Error("Overpass 一直没响应，过一会儿再跑");
}

async function load(name, fresh) {
  const file = new URL(`${name}.json`, CACHE);
  if (fresh || !existsSync(file)) {
    console.log(`抓 ${name} …`);
    mkdirSync(CACHE, { recursive: true });
    writeFileSync(file, await overpass(QUERIES[name]));
  }
  return JSON.parse(readFileSync(file, "utf8")).elements;
}

// ── 投影：等距圆柱，在地图中线的纬度上把经度压扁 ──
const LAT0 = ((VIEW.south + VIEW.north) / 2) * (Math.PI / 180);
const KX = (111320 * Math.cos(LAT0)) / UNIT;
const KY = 111034 / UNIT;
const W = Math.round((VIEW.east - VIEW.west) * KX);
const H = Math.round((VIEW.north - VIEW.south) * KY);
const project = (p) => [(p.lon - VIEW.west) * KX, (VIEW.north - p.lat) * KY];
const inView = ([x, y], pad = 40) => x > -pad && y > -pad && x < W + pad && y < H + pad;

const r1 = (n) => Math.round(n * 10) / 10;

function simplify(pts, tol) {
  if (pts.length < 3) return pts;
  const keep = new Uint8Array(pts.length);
  keep[0] = keep[pts.length - 1] = 1;
  const stack = [[0, pts.length - 1]];
  while (stack.length) {
    const [a, b] = stack.pop();
    const [ax, ay] = pts[a], [bx, by] = pts[b];
    const len = Math.hypot(bx - ax, by - ay) || 1;
    let far = -1, at = -1;
    for (let i = a + 1; i < b; i++) {
      const d = Math.abs((bx - ax) * (ay - pts[i][1]) - (ax - pts[i][0]) * (by - ay)) / len;
      if (d > far) { far = d; at = i; }
    }
    if (far > tol) { keep[at] = 1; stack.push([a, at], [at, b]); }
  }
  return pts.filter((_, i) => keep[i]);
}

/** 闭合环首尾是同一个点，直接简化会退化成两个点：先从离起点最远的地方切成两半 */
function simplifyRing(pts, tol) {
  let far = 0, at = 0;
  pts.forEach(([x, y], i) => {
    const d = Math.hypot(x - pts[0][0], y - pts[0][1]);
    if (d > far) { far = d; at = i; }
  });
  if (!at) return pts;
  return [...simplify(pts.slice(0, at + 1), tol), ...simplify(pts.slice(at), tol).slice(1)];
}

const toD = (lines, close = false) =>
  lines.map((l) => "M" + l.map(([x, y]) => `${r1(x)} ${r1(y)}`).join("L") + (close ? "Z" : "")).join("");

/** 把首尾相接的线段连成长线 */
function stitch(lines) {
  const key = (p) => `${p.lat.toFixed(7)},${p.lon.toFixed(7)}`;
  const pool = lines.filter((l) => l.length > 1).map((l) => [...l]);
  const out = [];
  while (pool.length) {
    let cur = pool.pop();
    for (let grown = true; grown;) {
      grown = false;
      for (let i = 0; i < pool.length; i++) {
        const l = pool[i];
        const a = key(cur[0]), b = key(cur[cur.length - 1]), c = key(l[0]), d = key(l[l.length - 1]);
        if (b === c) cur = cur.concat(l.slice(1));
        else if (b === d) cur = cur.concat([...l].reverse().slice(1));
        else if (a === d) cur = l.concat(cur.slice(1));
        else if (a === c) cur = [...l].reverse().concat(cur.slice(1));
        else continue;
        pool.splice(i, 1);
        grown = true;
        break;
      }
    }
    out.push(cur);
  }
  return out;
}

/** out geom(bbox) 会把框外的点写成 null，在那里断开 */
function pieces(geometry) {
  const out = [[]];
  for (const p of geometry ?? []) {
    if (p) out[out.length - 1].push(p);
    else if (out[out.length - 1].length) out.push([]);
  }
  return out.filter((l) => l.length > 1);
}

const projectLine = (l, tol) => simplify(l.map(project), tol);
const lengthOf = (pts) => pts.reduce((s, p, i) => (i ? s + Math.hypot(p[0] - pts[i - 1][0], p[1] - pts[i - 1][1]) : 0), 0);
const areaOf = (pts) => Math.abs(pts.reduce((s, [x, y], i) => {
  const [x2, y2] = pts[(i + 1) % pts.length];
  return s + x * y2 - x2 * y;
}, 0)) / 2;

function inside([x, y], ring) {
  let hit = false;
  for (let i = 0, j = ring.length - 1; i < ring.length; j = i++) {
    const [xi, yi] = ring[i], [xj, yj] = ring[j];
    if (yi > y !== yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi) hit = !hit;
  }
  return hit;
}

function distToLine([x, y], pts) {
  let best = Infinity;
  for (let i = 1; i < pts.length; i++) {
    const [ax, ay] = pts[i - 1], [bx, by] = pts[i];
    const dx = bx - ax, dy = by - ay;
    const t = Math.max(0, Math.min(1, ((x - ax) * dx + (y - ay) * dy) / (dx * dx + dy * dy || 1)));
    best = Math.min(best, Math.hypot(x - ax - t * dx, y - ay - t * dy));
  }
  return best;
}

/** 固定种子的伪随机：每次生成的小房子、小树位置都一样，diff 才看得懂 */
function rng(seed) {
  let s = seed;
  return () => ((s = (s * 1664525 + 1013904223) >>> 0) / 2 ** 32);
}

/** 多边形里离边最远的格点：放地名标签 */
function labelPoint(ring) {
  const xs = ring.map((p) => p[0]), ys = ring.map((p) => p[1]);
  let best = null, far = -1;
  for (let x = Math.min(...xs); x < Math.max(...xs); x += 6) {
    for (let y = Math.min(...ys); y < Math.max(...ys); y += 6) {
      if (!inside([x, y], ring)) continue;
      const d = distToLine([x, y], [...ring, ring[0]]);
      if (d > far) { far = d; best = [r1(x), r1(y)]; }
    }
  }
  return best;
}

// ─────────────────────────────────────────────────────────────
const fresh = process.argv.includes("--fresh");
const raw = {};
for (const name of Object.keys(QUERIES)) raw[name] = await load(name, fresh);

// 街道：外环连成闭合多边形
const ringsOf = (rel) => stitch(rel.members.filter((m) => m.type === "way" && m.role !== "inner").flatMap((m) => pieces(m.geometry)))
  .map((l) => simplifyRing(l.map(project), 1.5))
  .filter((l) => l.length > 3);

const areas = raw.bounds.map((rel) => {
  const ours = OURS[rel.id];
  const rings = ringsOf(rel);
  const main = rings.reduce((a, b) => (areaOf(b) > areaOf(a) ? b : a));
  return {
    name: ours ?? NEIGHBORS[rel.id],
    ours: Boolean(ours),
    d: toD(rings, true),
    label: labelPoint(main),
    rings,
  };
});
const ourRings = areas.filter((a) => a.ours).flatMap((a) => a.rings);
const ourPts = ourRings.flat();
const focus = [
  Math.min(...ourPts.map((p) => p[0])), Math.min(...ourPts.map((p) => p[1])),
  Math.max(...ourPts.map((p) => p[0])), Math.max(...ourPts.map((p) => p[1])),
].map(Math.round);

// 道路：同名同级连起来；辅路和无名路不画，画了太乱
const ROAD_CLASS = { motorway: "motorway", trunk: "trunk", primary: "primary", secondary: "secondary" };
const roadGroups = new Map();
const cycleWays = [];
for (const w of raw.roads) {
  const name = w.tags.name;
  if (w.tags.highway === "cycleway") {
    if (name === "回龙观-上地自行车专用路") cycleWays.push(w.geometry);
    continue;
  }
  if (!name || name.includes("辅路")) continue;
  const cls = ROAD_CLASS[w.tags.highway];
  if (!cls) continue;
  const key = `${cls}|${name}`;
  if (!roadGroups.has(key)) roadGroups.set(key, []);
  roadGroups.get(key).push(w.geometry);
}
const roads = [];
for (const [key, ways] of roadGroups) {
  const [cls, name] = key.split("|");
  const lines = stitch(ways).map((l) => projectLine(l, 1.2)).filter((l) => l.some((p) => inView(p)));
  if (!lines.length) continue;
  const longest = lines.reduce((a, b) => (lengthOf(b) > lengthOf(a) ? b : a));
  // 路名沿着这条线写；从右往左的线字会倒过来，先掉个头
  const label = longest[0][0] > longest[longest.length - 1][0] ? [...longest].reverse() : longest;
  roads.push({ name, cls, d: toD(lines), length: Math.round(lines.reduce((s, l) => s + lengthOf(l), 0)), label: toD([label]) });
}
roads.sort((a, b) => ["secondary", "primary", "trunk", "motorway"].indexOf(a.cls) - ["secondary", "primary", "trunk", "motorway"].indexOf(b.cls));

const cycleLines = stitch(cycleWays).map((l) => projectLine(l, 1)).filter((l) => l.some((p) => inView(p)));
const cycleway = {
  name: "回龙观-上地自行车专用路",
  d: toD(cycleLines),
  ride: toD([cycleLines.reduce((a, b) => (lengthOf(b) > lengthOf(a) ? b : a))]),
};

// 地铁：按线路关系取几何，地下段和地上段分开画
const wayTags = new Map(raw.rail.filter((e) => e.type === "way").map((w) => [w.id, w.tags]));
const LINE_NAME = { 8: "8号线", 13: "13号线", 18: "18号线", 27: "昌平线", 16: "16号线" };
const metro = new Map();
for (const rel of raw.rail.filter((e) => e.type === "relation")) {
  const ref = rel.tags.ref;
  if (!metro.has(ref)) metro.set(ref, { ref, name: LINE_NAME[ref] ?? rel.tags.name, colour: rel.tags.colour, ways: new Map() });
  for (const m of rel.members) if (m.type === "way" && m.geometry) metro.get(ref).ways.set(m.ref, m.geometry);
}
const lines = [];
for (const line of metro.values()) {
  const under = [], over = [];
  for (const [id, geometry] of line.ways) {
    const t = wayTags.get(id) ?? {};
    (t.tunnel && t.tunnel !== "no" ? under : over).push(...pieces(geometry));
  }
  const draw = (ws) => stitch(ws).map((l) => projectLine(l, 1.2)).filter((l) => l.some((p) => inView(p, 0)));
  const u = draw(under), o = draw(over);
  if (!u.length && !o.length) continue;
  const all = draw([...under, ...over]);
  lines.push({
    ref: line.ref, name: line.name, colour: line.colour,
    under: toD(u), over: toD(o),
    ride: toD([all.reduce((a, b) => (lengthOf(b) > lengthOf(a) ? b : a))]),
    pts: all,
  });
}
lines.sort((a, b) => Number(a.ref) - Number(b.ref));

// 火车：地上的干线铁路，画成细细的枕木线
const trains = stitch(raw.rail
  .filter((e) => e.type === "way" && e.tags.railway === "rail" && !e.tags.service && !(e.tags.tunnel && e.tags.tunnel !== "no"))
  .map((w) => w.geometry))
  .map((l) => projectLine(l, 1.2))
  .filter((l) => l.some((p) => inView(p)) && lengthOf(l) > 30);

// 车站：同名的合成一个，挨着哪几条线就算哪几条线的站
const byName = new Map();
for (const n of raw.rail.filter((e) => e.type === "node" && e.tags.name)) {
  if (!byName.has(n.tags.name)) byName.set(n.tags.name, []);
  byName.get(n.tags.name).push(project(n));
}
const stations = [];
for (const [name, pts] of byName) {
  const p = [pts.reduce((s, q) => s + q[0], 0) / pts.length, pts.reduce((s, q) => s + q[1], 0) / pts.length];
  if (!inView(p, -10)) continue;
  const on = lines.filter((l) => l.pts.some((seg) => distToLine(p, seg) < 25)).map((l) => l.ref);
  if (!on.length) continue;
  stations.push({ name, x: r1(p[0]), y: r1(p[1]), lines: on });
}
for (const l of lines) delete l.pts;

// 绿地和水
const polys = (e) => (e.type === "way" ? [e.geometry] : stitch(e.members.filter((m) => m.type === "way" && m.role !== "inner").flatMap((m) => pieces(m.geometry))))
  .map((l) => simplifyRing(l.map(project), 1))
  .filter((l) => l.length > 3);

const parks = [];
const water = [];
const rivers = [];
for (const e of raw.green) {
  const t = e.tags ?? {};
  if (t.waterway) {
    const ls = pieces(e.geometry).map((l) => projectLine(l, 1.2)).filter((l) => l.some((p) => inView(p)));
    if (ls.length) rivers.push({ name: t.name ?? "", kind: t.waterway, lines: ls });
    continue;
  }
  for (const ring of polys(e)) {
    if (!ring.some((p) => inView(p))) continue;
    const a = areaOf(ring);
    if (t.natural === "water") { if (a > 30) water.push(toD([ring], true)); continue; }
    const isPark = t.leisure === "park";
    // 公园 ≥ 2 公顷、林地 ≥ 5 公顷才画（1 平方单位 = 100 平方米）
    if (a < (isPark ? 200 : 500)) continue;
    parks.push({ name: isPark ? t.name ?? "" : "", kind: isPark ? "park" : "wood", ring, a });
  }
}
const riverOut = [];
const riverGroups = new Map();
for (const r of rivers) {
  const key = `${r.kind}|${r.name}`;
  if (!riverGroups.has(key)) riverGroups.set(key, []);
  riverGroups.get(key).push(...r.lines);
}
for (const [key, ls] of riverGroups) {
  const [kind, name] = key.split("|");
  if (kind === "stream" && !name) continue;
  riverOut.push({ name, kind, d: toD(ls) });
}

// 小树：公园里撒一些；小房子：只放在真实的居住区里
const rand = rng(20261112);
const trees = [];
for (const p of parks) {
  const xs = p.ring.map((q) => q[0]), ys = p.ring.map((q) => q[1]);
  const step = p.kind === "park" ? 13 : 17;
  for (let x = Math.min(...xs); x < Math.max(...xs); x += step) {
    for (let y = Math.min(...ys); y < Math.max(...ys); y += step) {
      const q = [x + (rand() - 0.5) * step * 0.8, y + (rand() - 0.5) * step * 0.8];
      if (inView(q, 0) && inside(q, p.ring) && rand() < 0.75) trees.push([r1(q[0]), r1(q[1]), Math.floor(rand() * 3)]);
    }
  }
}

const bigRoads = roads.filter((r) => r.cls !== "secondary").flatMap((r) => r.d.split("M").filter(Boolean).map((s) => s.split("L").map((pt) => pt.split(" ").map(Number))));
const railPts = [...trains, ...lines.flatMap((l) => (l.over + l.under).split("M").filter(Boolean).map((s) => s.split("L").map((pt) => pt.split(" ").map(Number))))];
const homeRings = raw.homes.map((w) => w.geometry.map(project)).filter((r) => r.length > 3 && areaOf(r) > 60);
const houses = [];
for (let x = 8; x < W - 8; x += 24) {
  for (let y = 8; y < H - 8; y += 21) {
    const q = [x + (rand() - 0.5) * 12, y + (rand() - 0.5) * 10];
    const home = homeRings.find((r) => inside(q, r));
    if (!home) continue;
    if (parks.some((p) => inside(q, p.ring))) continue;
    if (bigRoads.some((l) => distToLine(q, l) < 9) || railPts.some((l) => distToLine(q, l) < 7)) continue;
    const ours = ourRings.some((r) => inside(q, r));
    if (!ours && rand() < 0.55) continue;
    houses.push([r1(q[0]), r1(q[1]), Math.floor(rand() * 4)]);
  }
}
houses.sort((a, b) => a[1] - b[1]);

const parkOut = parks
  .sort((a, b) => b.a - a.a)
  .map((p) => ({ name: p.name, kind: p.kind, d: toD([p.ring], true), label: p.name && p.a > 400 ? labelPoint(p.ring) : null }));

const geo = {
  attribution: "© OpenStreetMap contributors",
  fetchedAt: new Date().toISOString().slice(0, 10),
  view: { ...VIEW, unit: UNIT, kx: KX, ky: KY, w: W, h: H },
  /** 三个街道合起来的外框：首页一打开就框住它 */
  focus,
  areas: areas.map(({ rings, ...a }) => a),
  parks: parkOut,
  water,
  rivers: riverOut,
  roads,
  trains: toD(trains),
  cycleway,
  lines,
  stations,
  trees,
  houses,
};
writeFileSync(OUT, JSON.stringify(geo));
const kb = (JSON.stringify(geo).length / 1024).toFixed(0);
console.log(`geo.json ${kb} KB · ${W}×${H} · ${areas.length} 块区域 · ${roads.length} 条路 · ${lines.length} 条地铁 · ${stations.length} 个站 · ${parkOut.length} 块绿地 · ${trees.length} 棵树 · ${houses.length} 栋小楼`);
