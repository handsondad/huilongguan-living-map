import { useEffect, useState, type CSSProperties } from 'react';
import { Cite } from '../render/Cite';
import { REDUCED_MOTION, SNAP } from '../render/env';
import type { Show } from '../topics/types';

/** 自己往下走时，每一格停多久 */
const STEP_MS = 2200;

/** 一把尺子：几个点排在上面，按「一个一个看」自己往后走，也能直接点 */
export function RulerShow({ show }: { show: Extract<Show, { kind: 'ruler' }> }) {
  const { marks, unit, even } = show;
  const lo = marks[0].at;
  const hi = marks[marks.length - 1].at;
  const pos = (k: number) => (even ? k / (marks.length - 1) : (marks[k].at - lo) / (hi - lo));
  const last = marks.length - 1;

  const [i, setI] = useState(SNAP ? last : 0);
  const [playing, setPlaying] = useState(false);
  useEffect(() => {
    if (!playing) return;
    if (i >= last) { setPlaying(false); return; }
    const t = setTimeout(() => setI((k) => k + 1), REDUCED_MOTION ? 0 : STEP_MS);
    return () => clearTimeout(t);
  }, [playing, i, last]);

  const go = () => {
    if (i >= last) setI(0);
    setPlaying((p) => !p || i >= last);
  };
  const m = marks[i];

  return (
    <>
      <div className={`ruler ${even ? 'even' : ''}`}>
        <div className="ruler-track"><span className="ruler-fill" style={{ width: `${pos(i) * 100}%` }} /></div>
        {even && marks.slice(1).map((b, k) => (
          <span key={b.at} className="ruler-gap" style={{ left: `${((pos(k) + pos(k + 1)) / 2) * 100}%` }}>隔 {b.at - marks[k].at} {unit}</span>
        ))}
        {marks.map((mk, k) => (
          <button key={mk.at} type="button" style={{ left: `${pos(k) * 100}%` }}
            className={`ruler-mark ${k <= i ? 'passed' : ''} ${k === i ? 'here' : ''} ${!even && k % 2 ? 'up' : ''}`}
            aria-label={`${mk.at} ${unit}：${mk.name}`} onClick={() => { setPlaying(false); setI(k); }}>
            <span className="ruler-dot" aria-hidden="true">{mk.icon}</span>
            <small>{even ? mk.at : `${mk.at} ${unit}`}</small>
          </button>
        ))}
      </div>

      <div className="ruler-ctl">
        <button type="button" className="btn small" onClick={go}>{playing ? '⏸ 停一下' : i >= last ? '↻ 从头看' : '▶ 一个一个看'}</button>
        <button type="button" className="btn ghost small" disabled={i === 0} onClick={() => { setPlaying(false); setI(i - 1); }} aria-label="上一个">‹</button>
        <button type="button" className="btn ghost small" disabled={i === last} onClick={() => { setPlaying(false); setI(i + 1); }} aria-label="下一个">›</button>
      </div>

      <div className="ride-card" key={m.at} style={{ '--i': 0 } as CSSProperties}>
        <span className="ride-card-icon" aria-hidden="true">{m.icon}</span>
        <div>
          <strong>{m.at} {unit} · {m.name}</strong>
          <p>{m.text}<Cite ids={m.cite} /></p>
        </div>
      </div>
    </>
  );
}
