import type { Source } from '../topics/types';

/** map：这一页画了 OpenStreetMap 的小地图，要署名 */
export function Sources({ sources, map }: { sources: readonly Source[]; map?: boolean }) {
  if (!sources.length && !map) return null;
  return (
    <footer className="sources">
      {sources.length > 0 && (
        <>
          <h3>资料来源</h3>
          <ol>
            {sources.map((s) => (
              <li key={s.id} id={`src-${s.id}`}>
                <a href={s.url} target="_blank" rel="noreferrer">{s.title}</a>
                {s.by && <span> · {s.by}</span>}
              </li>
            ))}
          </ol>
        </>
      )}
      {map && <p className="map-credit">小地图数据 © <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noreferrer">OpenStreetMap</a> 贡献者</p>}
    </footer>
  );
}
