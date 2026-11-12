import { useEffect, useState } from 'react';
import { useTween } from '../render/useInView';
import type { Show } from '../topics/types';

/** 动画里 1 分钟走多久 */
const MS_PER_MIN = 110;

/** 比一比：大家跑同一段路，各按自己要花的分钟数跑到终点；滚到眼前才开跑 */
export function RaceShow({ show, seen }: { show: Extract<Show, { kind: 'race' }>; seen: boolean }) {
  const longest = Math.max(...show.items.map((it) => it.value));
  const [round, setRound] = useState(0);
  const [run, setRun] = useState(false);
  useEffect(() => { if (seen) setRun(true); }, [seen]);
  const t = useTween(run, longest * MS_PER_MIN);
  const now = t * longest;
  const again = () => { setRun(false); setRound((r) => r + 1); requestAnimationFrame(() => setRun(true)); };

  return (
    <>
      <div className="race" key={round}>
        <div className="race-ends" aria-hidden="true"><span>{show.ends[0]}</span><span>{show.ends[1]}</span></div>
        {show.items.map((it) => {
          const p = Math.min(1, now / it.value);
          const done = p >= 1;
          return (
            <div key={it.label} className={`race-lane ${done ? 'done' : ''}`}>
              <span className="race-label">{it.label}</span>
              <div className="race-track">
                <span className="race-fill" style={{ width: `${p * 100}%` }} />
                <span className="race-runner" style={{ left: `${p * 100}%` }} aria-hidden="true">{it.icon}</span>
                <span className="race-flag" aria-hidden="true">🏁</span>
              </div>
              <span className="race-time">{done ? `${it.value} 分钟` : `${Math.floor(Math.min(now, it.value))} 分`}</span>
            </div>
          );
        })}
      </div>
      <button type="button" className="btn ghost small race-again" onClick={again}>↻ 再比一次</button>
    </>
  );
}
