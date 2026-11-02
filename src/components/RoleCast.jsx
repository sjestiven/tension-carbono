import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { ROLES } from '../engine.js';
import { roleLabel } from '../motion.js';

const colors={Estado:0x245443,A:0x806326,B:0x395f94,C:0x79516f,F1:0x397552,F2:0x296f78};

export default function RoleCast({game,activeRole,receipt,motionEnabled}) {
  const host=useRef(),engine=useRef();
  const latest=useRef({activeRole,receipt,motionEnabled});latest.current={activeRole,receipt,motionEnabled};
  const [fallback,setFallback]=useState(false);
  useEffect(()=>{
    let renderer;
    try { renderer=new THREE.WebGLRenderer({alpha:true,antialias:true}); }
    catch { setFallback(true);return; }
    const node=host.current,scene=new THREE.Scene();
    renderer.setPixelRatio(Math.min(devicePixelRatio,1.5));renderer.outputEncoding=THREE.sRGBEncoding;
    node.appendChild(renderer.domElement);
    const camera=new THREE.OrthographicCamera(-4.1,4.1,1.4,-.55,.1,30);camera.position.set(0,2.2,7);camera.lookAt(0,.55,0);
    scene.add(new THREE.HemisphereLight(0xffffff,0x8b9a8d,.8));
    const light=new THREE.DirectionalLight(0xfff5df,.7);light.position.set(-2,4,4);scene.add(light);
    const headGeometry=new THREE.SphereGeometry(.19,10,8),bodyGeometry=new THREE.CylinderGeometry(.22,.27,.48,8),limbGeometry=new THREE.BoxGeometry(.1,.28,.12);
    const skin=new THREE.MeshStandardMaterial({color:0xdfc4a6,roughness:.95}),dark=new THREE.MeshStandardMaterial({color:0x293f38,roughness:1}),gold=new THREE.MeshStandardMaterial({color:0xe1b858,roughness:1});
    for(const material of [skin,dark,gold])material.color.convertSRGBToLinear();
    const figures=[],markers=[];
    const add=(geometry,material,parent,x,y,z=0)=>{const mesh=new THREE.Mesh(geometry,material);mesh.position.set(x,y,z);parent.add(mesh);return mesh;};
    for(const [index,role] of ROLES.entries()) {
      const group=new THREE.Group();group.position.x=(index-2.5)*1.24;scene.add(group);
      const material=new THREE.MeshStandardMaterial({color:colors[role],roughness:.9});
      material.color.convertSRGBToLinear();
      add(bodyGeometry,material,group,0,.55);add(headGeometry,skin,group,0,.99);
      add(limbGeometry,material,group,-.29,.52).rotation.z=-.15;add(limbGeometry,material,group,.29,.52).rotation.z=.15;
      add(limbGeometry,dark,group,-.1,.18);add(limbGeometry,dark,group,.1,.18);
      if(['A','B','C'].includes(role))add(new THREE.CylinderGeometry(.23,.23,.1,10),gold,group,0,1.13);
      if(role.startsWith('F'))add(new THREE.ConeGeometry(.09,.2,5),gold,group,.12,.66,.23);
      if(role==='Estado')add(new THREE.BoxGeometry(.15,.2,.03),gold,group,.1,.58,.24);
      const marker=add(new THREE.CylinderGeometry(.4,.4,.025,20),new THREE.MeshBasicMaterial({color:0xd5b05f,transparent:true,opacity:.25}),group,0,.015);
      figures.push(group);markers.push(marker);
    }
    const tokenGeometry=new THREE.SphereGeometry(.075,8,6),creditGeometry=new THREE.OctahedronGeometry(.09);
    const tokenMaterial=new THREE.MeshBasicMaterial({color:0xd09a34}),creditMaterial=new THREE.MeshBasicMaterial({color:0x2e7956});
    const transfers=Array.from({length:3},()=>({token:add(tokenGeometry,tokenMaterial,scene,0,.7,.5),credit:add(creditGeometry,creditMaterial,scene,0,.7,.5)}));
    let frame=null,visible=true;
    function render(time=performance.now()) {
      frame=null;
      if(!visible)return;
      const state=latest.current,elapsed=state.receipt?Date.now()-state.receipt.createdAt:1000;
      const animating=state.motionEnabled&&elapsed>=0&&elapsed<450;
      figures.forEach((figure,index)=>{const active=ROLES[index]===state.activeRole;figure.scale.setScalar(active?1.09:1);markers[index].material.opacity=active ? .8 : .15;});
      transfers.forEach(({token,credit})=>{token.visible=false;credit.visible=false;});
      if(animating) {
        const entries=state.receipt.entries.filter(entry=>ROLES.includes(entry.from)&&ROLES.includes(entry.to)&&entry.from!==entry.to);
        entries.slice(0,3).forEach((entry,index)=>{
          const {token,credit}=transfers[index],start=ROLES.indexOf(entry.from),end=ROLES.indexOf(entry.to),t=elapsed/450;
          token.visible=true;token.position.set(THREE.MathUtils.lerp(figures[start].position.x,figures[end].position.x,t),.7+Math.sin(t*Math.PI)*(.3+index*.08),.5);
          if(['purchase','refund'].includes(entry.kind)){credit.visible=true;credit.position.set(THREE.MathUtils.lerp(figures[end].position.x,figures[start].position.x,t),.6-Math.sin(t*Math.PI)*.12,.55);}
        });
      }
      renderer.render(scene,camera);
      if(animating)frame=requestAnimationFrame(render);
    }
    function request(){if(frame===null)frame=requestAnimationFrame(render);}
    function resize(){renderer.setSize(Math.max(1,node.clientWidth),78,false);request();}
    const observer=new ResizeObserver(resize);observer.observe(node);resize();
    const visibility=()=>{visible=document.visibilityState==='visible';if(!visible&&frame!==null){cancelAnimationFrame(frame);frame=null;}else if(visible)request();};
    document.addEventListener('visibilitychange',visibility);engine.current={request};request();
    return()=>{engine.current=null;observer.disconnect();document.removeEventListener('visibilitychange',visibility);if(frame!==null)cancelAnimationFrame(frame);const geometries=new Set(),materials=new Set();scene.traverse(object=>{if(object.geometry)geometries.add(object.geometry);if(object.material)materials.add(object.material);});geometries.forEach(geometry=>geometry.dispose());materials.forEach(material=>material.dispose());renderer.dispose();renderer.domElement.remove();};
  },[]);
  useEffect(()=>engine.current?.request(),[activeRole,receipt,motionEnabled]);
  return <section className="role-cast" aria-label="Los seis roles de la mesa"><div ref={host} className="avatar-scene" aria-hidden="true"/>{fallback&&<div className="avatar-fallback" aria-hidden="true">{ROLES.map(role=><span key={role}>♟</span>)}</div>}<ul className="avatar-labels">{ROLES.map(role=><li key={role} aria-current={role===activeRole?'true':undefined} title={game.setup.names[role]}><span className="sr-only">{roleLabel(role)}: </span>{role==='Estado'?'Estado':role}</li>)}</ul></section>;
}
