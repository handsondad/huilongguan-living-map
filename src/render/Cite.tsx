import { createContext, useContext } from 'react';
import type { Source } from '../topics/types';

export const SourcesContext = createContext<readonly Source[]>([]);

let litTimer = 0;
function jumpToSource(id: string) {
  const el = document.getElementById(`src-${id}`);
  if (!el) return;
  document.querySelectorAll('.sources li.is-lit').forEach((n) => n.classList.remove('is-lit'));
  el.classList.add('is-lit');
  el.scrollIntoView({ behavior: 'smooth', block: 'center' });
  window.clearTimeout(litTimer);
  litTimer = window.setTimeout(() => el.classList.remove('is-lit'), 2400);
}

/** 正文里的引用角标：指上去看出处标题，点一下滚到页底的资料来源并亮一下 */
export function Cite({ ids }: { ids?: readonly string[] }) {
  const sources = useContext(SourcesContext);
  if (!ids?.length) return null;
  return (
    <>
      {ids.map((id) => {
        const idx = sources.findIndex((s) => s.id === id);
        if (idx < 0) return null;
        const n = idx + 1;
        const src = sources[idx];
        const tip = `${n}. ${src.title}${src.by ? ` · ${src.by}` : ''}`;
        return (
          <button key={id} type="button" className="cite" aria-label={`资料 ${n}：${src.title}`} title={tip}
            onClick={() => jumpToSource(id)}>
            {n}
          </button>
        );
      })}
    </>
  );
}
