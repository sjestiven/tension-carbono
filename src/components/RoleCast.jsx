import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { ROLES } from '../engine.js';
import { roleLabel } from '../motion.js';
import { DEFAULT_AVATAR_GENDERS } from '../table_setup.js';

const colors={Estado:0x245443,A:0x806326,B:0x395f94,C:0x79516f,F1:0x397552,F2:0x296f78};

export default function RoleCast({game,activeRole,receipt,motionEnabled}) {
  const host=useRef(),engine=useRef();
  const latest=useRef({activeRole,receipt,motionEnabled});latest.current={activeRole,receipt,motionEnabled};
  const [fallback,setFallback]=useState(false);
  const styleKey = ROLES.map(role => game.setup.avatarGenders?.[role] ?? DEFAULT_AVATAR_GENDERS[role]).join(',');

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
    const block = new THREE.BoxGeometry(1, 1, 1);
    const materialFor = color => {
      const material = new THREE.MeshStandardMaterial({ color, roughness: .9 });
      material.color.convertSRGBToLinear();
      return material;
    };
    const navy = materialFor(0x273746);
    const shirt = materialFor(0xe9ece7);
    const gold = materialFor(0xe1b858);
    const hair = materialFor(0x342b29);
    const skinTones = [0xc49171, 0xe1b28d, 0x9d6549, 0xd5a082, 0xb17b60, 0xe7c29c].map(materialFor);
    const styles = styleKey.split(',');
    const figures = [], markers = [];
    const add = (geometry, material, parent, x, y, z = 0) => {
      const mesh = new THREE.Mesh(geometry, material);
      mesh.position.set(x, y, z);
      parent.add(mesh);
      return mesh;
    };
    function box(group, material, position, size) {
      const mesh = add(block, material, group, ...position);
      mesh.scale.set(...size);
      return mesh;
    }

    for (const [index, role] of ROLES.entries()) {
      const group = new THREE.Group();
      group.position.x = (index - 2.5) * 1.24;
      scene.add(group);
      const jacket = materialFor(colors[role]);
      const skin = skinTones[index];
      const style = styles[index];

      box(group, jacket, [0, .59, 0], [.49, .48, .29]);
      box(group, shirt, [0, .70, .15], [.18, .25, .025]);
      box(group, navy, [0, .67, .17], [.045, .19, .025]);
      box(group, gold, [.15, .68, .16], [.07, .055, .025]);
      box(group, skin, [0, 1.03, 0], [.34, .34, .32]);
      box(group, hair, [0, 1.19, -.016], [.37, .095, .34]);
      if (style === 'woman') {
        box(group, hair, [-.17, 1.03, -.055], [.085, .29, .25]);
        box(group, hair, [.17, 1.03, -.055], [.085, .29, .25]);
      } else if (style === 'other') {
        box(group, hair, [-.06, 1.24, -.025], [.24, .08, .29]);
      } else {
        box(group, hair, [.115, 1.145, .11], [.14, .10, .13]);
      }
      for (const side of [-1, 1]) {
        box(group, navy, [side * .067, 1.047, .166], [.025, .038, .018]);
        box(group, jacket, [side * .32, .60, 0], [.135, .34, .17]);
        box(group, skin, [side * .32, .397, 0], [.127, .106, .15]);
        box(group, navy, [side * .12, .205, 0], [.18, .32, .20]);
        box(group, navy, [side * .12, .07, .028], [.19, .09, .27]);
      }
      const marker = add(new THREE.CylinderGeometry(.43, .43, .025, 20),
        new THREE.MeshBasicMaterial({ color: 0xd5b05f, transparent: true, opacity: .25 }), group, 0, .015);
      figures.push(group);
      markers.push(marker);
    }
    const tokenGeometry=new THREE.SphereGeometry(.075,8,6),creditGeometry=new THREE.OctahedronGeometry(.09);
    const tokenMaterial=new THREE.MeshBasicMaterial({color:0xd09a34}),creditMaterial=new THREE.MeshBasicMaterial({color:0x2e7956});
    const transfers=Array.from({length:3},()=>({token:add(tokenGeometry,tokenMaterial,scene,0,.7,.5),credit:add(creditGeometry,creditMaterial,scene,0,.7,.5)}));
    let frame=null,visible=true;
    function render() {
      frame=null;
      if(!visible)return;
      const state=latest.current,elapsed=state.receipt?Date.now()-state.receipt.createdAt:1000;
      const animating=state.motionEnabled&&elapsed>=0&&elapsed<450;
      figures.forEach((figure,index)=>{const active=ROLES[index]===state.activeRole;figure.scale.setScalar(active?1.09:1);markers[index].material.opacity=active ? .8 : .15;});
      transfers.forEach(({token,credit})=>{token.visible=false;credit.visible=false;});
      if(animating) {
        const entries=state.receipt.entries.filter(entry=>ROLES.includes(entry.from)&&ROLES.includes(entry.to)&&entry.from!==entry.to);
        entries.slice(0,3).forEach((entry,index)=>{
          const {token,credit}=transfers[index],start=ROLES.indexOf(entry.from),end=ROLES.indexOf(entry.to);
          const progress=elapsed/450,t=progress*progress*(3-2*progress);
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
  },[styleKey]);
  useEffect(()=>engine.current?.request(),[activeRole,receipt,motionEnabled]);
  return <section className="role-cast" aria-label="Los seis roles de la mesa">
    <div ref={host} className="avatar-scene" aria-hidden="true" />
    {fallback && <div className="avatar-fallback" aria-hidden="true">{ROLES.map(role => <span key={role}>♟</span>)}</div>}
    <ul className="avatar-labels">{ROLES.map(role => {
      const player = game.setup.players[role];
      return <li key={role} aria-current={role === activeRole ? 'true' : undefined} title={player ? `${game.setup.names[role]} · ${player}` : game.setup.names[role]}>
        <span className="sr-only">{roleLabel(role)}: </span>
        {role}
        {player && <span className="avatar-player">{player}</span>}
      </li>;
    })}</ul>
  </section>;
}
