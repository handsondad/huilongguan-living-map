import { Link } from 'react-router-dom';
import { ThemeCard } from '../components/ThemeCard';
import { themes } from '../data/themes';

export function ThemesPage() {
  return <><section className="archive-hero section"><p className="eyebrow">THE FIELD GUIDE / 07 THEMES</p><h1>七副观察眼镜，<br /><em>一片真实的附近。</em></h1><p>这里不是要一次性完成的报告目录，而是一套可以陪着孩子慢慢用的观察框架。先选一个主题，再往其中放入一次散步、一张照片、一句原话或一个问题。</p><div className="archive-principles"><span>从具体地点开始</span><span>保留孩子的原话</span><span>允许没有答案</span></div></section><section className="section theme-directory"><div className="directory-header"><h2>选择今天想看的方向</h2><p>每个主题页都预置了问题、记录字段和可逐步完成的内容位置。</p></div><div className="theme-directory-grid">{themes.map((theme) => <ThemeCard key={theme.id} theme={theme} directory />)}</div></section><section className="section archive-note"><div><p className="eyebrow">HOW TO GROW THIS ARCHIVE</p><h2>一条记录，<br />就能让地图长大一点。</h2></div><ol><li><span>1</span>选一个主题和一条路线。</li><li><span>2</span>只记录一个印象最深的瞬间。</li><li><span>3</span>把它补进对应主题的“观察条目”。</li></ol><Link className="button button-primary" to="/guide">查看内容填写指南 →</Link></section></>;
}
