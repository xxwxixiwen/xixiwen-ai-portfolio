import CinematicBackdrop from '@/components/portfolio/CinematicBackdrop';
import { notFound } from 'next/navigation';
import { projects } from '@/data/portfolio';
import ProjectCase from '@/components/portfolio/ProjectCase';
import { SiteShell } from '@/components/portfolio/Site';
export function generateStaticParams() { return projects.map(({id}) => ({ id })); }
export async function generateMetadata({params}) { const {id} = await params; const project = projects.find(p => p.id === id); return {title: project?.title || '未找到项目'}; }
export default async function DetailPage({ params }) { const {id} = await params; const project = projects.find(p => p.id === id); if (!project) notFound(); return <SiteShell><main id="main" className="portrait-page"><CinematicBackdrop sceneId="work"/><ProjectCase project={project}/></main></SiteShell>; }
