import type { CSSProperties } from 'react';
import { categoryOf } from '../topics/categories';
import { readyCount, TOPICS } from '../topics/index';
import type { Topic } from '../topics/types';
import { Locator } from './Locator';
import { Sources } from './Sources';

/** 点开一个泡泡：小念在这个主题下的问题列表 */
export function TopicPage({ topic }: { topic: Topic }) {
  const cat = categoryOf(topic.category);
  const ready = readyCount(topic);

  return (
    <div className="app topic" style={{ '--c': cat.color } as CSSProperties}>
      <nav className="topbar">
        <a className="btn ghost" href="#/">← 回到地图</a>
      </nav>

      <header className="topic-hero">
        <Locator anchor={topic.anchor} home={topic.home} />
        <div className="topic-head">
          <p className="topic-cat"><span aria-hidden="true">{cat.icon}</span> {cat.name}</p>
          <h1><span className="topic-emoji" aria-hidden="true">{topic.emoji}</span>{topic.title}</h1>
          <p className="hello">{topic.hello}</p>
          <p className="topic-count">💬 小念在这个泡泡里有 {topic.articles.length} 个问题{ready === 0 ? ' · 都还在写' : ready < topic.articles.length && ` · 聊完了 ${ready} 个`}</p>
        </div>
      </header>

      <ol className="article-list">
        {topic.articles.map((a, i) => (
          <li key={a.id}>
            <a className={`article-card ${a.draft || !a.dialogue ? 'is-draft' : ''}`} href={`#/topic/${topic.id}/${a.id}`}>
              <span className="article-no" aria-hidden="true">{i + 1}</span>
              <strong>{a.title}</strong>
              <small>📍 {a.trigger}</small>
              <span className="article-go">{a.draft || !a.dialogue ? <em className="draft-chip">还在写</em> : '听小念和爸爸聊'} →</span>
            </a>
          </li>
        ))}
      </ol>

      <nav className="other-topics" aria-label="换一个泡泡">
        <h2>换一个泡泡</h2>
        <div className="other-chips">
          {TOPICS.filter((t) => t.id !== topic.id).map((t) => {
            const c = categoryOf(t.category);
            return (
              <a key={t.id} className="cat-chip" href={`#/topic/${t.id}`} style={{ '--c': c.color } as CSSProperties}>
                <span aria-hidden="true">{t.emoji}</span> {t.home ? '我家' : t.short}<b>{t.articles.length}</b>
              </a>
            );
          })}
        </div>
      </nav>

      <Sources sources={topic.sources} map fold />
    </div>
  );
}
