import { GEO, metersToUnits, project } from '../map/geo';
import { MapArt } from '../map/MapArt';
import type { Anchor } from '../topics/types';

/** 以泡泡钉的地方为中心裁一块（地图单位） */
const CROP = { w: 420, h: 280 };

/** 贴在页头的一张小地图，标出泡泡钉在哪儿；飘着的泡泡讲的是整片地区，就给全图 */
export function Locator({ anchor: a, home }: { anchor: Anchor; home?: boolean }) {
  const [x, y] = project(a.lat, a.lon);
  const [fx0, fy0, fx1, fy1] = GEO.focus;
  const r = a.kind === 'area' ? metersToUnits(a.radius) : 0;
  const w = a.kind === 'area' ? Math.max(CROP.w, Math.min(840, r * 2.6)) : CROP.w;
  const h = (w * CROP.h) / CROP.w;
  const box = a.kind === 'sky'
    ? `${fx0} ${fy0} ${fx1 - fx0} ${fy1 - fy0}`
    : `${x - w / 2} ${y - h / 2} ${w} ${h}`;
  const wide = a.kind === 'sky' || w > 600;
  return (
    <figure className="locator">
      <span className="tape" aria-hidden="true" />
      <div className={wide ? 'locator-frame' : 'locator-frame close'}>
        <MapArt viewBox={box} moving={false} className="locator-art" />
        {a.kind === 'pin' && <span className="locator-pin" aria-hidden="true" />}
        {a.kind === 'area' && home && <span className="locator-area" aria-hidden="true" style={{ width: `${(r * 2 * 100) / w}%` }} />}
      </div>
      <figcaption>📍 {a.place}{a.kind === 'pin' && a.approx && '（大致位置）'}{a.kind === 'area' && home && '（只画一个大概的圈）'}</figcaption>
    </figure>
  );
}
