import Link from 'next/link';
import './projectCase.css';

export default function ProjectCase({ project }) {
  return <section className="section standalone project-detail resume-project-case">
    <Link className="text-link" href="/projects">← 返回全部作品</Link>
    <p className="section-label detail-label">{project.english} / {project.kind}</p>
    <h1>{project.title}</h1>
    <p className="body-copy case-summary">{project.summary}</p>
    {project.links?.length > 0 && <div className="case-project-links">{project.links.map(link => <a className="button button-orange" href={link.url} key={link.url} target="_blank" rel="noopener noreferrer">{link.label} <span aria-hidden="true">↗</span></a>)}{project.linkNote && <p className="muted-copy">{project.linkNote}</p>}</div>}
    <dl className="case-facts"><div><dt>我的角色</dt><dd>{project.role}</dd></div><div><dt>项目时间</dt><dd>{project.period}</dd></div></dl>
    <div className="tags">{project.tags.map(tag => <span key={tag}>{tag}</span>)}</div>
    {project.metrics?.length > 0 && <dl className="case-metrics">{project.metrics.map(metric => <div key={metric.label}><dt>{metric.label}</dt><dd>{metric.value}</dd></div>)}</dl>}
    <div className="case-sections">{project.sections.map((section, index) => <article key={section.title}><span>{String(index+1).padStart(2,'0')}</span><div><h2>{section.title}</h2>{section.body && <p>{section.body}</p>}{section.items && <ul className="case-action-list">{section.items.map(item => <li key={item.title}><h3>{item.title}</h3><p>{item.body}</p></li>)}</ul>}</div></article>)}</div>
    <Link className="button button-orange" href="/contact">交流这个项目 <span aria-hidden="true">↗</span></Link>
  </section>;
}
