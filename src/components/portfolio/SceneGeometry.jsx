'use client';
import { forwardRef } from 'react';
const points=[[60,6],[106,34],[106,86],[60,114],[14,86],[14,34],[60,36],[86,60],[60,86],[34,60]];
const edges=[[0,1],[1,2],[2,3],[3,4],[4,5],[5,0],[0,6],[1,6],[1,7],[2,7],[2,8],[3,8],[4,8],[4,9],[5,9],[5,6],[6,7],[7,8],[8,9],[9,6],[0,9],[3,7]];
const shapes=[{x:57,y:21,size:150,depth:0},{x:91,y:33,size:90,depth:1},{x:43,y:73,size:68,depth:2},{x:78,y:84,size:135,depth:0},{x:11,y:19,size:55,depth:2},{x:94,y:79,size:64,depth:1}];
const SceneGeometry=forwardRef(function SceneGeometry(_,ref){
 return <div className="layered-environment" ref={ref}>
  {shapes.map((shape,index)=><div key={index} className={`geometry-anchor geometry-depth-${shape.depth}`} style={{left:`${shape.x}%`,top:`${shape.y}%`,'--geometry-size':`${shape.size}px`,'--geometry-delay':`${index*-2.7}s`,'--geometry-duration':`${18+index*3}s`}}><svg className="floating-polyhedron" viewBox="0 0 120 120" fill="none">{edges.map(([a,b],i)=><path key={i} d={`M${points[a].join(',')}L${points[b].join(',')}`} stroke={i%3===0?'#a59aff':'#ff9456'} strokeWidth=".65"/>)}{points.map(([x,y],i)=><circle key={i} cx={x} cy={y} r="1.5" fill={i%3?'#ffc193':'#d7d0ff'}/>)}</svg></div>)}
  <div className="geometry-orbit orbit-rear"/><div className="geometry-orbit orbit-front"/>
  {Array.from({length:18},(_,index)=><i className="layered-spark" key={index} style={{left:`${(index*31+9)%100}%`,top:`${(index*43+11)%100}%`,animationDelay:`${index*-1.1}s`,'--spark-distance':`${30+index%4*15}px`}}/>)}
 </div>;
});
export default SceneGeometry;
