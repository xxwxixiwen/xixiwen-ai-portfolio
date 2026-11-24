import OpeningVideo from '@/components/portfolio/OpeningVideo';
import CinematicBackdrop from '@/components/portfolio/CinematicBackdrop';
import { SiteShell, Hero, AboutSection, Capabilities, ProjectsSection, ContactSection } from '@/components/portfolio/Site';
export default function Home() { return <OpeningVideo><SiteShell><main id="main" className="cinematic-home"><CinematicBackdrop/><Hero/><AboutSection/><Capabilities/><ProjectsSection/><ContactSection/></main></SiteShell></OpeningVideo>; }
