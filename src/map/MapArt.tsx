import { memo } from 'react';
import { GEO, MAP_H, MAP_W, project } from './geo';

/** 我们的三个街道各一种糖果色 */
export const AREA_TONE: Record<string, { fill: string; edge: string }> = {
  回龙观街道: { fill: '#ffe4c8', edge: '#ff9f43' },
  龙泽园街道: { fill: '#daf5d3', edge: '#4fc464' },
  史各庄街道: { fill: '#dcebff', edge: '#4d96ff' },
};

/** 街道名默认写在区域中间；中间要是正好有泡泡或「我家」的小房子，就挪到空一点的地方 */
export const LABEL_AT: Record<string, readonly [number, number]> = {
  龙泽园街道: project(40.07915, 116.30869),
  回龙观街道: project(40.06024, 116.29871),
};

/** 地图外面那一圈的底色，首页的背景也用它，地图拖到边上时接得上 */
export const LAND = '#fbf3e3';

/** 要在路上写名字的路 */
const NAMED_ROADS = new Set(['京藏高速', '京新高速', '北清路', '回龙观东大街', '回龙观西大街', '同成街', '育知东路', '科星路', '黄平路', '定泗路', '龙域中街', '回南北路']);
/** 同名的路可能分好几级（主路一段、次路一段），名字只写在最长的那段上 */
const LABELLED = [...GEO.roads.filter((r) => NAMED_ROADS.has(r.name)).reduce((m, r) => {
  if ((m.get(r.name)?.length ?? 0) < r.length) m.set(r.name, r);
  return m;
}, new Map<string, (typeof GEO.roads)[number]>()).values()];

const ROAD_STYLE = {
  motorway: { casing: '#f5a742', fill: '#ffd56b', w: 11 },
  trunk: { casing: '#f5b75a', fill: '#ffe592', w: 9 },
  primary: { casing: '#ecd3ab', fill: '#ffffff', w: 7 },
  secondary: { casing: '#f0e0c4', fill: '#ffffff', w: 4.5 },
} as const;

/** 小楼：墙、屋顶、高度；尖顶的是矮房子 */
const HOUSES = [
  { roof: '#ff8a7a', tall: 16, peak: false },
  { roof: '#6fb1ff', tall: 13, peak: false },
  { roof: '#ffc14d', tall: 10, peak: true },
  { roof: '#7fd18b', tall: 18, peak: false },
  { roof: '#c39bff', tall: 9, peak: true },
];

/** 首页卡通地图：只管画，不管拖动和泡泡。viewBox 可以裁一块用在文章页的小地图上 */
export const MapArt = memo(function MapArt({ viewBox, moving = true, className, names = LABEL_AT }: {
  viewBox?: string; moving?: boolean; className?: string;
  /** 街道名写在哪儿；首页地图跟着泡泡挪，别处用固定的位置 */
  names?: Record<string, readonly [number, number]>;
}) {
  const line13 = GEO.lines.find((l) => l.ref === '13');
  return (
    <svg className={className ?? 'map-art'} viewBox={viewBox ?? `0 0 ${MAP_W} ${MAP_H}`} role="img" aria-label="回龙观地区卡通地图" preserveAspectRatio="xMidYMid slice">
      <defs>
        <pattern id="paper-dots" width="22" height="22" patternUnits="userSpaceOnUse">
          <circle cx="4" cy="4" r="1.3" fill="#f1e4c8" />
          <circle cx="15" cy="15" r="1.3" fill="#f1e4c8" />
        </pattern>
        <filter id="lift" x="-5%" y="-5%" width="110%" height="110%">
          <feDropShadow dx="0" dy="5" stdDeviation="4" floodColor="#d08a52" floodOpacity="0.22" />
        </filter>
        <symbol id="tree-0" viewBox="-6 -12 12 14" overflow="visible">
          <ellipse cy="1" rx="4" ry="1.4" fill="#000" opacity="0.08" />
          <rect x="-1" y="-3" width="2" height="4" rx="1" fill="#b9875a" />
          <circle r="4.8" cy="-6" fill="#5cc46a" />
          <circle r="1.8" cx="-1.6" cy="-7.6" fill="#a5e995" />
        </symbol>
        <symbol id="tree-1" viewBox="-6 -12 12 14" overflow="visible">
          <ellipse cy="1" rx="3.6" ry="1.3" fill="#000" opacity="0.08" />
          <rect x="-1" y="-2.6" width="2" height="3.6" rx="1" fill="#b9875a" />
          <path d="M0 -12.5 L4.6 -6 H-4.6 Z M0 -9 L5.4 -2 H-5.4 Z" fill="#3fae5a" strokeLinejoin="round" stroke="#3fae5a" strokeWidth="1.2" />
          <path d="M0 -12 L1.8 -9.4 L-1.2 -8.6 Z" fill="#8fdc7f" />
        </symbol>
        <symbol id="tree-2" viewBox="-6 -12 12 14" overflow="visible">
          <ellipse cy="1" rx="4.6" ry="1.4" fill="#000" opacity="0.08" />
          <circle r="3.6" cx="-2" cy="-3" fill="#4fb862" />
          <circle r="4" cx="1.8" cy="-4" fill="#72d07c" />
          <circle r="1.4" cx="0.6" cy="-5.6" fill="#b4f0a6" />
        </symbol>
        {HOUSES.map((h, i) => (
          <symbol key={i} id={`house-${i}`} viewBox="-8 -24 16 26" overflow="visible">
            <ellipse cy="1" rx="7.5" ry="1.8" fill="#000" opacity="0.07" />
            <rect x="-6" y={-h.tall} width="12" height={h.tall} rx="2.4" fill="#fffdf8" stroke="#e2c9a4" strokeWidth="0.9" />
            {h.peak
              ? <path d={`M-7.6 ${-h.tall + 0.6} L0 ${-h.tall - 6} L7.6 ${-h.tall + 0.6} Z`} fill={h.roof} stroke={h.roof} strokeWidth="1.4" strokeLinejoin="round" />
              : <rect x="-7" y={-h.tall - 3} width="14" height="4.4" rx="2.2" fill={h.roof} />}
            {Array.from({ length: Math.max(1, Math.floor((h.tall - 4) / 4.4)) }, (_, r) => (
              <g key={r} fill="#bfe3ff">
                <rect x="-3.8" y={-h.tall + 2.6 + r * 4.4} width="2.8" height="2.4" rx="0.9" />
                <rect x="1" y={-h.tall + 2.6 + r * 4.4} width="2.8" height="2.4" rx="0.9" />
              </g>
            ))}
            <rect x="-1.4" y="-3.4" width="2.8" height="3.4" rx="1" fill={h.roof} />
          </symbol>
        ))}
        {line13 && <path id="ride-13" d={line13.ride} />}
        <path id="ride-bike" d={GEO.cycleway.ride} />
        {LABELLED.map((r) => <path key={r.name} id={`road-${r.name}`} d={r.label} />)}
      </defs>

      <rect width={MAP_W} height={MAP_H} fill={LAND} />
      <rect width={MAP_W} height={MAP_H} fill="url(#paper-dots)" />

      <g className="layer-areas">
        {GEO.areas.filter((a) => !a.ours).map((a) => <path key={a.name} d={a.d} fill="#f7eedb" stroke="#ecdcbd" strokeWidth="2.5" strokeLinejoin="round" />)}
        <g filter="url(#lift)">
          {GEO.areas.filter((a) => a.ours).map((a) => (
            <path key={a.name} d={a.d} fill={AREA_TONE[a.name]?.fill} stroke="#fff" strokeWidth="11" strokeLinejoin="round" />
          ))}
        </g>
        {GEO.areas.filter((a) => a.ours).map((a) => (
          <path key={a.name} d={a.d} fill="none" stroke={AREA_TONE[a.name]?.edge} strokeOpacity="0.75" strokeWidth="3" strokeLinejoin="round" />
        ))}
      </g>

      <g className="layer-green">
        {GEO.parks.map((p, i) => (
          <path key={i} d={p.d} fill={p.kind === 'park' ? '#b4e69c' : '#c8edb2'} stroke={p.kind === 'park' ? '#7fd06b' : '#a3dc8c'} strokeWidth="2.4" strokeLinejoin="round" />
        ))}
        {GEO.water.map((d, i) => <path key={i} d={d} fill="#a8e0ff" stroke="#5fbfff" strokeWidth="2" strokeLinejoin="round" />)}
        {GEO.rivers.map((r) => (
          <g key={r.kind + r.name} fill="none" strokeLinecap="round" strokeLinejoin="round">
            <path d={r.d} stroke="#6cc8ff" strokeWidth={r.kind === 'river' ? 8 : 6} />
            <path d={r.d} stroke="#c2ecff" strokeWidth={r.kind === 'river' ? 3.5 : 2.4} />
          </g>
        ))}
      </g>

      <g className="layer-rail" fill="none">
        <path d={GEO.trains} stroke="#b7a68a" strokeWidth="4" strokeLinecap="round" />
        <path d={GEO.trains} stroke="#fff" strokeWidth="1.8" strokeDasharray="5 5" />
      </g>

      <g className="layer-roads" fill="none" strokeLinecap="round" strokeLinejoin="round">
        {GEO.roads.map((r) => <path key={r.name + r.cls} d={r.d} stroke={ROAD_STYLE[r.cls as keyof typeof ROAD_STYLE].casing} strokeWidth={ROAD_STYLE[r.cls as keyof typeof ROAD_STYLE].w + 3} />)}
        {GEO.roads.map((r) => <path key={r.name + r.cls} d={r.d} stroke={ROAD_STYLE[r.cls as keyof typeof ROAD_STYLE].fill} strokeWidth={ROAD_STYLE[r.cls as keyof typeof ROAD_STYLE].w} />)}
      </g>

      <g className="layer-metro" fill="none" strokeLinecap="round" strokeLinejoin="round">
        {GEO.lines.map((l) => (
          <g key={l.ref}>
            {l.under && <path d={l.under} stroke={l.colour} strokeWidth="4" strokeDasharray="1 7" opacity="0.9" />}
            {l.over && <path d={l.over} stroke="#fff" strokeWidth="9.5" />}
            {l.over && <path d={l.over} stroke={l.colour} strokeWidth="6" />}
          </g>
        ))}
      </g>

      {/* 自行车专用路紧贴着 13 号线，画在地铁上面才看得见 */}
      <g className="layer-cycleway" fill="none" strokeLinecap="round" strokeLinejoin="round">
        <path d={GEO.cycleway.d} stroke="#fff" strokeWidth="8.5" />
        <path d={GEO.cycleway.d} stroke="#ff6b6b" strokeWidth="5.5" />
        <path d={GEO.cycleway.d} stroke="#fff" strokeWidth="1.2" strokeDasharray="4 5" />
      </g>

      <g className="layer-trees">
        {GEO.trees.map(([x, y, v], i) => <use key={i} href={`#tree-${v}`} x={x - 6} y={y - 12} width="12" height="14" />)}
      </g>

      {/* 真实的小区只拿来决定小楼放哪儿，隔一栋画一栋，免得挤成一片 */}
      <g className="layer-houses">
        {GEO.houses.filter((_, i) => i % 2 === 0).map(([x, y, v], i) => (
          <use key={i} href={`#house-${(v + i) % HOUSES.length}`} x={x - 8} y={y - 24} width="16" height="26" />
        ))}
      </g>

      <g className="layer-stations">
        {GEO.stations.map((s) => (
          <g key={s.name} className="station" transform={`translate(${s.x} ${s.y})`}>
            {s.lines.length > 1
              ? <rect x="-8" y="-6" width="16" height="12" rx="6" fill="#fff" stroke="#5d4e37" strokeWidth="2.4" />
              : <circle r="5.6" fill="#fff" stroke="#5d4e37" strokeWidth="2.4" />}
            <text className="station-label" y="-11" textAnchor="middle">{s.name}</text>
          </g>
        ))}
      </g>

      {moving && (
        <g className="layer-moving" aria-hidden="true">
          {line13 && (
            <g>
              <rect x="-12" y="-5.5" width="24" height="11" rx="5.5" fill="#ffe66d" stroke="#e0a800" strokeWidth="1.8" />
              <rect x="-8" y="-2.8" width="4.2" height="3.6" rx="1.2" fill="#7cc8ff" />
              <rect x="-2.1" y="-2.8" width="4.2" height="3.6" rx="1.2" fill="#7cc8ff" />
              <rect x="3.8" y="-2.8" width="4.2" height="3.6" rx="1.2" fill="#7cc8ff" />
              <animateMotion dur="34s" repeatCount="indefinite" rotate="auto" keyPoints="0;1;0" keyTimes="0;0.5;1" calcMode="linear"><mpath href="#ride-13" /></animateMotion>
            </g>
          )}
          <g>
            <circle r="5.2" fill="#fff" stroke="#ff6b6b" strokeWidth="1.8" />
            <text y="3" textAnchor="middle" fontSize="7.5">🚲</text>
            <animateMotion dur="24s" repeatCount="indefinite" keyPoints="0;1;0" keyTimes="0;0.5;1" calcMode="linear"><mpath href="#ride-bike" /></animateMotion>
          </g>
        </g>
      )}

      <g className="layer-labels">
        {LABELLED.map((r) => (
          <text key={r.name} className={`road-label road-${r.cls}`} dy="3.4">
            <textPath href={`#road-${r.name}`} startOffset="50%" textAnchor="middle">{r.name}</textPath>
          </text>
        ))}
        {GEO.parks.filter((p) => p.label).map((p, i) => (
          <text key={i} className="park-label" x={p.label![0]} y={p.label![1]} textAnchor="middle">{p.name}</text>
        ))}
        {GEO.areas.filter((a) => !a.ours && a.label).map((a) => (
          <text key={a.name} className="area-label neighbor" x={a.label![0]} y={a.label![1]} textAnchor="middle">{a.name}</text>
        ))}
        {GEO.areas.filter((a) => a.ours && a.label).map((a) => {
          const [x, y] = names[a.name] ?? a.label!;
          return <text key={a.name} className="area-label ours" x={x} y={y} textAnchor="middle" fill={AREA_TONE[a.name]?.edge}>{a.name}</text>;
        })}
      </g>
    </svg>
  );
});
