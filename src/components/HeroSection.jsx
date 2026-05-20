import { useRef } from 'react';
import Scene3D from './Scene3D';
import HeroUI from './HeroUI';

export default function HeroSection({ isMobile, onEnter, transitioning }) {
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
        <HeroUI onEnter={onEnter} />
      </div>

      {/* Transition indicator */}
      {transitioning && (
        <div className="absolute inset-0 z-20 flex items-center justify-center bg-moss-bg/60 backdrop-blur-sm">
          <div className="flex flex-col items-center gap-4">
            <div className="w-10 h-10 border-2 border-moss-accent/60 border-t-transparent rounded-full animate-spin" />
            <p className="text-sm text-moss-muted tracking-wide">正在进入平台...</p>
          </div>
        </div>
      )}
    </section>
  );
}
