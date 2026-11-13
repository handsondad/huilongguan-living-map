import type { CSSProperties } from 'react';
import { useInView } from '../render/useInView';
import type { Show } from '../topics/types';
import { BarsShow } from './BarsShow';
import { MetroShow } from './MetroShow';
import { RaceShow } from './RaceShow';
import { RampShow } from './RampShow';
import { RideShow } from './RideShow';
import { RulerShow } from './RulerShow';
import { StationsShow } from './StationsShow';
import { StreetsShow } from './StreetsShow';
import { TideShow } from './TideShow';
import { WhoShow } from './WhoShow';

type Of<K extends Show['kind']> = Extract<Show, { kind: K }>;

/** 每行几张卡：凑成整行，别剩一张孤零零的 */
const cols = (n: number) => (n % 3 === 0 ? 3 : n === 4 || n === 2 ? 2 : Math.min(n, 4));

/** 配在爸爸回答下面的图解或互动；滚到眼前才开始动 */
export function ShowView({ show }: { show: Show }) {
  const [ref, seen] = useInView<HTMLDivElement>(0.15);
  return (
    <div ref={ref} className={`qa-show show-${show.kind} ${seen ? 'in' : ''}`}>
      <Body show={show} seen={seen} />
    </div>
  );
}

function Body({ show, seen }: { show: Show; seen: boolean }) {
  switch (show.kind) {
    case 'steps': return <Steps show={show} />;
    case 'ride': return <RideShow show={show} />;
    case 'numbers': return <Numbers show={show} />;
    case 'race': return <RaceShow show={show} seen={seen} />;
    case 'who': return <WhoShow show={show} />;
    case 'tide': return <TideShow />;
    case 'ramp': return <RampShow />;
    case 'list': return <List show={show} />;
    case 'ruler': return <RulerShow show={show} />;
    case 'bars': return <BarsShow show={show} />;
    case 'streets': return <StreetsShow show={show} />;
    case 'metro': return <MetroShow show={show} />;
    case 'stations': return <StationsShow show={show} />;
  }
}

function Steps({ show }: { show: Of<'steps'> }) {
  return (
    <ol className="qa-steps" aria-label="图解">
      {show.frames.map((f, i) => (
        <li key={f.label} style={{ '--i': i } as CSSProperties}>
          <span aria-hidden="true">{f.icon}</span>
          <small>{f.label}</small>
        </li>
      ))}
    </ol>
  );
}

function Numbers({ show }: { show: Of<'numbers'> }) {
  return (
    <ul className="numbers" data-count={show.items.length} style={{ '--cols': cols(show.items.length) } as CSSProperties}>
      {show.items.map((it, i) => (
        <li key={it.label} style={{ '--i': i } as CSSProperties}>
          <strong>{it.value}<small>{it.unit}</small></strong>
          <span>{it.label}</span>
        </li>
      ))}
    </ul>
  );
}

function List({ show }: { show: Of<'list'> }) {
  return (
    <ul className="tick-list">
      {show.items.map((it, i) => (
        <li key={it.text} style={{ '--i': i } as CSSProperties}><span className="tick-icon" aria-hidden="true">{it.icon}</span>{it.text}</li>
      ))}
    </ul>
  );
}
