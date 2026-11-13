import { useEffect, useState } from 'react';
import { REDUCED_MOTION, SNAP } from '../render/env';

const W = 640;
const ROAD = { x0: 14, x1: 626, lanes: [64, 108, 152], h: 44 };
/** 中间的红色车道：0 点到 12 点往西（上地），12 点到 24 点往东（回龙观） */
const westward = (h: number) => h < 12;
/** 早上去上地、傍晚回回龙观的人多，只是画个示意 */
const toWest = (h: number) => Math.exp(-(((h - 8) / 1.7) ** 2));
const toEast = (h: number) => Math.exp(-(((h - 18) / 1.9) ** 2));
const TONES = ['#ff9f43', '#4d96ff', '#a66cff', '#ff6bd6', '#3dbb5a', '#ffb703'];

const hhmm = (h: number) => `${String(Math.floor(h) % 24).padStart(2, '0')}:${String(Math.round((h % 1) * 60)).padStart(2, '0')}`;

function Rider({ x, y, dir, tone }: { x: number; y: number; dir: 1 | -1; tone: string }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${dir} 1)`}>
      <circle cx="-8" cy="6" r="6" fill="#fff" stroke="#5d4e37" strokeWidth="2" />
      <circle cx="9" cy="6" r="6" fill="#fff" stroke="#5d4e37" strokeWidth="2" />
      <path d="M-8 6 L-1 -3 L9 6 M-1 -3 L5 -3 M-3 -7 L1 -7" fill="none" stroke={tone} strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M-1 -8 L3 -17" stroke={tone} strokeWidth="5" strokeLinecap="round" />
      <circle cx="4.5" cy="-21" r="4.2" fill="#ffd7b5" stroke="#5d4e37" strokeWidth="1.4" />
    </g>
  );
}

/** 一条车道上的车：n 辆等距排开，按时间往 dir 方向挪 */
function lane(n: number, y: number, dir: 1 | -1, t: number, seed: number) {
  const span = ROAD.x1 - ROAD.x0 + 60;
  return Array.from({ length: n }, (_, i) => {
    const base = (i / n) * span + seed * 37;
    const x = ROAD.x0 - 30 + ((((base + dir * t * 70) % span) + span) % span);
    return <Rider key={`${seed}-${i}`} x={x} y={y + 30} dir={dir} tone={TONES[(i + seed) % TONES.length]} />;
  });
}

function Arrow({ x, y, dir }: { x: number; y: number; dir: 1 | -1 }) {
  return <path d={`M${x - dir * 12} ${y - 7} L${x + dir * 4} ${y} L${x - dir * 12} ${y + 7}`} fill="none" stroke="#fff" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" opacity="0.9" />;
}

/** 拨一拨钟：中间的红色车道到了 12 点会掉头 */
export function TideShow() {
  const [hour, setHour] = useState(8);
  const [t, setT] = useState(0);
  useEffect(() => {
    if (SNAP || REDUCED_MOTION) return;
    let raf = 0;
    const start = performance.now();
    const tick = (now: number) => { setT((now - start) / 1000); raf = requestAnimationFrame(tick); };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  const west = westward(hour);
  const wN = Math.round(1 + 4 * toWest(hour));
  const eN = Math.round(1 + 4 * toEast(hour));
  const midN = Math.round(4 * (west ? toWest(hour) : toEast(hour)));
  const midDir = west ? -1 : 1;
  const [top, mid, bot] = ROAD.lanes;

  return (
    <>
      <div className="tide-ends" aria-hidden="true"><span>← 往上地</span><span>往回龙观 →</span></div>
      <svg className="tide-road" viewBox={`0 0 ${W} 232`} role="img"
        aria-label={`${hhmm(hour)}，中间的红色车道往${west ? '上地' : '回龙观'}方向开`}>
        <defs>
          <clipPath id="tide-lanes">
            <rect x={ROAD.x0} y={top - 28} width={ROAD.x1 - ROAD.x0} height={ROAD.h * 3 + 36} />
          </clipPath>
        </defs>
        <rect x={ROAD.x0 - 6} y={top - 8} width={ROAD.x1 - ROAD.x0 + 12} height={ROAD.h * 3 + 16} rx="16" fill="#e9dcc4" />
        <rect x={ROAD.x0} y={top} width={ROAD.x1 - ROAD.x0} height={ROAD.h} fill="#6bcb77" />
        <rect x={ROAD.x0} y={mid} width={ROAD.x1 - ROAD.x0} height={ROAD.h} fill="#ff6b6b" />
        <rect x={ROAD.x0} y={bot} width={ROAD.x1 - ROAD.x0} height={ROAD.h} fill="#6bcb77" />
        <path d={`M${ROAD.x0} ${mid} H${ROAD.x1} M${ROAD.x0} ${bot} H${ROAD.x1}`} stroke="#fff" strokeWidth="3" strokeDasharray="16 12" />
        {[110, 320, 530].map((x) => (
          <g key={x}>
            <Arrow x={x} y={top + ROAD.h / 2} dir={-1} />
            <g className="tide-mid-arrow" style={{ transformOrigin: `${x}px ${mid + ROAD.h / 2}px`, rotate: west ? '0deg' : '180deg' }}>
              <Arrow x={x} y={mid + ROAD.h / 2} dir={-1} />
            </g>
            <Arrow x={x} y={bot + ROAD.h / 2} dir={1} />
          </g>
        ))}
        <g clipPath="url(#tide-lanes)">
          {lane(wN, top, -1, t, 1)}
          {lane(midN, mid, midDir, t, 3)}
          {lane(eN, bot, 1, t, 5)}
        </g>
        <rect x="312" y={top - 22} width="16" height={ROAD.h * 3 + 44} rx="6" fill="#8c7b62" opacity="0.85" />
        <text x="320" y={top - 28} textAnchor="middle" className="tide-gantry-label">龙门架</text>
      </svg>

      <div className="tide-signs">
        <Sign who="往上地骑的人" lights={[{ lane: '自己这边', ok: true }, { lane: '红色车道', ok: west }]} dir="←" />
        <Sign who="往回龙观骑的人" lights={[{ lane: '红色车道', ok: !west }, { lane: '自己这边', ok: true }]} dir="→" />
      </div>

      <div className="tide-clock">
        <Clock hour={hour} />
        <div className="tide-dial">
          <p className="tide-now" aria-live="polite">
            <b>{hhmm(hour)}</b> {hour >= 6 && hour < 18 ? '☀️' : '🌙'} 红色车道往<b className={west ? 'go-west' : 'go-east'}>{west ? '上地' : '回龙观'}</b>开
          </p>
          <input type="range" min={0} max={23.75} step={0.25} value={hour} onChange={(e) => setHour(Number(e.target.value))} aria-label="拨时间" />
          <div className="tide-day" aria-hidden="true">
            <span className="am">0 点 – 12 点：往上地</span><span className="pm">12 点 – 24 点：往回龙观</span>
            <i style={{ left: `${(hour / 24) * 100}%` }} />
          </div>
          <div className="tide-presets">
            <button type="button" className="btn ghost small" onClick={() => setHour(8)}>🌅 早上 8 点</button>
            <button type="button" className="btn ghost small" onClick={() => setHour(11.75)}>🕚 11:45</button>
            <button type="button" className="btn ghost small" onClick={() => setHour(12.25)}>🕛 12:15</button>
            <button type="button" className="btn ghost small" onClick={() => setHour(18)}>🌇 傍晚 6 点</button>
          </div>
        </div>
      </div>
      <p className="tide-note">路上小车子的多少只是画个样子，不是真的数出来的。</p>
    </>
  );
}

function Sign({ who, lights, dir }: { who: string; lights: readonly { lane: string; ok: boolean }[]; dir: string }) {
  return (
    <div className="tide-sign">
      <small>{who}（{dir}）在龙门架上看到</small>
      <div className="tide-lights">
        {lights.map((l) => (
          <span key={l.lane} className={l.ok ? 'light ok' : 'light no'}>
            <b aria-hidden="true">{l.ok ? '↓' : '✕'}</b>
            <small>{l.lane}{l.ok ? '：能走' : '：不能走'}</small>
          </span>
        ))}
      </div>
    </div>
  );
}

function Clock({ hour }: { hour: number }) {
  const h = ((hour % 12) / 12) * 360;
  const m = (hour % 1) * 360;
  return (
    <svg className="clock" viewBox="-50 -50 100 100" aria-hidden="true">
      <circle r="46" fill="#fff" stroke="var(--c)" strokeWidth="5" />
      {Array.from({ length: 12 }, (_, i) => (
        <circle key={i} cx={Math.sin((i / 12) * Math.PI * 2) * 37} cy={-Math.cos((i / 12) * Math.PI * 2) * 37} r={i % 3 === 0 ? 3.2 : 1.8} fill="#cbb89a" />
      ))}
      <line y2="-24" stroke="#5d4e37" strokeWidth="6" strokeLinecap="round" style={{ rotate: `${h}deg` }} className="clock-hand" />
      <line y2="-35" stroke="#ff9f43" strokeWidth="3.5" strokeLinecap="round" style={{ rotate: `${m}deg` }} className="clock-hand" />
      <circle r="5" fill="#5d4e37" />
    </svg>
  );
}
