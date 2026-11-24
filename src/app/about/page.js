import CinematicBackdrop from '@/components/portfolio/CinematicBackdrop';
import { SiteShell, AboutSection, Capabilities } from '@/components/portfolio/Site';
export const metadata = { title: '个人资料' };
export default function AboutPage() { return <SiteShell><main id="main" className="portrait-page"><CinematicBackdrop sceneId="about"/><AboutSection full/><Capabilities/></main></SiteShell>; }
