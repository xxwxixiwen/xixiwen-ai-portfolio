import Link from 'next/link';
import { SiteShell, SectionLabel, Arrow } from '@/components/portfolio/Site';
import CinematicBackdrop from '@/components/portfolio/CinematicBackdrop';
import { profile } from '@/data/portfolio';
import { personalResume as resume } from '@/data/personalResume';
import './resume.css';

export const metadata = { title: '个人简历' };

export default function ResumePage() {
  return <SiteShell><main id="main" className="portrait-page personal-resume-page">
    <CinematicBackdrop sceneId="about" />
    <section className="section personal-resume-section" aria-labelledby="resume-heading">
      <Link href="/about#background-section" className="text-link">← 返回个人资料</Link>
      <header className="resume-intro">
        <SectionLabel number="03">PERSONAL RESUME · 个人简历</SectionLabel>
        <h1 id="resume-heading">{profile.name}<span className="orange"> · AI 产品经理</span></h1>
        <p className="resume-positioning">设计美学 <span>×</span> 多模态 AI <span>×</span> 业务落地</p>
        <p className="resume-availability"><span className="status-dot" aria-hidden="true" />求职方向：{resume.jobIntent}<span className="resume-status">{resume.availability}</span></p>
        <dl className="resume-contacts">
          <div><dt>电话 / 微信</dt><dd><a href={`tel:+86${profile.phone}`}>{profile.phone}</a></dd></div>
          <div><dt>邮箱</dt><dd><a href={`mailto:${profile.email}`}>{profile.email}</a></dd></div>
          <div><dt>GitHub</dt><dd><a href={profile.github} target="_blank" rel="noreferrer">github.com/xxwxixiwen <Arrow /></a></dd></div>
        </dl>
      </header>
      <section className="resume-overview" aria-labelledby="resume-about-heading">
        <p className="resume-label">ABOUT ME / 关于我</p>
        <h2 id="resume-about-heading">从设计出发，<span className="outline">让 AI 落地。</span></h2>
        <p className="body-copy">{resume.introduction}</p>
        <dl className="resume-facts">{resume.facts.map(fact => <div key={fact.label}><dt>{fact.label}</dt><dd>{fact.value}</dd></div>)}</dl>
      </section>
      <section className="resume-strengths" aria-labelledby="resume-strengths-heading">
        <p className="resume-label">PERSONAL PROFILE / 个人画像与核心定位</p>
        <h2 id="resume-strengths-heading">我的四个<span className="orange">能力支点。</span></h2>
        <ol className="resume-strength-list">{resume.strengths.map((strength, index) => <li key={strength.label}><div className="resume-strength-meta"><span>0{index+1}</span><p>{strength.label}</p></div><article><h3>{strength.title}</h3><p>{strength.body}</p></article></li>)}</ol>
      </section>
      <section className="resume-education" aria-labelledby="resume-education-heading">
        <p className="resume-label">EDUCATION &amp; SKILLS / 教育与技能</p>
        <h2 id="resume-education-heading">教育背景<span className="outline">与能力标签。</span></h2>
        <div className="resume-education-grid"><div><h3>{resume.education.school}</h3><p>{resume.education.major} / {resume.education.degree}</p><p className="resume-education-period">{resume.education.period}</p></div><ul className="resume-skills" aria-label="能力标签">{resume.skills.map(skill => <li key={skill}>{skill}</li>)}</ul></div>
      </section>
      <nav className="resume-next" aria-label="继续了解"><Link className="text-link" href="/about/experience">查看工作经历 <Arrow /></Link><Link className="button button-orange" href="/projects">浏览作品与项目 <Arrow /></Link></nav>
    </section>
  </main></SiteShell>;
}
