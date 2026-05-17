import { useRef, useCallback } from 'react';
import { Canvas } from '@react-three/fiber';
import Experience from '../three/Experience';

export default function Scene3D({ mouseRef, isMobile }) {
  const wrapperRef = useRef();

  const handlePointerMove = useCallback((e) => {
    if (!mouseRef) return;
    const x = (e.clientX / window.innerWidth) * 2 - 1;
    const y = -(e.clientY / window.innerHeight) * 2 + 1;
    mouseRef.current = { x, y };
  }, [mouseRef]);

  const handlePointerLeave = useCallback(() => {
    if (!mouseRef) return;
    mouseRef.current = { x: 0, y: 0 };
  }, [mouseRef]);

  return (
    <div
      ref={wrapperRef}
      className="absolute inset-0"
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
    >
      <Canvas
        dpr={isMobile ? [1, 1.5] : [1, 2]}
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: 'high-performance',
          toneMapping: 3, // ACESFilmicToneMapping
          toneMappingExposure: 1.1,
        }}
        camera={{ position: [0, 0.4, 5], fov: 45, near: 0.1, far: 20 }}
      >
        <Experience mouseRef={mouseRef} isMobile={isMobile} />
      </Canvas>
    </div>
  );
}
