import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

function MapFallback({game,onSelect}) {
  const positions={A:[194,208],B:[350,284],C:[506,208],F1:[194,119],F2:[350,58],Estado:[506,119]};
  const tree=(x,y,k)=> <g key={k} transform={`translate(${x} ${y})`}><path d="M0 9V-7" stroke="#877860" strokeWidth="4"/><path d="M-14 0 0-30 14 0Z" fill="#5d845b"/><path d="M0-30 14 0H0Z" fill="#466c4d"/></g>;
  return <svg className="valley-map" viewBox="0 0 700 410" role="img" aria-label="Mapa accesible del valle con seis organizaciones">
    <defs><filter id="soft"><feDropShadow dx="0" dy="10" stdDeviation="8" floodColor="#59704b" floodOpacity=".12"/></filter></defs>
    <path d="M350 53 656 206 350 371 44 206V192L350 39 656 192V206L350 357 44 206" fill="#bdc3a3"/>
    <path d="M350 39 656 192 350 357 44 192Z" fill="#b5c69e" filter="url(#soft)"/>
    <path d="m75 195 275-136 275 136-275 139Z" fill="#bdcdaa"/>
    <path d="M100 214q120-35 180 15t110-5q70-50 198-26" stroke="#8eafab" strokeWidth="14" fill="none" opacity=".85"/>
    {Object.values(positions).map(([x,y],i)=><path key={i} d={`M350 192 ${x} ${y+20}`} stroke="#e4dfc4" strokeWidth="8"/>)}
    <path d="m327 192 23-12 23 12-23 12Z" fill="#e7e9cf"/>
    {Object.entries(positions).map(([role,[x,y]])=><g key={role} transform={`translate(${x} ${y})`} className="map-place" role="button" tabIndex={0} aria-label={`Abrir ${game.setup.names[role]}`} onClick={()=>onSelect(role)} onKeyDown={e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();onSelect(role);}}}>
      <ellipse rx="60" ry="29" cy="18" fill="#c9d7b8" opacity=".8"/>
      {['A','B','C'].includes(role)?<><path d="m-38 5 46-23 36 18-46 23Z" fill="#eddbc0"/><path d="M-38 5v32L-2 55V23Z" fill="#c9b490"/><path d="M-2 23 44 0v32L-2 55Z" fill={role==='A'?'#ba9a7e':role==='B'?'#d4a498':'#91a4ad'}/><path d="m-43 4 51-26 40 20-51 26Z" fill="#5e7e6b"/><path d="m15-11 10-5v-31l-10 5Z" fill="#839181"/><path d="m25-16 5 3v-31l-5-3Z" fill="#687a70"/><path d="m15-42 10-5 5 3-10 5Z" fill="#abc0a3"/>
      {[0,1,2].map(i=><path key={i} d={`m${5+i*12} ${26-i*6} 7-3v9l-7 3Z`} fill="#f1e7bb"/>)}
      <ellipse cx="22" cy="-59" rx="8" ry="6" fill="#f0f1e5"/><ellipse cx="27" cy="-71" rx="12" ry="7" fill="#f0f1e5" opacity=".8"/></>:role.startsWith('F')?<>{tree(-24,2,1)}{tree(3,-12,2)}{tree(31,4,3)}{tree(0,24,4)}{game.foundations[role].capacity>=40&&tree(-43,18,5)}{game.foundations[role].capacity>=80&&tree(45,25,6)}<path d="m-10 23 16-8 16 8v15l-16 8-16-8Z" fill="#ded1ac"/><path d="m-14 21 20-22 21 22-21 11Z" fill="#6b8a66"/></>:<><path d="m-37 5 40-21 39 20v30L2 55-37 35Z" fill="#e0cfac"/><path d="m2 25 40-21v30L2 55Z" fill="#c9bb9a"/><path d="m-42 3 45-24L48 2 3 28Z" fill="#6b8b72"/><path d="m-42 3 45-34L48 2 3 16Z" fill="#7b9b7b"/>{[-25,-10,5].map((v,i)=><path key={i} d={`m${v} ${15+i*7}v22`} stroke="#f6e9c9" strokeWidth="5"/>)}<path d="m18 29 10-5v17l-10 5Z" fill="#66806c"/></>}
    </g>)}
    {[[102,176],[145,236],[218,272],[420,308],[589,169],[410,106],[295,115]].map(([x,y],i)=><g key={i} transform={`translate(${x} ${y}) scale(.6)`}>{tree(0,0,i)}</g>)}
  </svg>;
}

export default function Valley({ game, onSelect }) {
  const host = useRef(null), select = useRef(onSelect), [failed, setFailed] = useState(false);
  select.current = onSelect;
  const quantities = Object.values(game.draft.production).join('-');
  const capacities = Object.values(game.foundations).map(f => f.capacity).join('-');
  useEffect(() => {
    const container = host.current;
    let renderer;
    try { renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true }); }
    catch { setFailed(true); return; }
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0xe9eee4, 1);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.outputEncoding = THREE.sRGBEncoding;
    container.appendChild(renderer.domElement);
    const scene = new THREE.Scene();scene.fog = new THREE.Fog(0xe9eee4, 26, 55);
    const camera = new THREE.PerspectiveCamera(34, 1, .1, 100);
    camera.position.set(15, 17, 19);
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.target.set(0, .7, 0);controls.enableDamping = true;controls.enableZoom = false;controls.enablePan = false;
    controls.minPolarAngle = .45;controls.maxPolarAngle = 1.2;
    scene.add(new THREE.HemisphereLight(0xfff8e5, 0x728e66, .95));
    const sun = new THREE.DirectionalLight(0xfff2d5, 1.3);sun.position.set(-8, 20, 10);sun.castShadow = true;
    sun.shadow.mapSize.set(1024,1024);Object.assign(sun.shadow.camera,{left:-13,right:13,top:13,bottom:-13});sun.shadow.bias=-.001;scene.add(sun);
    const pickables = [], clouds = [];
    const mat = color => new THREE.MeshStandardMaterial({ color, roughness: .92, metalness: 0 });
    function mesh(geo, color, parent, x=0,y=0,z=0) {
      const m=new THREE.Mesh(geo, typeof color==='number'?mat(color):color);m.position.set(x,y,z);m.castShadow=true;m.receiveShadow=true;parent.add(m);return m;
    }
    const land=mesh(new THREE.CylinderGeometry(9.3,8.9,.7,64),0xa6ba8c,scene,0,-.4,0);
    mesh(new THREE.CylinderGeometry(9.4,9.5,.25,64),0xd2cbb2,scene,0,-.85,0);
    const ground=mesh(new THREE.PlaneGeometry(200,200),0xe9eee4,scene,0,-1.05,0);ground.rotation.x=-Math.PI/2;
    mesh(new THREE.CylinderGeometry(1.6,1.6,.05,48),0xdde4ca,scene,0,.01,0);
    mesh(new THREE.CylinderGeometry(.6,.6,.08,32),0x91b6b2,scene,0,.07,0);
    // Senderos de igual ancho conectan los seis espacios, sin un rol dominante.
    const positions = { A:[-4.9,0,3.6],B:[.2,0,6.2],C:[5.1,0,3.1],F1:[-4.9,0,-3.3],F2:[.3,0,-6.1],Estado:[5.3,0,-3.1] };
    for(const [role,pos] of Object.entries(positions)) {
      const group=new THREE.Group();group.position.set(...pos);scene.add(group);
      const pad=mesh(new THREE.CylinderGeometry(1.95,1.95,.05,36),0xd3dec1,group,0,0,0);pad.userData.role=role;
      const len=Math.hypot(pos[0],pos[2]);const path=mesh(new THREE.BoxGeometry(.4,.03,len-1.4),0xd9d3b9,scene,pos[0]/2,.02,pos[2]/2);
      path.rotation.y=Math.atan2(pos[0],pos[2]);
      if (['A','B','C'].includes(role)) {
        const colors={A:0xc7ab83,B:0xdda99b,C:0xa4b3c3};
        mesh(new THREE.BoxGeometry(2.0,1.1,1.25),colors[role],group,0,.6,0);
        mesh(new THREE.BoxGeometry(2.15,.18,1.4),0x526f63,group,0,1.25,0);
        for(let w=-.65;w<=.65;w+=.65)mesh(new THREE.BoxGeometry(.28,.34,.03),0xf8e7b3,group,w,.72,.64);
        mesh(new THREE.CylinderGeometry(.18,.23,1.8,12),0x7e8981,group,.6,1.3,-.35);
        for(let k=0;k<3;k++) {
          const material=new THREE.MeshStandardMaterial({color:0xf5f4ec,transparent:true,opacity:.55,roughness:1});
          const c=mesh(new THREE.SphereGeometry(.24+k*.09,9,7),material,group,.6,2.4+k*.45,-.35);
          clouds.push({m:c,base:2.3+k*.45,phase:k,volume:game.draft.production[role]/300});
        }
      } else if(role.startsWith('F')) {
        mesh(new THREE.BoxGeometry(.9,.6,.7),0xe3d9b7,group,.15,.35,.8);
        const roof=mesh(new THREE.ConeGeometry(.78,.45,4),0x59836b,group,.15,.88,.8);roof.rotation.y=Math.PI/4;
        const n=5+Math.floor(game.foundations[role].capacity/20);
        for(let i=0;i<n;i++) {
          const angle=i*2.399,rad=.5+(i%3)*.4,x=Math.cos(angle)*rad,z=Math.sin(angle)*rad-.3;
          mesh(new THREE.CylinderGeometry(.07,.1,.65,7),0x85715b,group,x,.35,z);
          mesh(new THREE.ConeGeometry(.42,.95,7),i%2?0x648858:0x3e725c,group,x,1,z);
        }
      } else {
        mesh(new THREE.BoxGeometry(1.8,.8,1.2),0xe5dabd,group,0,.45,0);
        const roof=mesh(new THREE.ConeGeometry(1.5,.4,4),0x5b7d6b,group,0,1.05,0);roof.rotation.y=Math.PI/4;
        for(let x=-.6;x<.8;x+=.4)mesh(new THREE.CylinderGeometry(.065,.065,.65,8),0xf6f2de,group,x,.48,.65);
      }
      group.traverse(obj=>{ if(obj.isMesh){obj.userData.role=role;pickables.push(obj);} });
    }
    // Vegetación de borde sin recursos externos ni texturas remotas.
    for(let i=0;i<22;i++) {
      const a=i*Math.PI*2/22, r=8.2;
      mesh(new THREE.ConeGeometry(.3,.8,6),0x709365,scene,Math.cos(a)*r,.4,Math.sin(a)*r);
    }
    const ray=new THREE.Raycaster(), pointer=new THREE.Vector2();let down;
    const pointerDown=e=>{down=[e.clientX,e.clientY];};
    const click=e=>{
      if(!down || Math.hypot(e.clientX-down[0],e.clientY-down[1])>7)return;
      const rect=renderer.domElement.getBoundingClientRect();
      pointer.set((e.clientX-rect.left)/rect.width*2-1,-(e.clientY-rect.top)/rect.height*2+1);
      ray.setFromCamera(pointer,camera);const hits=ray.intersectObjects(pickables);
      if(hits[0])select.current(hits[0].object.userData.role);
    };
    renderer.domElement.addEventListener('pointerdown',pointerDown);renderer.domElement.addEventListener('click',click);
    const resize=new ResizeObserver(()=>{ const w=container.clientWidth,h=container.clientHeight;renderer.setSize(w,h);camera.aspect=w/h;camera.updateProjectionMatrix(); });resize.observe(container);
    const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;let frame;
    const animate=time=>{
      frame=requestAnimationFrame(animate);controls.update();
      if(!reduced)for(const c of clouds){c.m.position.y=c.base+Math.sin(time*.0007+c.phase)*.13;c.m.position.x=.6+Math.sin(time*.0004+c.phase)*.2;c.m.scale.setScalar(.7+c.volume*.4);}
      renderer.render(scene,camera);
    };frame=requestAnimationFrame(animate);
    return()=>{
      cancelAnimationFrame(frame);resize.disconnect();controls.dispose();
      renderer.domElement.removeEventListener('pointerdown',pointerDown);renderer.domElement.removeEventListener('click',click);
      scene.traverse(o=>{o.geometry?.dispose(); if(o.material){const ms=Array.isArray(o.material)?o.material:[o.material];ms.forEach(m=>m.dispose());}});
      renderer.dispose();renderer.domElement.remove();
    };
  },[quantities,capacities]);
  return <div className="valley-wrap"><div ref={host} className="valley" role="img" aria-label="Valle 3D con tres empresas, dos fundaciones y un Estado. Use las tarjetas inferiores para abrir cada rol." />
    {failed ? <div className="scene-fallback"><MapFallback game={game} onSelect={onSelect}/><small>Vista de mapa · 3D disponible en dispositivos con WebGL</small></div> : <span className="scene-hint">Arrastra para explorar el valle</span>}
  </div>;
}
