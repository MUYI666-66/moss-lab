import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { CatmullRomCurve3, Vector3 } from 'three';
import SceneLighting from './SceneLighting';
import MossBranch from './MossBranch';
import MossParticles from './MossParticles';

export default function Experience({ mouseRef, isMobile }) {
  const groupRef = useRef();

  // 3D mouse position in group-local space
  const mouse3DTarget = useRef(new Vector3(0, -5, 0));
  const mouse3DSmooth = useRef(new Vector3(0, -5, 0));
  const mouseWasActive = useRef(false);

  // Pre-allocated vectors for ray-plane math (no per-frame GC)
  const ndcVec = useRef(new Vector3());
  const rayDir = useRef(new Vector3());
  const worldHit = useRef(new Vector3());

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

  useFrame((state, delta) => {
    if (!groupRef.current) return;

    const mouse = mouseRef?.current ?? { x: 0, y: 0 };
    const { camera } = state;
    const dt = Math.min(delta, 0.1);

    // ── 1. Group rotation (existing) ──
    const targetRotY = mouse.x * 0.35;
    const targetRotX = mouse.y * 0.18;
    groupRef.current.rotation.y += (targetRotY - groupRef.current.rotation.y) * 0.03;
    groupRef.current.rotation.x += (targetRotX - groupRef.current.rotation.x) * 0.03;

    const t = state.clock.getElapsedTime();
    groupRef.current.position.y = Math.sin(t * 0.4) * 0.08;
    groupRef.current.position.x = Math.cos(t * 0.35) * 0.04;

    // ── 2. Ray-plane intersection → 3D mouse in group local space ──
    const active = !!mouse.active;
    if (active) {
      ndcVec.current.set(mouse.x, mouse.y, 0.5).unproject(camera);
      rayDir.current.copy(ndcVec.current).sub(camera.position).normalize();

      if (Math.abs(rayDir.current.z) > 0.0001) {
        const planeT = -camera.position.z / rayDir.current.z;
        if (planeT > 0) {
          worldHit.current.copy(camera.position).addScaledVector(rayDir.current, planeT);
          // into group-local space (accounts for rotation + translation)
          groupRef.current.worldToLocal(worldHit.current);
          mouse3DTarget.current.copy(worldHit.current);
        }
      }

      // Snap on first frame after mouse enters (no lerp from offscreen)
      if (!mouseWasActive.current) {
        mouse3DSmooth.current.copy(mouse3DTarget.current);
      }
    } else {
      // Mouse left window — retract target just offscreen
      mouse3DTarget.current.set(0, -5, 0);
    }

    mouseWasActive.current = active;

    // ── 3. Smooth lerp toward target (frame-rate independent) ──
    const lerpFactor = 1 - Math.exp(-6 * dt);
    mouse3DSmooth.current.lerp(mouse3DTarget.current, lerpFactor);
  });

  return (
    <>
      <SceneLighting />
      <group ref={groupRef}>
        <MossBranch curves={curves} isMobile={isMobile} mouse3D={mouse3DSmooth} />
        <MossParticles
          mainCurve={curves.mainCurve}
          forkCurve={curves.forkCurve}
          twigCurve={curves.twigCurve}
          isMobile={isMobile}
          mouseRef={mouseRef}
          mouse3D={mouse3DSmooth}
        />
      </group>
    </>
  );
}
