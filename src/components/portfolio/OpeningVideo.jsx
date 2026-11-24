'use client';
import { useEffect, useRef, useState } from 'react';
import './openingVideo.css';
import { personalScenes } from '@/data/portfolio';

let completedThisVisit = false;

export default function OpeningVideo({ children }) {
  const [phase, setPhase] = useState('playing');
  const [muted, setMuted] = useState(false);
  const [blocked, setBlocked] = useState(false);
  const [failed, setFailed] = useState(false);
  const [loading, setLoading] = useState(true);
  const video = useRef(null);
  const finishTimer = useRef(null);
  const started = useRef(false);
  const entered = useRef(false);
  const touchY = useRef(null);
  const welcomeButton = useRef(null);
  const showPage = phase === 'entering' || phase === 'done';
  const showWelcome = phase === 'leaving' || phase === 'welcome' || phase === 'entering';

  async function play() {
    const element = video.current;
    if (!element) return;
    if (element.error) element.load();
    setFailed(false);
    try {
      element.playbackRate = 1;
      await element.play();
      setBlocked(false);
    } catch (error) {
      setBlocked(true);
      if (error.name !== 'NotAllowedError' && error.name !== 'AbortError') setFailed(true);
    }
  }

  useEffect(() => {
    if (completedThisVisit) { setPhase('done'); return; }
    const heroImage = new Image();
    heroImage.src = personalScenes[0].src;
    const bodyOverflow = document.body.style.overflow;
    const htmlOverflow = document.documentElement.style.overflow;
    document.body.style.overflow = 'hidden';
    document.documentElement.style.overflow = 'hidden';
    window.scrollTo({ top: 0, behavior: 'instant' });
    window.dispatchEvent(new Event('portfolio:overlay-open'));
    play();
    return () => {
      clearTimeout(finishTimer.current);
      document.body.style.overflow = bodyOverflow;
      document.documentElement.style.overflow = htmlOverflow;
      window.dispatchEvent(new Event('portfolio:overlay-close'));
    };
  }, []);

  useEffect(() => {
    if (!showPage) return;
    const frame = requestAnimationFrame(() => window.dispatchEvent(new Event('portfolio:intro-ready')));
    return () => cancelAnimationFrame(frame);
  }, [showPage]);

  useEffect(() => {
    if (phase !== 'done') return;
    document.body.style.overflow = '';
    document.documentElement.style.overflow = '';
    window.dispatchEvent(new Event('portfolio:overlay-close'));
  }, [phase]);

  function ended() {
    if (started.current) return;
    started.current = true;
    setPhase('leaving');
    finishTimer.current = setTimeout(() => setPhase('welcome'), 950);
  }

  useEffect(() => {
    if (phase === 'welcome') welcomeButton.current?.focus({ preventScroll: true });
  }, [phase]);

  function enterPage() {
    if (phase !== 'welcome' || entered.current) return;
    entered.current = true;
    completedThisVisit = true;
    setPhase('entering');
    finishTimer.current = setTimeout(() => setPhase('done'), 850);
  }

  function toggleSound() {
    const next = !muted;
    if (video.current) video.current.muted = next;
    setMuted(next);
    if (blocked) play();
  }

  return <>
    {showPage && <div inert={phase !== 'done' ? true : undefined}>{children}</div>}
    {showWelcome && <div className={`opening-welcome ${phase === 'entering' ? 'opening-welcome-exit' : ''}`}
      role="dialog" aria-modal="true" aria-label="欢迎来到我的世界"
      onWheel={event => { if (Math.abs(event.deltaY) > 2) enterPage(); }}
      onTouchStart={event => { touchY.current = event.touches[0].clientY; }}
      onTouchEnd={event => {
        if (touchY.current !== null && touchY.current - event.changedTouches[0].clientY > 24) enterPage();
        touchY.current = null;
      }}
      onKeyDown={event => { if (['ArrowDown', 'PageDown'].includes(event.key)) { event.preventDefault(); enterPage(); } }}>
      <h1 className="opening-welcome-title" aria-label="欢迎来到我的世界">{[...'欢迎来到我的世界'].map((char, i) => <span key={i} aria-hidden="true" style={{ '--welcome-index': i }}>{char}</span>)}</h1>
      <button ref={welcomeButton} className="opening-welcome-action" type="button" disabled={phase !== 'welcome'} onClick={enterPage}><span className="welcome-scroll">滚动进入</span><span className="welcome-swipe">上滑进入</span><span aria-hidden="true">↓</span></button>
    </div>}
    {(phase === 'playing' || phase === 'leaving') && <div className={`opening-video ${phase === 'leaving' ? 'opening-leaving' : ''}`} role="dialog" aria-modal="true" aria-label="网站开场视频">
      <video ref={video} className="opening-film" src="/portfolio/intro/opening-impact.mp4" poster="/portfolio/intro/poster.webp" autoPlay playsInline preload="auto" muted={muted} onEnded={ended} onPlaying={() => {setLoading(false);setBlocked(false);}} onWaiting={() => setLoading(true)} onError={() => {setFailed(true);setBlocked(true);}} />
      {phase === 'playing' && <>
        <button className="opening-sound" type="button" onClick={toggleSound} aria-pressed={muted}>{muted ? '开启声音' : '静音播放'}</button>
        {blocked && <button className="opening-start" type="button" onClick={play}><span>{failed ? '视频加载失败' : '你好'}</span><small>{failed ? '点击重试' : '点击进入页面'}</small></button>}
        {loading && !blocked && <p className="opening-loading" role="status">正在加载开场视频…</p>}
      </>}
    </div>}
  </>;
}
