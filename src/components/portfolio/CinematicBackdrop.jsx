'use client';
import { useEffect, useMemo, useRef } from 'react';
import gsap from 'gsap';
import { personalScenes } from '@/data/portfolio';
import { layerPose, sceneStateAtScroll } from './motionMath.mjs';
import useMotionPreference from './useMotionPreference';
import SceneGeometry from './SceneGeometry';

export default function CinematicBackdrop({ sceneId }) {
  const root=useRef(null), frames=useRef([]), figures=useRef([]), geometry=useRef(null);
  const reduced=useMotionPreference();
  const scenes=useMemo(()=>sceneId?personalScenes.filter(scene=>scene.id===sceneId):personalScenes,[sceneId]);
  useEffect(()=>{
    let tops=[],current=0,last=performance.now(),stopped=false;
    let targetX=0,targetY=0,pointerX=0,pointerY=0;
    const measure=()=>{tops=scenes.map(scene=>{
      const section=document.getElementById(scene.section);
      return section?section.getBoundingClientRect().top+scrollY:0;
    });};
    const progress=()=>{
      if(sceneId)return 0;
      const state=sceneStateAtScroll(scrollY,tops,innerHeight);
      return state.from+state.blend;
    };
    measure();current=progress();
    const render=()=>{
      if(document.hidden)return;
      const now=performance.now(),dt=Math.min((now-last)/1000,.1);last=now;
      const target=progress();
      current=reduced?Math.round(target):current+(target-current)*(1-Math.exp(-dt*9));
      if(Math.abs(current-target)<.0001)current=target;
      const mobile=innerWidth<=720;
      pointerX+=(targetX-pointerX)*.07;pointerY+=(targetY-pointerY)*.07;
      frames.current.forEach((frame,index)=>{
        if(!frame)return;
        const globalIndex=personalScenes.findIndex(scene=>scene.id===scenes[index].id);
        const pose=layerPose(sceneId?globalIndex:current,globalIndex);
        frame.style.opacity=String(pose.opacity);
        frame.style.visibility=pose.opacity>.001?'visible':'hidden';
        if(!figures.current[index])return;
        const sectionTravel=sceneId?0:Math.max(0,Math.min(1,(scrollY-(tops[index]||0))/innerHeight));
        const drift=reduced?0:Math.sin(now/2600+globalIndex)*8;
        const scale=reduced?1:pose.scale+(mobile?.018:.035)*sectionTravel+Math.sin(now/4200+globalIndex)*.007;
        const x=reduced?0:(pose.x*(mobile?.25:1)+pointerX*(mobile?0:1));
        // On narrow screens the artwork travels with its section, so reading
        // copy never scrolls over a fixed character in the upper half.
        const documentOffset=mobile?(tops[index]||0)-scrollY:0;
        const y=documentOffset+(reduced?0:pose.y+drift+pointerY-sectionTravel*(mobile?5:24));
        figures.current[index].style.transform=`translate(-50%,-50%) translate3d(${x}vw,${y}px,0) scale(${scale})`;
      });
      root.current.dataset.activeScene=scenes[Math.min(scenes.length-1,Math.round(current))]?.id||'hero';
      root.current.style.setProperty('--story-progress',String(current));
      if(geometry.current)geometry.current.style.transform=reduced?'none':`translate3d(${pointerX*-5}px,${pointerY*-4-current*25}px,0) rotate(${current*5}deg)`;
    };
    const pointer=event=>{
      if(event.pointerType==='touch')return;
      targetX=(event.clientX/innerWidth-.5)*1.2;
      targetY=(event.clientY/innerHeight-.5)*-12;
    };
    const resize=()=>{measure();render();};
    const observer=new ResizeObserver(resize);
    const main=document.getElementById('main');if(main)observer.observe(main);
    document.fonts.ready.then(()=>{if(!stopped)resize();});
    window.addEventListener('resize',resize,{passive:true});
    if(reduced)window.addEventListener('scroll',render,{passive:true});
    else{window.addEventListener('pointermove',pointer,{passive:true});gsap.ticker.add(render);}
    render();
    return()=>{stopped=true;observer.disconnect();gsap.ticker.remove(render);window.removeEventListener('resize',resize);window.removeEventListener('scroll',render);window.removeEventListener('pointermove',pointer);};
  },[sceneId,scenes,reduced]);
  return <div ref={root} className={`cinematic-backdrop layered-backdrop ${sceneId?'layered-single':''}`} data-scene-id={sceneId||'story'} aria-hidden="true">
    <SceneGeometry ref={geometry}/>
    {scenes.map((scene,index)=><div key={scene.id} className="layered-scene" data-scene={scene.id} ref={el=>{frames.current[index]=el;}} style={{opacity:index===0?1:0,visibility:index===0?'visible':'hidden'}}>
      <div className={`layered-figure figure-${scene.id}`} ref={el=>{figures.current[index]=el;}}>
        <img src={scene.src} alt="" className="figure-person" width="1024" height="1536" fetchPriority={index===0?'high':'auto'} decoding="async"/>
      </div>
    </div>)}
    <div className="layered-vignette"/>
  </div>;
}
