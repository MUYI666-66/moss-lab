import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { CatmullRomCurve3, Vector3 } from 'three';
import SceneLighting from './SceneLighting';
import MossBranch from './MossBranch';
import MossParticles from './MossParticles';

export default function Experience({ mouseRef, isMobile }) {
  const groupRef = useRef();

  // Shared curves for both branch geometry and moss particle sampling
  const curves = useMemo(() => {
    const mainCurve = new CatmullRomCurve3([
      new Vector3(-1.2, -0.6, -0.3),
      new Vector3(-0.7, -0.2, -0.1),
      new Vector3(-0.2, 0.1, 0.2),
      new Vector3(0.3, 0.3, 0.0),
      new Vector3(0.8, 0.6, -0.2),
      new Vector3(1.3, 0.9, -0.1),
    ]);

    const forkOrigin = mainCurve.getPointAt(0.45);
    const forkCurve = new CatmullRomCurve3([
      forkOrigin.clone(),
      forkOrigin.clone().add(new Vector3(0.15, 0.25, 0.3)),
      forkOrigin.clone().add(new Vector3(0.5, 0.6, 0.5)),
      forkOrigin.clone().add(new Vector3(0.9, 0.85, 0.4)),
    ]);

    const twigOrigin = mainCurve.getPointAt(0.7);
    const twigCurve = new CatmullRomCurve3([
      twigOrigin.clone(),
      twigOrigin.clone().add(new Vector3(-0.1, 0.2, -0.3)),
      twigOrigin.clone().add(new Vector3(-0.05, 0.5, -0.5)),
    ]);

    return { mainCurve, forkCurve, twigCurve };
  }, []);

  useFrame((state) => {
    if (!groupRef.current) return;
    const t = state.clock.getElapsedTime();
    const mx = mouseRef?.current?.x ?? 0;
    const my = mouseRef?.current?.y ?? 0;

    // Target rotation based on mouse
    const targetRotY = mx * 0.35;
    const targetRotX = my * 0.18;

    // Smooth lerp toward target
    groupRef.current.rotation.y += (targetRotY - groupRef.current.rotation.y) * 0.03;
    groupRef.current.rotation.x += (targetRotX - groupRef.current.rotation.x) * 0.03;

    // Subtle floating
    groupRef.current.position.y = Math.sin(t * 0.4) * 0.08;
    groupRef.current.position.x = Math.cos(t * 0.35) * 0.04;
  });

  return (
    <>
      <SceneLighting />
      <group ref={groupRef}>
        <MossBranch curves={curves} isMobile={isMobile} />
        <MossParticles
          mainCurve={curves.mainCurve}
          forkCurve={curves.forkCurve}
          twigCurve={curves.twigCurve}
          isMobile={isMobile}
          mouseRef={mouseRef}
        />
      </group>
    </>
  );
}
