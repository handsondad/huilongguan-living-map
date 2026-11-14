import { useState, type CSSProperties } from 'react';
import type { Show } from '../topics/types';

/** 先猜再翻：点一张卡，看它能不能进来 */
export function WhoShow({ show }: { show: Extract<Show, { kind: 'who' }> }) {
  const [open, setOpen] = useState<ReadonlySet<number>>(new Set());
  const all = open.size === show.items.length;
  return (
    <>
      <p className="who-ask">{show.ask}</p>
      <ul className="who-grid">
        {show.items.map((it, i) => {
          const shown = open.has(i);
          return (
            <li key={it.name} style={{ '--i': i } as CSSProperties}>
              <button type="button" className={`who-card ${shown ? (it.ok ? 'is-ok' : 'is-no') : ''}`} aria-pressed={shown}
                onClick={() => setOpen((s) => new Set(s).add(i))}>
                <span className="who-icon" aria-hidden="true">{it.icon}</span>
                <strong>{it.name}</strong>
                {shown
                  ? <span className="who-verdict"><b>{it.ok ? '✓ 可以' : '✗ 不行'}</b>{it.why}</span>
                  : <span className="who-guess">可以吗？点一下</span>}
              </button>
            </li>
          );
        })}
      </ul>
      <p className={`who-sum ${all ? 'in' : ''}`} aria-live="polite">
        {all ? show.sum : `还有 ${show.items.length - open.size} 张没翻`}
      </p>
    </>
  );
}
