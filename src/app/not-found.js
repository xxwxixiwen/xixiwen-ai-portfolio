import Link from 'next/link';
import { SiteShell } from '@/components/portfolio/Site';
export default function NotFound() { return <SiteShell><main id="main" className="section standalone"><p className="section-label">404 / PAGE NOT FOUND</p><h1>这个页面还没到达。</h1><p className="body-copy">可以先回到首页，继续了解我的作品与产品思考。</p><Link className="button button-orange" href="/">回到首页 ↗</Link></main></SiteShell>; }
