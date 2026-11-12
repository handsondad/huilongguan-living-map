import type { CSSProperties } from 'react';
import { categoryOf } from '../topics/categories';
import type { Topic } from '../topics/types';

/** 泡泡底下那根小棍默认多长（像素） */
export const STEM = 40;

/** 泡泡挤在一起时，往旁边或上面挪多少（像素）；钉子永远在真实的位置 */
export type Lean = { readonly ox: number; readonly lift: number };

type Props = {
  readonly topic: Topic;
  readonly x: number;
  readonly y: number;
  readonly lean: Lean;
  /** 第几个冒出来，决定先后 */
  readonly order: number;
  /** 刚从这个泡泡里回来，让它亮一下 */
  readonly on: boolean;
  readonly off: boolean;
  readonly onPick: () => void;
};

/** 地图上的一个泡泡：钉子钉在 (x, y)，小棍斜着拉到泡泡；讲整片地区的泡泡飘在天上，没有小棍 */
export function Bubble({ topic, x, y, lean, order, on, off, onPick }: Props) {
  const cat = categoryOf(topic.category);
  const sky = topic.anchor.kind === 'sky';
  const n = topic.articles.length;
  const len = sky ? 0 : STEM + lean.lift;
  const style = { left: x, top: y, '--c': cat.color, '--i': order, '--ox': `${lean.ox}px`, '--len': `${len}px` } as CSSProperties;
  return (
    <button type="button" className={`bubble ${sky ? 'is-sky' : ''} ${off ? 'is-off' : ''}`} style={style}
      data-on={on || undefined} aria-label={`${topic.title}（${cat.name}，${n} 个问题）`} tabIndex={off ? -1 : 0} onClick={onPick}>
      {!sky && <Stem ox={lean.ox} len={len} />}
      {!sky && <span className="bubble-peg" aria-hidden="true" />}
      <span className="bubble-fly">
        <span className="bubble-body" aria-hidden="true">{topic.emoji}</span>
        <span className="bubble-tag">{topic.short}<b>{n}</b></span>
      </span>
    </button>
  );
}

/** 从钉子 (0, 0) 拉到泡泡底下 (ox, -len) 的一根软棍 */
function Stem({ ox, len }: { ox: number; len: number }) {
  const left = Math.min(0, ox) - 6;
  const w = Math.abs(ox) + 12;
  const x0 = -left, x1 = ox - left;
  return (
    <svg className="bubble-stem" style={{ left, width: w, height: len }} viewBox={`0 0 ${w} ${len}`} aria-hidden="true">
      <path d={`M${x0} ${len}C${x0} ${len * 0.55} ${x1} ${len * 0.5} ${x1} 0`} />
    </svg>
  );
}

/** 「我家」：一座小房子坐在 (x, y)，头顶冒一句话。点它就是小念问我家这一片的问题 */
export function HomeMarker({ topic, x, y, on, onPick }: { topic: Topic; x: number; y: number; on: boolean; onPick: () => void }) {
  const n = topic.articles.length;
  return (
    <button type="button" className="home-marker" style={{ left: x, top: y } as CSSProperties} data-on={on || undefined}
      aria-label={`我家住在回龙观：${topic.title}（${n} 个问题）`} onClick={onPick}>
      <span className="home-say">
        <strong>我家住在回龙观</strong>
        <small>点小房子，看看我家这一片</small>
      </span>
      <svg className="home-house" viewBox="0 0 96 84" aria-hidden="true">
        <ellipse cx="48" cy="80" rx="40" ry="4.5" fill="#000" opacity="0.1" />
        <rect x="66" y="12" width="10" height="22" rx="3" fill="#c98a5a" />
        <rect x="18" y="38" width="60" height="42" rx="8" fill="#fffaf0" stroke="#e8b98a" strokeWidth="3" />
        <path d="M10 44 L48 10 L86 44" fill="#ff7b6b" stroke="#ff7b6b" strokeWidth="9" strokeLinejoin="round" strokeLinecap="round" />
        <path d="M20 40 L48 16" stroke="#ffb3a8" strokeWidth="3.5" strokeLinecap="round" />
        <rect x="40" y="54" width="16" height="26" rx="6" fill="#ffb347" />
        <circle cx="52" cy="68" r="1.8" fill="#a0601e" />
        <rect x="24" y="50" width="12" height="11" rx="3" fill="#bfe3ff" stroke="#8cc8f5" strokeWidth="2" />
        <rect x="60" y="50" width="12" height="11" rx="3" fill="#bfe3ff" stroke="#8cc8f5" strokeWidth="2" />
        <path d="M80 70c4-6 10-6 12 0" fill="#5cc46a" />
        <path d="M4 72c4-7 11-7 13 0" fill="#5cc46a" />
      </svg>
    </button>
  );
}
