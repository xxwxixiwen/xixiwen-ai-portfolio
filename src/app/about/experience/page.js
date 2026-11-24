import Link from 'next/link';
import { SiteShell, SectionLabel, Arrow } from '@/components/portfolio/Site';
import CinematicBackdrop from '@/components/portfolio/CinematicBackdrop';
import { workExperience } from '@/data/workExperience';
import './experience.css';

export const metadata = { title: '工作经历' };

export default function ExperiencePage() {
  return (
    <SiteShell>
      <main id="main" className="portrait-page experience-page">
        <CinematicBackdrop sceneId="about" />
        <section className="section experience-section" aria-labelledby="experience-heading">
          <Link href="/about#background-section" className="text-link experience-back">← 返回个人资料</Link>
          <header className="experience-intro">
            <SectionLabel number="02">WORK EXPERIENCE · 工作经历</SectionLabel>
            <h1 id="experience-heading">每一段经历，<br />都有<span className="orange">上下文。</span></h1>
          </header>
          <ol className="experience-timeline">
            {workExperience.map((job, index) => (
              <li className="experience-entry" key={job.company}>
                <div className="experience-date"><span className="experience-index">0{index + 1}</span><span>{job.period}</span></div>
                <article className="experience-content">
                  <header>
                    <h2>{job.company}</h2>
                    {job.organization && <p className="experience-organization">{job.organization}</p>}
                    <p className="experience-role">{job.role}{job.direction && <span> / {job.direction}</span>}</p>
                  </header>
                  <ul className="experience-duties">
                    {job.responsibilities.map((item, i) => (
                      <li key={i}>{item.title && <strong>{item.title}：</strong>}{item.description}</li>
                    ))}
                  </ul>
                </article>
              </li>
            ))}
          </ol>
          <Link href="/contact" className="text-link experience-contact">聊聊下一段经历 <Arrow /></Link>
        </section>
      </main>
    </SiteShell>
  );
}
