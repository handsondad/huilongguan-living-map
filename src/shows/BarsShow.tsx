import type { CSSProperties } from 'react';
import type { Show } from '../topics/types';

/** 比长短：滚到眼前，条一根一根长出来 */
export function BarsShow({ show }: { show: Extract<Show, { kind: 'bars' }> }) {
  const max = Math.max(...show.items.map((it) => it.value));
  return (
    <ul className="bars">
      {show.items.map((it, i) => (
        <li key={it.label} style={{ '--i': i, '--w': `${(it.value / max) * 100}%` } as CSSProperties}>
          <span className="bars-label"><span aria-hidden="true">{it.icon}</span>{it.label}</span>
          <span className="bars-track"><span className="bars-fill" /></span>
          <b>{it.text ?? `${it.value} ${show.unit}`}</b>
        </li>
      ))}
    </ul>
  );
}
