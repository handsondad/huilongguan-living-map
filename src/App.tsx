import { useEffect, useState } from 'react';
import { ArticlePage } from './pages/ArticlePage';
import { HomePage } from './pages/HomePage';
import { TopicPage } from './pages/TopicPage';
import { useSaved } from './render/env';
import { topicById } from './topics/index';

type Route =
  | { page: 'home' }
  | { page: 'topic'; id: string }
  | { page: 'article'; id: string; article: string };

function parseRoute(hash: string): Route {
  const [, page, id, article] = hash.replace(/^#/, '').split('/');
  const topic = page === 'topic' && id ? topicById(id) : undefined;
  if (!topic) return { page: 'home' };
  if (article && topic.articles.some((a) => a.id === article)) return { page: 'article', id, article };
  return { page: 'topic', id };
}

export function App() {
  const [route, setRoute] = useState(() => parseRoute(window.location.hash));
  /** 最近点开的那个泡泡，回到地图时让它亮一下 */
  const [last, setLast] = useSaved<string | null>('map-last', null);

  useEffect(() => {
    const onHash = () => setRoute(parseRoute(window.location.hash));
    window.addEventListener('hashchange', onHash);
    return () => window.removeEventListener('hashchange', onHash);
  }, []);
  useEffect(() => {
    window.scrollTo(0, 0);
    if (route.page !== 'home') setLast(route.id);
  }, [route]);

  if (route.page === 'article') {
    const topic = topicById(route.id)!;
    const article = topic.articles.find((a) => a.id === route.article)!;
    return <ArticlePage key={`${topic.id}/${article.id}`} topic={topic} article={article} />;
  }
  if (route.page === 'topic') {
    const topic = topicById(route.id)!;
    return <TopicPage key={topic.id} topic={topic} />;
  }
  return <HomePage last={last} onOpen={(id) => { window.location.hash = `#/topic/${id}`; }} />;
}
