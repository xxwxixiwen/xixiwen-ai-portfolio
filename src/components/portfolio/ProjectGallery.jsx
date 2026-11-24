'use client';
import { Component, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { createPortal } from 'react-dom';
import { AnimatePresence, motion } from 'framer-motion';
import useMotionPreference from './useMotionPreference';
import { projects } from '@/data/portfolio';
import CinematicBackdrop from './CinematicBackdrop';
import { boundedProjectIndex } from './motionMath.mjs';

const CircularGallery = dynamic(() => import('@/components/CircularGallery/CircularGallery'), { ssr: false, loading: () => <div className="gallery-loading">正在展开作品画廊…</div> });
class GalleryBoundary extends Component {
  state = { failed: false };
  static getDerivedStateFromError() { return { failed: true }; }
  componentDidCatch() { this.props.onFailure(); }
  render() { return this.state.failed ? null : this.props.children; }
}

function Showcase({ items, start, onClose }) {
  const [index, setIndex] = useState(start);
  const [direction, setDirection] = useState(1);
  const [announcement, setAnnouncement] = useState('');
  const dialog = useRef(null);
  const locked = useRef(false);
  const unlock = useRef(null);
  const reduced = useMotionPreference();
  const current = items[index];
  const go = useCallback(delta => {
    const next = boundedProjectIndex(index, delta, items.length);
    if (locked.current || next === index) return;
    locked.current = true;
    setDirection(delta); setIndex(next);
    setAnnouncement(`${next + 1} / ${items.length}：${items[next].title}`);
    unlock.current = setTimeout(() => { locked.current = false; }, reduced ? 0 : 700);
  }, [index, items, reduced]);
  useEffect(() => {
    const previous = document.activeElement;
    const overflow = document.body.style.overflow;
    const main = document.querySelector('main');
    const nav = document.querySelector('.site-nav');
    const previousMainInert = main?.inert;
    const previousNavInert = nav?.inert;
    if (main) main.inert = true;
    if (nav) nav.inert = true;
    document.body.style.overflow = 'hidden';
    window.dispatchEvent(new Event('portfolio:overlay-open'));
    dialog.current?.querySelector('.showcase-close')?.focus();
    return () => {
      clearTimeout(unlock.current);
      document.body.style.overflow = overflow;
      if (main) main.inert = previousMainInert;
      if (nav) nav.inert = previousNavInert;
      window.dispatchEvent(new Event('portfolio:overlay-close'));
      previous?.focus({ preventScroll: true });
    };
  }, []);
  useEffect(() => {
    let startY = 0;
    const wheel = event => {
      // Long copy inside the pane keeps its own native scrolling.
      const pane = event.target.closest('.showcase-copy');
      if (pane && pane.scrollHeight > pane.clientHeight + 4) return;
      event.preventDefault();
      if (Math.abs(event.deltaY) > 20) go(event.deltaY > 0 ? 1 : -1);
    };
    const key = event => {
      if (event.key === 'Escape') { event.preventDefault(); onClose(); }
      else if (['ArrowDown','ArrowRight'].includes(event.key)) { event.preventDefault(); go(1); }
      else if (['ArrowUp','ArrowLeft'].includes(event.key)) { event.preventDefault(); go(-1); }
      else if (event.key === 'Tab') {
        const controls = [...dialog.current.querySelectorAll('a[href],button:not(:disabled)')];
        const first = controls[0], last = controls.at(-1);
        if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
        if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
      }
    };
    const touchStart = e => { startY = e.touches[0].clientY; };
    const touchEnd = e => {
      if (e.target.closest('a,button,.showcase-copy')) return;
      const delta = startY - e.changedTouches[0].clientY;
      if (Math.abs(delta) > 45) go(delta > 0 ? 1 : -1);
    };
    const element = dialog.current;
    element.addEventListener('wheel', wheel, { passive: false });
    element.addEventListener('touchstart', touchStart, { passive: true });
    element.addEventListener('touchend', touchEnd, { passive: true });
    window.addEventListener('keydown', key);
    return () => {
      element.removeEventListener('wheel', wheel);
      element.removeEventListener('touchstart', touchStart);
      element.removeEventListener('touchend', touchEnd);
      window.removeEventListener('keydown', key);
    };
  }, [go, onClose]);
  const duration = reduced ? 0 : .65;
  return createPortal(<motion.div ref={dialog} role="dialog" aria-modal="true" aria-label="作品全屏展示" className="project-showcase" data-lenis-prevent initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} transition={{duration:.25}}>
    <button className="showcase-close" onClick={onClose}>关闭 <span aria-hidden="true">×</span></button>
    <AnimatePresence initial={false} custom={direction} mode="wait">
      <motion.div className="showcase-scene" key={current.id} custom={direction} variants={{ enter: d => ({y: reduced ? 0 : d * 55, opacity:0}), visible:{y:0,opacity:1}, exit:d=>({y:reduced?0:d * -55,opacity:0}) }} initial="enter" animate="visible" exit="exit" transition={{duration,ease:[.76,0,.24,1]}}>
        <div className="showcase-image"><motion.img src={current.cover} alt={`${current.title} · 项目概念视觉`} initial={{scale:reduced?1:1.12}} animate={{scale:1}} transition={{duration:1}} onPointerMove={event => {
          if (reduced || event.pointerType === 'touch') return;
          const rect = event.currentTarget.parentElement.getBoundingClientRect();
          event.currentTarget.style.transform = `scale(1.04) translate(${((event.clientX-rect.left)/rect.width-.5)*15}px,${((event.clientY-rect.top)/rect.height-.5)*10}px)`;
        }} onPointerLeave={event => {event.currentTarget.style.transform = 'scale(1)';}}/></div>
        <div className="showcase-copy"><p className="showcase-counter"><span>{String(index+1).padStart(2,'0')}</span> ── {String(items.length).padStart(2,'0')}</p><p className="showcase-category">{current.category} · {current.kind}</p><h2>{current.title}</h2><p className="body-copy">{current.summary}</p><div className="tags">{current.tags.map(tag=><span key={tag}>{tag}</span>)}</div><Link className="button button-orange" href={`/project/${current.id}`} onClick={onClose}>查看项目详情 ↗</Link><p className="showcase-caption">项目概念视觉 / 非产品界面截图</p></div>
      </motion.div>
    </AnimatePresence>
    <div className="showcase-dots"><button onClick={()=>go(-1)} disabled={index===0} aria-label="上一个作品">↑</button>{items.map((item,i)=><button key={item.id} onClick={()=>go(i-index)} aria-label={`查看${item.title}`} aria-current={i===index?'true':undefined}><span/></button>)}<button onClick={()=>go(1)} disabled={index===items.length-1} aria-label="下一个作品">↓</button></div>
    <p className="showcase-hint">滚动 / ↑ ↓ 切换作品 · ESC 关闭</p><span role="status" className="sr-only">{announcement}</span>
  </motion.div>, document.body);
}

export default function ProjectGallery() {
  const [filter, setFilter] = useState('全部');
  const [view, setView] = useState('gallery');
  const [supported, setSupported] = useState(null);
  const [active, setActive] = useState(0);
  const [spin, setSpin] = useState(0);
  const [targetIndex, setTargetIndex] = useState(0);
  const [selected, setSelected] = useState(null);
  const reduced = useMotionPreference();
  const items = useMemo(()=>projects.map((project,i)=>({...project,cover:project.cover || `/portfolio/project-${i+1}.svg`})).filter(p=>filter==='全部'||p.category===filter),[filter]);
  const images = useMemo(()=>items.map(item=>({image:item.cover,text:item.shortTitle || item.title})),[items]);
  const open = useCallback(index => setSelected(index),[]);
  const close = useCallback(()=>setSelected(null),[]);
  const fallback = useCallback(()=>setSupported(false),[]);
  useEffect(()=>{
    const canvas = document.createElement('canvas');
    const gl = canvas.getContext('webgl2') || canvas.getContext('webgl');
    setSupported(!!gl);
    gl?.getExtension('WEBGL_lose_context')?.loseContext();
  },[]);
  const list = view==='list'||supported===false||reduced;
  const spinTo = delta => { const next=(active+delta+items.length)%items.length; setTargetIndex(next); setActive(next); setSpin(i=>i+1); };
  return <><section className={`gallery-page ${list?'gallery-list-mode':''}`} aria-label="作品与项目"><CinematicBackdrop sceneId="work"/><div className="gallery-heading"><p className="section-label">SELECTED WORK / 作品与项目</p><h1>作品<span className="outline">档案。</span></h1><p>滚动与拖动，探索我的产品思考。</p></div><div className="gallery-mode" aria-label="展示方式"><button onClick={()=>setView('gallery')} aria-pressed={!list}>画廊</button><button onClick={()=>setView('list')} aria-pressed={list}>列表</button></div>
    {!list ? <div className="gallery-stage" data-gallery data-lenis-prevent tabIndex={0} role="region" aria-label="弧形作品画廊，可左右拖动、滚轮浏览或使用左右键切换" onKeyDown={event=>{if(event.key==='ArrowRight'){event.preventDefault();spinTo(1);}if(event.key==='ArrowLeft'){event.preventDefault();spinTo(-1);}if(event.key==='Enter'){event.preventDefault();open(active);}}}>{supported&&<GalleryBoundary onFailure={fallback}><CircularGallery key={filter} items={images} bend={3} textColor="gradient" borderRadius={.045} font="500 36px sans-serif" scrollSpeed={2} scrollEase={.05} onItemClick={open} activeIndex={targetIndex} spinTimestamp={spin} onActiveChange={setActive}/></GalleryBoundary>}</div> : <div className="gallery-list">{items.map((item,i)=><button className="gallery-list-card" key={item.id} onClick={()=>open(i)}><img src={item.cover} alt={`${item.title} · 项目概念视觉`}/><span>{item.category}<small>{item.kind} ↗</small></span><h2>{item.title}</h2></button>)}</div>}
    <div className="gallery-bottom"><div className="gallery-filters" aria-label="项目分类">{['全部',...new Set(projects.map(p=>p.category))].map(category=><button key={category} aria-pressed={category===filter} onClick={()=>{setFilter(category);setActive(0);setTargetIndex(0);setSpin(i=>i+1);}}>{category}</button>)}</div><div className="gallery-controls"><button onClick={()=>spinTo(-1)} aria-label="向左浏览">←</button><span>{String(active+1).padStart(2,'0')} / {String(items.length).padStart(2,'0')}</span><button onClick={()=>spinTo(1)} aria-label="向右浏览">→</button><button className="gallery-open" onClick={()=>open(active)}>展开作品 ↗</button></div><p>共 {projects.length} 个项目 · 点击查看方案与成果。{!list&&<span>拖动 / 滚动探索 · 点击卡片展开</span>}</p></div>
  </section><AnimatePresence>{selected!==null&&<Showcase items={items} start={selected} onClose={close}/>}</AnimatePresence></>;
}
