import data from './geo.json';

/** tools/osm.mjs 生成的地图数据，别手改；要更新就跑 npm run osm */
export const GEO = data;
export const { w: MAP_W, h: MAP_H } = data.view;

/** 经纬度 → 地图上的 SVG 坐标（1 单位 = 10 米） */
export function project(lat: number, lon: number): [number, number] {
  const v = data.view;
  return [(lon - v.west) * v.kx, (v.north - lat) * v.ky];
}

export const metersToUnits = (m: number) => m / data.view.unit;

/** 一条 "M x y L x y …" 折线：总长，和沿线走 len 之后到了哪儿 */
export function polyline(d: string) {
  const pts = d.split(/[ML]/).filter((s) => s.trim()).map((s) => s.trim().split(/\s+/).map(Number) as [number, number]);
  const cum = [0];
  for (let i = 1; i < pts.length; i++) cum.push(cum[i - 1] + Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]));
  const total = cum[cum.length - 1];
  const at = (len: number): [number, number] => {
    const l = Math.max(0, Math.min(total, len));
    let i = 1;
    while (i < pts.length - 1 && cum[i] < l) i++;
    const seg = cum[i] - cum[i - 1] || 1;
    const t = (l - cum[i - 1]) / seg;
    return [pts[i - 1][0] + (pts[i][0] - pts[i - 1][0]) * t, pts[i - 1][1] + (pts[i][1] - pts[i - 1][1]) * t];
  };
  return { total, at };
}
