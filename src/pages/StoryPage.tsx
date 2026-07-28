import { Link } from 'react-router-dom';

export function StoryPage() {
  return <section className="section story-feature story-page"><div className="story-number">01</div><div className="story-copy"><p className="eyebrow">NEIGHBORHOOD NOTE / 回龙观西大街</p><h1>云趣园三区：<br />日常被压得很近。</h1><p>它不是最新的小区，也不靠“网红”气质取胜。这里更像回龙观的一段日常切片：早晨从楼下出发的人、傍晚绕进树荫的孩子、沿街买菜和等车的路线，都在这里交叠。</p><p>这只是社区故事模块的第一篇。之后可在这里加入路线、照片、声音、孩子原话与季节变化。</p><Link className="text-link" to="/themes">回到观察主题 →</Link></div><div className="story-visual" aria-hidden="true"><span className="story-sun" /><span className="story-block block-one" /><span className="story-block block-two" /><span className="story-block block-three" /><span className="story-path" /><span className="story-person">●</span></div></section>;
}
