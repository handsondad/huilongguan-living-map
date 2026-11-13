import { useEffect, useRef, useState } from 'react';
import { GEO } from '../map/geo';
import { useTween } from '../render/useInView';
import type { Show } from '../topics/types';

/** 示意图，只管先后顺序，不管真实远近。左腿、顶上、右腿 */
const L = 160;
const R = 350;
const TOP = 74;
const BOTTOM = 286;
const PATH_13 = `M${L} ${BOTTOM}V${TOP + 26}Q${L} ${TOP} ${L + 26} ${TOP}H${R - 26}Q${R} ${TOP} ${R} ${TOP + 26}V${BOTTOM}`;
/** 13 号线在地下的两段：西二旗—龙泽、柳芳—东直门 */
const UNDER_13 = [`M${L} 106V${TOP + 26}Q${L} ${TOP} ${L + 26} ${TOP}H207`, `M${R} 256V${BOTTOM}`];

type Stop = { name: string; x: number; y: number; side: 'l' | 'r' | 't' | 'b' };
const leg = (x: number, names: string[], side: 'l' | 'r'): Stop[] => names.map((name, k) => ({ name, x, y: BOTTOM - k * 30, side }));
const STOPS_13: Stop[] = [
  ...leg(L, ['西直门', '大钟寺', '知春路', '五道口', '上地', '清河', '西二旗'], 'l'),
  { name: '龙泽', x: 207, y: TOP, side: 'b' },
  { name: '回龙观', x: 255, y: TOP, side: 'b' },
  { name: '霍营', x: 303, y: TOP, side: 'b' },
  ...leg(R, ['东直门', '柳芳', '光熙门', '芍药居', '望京西', '北苑', '立水桥'], 'r').reverse(),
];

/** 18 号线：从西边的马连洼绕到 13 号线顶上，再往东到天通苑东；全在地下 */
const L18 = 72;
const R18 = 430;
const TOP18 = 30;
const PATH_18 = `M${L18} 176V${TOP18 + 22}Q${L18} ${TOP18} ${L18 + 22} ${TOP18}H${R18 - 22}Q${R18} ${TOP18} ${R18} ${TOP18 + 22}V150`;
const STOPS_18: Stop[] = [
  { name: '马连洼', x: L18, y: 176, side: 'l' },
  { name: '上地软件园', x: L18, y: 136, side: 'l' },
  { name: '东北旺', x: L18, y: 96, side: 'l' },
  { name: '龙泽西', x: 186, y: TOP18, side: 't' },
  { name: '回龙观西大街', x: 238, y: TOP18, side: 'b' },
  { name: '文华路', x: 290, y: TOP18, side: 't' },
  { name: '回龙观东大街', x: 342, y: TOP18, side: 'b' },
  { name: '霍营东', x: 394, y: TOP18, side: 't' },
  { name: '天通苑', x: R18, y: 80, side: 'r' },
  { name: '太平庄', x: R18, y: 115, side: 'r' },
  { name: '天通苑东', x: R18, y: 150, side: 'r' },
];

const C13 = GEO.lines.find((l) => l.ref === '13')?.colour ?? '#F9E700';
const C18 = GEO.lines.find((l) => l.ref === '18')?.colour ?? '#5554a2';
const RUN_MS = 7000;

function Label({ s, home }: { s: Stop; home?: boolean }) {
  const at = { l: [s.x - 11, s.y + 4, 'end'], r: [s.x + 11, s.y + 4, 'start'], t: [s.x, s.y - 11, 'middle'], b: [s.x, s.y + 20, 'middle'] }[s.side];
  return <text x={at[0]} y={at[1]} textAnchor={at[2] as 'end'} className={`metro-label ${home ? 'home' : ''}`}>{s.name}</text>;
}

/** 13 号线的倒 U：点「开车」看一趟车从西直门绕到东直门 */
export function MetroShow({ show }: { show: Extract<Show, { kind: 'metro' }> }) {
  const pathRef = useRef<SVGPathElement>(null);
  const [run, setRun] = useState(false);
  const [round, setRound] = useState(0);
  const t = useTween(run, RUN_MS);
  const [train, setTrain] = useState<[number, number]>([L, BOTTOM]);
  useEffect(() => {
    const p = pathRef.current;
    if (!p) return;
    const pt = p.getPointAtLength(p.getTotalLength() * t);
    setTrain([pt.x, pt.y]);
  }, [t, round]);
  const go = () => { setRun(false); setRound((r) => r + 1); requestAnimationFrame(() => setRun(true)); };
  const where = STOPS_13.reduce((best, s) => (Math.hypot(s.x - train[0], s.y - train[1]) < Math.hypot(best.x - train[0], best.y - train[1]) ? s : best));

  return (
    <>
      <svg className="metro" viewBox={`-16 0 524 ${BOTTOM + 30}`} role="img" aria-label={show.with18 ? '13 号线和 18 号线示意图' : '13 号线示意图'}>
        {show.with18 && (
          <g className="metro-18">
            <path d={PATH_18} stroke={C18} className="metro-under" />
            {STOPS_18.map((s) => (
              <g key={s.name}>
                <circle cx={s.x} cy={s.y} r="5" fill="#fff" stroke={C18} strokeWidth="2.5" />
                <Label s={s} home={s.name === '回龙观西大街' || s.name === '文华路'} />
              </g>
            ))}
          </g>
        )}
        <path ref={pathRef} d={PATH_13} stroke="#fff" strokeWidth="13" fill="none" strokeLinecap="round" />
        <path d={PATH_13} stroke={C13} strokeWidth="8" fill="none" strokeLinecap="round" />
        {UNDER_13.map((d) => <path key={d} d={d} stroke="#fff" strokeWidth="5" fill="none" strokeDasharray="2 7" strokeLinecap="round" />)}
        {STOPS_13.map((s) => (
          <g key={s.name}>
            <circle cx={s.x} cy={s.y} r={s.name === '回龙观' ? 8 : 5.5} fill="#fff" stroke="#3a3a3a" strokeWidth="2.2" />
            <Label s={s} home={s.name === '回龙观'} />
          </g>
        ))}
        <text x={(L + R) / 2} y={BOTTOM - 74} textAnchor="middle" className="metro-mid">13 号线</text>
        <text x={(L + R) / 2} y={BOTTOM - 50} textAnchor="middle" className="metro-mid small">像一个倒过来的 U</text>
        <g transform={`translate(${train[0]} ${train[1]})`} className="metro-train" aria-hidden="true">
          <circle r="13" fill={C13} stroke="#fff" strokeWidth="3" />
          <text y="5" textAnchor="middle">🚈</text>
        </g>
      </svg>
      <div className="metro-ctl">
        <button type="button" className="btn small" onClick={go}>{run && t < 1 ? '🚈 开着呢…' : t >= 1 ? '↻ 再开一趟' : '▶ 开车！'}</button>
        <p className="metro-read" aria-live="polite">{t > 0 ? <>到 <b>{where.name}</b> 了</> : '从西直门出发'}</p>
      </div>
      <p className="tide-note">
        <span className="metro-key solid" style={{ background: C13 }} />地面和高架
        {show.with18
          ? <span className="metro-key dots" style={{ color: C18 }} />
          : <span className="metro-key tunnel-13" style={{ background: C13 }} />}在地下
        · 示意图只画了站的先后，不是真的远近。
      </p>
    </>
  );
}
