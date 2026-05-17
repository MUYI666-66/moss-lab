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

function sampleCurvePoints(curve, count) {
  const points = [];
  for (let i = 0; i < count; i++) {
    const t = Math.random();
    const pt = curve.getPointAt(t);
    points.push({ position: pt.clone(), t });
  }
  return points;
}

export default function MossParticles({ mainCurve, forkCurve, twigCurve, isMobile, mouseRef }) {
  const pointsRef = useRef();
  const particleCount = isMobile ? 250 : 600;

  const { positions, colors, basePositions } = useMemo(() => {
    const pos = [];
    const col = [];
    const base = [];

    // Sample points from all three curves
    const mainSamples = sampleCurvePoints(mainCurve, Math.floor(particleCount * 0.55));
    const forkSamples = sampleCurvePoints(forkCurve, Math.floor(particleCount * 0.3));
    const twigSamples = sampleCurvePoints(twigCurve, Math.floor(particleCount * 0.15));

    const allSamples = [...mainSamples, ...forkSamples, ...twigSamples];

    for (const sample of allSamples) {
      const { position: pt } = sample;

      // Random radial offset from curve
      const angle = Math.random() * Math.PI * 2;
      const dist = 0.08 + Math.random() * 0.22;

      const offset = new Vector3(
        Math.cos(angle) * dist,
        (Math.random() - 0.5) * dist * 2,
        Math.sin(angle) * dist
      );

      const finalPos = pt.clone().add(offset);

      pos.push(finalPos.x, finalPos.y, finalPos.z);
      base.push(finalPos.x, finalPos.y, finalPos.z);

      // Pick a moss color with slight variation
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

    for (let i = 0; i < arr.length; i += 3) {
      const bx = basePositions[i];
      const by = basePositions[i + 1];
      const bz = basePositions[i + 2];

      // Gentle breathing oscillation
      const breathe = Math.sin(t * 1.5 + i * 0.1) * 0.015;

      // Mouse-driven displacement
      const mouseInfluence = 0.04;
      const dx = mx * mouseInfluence * (0.5 + Math.random() * 0.1);
      const dy = my * mouseInfluence * (0.5 + Math.random() * 0.1);

      arr[i] = bx + dx + Math.sin(t * 2.3 + by) * 0.01;
      arr[i + 1] = by + dy + breathe;
      arr[i + 2] = bz + dx * 0.5 + Math.cos(t * 1.8 + bx) * 0.01;
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
