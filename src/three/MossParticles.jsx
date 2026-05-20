import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { BufferGeometry, BufferAttribute, Vector3, MathUtils, Color } from 'three';

const MOSS_COLORS = [
  new Color('#3D5A2E'),
  new Color('#4A6B35'),
  new Color('#5C7A3E'),
  new Color('#6B8A4A'),
  new Color('#8BA85C'),
  new Color('#A4C783'),
  new Color('#7A9B55'),
  new Color('#556B2F'),
];

const PARTICLE_INFLUENCE_RADIUS = 1.3;
const PARTICLE_STRENGTH = 0.25;

function sampleCurvePoints(curve, count) {
  const points = [];
  for (let i = 0; i < count; i++) {
    const t = Math.random();
    const pt = curve.getPointAt(t);
    points.push({ position: pt.clone(), t });
  }
  return points;
}

export default function MossParticles({ mainCurve, forkCurve, twigCurve, isMobile, mouseRef, mouse3D }) {
  const pointsRef = useRef();
  const particleCount = isMobile ? 250 : 600;

  const { positions, colors, basePositions } = useMemo(() => {
    const pos = [];
    const col = [];
    const base = [];

    const mainSamples = sampleCurvePoints(mainCurve, Math.floor(particleCount * 0.55));
    const forkSamples = sampleCurvePoints(forkCurve, Math.floor(particleCount * 0.3));
    const twigSamples = sampleCurvePoints(twigCurve, Math.floor(particleCount * 0.15));

    const allSamples = [...mainSamples, ...forkSamples, ...twigSamples];

    for (const sample of allSamples) {
      const { position: pt } = sample;

      const angle = Math.random() * Math.PI * 2;
      const dist = 0.08 + Math.random() * 0.22;

      const offset = new Vector3(
        Math.cos(angle) * dist,
        (Math.random() - 0.5) * dist * 2,
        Math.sin(angle) * dist,
      );

      const finalPos = pt.clone().add(offset);

      pos.push(finalPos.x, finalPos.y, finalPos.z);
      base.push(finalPos.x, finalPos.y, finalPos.z);

      const color = MOSS_COLORS[Math.floor(Math.random() * MOSS_COLORS.length)].clone();
      color.offsetHSL(0, 0, MathUtils.randFloatSpread(0.08));
      col.push(color.r, color.g, color.b);
    }

    return {
      positions: new Float32Array(pos),
      colors: new Float32Array(col),
      basePositions: new Float32Array(base),
    };
  }, [mainCurve, forkCurve, twigCurve, particleCount]);

  const geo = useMemo(() => {
    const g = new BufferGeometry();
    g.setAttribute('position', new BufferAttribute(positions, 3));
    g.setAttribute('color', new BufferAttribute(colors, 3));
    return g;
  }, [positions, colors]);

  useFrame((state) => {
    if (!pointsRef.current) return;
    const t = state.clock.getElapsedTime();
    const posAttr = pointsRef.current.geometry.attributes.position;
    const arr = posAttr.array;

    const mx = mouseRef?.current?.x ?? 0;
    const my = mouseRef?.current?.y ?? 0;

    const m3 = mouse3D?.current;

    for (let i = 0; i < arr.length; i += 3) {
      const bx = basePositions[i];
      const by = basePositions[i + 1];
      const bz = basePositions[i + 2];

      // ── 1. Gentle breathing oscillation (existing) ──
      const breathe = Math.sin(t * 1.5 + i * 0.1) * 0.015;

      // ── 2. Global mouse-driven displacement (existing, subtle) ──
      const globalInfluence = 0.04;
      const gdx = mx * globalInfluence * (0.5 + (i % 7) * 0.014);
      const gdy = my * globalInfluence * (0.5 + (i % 7) * 0.014);

      // Compute base position
      let px = bx + gdx + Math.sin(t * 2.3 + by) * 0.01;
      let py = by + gdy + breathe;
      let pz = bz + gdx * 0.5 + Math.cos(t * 1.8 + bx) * 0.01;

      // ── 3. Local 3D mouse deformation（方案 B：粒子级形变）──
      if (m3 && m3.y > -3) {
        const d3x = px - m3.x;
        const d3y = py - m3.y;
        const d3z = pz - m3.z;
        const dist3 = Math.sqrt(d3x * d3x + d3y * d3y + d3z * d3z);

        if (dist3 < PARTICLE_INFLUENCE_RADIUS && dist3 > 0.0001) {
          const t3 = 1 - dist3 / PARTICLE_INFLUENCE_RADIUS;
          const localForce = t3 * t3 * PARTICLE_STRENGTH;
          const invDist3 = 1 / dist3;

          px += d3x * invDist3 * localForce;
          py += d3y * invDist3 * localForce;
          pz += d3z * invDist3 * localForce;
        }
      }

      arr[i] = px;
      arr[i + 1] = py;
      arr[i + 2] = pz;
    }

    posAttr.needsUpdate = true;
  });

  return (
    <points ref={pointsRef} geometry={geo}>
      <pointsMaterial
        size={isMobile ? 0.025 : 0.02}
        vertexColors
        transparent
        opacity={0.85}
        depthWrite={false}
        blending={2}
        sizeAttenuation
      />
    </points>
  );
}
