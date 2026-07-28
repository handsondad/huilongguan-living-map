import { Link } from 'react-router-dom';
import type { Theme } from '../types';

export function ThemeCard({ theme, directory = false }: { theme: Theme; directory?: boolean }) {
  if (directory) {
    return <Link className={`directory-card directory-${theme.accent}`} to={`/themes/${theme.id}`}><span className="directory-index">{theme.index} / {theme.label}</span><span className="directory-icon" aria-hidden="true">{theme.icon}</span><h3>{theme.title}</h3><p>{theme.summary}</p><span className="directory-link">打开主题档案 <b>→</b></span></Link>;
  }
  return <Link className={`theme-card theme-${theme.accent === 'sand' ? 'housing' : theme.accent}`} to={`/themes/${theme.id}`}><span className="theme-index">{theme.index}</span><span className="theme-icon" aria-hidden="true">{theme.icon}</span><h3>{theme.title}</h3><p>{theme.summary}</p></Link>;
}
