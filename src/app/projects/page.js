import { SiteShell } from '@/components/portfolio/Site';
import ProjectGallery from '@/components/portfolio/ProjectGallery';
export const metadata = { title: '作品与项目' };
export default function ProjectsPage() { return <SiteShell><main id="main"><ProjectGallery/></main></SiteShell>; }
