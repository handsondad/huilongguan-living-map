import { useState } from 'react';
import { useTween } from '../render/useInView';

const GROUND = 292;
const DECK = 92;
/** 梯道从 A 爬到 B，凹槽就贴着台阶的边 */
const A = { x: 92, y: GROUND };
const B = { x: 430, y: DECK };
const STEPS = 12;
const ANGLE = Math.atan2(B.y - A.y, B.x - A.x);

const MODES = {
  up: {
    label: '⬆️ 上桥',
    start: '把车轮放进凹槽',
    steps: ['推到梯道底下，对准凹槽', '把前轮放进凹槽，传送带自己就转起来', '两只手扶着车把，跟着走就行，不用使劲推', '到桥上啦，把车推出来再骑'],
    ms: 5200,
  },
  down: {
    label: '⬇️ 下桥',
    start: '把车轮放进下坡的凹槽',
    steps: ['在桥上推到梯道口', '把车轮放进下坡的凹槽', '凹槽里的阻力装置轻轻拉着车轮，车不会越走越快', '到地面了，推出来再骑'],
    ms: 6400,
  },
} as const;

const ease = (t: number) => (t < 0.5 ? 2 * t * t : 1 - (-2 * t + 2) ** 2 / 2);

/** 凹槽上离 A 点 s（0–1）的位置 */
const onSlope = (s: number) => ({ x: A.x + (B.x - A.x) * s, y: A.y + (B.y - A.y) * s });

/** 推车上下桥：凹槽里的传送带把车轮送上去，下坡时阻力装置拉住它 */
export function RampShow() {
  const [mode, setMode] = useState<keyof typeof MODES>('up');
  const [run, setRun] = useState(false);
  const m = MODES[mode];
  const t = useTween(run, m.ms);
  const p = ease(t);
  const s = mode === 'up' ? p : 1 - p;
  const step = !run ? 0 : t < 0.08 ? 1 : t < 1 ? 2 : 3;
  const pick = (next: keyof typeof MODES) => { setMode(next); setRun(false); };

  // 还没开始时人和车停在梯道外面的平地上
  const idle = !run;
  const bike = idle
    ? (mode === 'up' ? { x: A.x - 46, y: GROUND, a: 0 } : { x: B.x + 50, y: DECK, a: 0 })
    : { ...onSlope(s), a: (ANGLE * 180) / Math.PI };
  const belt = (mode === 'up' ? -1 : 1) * t * m.ms * (mode === 'up' ? 0.09 : 0.04);

  return (
    <>
      <div className="ramp-modes" role="group" aria-label="上桥还是下桥">
        {(Object.keys(MODES) as (keyof typeof MODES)[]).map((k) => (
          <button key={k} type="button" className={`ramp-mode ${k === mode ? 'on' : ''}`} aria-pressed={k === mode} onClick={() => pick(k)}>{MODES[k].label}</button>
        ))}
      </div>

      <svg className="ramp-art" viewBox="0 0 640 330" role="img" aria-label={mode === 'up' ? '推着自行车，车轮放在凹槽里被传送带送上桥' : '推着自行车下桥，凹槽拉住车轮'}>
        <defs>
          <linearGradient id="ramp-sky" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#e6f4ff" />
            <stop offset="1" stopColor="#fff8f0" />
          </linearGradient>
        </defs>
        <rect width="640" height="330" rx="18" fill="url(#ramp-sky)" />
        <rect y={GROUND} width="640" height={330 - GROUND} fill="#b4e69c" />
        <rect y={GROUND} width="640" height="6" fill="#7fd06b" />

        <g className="ramp-bridge">
          <rect x="470" y={DECK + 16} width="18" height={GROUND - DECK - 16} rx="4" fill="#c9b8a0" />
          <rect x="590" y={DECK + 16} width="18" height={GROUND - DECK - 16} rx="4" fill="#c9b8a0" />
          <rect x={B.x - 4} y={DECK} width={644 - B.x} height="18" rx="6" fill="#f3e6cf" stroke="#d8c3a2" strokeWidth="2" />
          <rect x={B.x + 2} y={DECK - 4} width={640 - B.x} height="6" rx="3" fill="#ff6b6b" />
          <path d={`M${B.x + 6} ${DECK - 34} H640`} stroke="#bfa985" strokeWidth="3" />
          {Array.from({ length: 9 }, (_, i) => <path key={i} d={`M${B.x + 14 + i * 24} ${DECK - 34} V${DECK - 4}`} stroke="#bfa985" strokeWidth="2.4" />)}
        </g>

        <path className="ramp-stairs" fill="#f3e6cf" stroke="#d8c3a2" strokeWidth="2" strokeLinejoin="round"
          d={`M${A.x} ${GROUND} ${Array.from({ length: STEPS }, (_, i) => {
            const x = A.x + ((B.x - A.x) / STEPS) * i;
            const y = A.y - ((A.y - B.y) / STEPS) * (i + 1);
            return `V${y} H${x + (B.x - A.x) / STEPS}`;
          }).join(' ')} V${GROUND} Z`} />

        <line x1={A.x} y1={A.y - 4} x2={B.x} y2={B.y - 4} stroke="#5d4e37" strokeWidth="12" strokeLinecap="round" />
        <line x1={A.x} y1={A.y - 4} x2={B.x} y2={B.y - 4} stroke="#8a7a62" strokeWidth="6" strokeLinecap="round" strokeDasharray="6 8" strokeDashoffset={belt} className={run && t < 1 ? 'belt on' : 'belt'} />

        <g className="ramp-height">
          <path d={`M26 ${GROUND - 4} V${DECK + 4}`} stroke="#a8977a" strokeWidth="2" strokeDasharray="4 4" />
          <path d={`M20 ${DECK + 12} L26 ${DECK + 2} L32 ${DECK + 12} M20 ${GROUND - 12} L26 ${GROUND - 2} L32 ${GROUND - 12}`} fill="none" stroke="#a8977a" strokeWidth="2" />
          <text x="40" y={(GROUND + DECK) / 2} className="ramp-height-label">约 5～6 米</text>
        </g>

        <g transform={`translate(${bike.x} ${bike.y - 4}) rotate(${bike.a}) scale(${mode === 'up' ? 1 : -1} 1)`}>
          <Walker phase={run ? (t * m.ms) / 180 : 0} tilt={mode === 'up' ? -bike.a : bike.a} />
          <Bike />
        </g>

        {mode === 'down' && run && t < 1 && (
          <g transform={`translate(${onSlope(s).x} ${onSlope(s).y - 4}) rotate(${(ANGLE * 180) / Math.PI})`} className="ramp-brake">
            <text x="-52" y="30" className="ramp-tag">慢慢来～</text>
          </g>
        )}
      </svg>

      <div className="ramp-ctl">
        <button type="button" className="btn small" onClick={() => setRun((r) => !r)} disabled={run && t < 1}>
          {!run ? `👉 ${m.start}` : t < 1 ? '🚲 走着呢…' : '↻ 再来一次'}
        </button>
      </div>
      <ol className="ramp-steps">
        {m.steps.map((txt, i) => <li key={txt} className={i < step ? 'done' : i === step ? 'now' : ''}>{txt}</li>)}
      </ol>
      <p className="tide-note">为了看得清，画里的台阶比真的少，人和车也画大了一点。</p>
    </>
  );
}

/** 车轮压在凹槽上：原点是两个轮子着地的中点 */
function Bike() {
  return (
    <g>
      <circle cx="-22" cy="-16" r="16" fill="none" stroke="#5d4e37" strokeWidth="3.4" />
      <circle cx="22" cy="-16" r="16" fill="none" stroke="#5d4e37" strokeWidth="3.4" />
      <circle cx="-22" cy="-16" r="2.5" fill="#5d4e37" />
      <circle cx="22" cy="-16" r="2.5" fill="#5d4e37" />
      <path d="M-22 -16 L-6 -16 L12 -36 L-12 -36 Z M-6 -16 L-14 -42 M22 -16 L14 -44" fill="none" stroke="#ff6b6b" strokeWidth="4" strokeLinejoin="round" strokeLinecap="round" />
      <path d="M-20 -43 H-8" stroke="#5d4e37" strokeWidth="5" strokeLinecap="round" />
      <path d="M10 -46 L18 -44 L20 -48" fill="none" stroke="#5d4e37" strokeWidth="3.4" strokeLinecap="round" strokeLinejoin="round" />
    </g>
  );
}

/** 走在车旁边扶着车把的人：腿随 phase 前后摆 */
function Walker({ phase, tilt }: { phase: number; tilt: number }) {
  const swing = Math.sin(phase) * 10;
  return (
    <g transform={`translate(-6 0) rotate(${tilt})`}>
      <path d={`M0 -36 L${-6 + swing} -2 M0 -36 L${6 - swing} -2`} stroke="#4d96ff" strokeWidth="7" strokeLinecap="round" />
      <path d="M0 -38 L2 -72" stroke="#ffb703" strokeWidth="16" strokeLinecap="round" />
      <path d="M2 -66 L22 -60" stroke="#ffd7b5" strokeWidth="5" strokeLinecap="round" />
      <circle cx="4" cy="-88" r="11" fill="#ffd7b5" stroke="#5d4e37" strokeWidth="2" />
      <path d="M-7 -92 Q4 -104 15 -92" fill="#5d4e37" />
    </g>
  );
}
