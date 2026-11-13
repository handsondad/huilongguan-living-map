import { useMemo, type CSSProperties, type ReactNode } from 'react';
import { Avatar, CHARACTER_NAMES, type CharacterId } from '../render/Avatar';
import { Cite, SourcesContext } from '../render/Cite';
import { ShowView } from '../shows/ShowView';
import { categoryOf } from '../topics/categories';
import type { Article, Source, Topic, Turn } from '../topics/types';
import { Sources } from './Sources';

/** 用了 OSM 地图的图解，页尾要写地图数据的出处 */
const MAP_SHOWS = new Set(['ride', 'streets', 'stations']);

function turnCites(turn: Turn): readonly string[] {
  const s = turn.show;
  const inner = s?.kind === 'ride' ? s.stops : s?.kind === 'ruler' ? s.marks : s?.kind === 'streets' || s?.kind === 'stations' ? s.items : [];
  return [...(turn.cite ?? []), ...inner.flatMap((x) => x.cite ?? [])];
}

/** 只挑这篇问答实际引到的资料，按正文里出现的先后编号 1, 2, 3… */
function articleSources(topic: Topic, article: Article): readonly Source[] {
  const byId = new Map(topic.sources.map((s) => [s.id, s]));
  const seen = new Set<string>();
  const out: Source[] = [];
  for (const turn of article.dialogue ?? []) {
    for (const id of turnCites(turn)) {
      if (seen.has(id)) continue;
      seen.add(id);
      const src = byId.get(id);
      if (src) out.push(src);
    }
  }
  return out;
}

function Line({ who, i, children }: { who: CharacterId; i: number; children: ReactNode }) {
  return (
    <div className={`qa-line is-${who}`} style={{ '--i': i } as CSSProperties}>
      <span className="qa-avatar"><Avatar who={who} /></span>
      <div className="qa-bubble">
        <span className="qa-name"><span className="qa-face" aria-hidden="true"><Avatar who={who} /></span>{CHARACTER_NAMES[who]}</span>
        {children}
      </div>
    </div>
  );
}

/** 泡泡里的一个问题：小念问，爸爸答，一路问到弄懂 */
export function ArticlePage({ topic, article }: { topic: Topic; article: Article }) {
  const cat = categoryOf(topic.category);
  const i = topic.articles.indexOf(article);
  const prev = topic.articles[i - 1];
  const next = topic.articles[i + 1];
  const list = `#/topic/${topic.id}`;
  const more = topic.articles.filter((a) => a !== article);
  const sources = useMemo(() => articleSources(topic, article), [topic, article]);

  return (
    <div className="app article" style={{ '--c': cat.color } as CSSProperties}>
      <nav className="topbar">
        <a className="btn ghost" href={list}>← {topic.emoji} {topic.short}</a>
        <span className="spacer" />
        {prev && <a className="btn ghost small" href={`${list}/${prev.id}`} aria-label={`上一个问题：${prev.title}`}>‹ 上一个</a>}
        {next && <a className="btn ghost small" href={`${list}/${next.id}`} aria-label={`下一个问题：${next.title}`}>下一个 ›</a>}
      </nav>

      <header className="article-head">
        <p className="topic-cat">
          <span aria-hidden="true">{cat.icon}</span> <a href={list}>{topic.title}</a> · 第 {i + 1} / {topic.articles.length} 个问题
        </p>
        {article.draft && <p className="draft-flag">草稿 · 这篇还在写</p>}
        <h1>{article.title}</h1>
      </header>

      <SourcesContext.Provider value={sources}>
        <main className="qa-main">
          <p className="qa-scene"><span aria-hidden="true">📍</span>{article.trigger}</p>
          {article.dialogue?.length ? (
            <section className="qa-chat" aria-label="小念和爸爸的问答">
              {article.dialogue.map((turn, n) => (
                <div key={n} className="qa-turn">
                  <Line who="nian" i={n * 2}><p>{turn.nian}</p></Line>
                  <Line who="dad" i={n * 2 + 1}><p>{turn.dad}<Cite ids={turn.cite} /></p></Line>
                  {turn.show && <ShowView show={turn.show} />}
                </div>
              ))}
            </section>
          ) : (
            <section className="block-todo">
              <p className="todo-icon" aria-hidden="true">✏️</p>
              <h3>小念和爸爸还在聊这个问题</h3>
              <p>先看看这个泡泡里别的问题吧。</p>
            </section>
          )}

          <section className="qa-wrap" aria-label="看完以后">
            {more.length > 0 && (
              <div className="qa-related">
                <h3><Avatar who="nian" /> 小念还想问</h3>
                {more.map((a) => (
                  <a key={a.id} href={`${list}/${a.id}`}>{a.title}{a.draft || !a.dialogue ? <em className="draft-chip">还在写</em> : ''}</a>
                ))}
              </div>
            )}
            {article.parentTip && (
              <details className="parent-tip">
                <summary>👨‍👩‍👧 给大人</summary>
                <p>{article.parentTip}</p>
              </details>
            )}
            {article.shots?.length ? (
              <details className="parent-tip shots">
                <summary>📷 下次去的时候拍（这篇还没有我们自己的照片）</summary>
                <ul>{article.shots.map((s) => <li key={s}>{s}</li>)}</ul>
              </details>
            ) : null}
          </section>
        </main>
      </SourcesContext.Provider>

      <Sources sources={sources} map={article.dialogue?.some((t) => t.show && MAP_SHOWS.has(t.show.kind))} />
    </div>
  );
}
