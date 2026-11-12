import { createContext, useContext } from 'react';
import type { Source } from '../topics/types';

export const SourcesContext = createContext<readonly Source[]>([]);

/** 正文里的引用角标：点一下滚到页底的资料来源 */
export function Cite({ ids }: { ids?: readonly string[] }) {
  const sources = useContext(SourcesContext);
  if (!ids?.length) return null;
  return (
    <>
      {ids.map((id) => {
        const n = sources.findIndex((s) => s.id === id) + 1;
        if (!n) return null;
        return (
          <button key={id} type="button" className="cite" aria-label={`资料 ${n}`}
            onClick={() => document.getElementById(`src-${id}`)?.scrollIntoView({ behavior: 'smooth', block: 'center' })}>
            {n}
          </button>
        );
      })}
    </>
  );
}
