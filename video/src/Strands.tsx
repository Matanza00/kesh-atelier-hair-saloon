import React, {useLayoutEffect, useRef, useState} from 'react';
import * as THREE from 'three';
import {continueRender, delayRender, useCurrentFrame, useVideoConfig} from 'remotion';

// The website's Three.js hair system, ported unchanged: every strand is shaped in the vertex shader,
// and cut length, dye, curl and gloss are uniforms. Here a timeline drives them instead of scroll.
export type StrandState = {cut: number; dye: number; curl: number; freq: number; gloss: number; frizz: number; blade: number; rotY: number; camZ: number; x: number; y: number; alpha: number};

const rng = (seed: number) => () => { seed |= 0; seed = (seed + 0x6d2b79f5) | 0; let t = Math.imul(seed ^ (seed >>> 15), 1 | seed); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };

const VERT = `
uniform float uTime,uCut,uLenMax,uCurl,uFreq,uWave,uDye,uGloss,uFrizz;
uniform vec3 uNatA,uNatB,uDyeA,uDyeB;
attribute float aT; attribute vec4 aRnd;
varying vec3 vCol; varying float vA;
void main(){
  float L=min(uLenMax*(0.78+0.22*aRnd.x),uCut*(0.985+0.03*aRnd.y));
  float s=aT*L; float ph=aRnd.z*6.2831853; vec3 p=position;
  p.y-=s*(1.0-uCurl*0.2); p.x+=position.x*0.09*s;
  float sw=s*s*0.06*uWave;
  p.x+=sin(s*1.4-uTime*0.8+ph+position.x)*sw; p.z+=cos(s*1.1-uTime*0.6+ph)*sw*0.8;
  float amp=uCurl*0.1*smoothstep(0.05,0.7,s); float ang=s*uFreq*3.14159+ph+uTime*0.15;
  p.x+=cos(ang)*amp; p.z+=sin(ang)*amp;
  float fz=uFrizz*0.02*smoothstep(0.3,1.0,aT);
  p.x+=sin(aT*53.0+aRnd.w*91.0)*fz; p.y+=sin(aT*31.0+aRnd.z*57.0)*fz*0.6; p.z+=cos(aT*47.0+aRnd.x*77.0)*fz;
  vec3 nat=mix(uNatA,uNatB,aT); float edge=uDye*1.15;
  float dyed=1.0-smoothstep(edge-0.1,edge,aT);
  vec3 c=mix(nat,mix(uDyeA,uDyeB,aT),dyed);
  float band=0.32+0.12*sin(uTime*0.5+position.x*1.7);
  c+=vec3(1.0,0.9,0.8)*exp(-pow((aT-band)*6.0,2.0))*(0.1+0.6*uGloss);
  c*=0.85+0.35*uGloss;
  vCol=c; vA=(0.55+0.45*aRnd.y)*(1.0-smoothstep(0.82,1.0,aT)*0.85);
  gl_Position=projectionMatrix*modelViewMatrix*vec4(p,1.0);
}`;
const FRAG = `uniform float uAlpha; varying vec3 vCol; varying float vA; void main(){ gl_FragColor=vec4(vCol,vA*uAlpha); }`;

type Bundle = {renderer: THREE.WebGLRenderer; scene: THREE.Scene; camera: THREE.PerspectiveCamera; group: THREE.Group; hair: THREE.ShaderMaterial; spark: THREE.ShaderMaterial; blade: THREE.Mesh; bladeMat: THREE.ShaderMaterial};

export const Strands: React.FC<{state: (frame: number) => StrandState; width: number; height: number; strands?: number}> = ({state, width, height, strands = 3000}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const canvas = useRef<HTMLCanvasElement>(null);
  const bundle = useRef<Bundle | null>(null);
  const [handle] = useState(() => delayRender('three.js strands'));

  useLayoutEffect(() => {
    const cv = canvas.current!;
    const renderer = new THREE.WebGLRenderer({canvas: cv, antialias: true, alpha: true, preserveDrawingBuffer: true});
    renderer.setPixelRatio(1); renderer.setSize(width, height, false); renderer.setClearColor(0x000000, 0);
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(35, width / height, 0.1, 50);
    const group = new THREE.Group(); scene.add(group);
    const R = rng(7);
    const SEG = 56, vc = strands * (SEG - 1) * 2;
    const pos = new Float32Array(vc * 3), aT = new Float32Array(vc), aR = new Float32Array(vc * 4);
    let k = 0;
    for (let i = 0; i < strands; i++) {
      const u = R() * 2 - 1, rx = Math.sign(u) * Math.pow(Math.abs(u), 0.85) * 1.7, rz = (R() - 0.5) * 0.55;
      const ry = 1.75 - 0.2 * rx * rx + (R() - 0.5) * 0.05, r = [R(), R(), R(), R()];
      for (let j = 0; j < SEG - 1; j++) for (let e = 0; e < 2; e++) {
        pos[k * 3] = rx; pos[k * 3 + 1] = ry; pos[k * 3 + 2] = rz; aT[k] = (j + e) / (SEG - 1);
        aR[k * 4] = r[0]; aR[k * 4 + 1] = r[1]; aR[k * 4 + 2] = r[2]; aR[k * 4 + 3] = r[3]; k++;
      }
    }
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    g.setAttribute('aT', new THREE.BufferAttribute(aT, 1));
    g.setAttribute('aRnd', new THREE.BufferAttribute(aR, 4));
    const hair = new THREE.ShaderMaterial({
      transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, vertexShader: VERT, fragmentShader: FRAG,
      uniforms: {uTime: {value: 0}, uCut: {value: 4}, uLenMax: {value: 3.9}, uCurl: {value: 0}, uFreq: {value: 1.5}, uWave: {value: 1}, uDye: {value: 0}, uGloss: {value: 0}, uFrizz: {value: 1}, uAlpha: {value: 0.26},
        uNatA: {value: new THREE.Color('#5a3424')}, uNatB: {value: new THREE.Color('#b8845a')}, uDyeA: {value: new THREE.Color('#a5532b')}, uDyeB: {value: new THREE.Color('#f2a85c')}},
    });
    const hairMesh = new THREE.LineSegments(g, hair); hairMesh.frustumCulled = false; group.add(hairMesh);
    const M = 500, sp = new Float32Array(M * 3), ss = new Float32Array(M);
    for (let i = 0; i < M; i++) { sp[i * 3] = (R() - 0.5) * 4.4; sp[i * 3 + 1] = 1.9 - R() * 3.4; sp[i * 3 + 2] = (R() - 0.5) * 1.4; ss[i] = R(); }
    const sg = new THREE.BufferGeometry(); sg.setAttribute('position', new THREE.BufferAttribute(sp, 3)); sg.setAttribute('aS', new THREE.BufferAttribute(ss, 1));
    const spark = new THREE.ShaderMaterial({transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, uniforms: {uTime: {value: 0}, uGloss: {value: 0}},
      vertexShader: `uniform float uTime,uGloss; attribute float aS; varying float vA; void main(){ vec3 p=position; p.y+=sin(uTime*0.4+aS*20.0)*0.06; vec4 mv=modelViewMatrix*vec4(p,1.0); float tw=0.5+0.5*sin(uTime*(1.4+aS*2.2)+aS*40.0); vA=tw*(0.04+0.85*uGloss); gl_PointSize=(3.0+aS*9.0)*(3.2/-mv.z); gl_Position=projectionMatrix*mv; }`,
      fragmentShader: `varying float vA; void main(){ float r=length(gl_PointCoord-0.5); float a=smoothstep(0.5,0.0,r); a*=a; gl_FragColor=vec4(1.0,0.9,0.76,a*vA); }`});
    const sparks = new THREE.Points(sg, spark); sparks.frustumCulled = false; group.add(sparks);
    const bladeMat = new THREE.ShaderMaterial({transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, uniforms: {uO: {value: 0}},
      vertexShader: `varying vec2 vUv; void main(){ vUv=uv; gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.0); }`,
      fragmentShader: `uniform float uO; varying vec2 vUv; void main(){ float y=vUv.y-0.5; float a=exp(-pow(y*70.0,2.0))+0.35*exp(-pow(y*9.0,2.0)); a*=smoothstep(0.0,0.2,vUv.x)*smoothstep(1.0,0.8,vUv.x); gl_FragColor=vec4(0.98,0.86,0.68,a*uO); }`});
    const blade = new THREE.Mesh(new THREE.PlaneGeometry(4.8, 0.3), bladeMat); blade.position.z = 0.4; group.add(blade);
    bundle.current = {renderer, scene, camera, group, hair, spark, blade, bladeMat};
    continueRender(handle);
    return () => { renderer.dispose(); g.dispose(); sg.dispose(); };
  }, []);

  useLayoutEffect(() => {
    const b = bundle.current; if (!b) return;
    const s = state(frame), t = frame / fps, u = b.hair.uniforms;
    u.uTime.value = t; u.uCut.value = s.cut; u.uDye.value = s.dye; u.uCurl.value = s.curl; u.uFreq.value = s.freq; u.uGloss.value = s.gloss; u.uFrizz.value = s.frizz; u.uAlpha.value = 0.26 * s.alpha;
    b.spark.uniforms.uTime.value = t; b.spark.uniforms.uGloss.value = s.gloss * s.alpha;
    b.bladeMat.uniforms.uO.value = s.blade; b.blade.position.y = 1.72 - s.cut;
    b.group.position.set(s.x, s.y, 0); b.group.rotation.y = s.rotY;
    b.camera.position.set(0, 0, s.camZ); b.camera.lookAt(0, 0.1, 0);
    b.renderer.render(b.scene, b.camera);
  }, [frame]);

  return <canvas ref={canvas} width={width} height={height} style={{width, height}} />;
};
