import { Link, NavLink, Outlet } from 'react-router-dom';

export function Layout() {
  return (
    <>
      <a className="skip-link" href="#main-content">跳到主要内容</a>
      <header className="site-header">
        <Link className="brand" to="/" aria-label="我家在回龙观首页">
          <span className="brand-mark" aria-hidden="true">观</span>
          <span className="brand-copy"><strong>我家在回龙观</strong><small>Living map</small></span>
        </Link>
        <nav className="site-nav" aria-label="主要导航">
          <NavLink to="/map">地图</NavLink>
          <NavLink to="/themes">观察档案</NavLink>
          <NavLink to="/guide">怎么记录</NavLink>
          <NavLink className="nav-story" to="/stories/yunquyuan-3">社区故事 <span aria-hidden="true">↗</span></NavLink>
        </nav>
      </header>
      <main id="main-content"><Outlet /></main>
      <footer className="site-footer">
        <div><Link className="brand footer-brand" to="/"><span className="brand-mark">观</span><span>我家在回龙观</span></Link><p>从孩子的高度，重新认识附近。</p></div>
        <div className="footer-end"><p>HUILONGGUAN LIVING MAP · 2026</p><a href="#main-content">回到顶部 ↑</a></div>
      </footer>
    </>
  );
}
