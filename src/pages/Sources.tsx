import type { Source } from '../topics/types';

/** map：这一页画了 OpenStreetMap 的小地图，要署名；fold：在泡泡目录页把长长的资料表收起来 */
export function Sources({ sources, map, fold }: { sources: readonly Source[]; map?: boolean; fold?: boolean }) {
  if (!sources.length && !map) return null;
  const list = (
    <ol>
      {sources.map((s) => (
        <li key={s.id} id={`src-${s.id}`}>
          <a href={s.url} target="_blank" rel="noreferrer">{s.title}</a>
          {s.by && <span> · {s.by}</span>}
        </li>
      ))}
    </ol>
  );
  return (
    <footer className="sources">
      {sources.length > 0 && (
        fold ? (
          <details className="sources-fold">
            <summary>📚 这个泡泡用到的 {sources.length} 份资料</summary>
            {list}
          </details>
        ) : (
          <>
            <h3>资料来源</h3>
            {list}
          </>
        )
      )}
      {map && <p className="map-credit">小地图数据 © <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noreferrer">OpenStreetMap</a> 贡献者</p>}
    </footer>
  );
}
