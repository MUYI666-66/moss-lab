import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { TubeGeometry, Vector3, MathUtils } from 'three';

// ── Create organic tube with noise (unchanged) ──
function createOrganicTube(curve, tubularSegments, radius, radialSegments) {
  const baseGeo = new TubeGeometry(curve, tubularSegments, radius, radialSegments, false);
  const positions = baseGeo.attributes.position.array;

  for (let i = 0; i < positions.length; i += 3) {
    const x = positions[i];
    const y = positions[i + 1];
    const z = positions[i + 2];
    const noise = 1 + Math.sin(x * 12) * Math.cos(z * 12) * Math.sin(y * 8) * 0.08;
    positions[i] = x * noise;
    positions[i + 1] = y * noise;
    positions[i + 2] = z * noise;
  }

  baseGeo.computeVertexNormals();
  return baseGeo;
}

// ── Per-frame vertex deformation ──
const INFLUENCE_RADIUS = 1.4;
const STRENGTH = 0.36;
const WAVE_AMPLITUDE = 0.015;

function deformTube(geo, rest, mouse, time) {
  const pos = geo.attributes.position.array;

  for (let i = 0; i < pos.length; i += 3) {
    const rx = rest[i];
    const ry = rest[i + 1];
    const rz = rest[i + 2];

    // Distance to 3D mouse（both in group-local space）
    const dx = rx - mouse.x;
    const dy = ry - mouse.y;
    const dz = rz - mouse.z;
    const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);

    // ── 1. Mouse influence (smoothstep-like quadratic falloff) ──
    let influence = 0;
    if (dist < INFLUENCE_RADIUS) {
      const t = 1 - dist / INFLUENCE_RADIUS;
      influence = t * t * STRENGTH;
    }

    // ── 2. Organic wave ──
    const wave =
      Math.sin(rx * 4.0 + time * 1.2) *
        Math.cos(rz * 3.5 + time * 0.9) *
        WAVE_AMPLITUDE +
      Math.sin(ry * 5.5 + time * 0.7) * WAVE_AMPLITUDE * 0.7;

    // ── 3. Displace along radial direction from mouse ──
    const invDist = 1 / (dist + 0.0001);
    const displacement = influence + wave;

    pos[i] = rx + dx * invDist * displacement;
    pos[i + 1] = ry + dy * invDist * displacement;
    pos[i + 2] = rz + dz * invDist * displacement;
  }

  geo.attributes.position.needsUpdate = true;
  geo.computeVertexNormals();
}

export default function MossBranch({ curves, isMobile, mouse3D }) {
  const { mainCurve, forkCurve, twigCurve } = curves;
  const tubularSegments = isMobile ? 120 : 200;
  const radialSegments = isMobile ? 10 : 16;

  const mainGeo = useMemo(
    () => createOrganicTube(mainCurve, tubularSegments, 0.14, radialSegments),
    [mainCurve, tubularSegments, radialSegments],
  );

  const forkGeo = useMemo(
    () => createOrganicTube(forkCurve, Math.floor(tubularSegments * 0.5), 0.07, radialSegments),
    [forkCurve, tubularSegments, radialSegments],
  );

  const twigGeo = useMemo(
    () => createOrganicTube(twigCurve, Math.floor(tubularSegments * 0.25), 0.04, radialSegments),
    [twigCurve, tubularSegments, radialSegments],
  );

  // ── Store rest positions once ──
  const mainRest = useRef();
  const forkRest = useRef();
  const twigRest = useRef();
  if (!mainRest.current) {
    mainRest.current = new Float32Array(mainGeo.attributes.position.array);
    forkRest.current = new Float32Array(forkGeo.attributes.position.array);
    twigRest.current = new Float32Array(twigGeo.attributes.position.array);
  }

  // ── Deform each frame ──
  useFrame((state) => {
    const m = mouse3D?.current;
    if (!m || m.y < -3) return; // mouse offscreen
    const time = state.clock.getElapsedTime();

    deformTube(mainGeo, mainRest.current, m, time);
    deformTube(forkGeo, forkRest.current, m, time);
    deformTube(twigGeo, twigRest.current, m, time);
  });

  // ── Sphere nodes (unchanged) ──
  const nodes = useMemo(() => {
    const result = [];
    const count = 5;
    for (let i = 0; i < count; i++) {
      const t = 0.1 + (i / (count - 1)) * 0.8 + MathUtils.randFloatSpread(0.05);
      const pt = mainCurve.getPointAt(MathUtils.clamp(t, 0.05, 0.95));
      const bumpRadius = 0.04 + Math.random() * 0.06;
      result.push({ position: [pt.x, pt.y, pt.z], radius: bumpRadius, key: `node-${i}` });
    }
    return result;
  }, [mainCurve]);

  return (
    <group>
      <mesh geometry={mainGeo}>
        <meshStandardMaterial color="#4A3728" roughness={0.85} metalness={0.05} />
      </mesh>

      <mesh geometry={forkGeo}>
        <meshStandardMaterial color="#3D2E1F" roughness={0.82} metalness={0.05} />
      </mesh>

      <mesh geometry={twigGeo}>
        <meshStandardMaterial color="#3A2A1C" roughness={0.88} metalness={0.04} />
      </mesh>

      {nodes.map((n) => (
        <mesh key={n.key} position={n.position}>
          <sphereGeometry args={[n.radius, 8, 6]} />
          <meshStandardMaterial color="#5C4432" roughness={0.9} metalness={0.03} />
        </mesh>
      ))}
    </group>
  );
}
