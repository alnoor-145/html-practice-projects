import React, {useLayoutEffect, useMemo} from 'react';
import {useCurrentFrame} from 'remotion';
import {ThreeCanvas} from '@remotion/three';
import {useThree} from '@react-three/fiber';
import * as THREE from 'three';
import {A, FPS, H, W} from './lib';

// Real 3D scene (three.js): launch pad + rocket, then Bangabandhu-style satellite in orbit. All shapes are built here from primitives.
const clamp = (x: number, a = 0, b = 1) => Math.min(b, Math.max(a, x));
const ease = (x: number) => 1 - Math.pow(1 - clamp(x), 3);
const lerp = (a: number, b: number, k: number) => a + (b - a) * clamp(k);

const Cam: React.FC<{pos: [number, number, number]; look: [number, number, number]; fov?: number}> = ({pos, look, fov = 40}) => {
  const {camera} = useThree();
  useLayoutEffect(() => {
    camera.position.set(...pos);
    camera.lookAt(...look);
    (camera as THREE.PerspectiveCamera).fov = fov;
    (camera as THREE.PerspectiveCamera).updateProjectionMatrix();
  });
  return null;
};

const Stars: React.FC = () => {
  const geo = useMemo(() => {
    const g = new THREE.BufferGeometry();
    const n = 1800; const p = new Float32Array(n * 3);
    let s = 7; const rnd = () => { s = (s * 16807) % 2147483647; return s / 2147483647; };
    for (let i = 0; i < n; i++) { const u = rnd() * 2 - 1, th = rnd() * Math.PI * 2, r = Math.sqrt(1 - u * u); p[i * 3] = 500 * r * Math.cos(th); p[i * 3 + 1] = 500 * u; p[i * 3 + 2] = 500 * r * Math.sin(th); }
    g.setAttribute('position', new THREE.BufferAttribute(p, 3)); return g;
  }, []);
  return <points geometry={geo}><pointsMaterial color="#ffffff" size={2.2} sizeAttenuation={false} /></points>;
};

const Earth: React.FC<{r: number; rot: number}> = ({r, rot}) => {
  const geo = useMemo(() => {
    const g = new THREE.SphereGeometry(1, 96, 96);
    const pos = g.attributes.position; const col = new Float32Array(pos.count * 3);
    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i), y = pos.getY(i), z = pos.getZ(i);
      const n = Math.sin(x * 3.1 + Math.sin(y * 2.3 + z)) + Math.sin(y * 4.7 + z * 1.9 + x) * 0.8 + Math.sin(z * 6.1 + x * 2.2) * 0.5 + Math.sin(x * 9 + y * 7) * 0.25;
      let c = new THREE.Color();
      if (Math.abs(y) > 0.92) c.set('#EEF3FF'); else if (n > 0.55) c.set(n > 1.2 ? '#8A9A5B' : '#3C9A5F'); else c.set(n > 0.3 ? '#2C7FC0' : '#175E9E');
      col[i * 3] = c.r; col[i * 3 + 1] = c.g; col[i * 3 + 2] = c.b;
    }
    g.setAttribute('color', new THREE.BufferAttribute(col, 3)); return g;
  }, []);
  const atm = useMemo(() => new THREE.ShaderMaterial({
    transparent: true, side: THREE.BackSide, blending: THREE.AdditiveBlending, depthWrite: false,
    vertexShader: 'varying vec3 vN; void main(){ vN = normalize(normalMatrix*normal); gl_Position = projectionMatrix*modelViewMatrix*vec4(position,1.0);}',
    fragmentShader: 'varying vec3 vN; void main(){ float i = pow(0.72 - dot(vN, vec3(0.0,0.0,1.0)), 3.0); gl_FragColor = vec4(0.35,0.65,1.0,1.0)*i*1.6; }',
  }), []);
  return (
    <group scale={r} rotation={[0.35, rot, 0.2]}>
      <mesh geometry={geo}><meshStandardMaterial vertexColors roughness={0.85} metalness={0} /></mesh>
      <mesh scale={1.1} material={atm}><sphereGeometry args={[1, 64, 64]} /></mesh>
    </group>
  );
};

const Satellite: React.FC<{deploy: number; spin: number}> = ({deploy, spin}) => (
  <group rotation={[0.2, spin, 0.1]}>
    <mesh castShadow><boxGeometry args={[2.2, 2.2, 3.4]} /><meshStandardMaterial color="#F2C865" metalness={0.35} roughness={0.45} /></mesh>
    <mesh position={[0, 0, 1.75]}><boxGeometry args={[1.9, 1.9, 0.12]} /><meshStandardMaterial color="#C9CDE0" metalness={0.6} roughness={0.4} /></mesh>
    {[-1, 1].map((s) => (
      <group key={s} position={[s * 1.1, 0, 0]}>
        <mesh position={[s * 0.45 * deploy, 0, 0]} rotation={[0, 0, Math.PI / 2]}><cylinderGeometry args={[0.07, 0.07, 0.9 * deploy + 0.01, 10]} /><meshStandardMaterial color="#C9CDE0" metalness={0.8} roughness={0.3} /></mesh>
        <group position={[s * (0.9 + 2.9 * deploy) * 1.0, 0, 0]} scale={[Math.max(0.02, deploy), 1, 1]}>
          <mesh><boxGeometry args={[5.8, 0.07, 2.6]} /><meshStandardMaterial color="#1D3F8F" metalness={0.5} roughness={0.25} emissive="#0A1E4F" emissiveIntensity={0.6} /></mesh>
          {[-1.9, -0.95, 0, 0.95, 1.9].map((x) => <mesh key={x} position={[x, 0.045, 0]}><boxGeometry args={[0.04, 0.02, 2.6]} /><meshStandardMaterial color="#9FB4E6" /></mesh>)}
        </group>
      </group>
    ))}
    <group position={[0, -0.2, -2.1]}>
      <mesh rotation={[-Math.PI / 2, 0, 0]}><cylinderGeometry args={[0.12, 0.12, 0.9, 10]} /><meshStandardMaterial color="#C9CDE0" metalness={0.8} roughness={0.3} /></mesh>
      <mesh position={[0, 0, -0.5]} rotation={[Math.PI / 2, 0, 0]}><sphereGeometry args={[1.1, 32, 16, 0, Math.PI * 2, 0, Math.PI / 2.4]} /><meshStandardMaterial color="#F5F7FF" metalness={0.3} roughness={0.4} side={THREE.DoubleSide} /></mesh>
    </group>
  </group>
);

const Rocket: React.FC<{flame: number; tNow: number}> = ({flame, tNow}) => {
  const nose = useMemo(() => { const pts: THREE.Vector2[] = []; for (let i = 0; i <= 14; i++) { const y = (i / 14) * 5; pts.push(new THREE.Vector2(1.8 * Math.sqrt(Math.max(0, 1 - Math.pow(y / 5, 1.7))), y)); } return pts; }, []);
  const flick = 0.85 + 0.25 * Math.sin(tNow * 45) + 0.1 * Math.sin(tNow * 71);
  return (
    <group>
      <mesh position={[0, 8, 0]} castShadow><cylinderGeometry args={[1.8, 1.8, 16, 40]} /><meshStandardMaterial color="#F2F4FF" metalness={0.25} roughness={0.35} /></mesh>
      <mesh position={[0, 9.5, 0]}><cylinderGeometry args={[1.83, 1.83, 0.5, 40]} /><meshStandardMaterial color="#14102E" roughness={0.6} /></mesh>
      <mesh position={[0, 16.5, 0]} castShadow><cylinderGeometry args={[1.8, 1.8, 1, 40]} /><meshStandardMaterial color="#222A4A" metalness={0.4} roughness={0.5} /></mesh>
      <mesh position={[0, 21.5, 0]} castShadow><cylinderGeometry args={[1.8, 1.8, 9, 40]} /><meshStandardMaterial color="#F2F4FF" metalness={0.25} roughness={0.35} /></mesh>
      <mesh position={[0, 26, 0]} castShadow><latheGeometry args={[nose, 40]} /><meshStandardMaterial color="#F5F7FF" metalness={0.2} roughness={0.3} /></mesh>
      <mesh position={[0, 12.5, 1.82]}><planeGeometry args={[0.9, 6]} /><meshStandardMaterial color="#FF4D6D" /></mesh>
      {[0, 1, 2, 3].map((i) => <mesh key={i} position={[Math.cos((i * Math.PI) / 2 + 0.78) * 2.3, 1.8, Math.sin((i * Math.PI) / 2 + 0.78) * 2.3]} rotation={[0, -((i * Math.PI) / 2 + 0.78), 0]} castShadow><boxGeometry args={[1.8, 3.4, 0.18]} /><meshStandardMaterial color="#2B2F4F" metalness={0.5} roughness={0.5} /></mesh>)}
      {[0, 1, 2].map((i) => <mesh key={'n' + i} position={[Math.cos((i * 2 * Math.PI) / 3) * 0.8, -0.3, Math.sin((i * 2 * Math.PI) / 3) * 0.8]}><cylinderGeometry args={[0.45, 0.65, 1.1, 20]} /><meshStandardMaterial color="#555B80" metalness={0.8} roughness={0.35} /></mesh>)}
      {flame > 0 && (
        <group position={[0, -0.8, 0]} scale={[flame, flame * flick, flame]}>
          <mesh position={[0, -4.5, 0]} rotation={[Math.PI, 0, 0]}><coneGeometry args={[1.5, 9, 24]} /><meshBasicMaterial color="#FF8A2F" transparent opacity={0.85} /></mesh>
          <mesh position={[0, -3.2, 0]} rotation={[Math.PI, 0, 0]}><coneGeometry args={[0.8, 6.4, 24]} /><meshBasicMaterial color="#FFE9A8" transparent opacity={0.95} /></mesh>
          <pointLight position={[0, -3, 0]} color="#FF9A3F" intensity={flame * 900} distance={70} />
        </group>
      )}
    </group>
  );
};

const Pad: React.FC = () => (
  <group>
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.01, 0]} receiveShadow><planeGeometry args={[600, 600]} /><meshStandardMaterial color="#232744" roughness={0.95} /></mesh>
    <mesh position={[0, -1.4, 0]} receiveShadow castShadow><boxGeometry args={[14, 2.8, 14]} /><meshStandardMaterial color="#454B6E" roughness={0.8} /></mesh>
    <mesh position={[0, -0.4, 0]}><boxGeometry args={[7, 0.2, 7]} /><meshStandardMaterial color="#14102E" roughness={0.9} /></mesh>
    {[[-8, 0], [8, 0], [0, -8], [0, 8]].map(([x, z], i) => <mesh key={i} position={[x, 18, z]} castShadow><cylinderGeometry args={[0.18, 0.18, 36, 8]} /><meshStandardMaterial color="#8A93B2" metalness={0.7} roughness={0.4} /></mesh>)}
    <group position={[-9.5, 0, 0]}>
      {[-1.2, 1.2].map((z) => [0, 1].map((k) => <mesh key={z + '' + k} position={[0, 17, z]} castShadow><boxGeometry args={[0.45, 34, 0.45]} /><meshStandardMaterial color="#C0C6E4" metalness={0.5} roughness={0.5} /></mesh>))}
      {Array.from({length: 11}).map((_, i) => <mesh key={i} position={[0, 3 + i * 3, 0]}><boxGeometry args={[0.35, 0.35, 2.8]} /><meshStandardMaterial color="#C0C6E4" metalness={0.5} roughness={0.5} /></mesh>)}
      {[10, 20, 30].map((y) => <mesh key={y} position={[4.5, y, 0]} castShadow><boxGeometry args={[9, 0.35, 2]} /><meshStandardMaterial color="#8A93B2" metalness={0.5} roughness={0.5} /></mesh>)}
    </group>
    {[[-14, 0, 0], [14, 0, 5], [0, 0, -16]].map(([x, y, z], i) => <mesh key={i} position={[x as number, 6, z as number]} castShadow><cylinderGeometry args={[0.3, 0.3, 12, 8]} /><meshStandardMaterial color="#9FA6C8" /></mesh>)}
  </group>
);

export const Scene3D: React.FC<{tOverride?: number}> = ({tOverride}) => {
  const frame = useCurrentFrame();
  const t = tOverride ?? frame / FPS;
  const padWorld = t < 62;
  // pad world
  const ign = A.launch + 0.2, t0 = A.launch + 2.2;
  const lift = Math.max(0, t - t0);
  const rocketY = t < t0 ? 0 : 0.55 * lift * lift * lift * 0.5 + 0.9 * lift * lift;
  const flame = t < ign ? 0 : ease((t - ign) / 1.4);
  const stopRed = t > A.s58 + 0.9 && t < A.next;
  const ang = -0.5 + t * 0.045 + (t > A.launch ? 0.4 : 0);
  const rad = t < A.next ? lerp(88, 66, t / 45) : lerp(70, 120, (t - A.launch) / 12);
  const camY = t < A.launch ? 10 + 3 * Math.sin(t * 0.3) : 9 + rocketY * 0.75;
  const lookY = t < A.launch ? 15 : 15 + rocketY * 0.92;
  const padCam: [number, number, number] = [Math.sin(ang) * rad, camY, Math.cos(ang) * rad];
  // space world
  const dep = ease((t - A.comms) / 2.2);
  const spin = t * 0.25;
  let spaceCam: [number, number, number], spaceLook: [number, number, number], earthR: number, earthPos: [number, number, number], satPos: [number, number, number], satScale: number;
  if (t < A.orbit) {
    earthR = 45; earthPos = [10, -52, -26]; satPos = [0, 0, 0]; satScale = 1;
    const a2 = 0.9 + (t - 62) * 0.05; spaceCam = [Math.sin(a2) * 44, 3 + 2 * Math.sin(t * 0.4), Math.cos(a2) * 44]; spaceLook = [0, 0, 0];
  } else {
    earthR = 4.6; earthPos = [0, 0, 0];
    const th = (t - A.orbit) * 0.16 + 0.6; satPos = [Math.cos(th) * 9, 0.4, Math.sin(th) * 9]; satScale = 0.3;
    if (t < A.life) { spaceCam = [0, 9, 44]; spaceLook = [0, 0, 0]; }
    else if (t < A.q) { spaceCam = [satPos[0] * 1.0 + 4, 1.6, satPos[2] + 6.5]; spaceLook = satPos; }
    else { const k = ease((t - A.q) / 6); spaceCam = [lerp(satPos[0] + 4, 0, k), lerp(1.6, 10, k), lerp(satPos[2] + 6.5, 46, k)]; spaceLook = [lerp(satPos[0], 0, k), 0, lerp(satPos[2], 0, k)]; }
  }
  const smoke = Array.from({length: 16}, (_, i) => i);
  return (
    <ThreeCanvas width={W} height={H} shadows camera={{fov: 40, position: [0, 10, 50], near: 0.1, far: 2000}} style={{position: 'absolute', inset: 0}}>
      <color attach="background" args={['#0C0820']} />
      {padWorld && <fog attach="fog" args={['#0C0820', 90, 400]} />}
      <Stars />
      <ambientLight intensity={padWorld ? 0.9 : 0.75} color="#B9C8FF" />
      <hemisphereLight args={["#DDE6FF", "#2A2250", padWorld ? 0.6 : 0.9]} />
      <directionalLight position={[30, 40, 25]} intensity={padWorld ? 2.2 : 3.2} color="#FFF1DC" castShadow shadow-mapSize={[1024, 1024]} shadow-camera-left={-40} shadow-camera-right={40} shadow-camera-top={60} shadow-camera-bottom={-20} shadow-camera-near={1} shadow-camera-far={200} />
      <directionalLight position={[-20, 10, -30]} intensity={0.9} color="#6D8BFF" />
      {stopRed && <pointLight position={[0, 18, 8]} color="#FF3355" intensity={Math.max(0, Math.sin(t * 7)) * 900} distance={60} />}
      {padWorld ? (
        <>
          <Cam pos={padCam} look={[0, lookY, 0]} fov={42} />
          <Pad />
          <group position={[0, rocketY, 0]}><Rocket flame={flame} tNow={t} /></group>
          {t > ign && smoke.map((i) => { const k = clamp((t - ign - i * 0.12) / 3.5); if (k <= 0 || k >= 1) return null; const a = (i * 2.4) % (Math.PI * 2); const d = 3 + k * 16; return <mesh key={i} position={[Math.cos(a) * d, 1 + k * 5, Math.sin(a) * d]} scale={2 + k * 7}><sphereGeometry args={[1, 14, 12]} /><meshBasicMaterial color="#E8E8F2" transparent opacity={0.55 * (1 - k)} /></mesh>; })}
        </>
      ) : (
        <>
          <Cam pos={spaceCam} look={spaceLook} fov={t < A.orbit ? 38 : 34} />
          <group position={earthPos}><Earth r={earthR} rot={t * 0.03} /></group>
          {t >= A.orbit && <mesh rotation={[Math.PI / 2, 0, 0]}><torusGeometry args={[9, 0.03, 8, 160]} /><meshBasicMaterial color="#9FB4E6" transparent opacity={0.6} /></mesh>}
          <group position={satPos} scale={satScale}><Satellite deploy={t < A.comms ? 0 : dep} spin={spin} /></group>
        </>
      )}
    </ThreeCanvas>
  );
};
