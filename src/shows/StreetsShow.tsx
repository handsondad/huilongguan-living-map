import { useState, type CSSProperties } from 'react';
import { GEO } from '../map/geo';
import { AREA_TONE, LABEL_AT, MapArt } from '../map/MapArt';
import { Cite } from '../render/Cite';
import type { Show } from '../topics/types';

const OURS = GEO.areas.filter((a) => a.ours);

function bbox(d: string) {
  const n = (d.match(/-?\d+(?:\.\d+)?/g) ?? []).map(Number);
  const xs = n.filter((_, i) => i % 2 === 0);
  const ys = n.filter((_, i) => i % 2 === 1);
  return { x0: Math.min(...xs), y0: Math.min(...ys), x1: Math.max(...xs), y1: Math.max(...ys) };
}

const PAD = 18;
const CROP = (() => {
  const b = OURS.map((a) => bbox(a.d));
  const x0 = Math.min(...b.map((v) => v.x0)) - PAD;
  const y0 = Math.min(...b.map((v) => v.y0)) - PAD;
  return { x: x0, y: y0, w: Math.max(...b.map((v) => v.x1)) + PAD - x0, h: Math.max(...b.map((v) => v.y1)) + PAD - y0 };
})();
const VIEW = `${CROP.x} ${CROP.y} ${CROP.w} ${CROP.h}`;
const G6 = GEO.roads.filter((r) => r.name === '京藏高速').map((r) => r.d).join('');
const LINE13 = GEO.lines.find((l) => l.ref === '13');

/** 三个街道：点名字（或点地图上那一块）看它，别的两块变淡；分界用的京藏高速和 13 号线描粗 */
export function StreetsShow({ show }: { show: Extract<Show, { kind: 'streets' }> }) {
  const [pick, setPick] = useState(show.items[0].name);
  const item = show.items.find((it) => it.name === pick) ?? show.items[0];
  const tone = AREA_TONE[pick];

  return (
    <>
      <div className="streets-pick" role="group" aria-label="选一个街道">
        {show.items.map((it) => (
          <button key={it.name} type="button" aria-pressed={it.name === pick} onClick={() => setPick(it.name)}
            style={{ '--c': AREA_TONE[it.name]?.edge, '--f': AREA_TONE[it.name]?.fill } as CSSProperties}>
            {it.name}
          </button>
        ))}
      </div>

      <div className="streets-map" style={{ aspectRatio: `${CROP.w} / ${CROP.h}` }}>
        <MapArt viewBox={VIEW} moving={false} className="streets-art" />
        <svg className="streets-over" viewBox={VIEW}>
          {OURS.map((a) => (
            <path key={a.name} d={a.d} className={`streets-area ${a.name === pick ? 'on' : ''}`}
              style={{ '--c': AREA_TONE[a.name]?.edge } as CSSProperties} onClick={() => setPick(a.name)}>
              <title>{a.name}</title>
            </path>
          ))}
          <path d={G6} className="streets-edge g6" />
          {LINE13 && <path d={LINE13.ride} className="streets-edge l13" />}
          {OURS.map((a) => {
            const [x, y] = LABEL_AT[a.name] ?? a.label ?? [0, 0];
            return <text key={a.name} x={x} y={y} className={`streets-name ${a.name === pick ? 'on' : ''}`} textAnchor="middle" fill={AREA_TONE[a.name]?.edge}>{a.name}</text>;
          })}
        </svg>
      </div>
      <p className="streets-key" aria-hidden="true"><span className="k g6" />京藏高速（G6）<span className="k l13" />13 号线</p>

      <div className="ride-card streets-card" key={pick} style={{ '--i': 0, '--c': tone?.edge, '--f': tone?.fill } as CSSProperties}>
        <span className="streets-swatch" aria-hidden="true" />
        <div>
          <strong>{item.name}</strong>
          <p>{item.text}<Cite ids={item.cite} /></p>
        </div>
      </div>
    </>
  );
}
