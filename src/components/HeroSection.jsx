import { useRef } from 'react';
import Scene3D from './Scene3D';
import HeroUI from './HeroUI';

export default function HeroSection({ isMobile }) {
  const mouseRef = useRef({ x: 0, y: 0 });

  return (
    <section className="relative w-full h-screen overflow-hidden bg-moss-bg">
      {/* 3D background — fills entire section */}
      <Scene3D mouseRef={mouseRef} isMobile={isMobile} />

      {/* Gradient overlays for depth */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Vignette */}
        <div
          className="absolute inset-0"
          style={{
            background:
              'radial-gradient(ellipse at center, transparent 40%, rgba(8,10,8,0.6) 100%)',
          }}
        />
        {/* Bottom fade */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-moss-bg to-transparent" />
        {/* Left fade for text readability */}
        <div className="absolute left-0 top-0 bottom-0 w-1/2 bg-gradient-to-r from-moss-bg/70 via-moss-bg/30 to-transparent" />
      </div>

      {/* UI overlay */}
      <div className="absolute inset-0 flex items-center">
        <HeroUI />
      </div>
    </section>
  );
}
