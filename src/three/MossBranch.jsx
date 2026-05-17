import { useMemo } from 'react';
import { TubeGeometry, Vector3, MathUtils } from 'three';

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

export default function MossBranch({ curves, isMobile }) {
  const { mainCurve, forkCurve, twigCurve } = curves;
  const tubularSegments = isMobile ? 120 : 200;
  const radialSegments = isMobile ? 10 : 16;

  const mainGeo = useMemo(
    () => createOrganicTube(mainCurve, tubularSegments, 0.14, radialSegments),
    [mainCurve, tubularSegments, radialSegments]
  );

  const forkGeo = useMemo(
    () => createOrganicTube(forkCurve, Math.floor(tubularSegments * 0.5), 0.07, radialSegments),
    [forkCurve, tubularSegments, radialSegments]
  );

  const twigGeo = useMemo(
    () => createOrganicTube(twigCurve, Math.floor(tubularSegments * 0.25), 0.04, radialSegments),
    [twigCurve, tubularSegments, radialSegments]
  );

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
