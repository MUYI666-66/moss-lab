import { useState, useCallback, useRef, useEffect } from 'react';

export default function useMouse() {
  const [mouse, setMouse] = useState({ x: 0, y: 0 });
  const current = useRef({ x: 0, y: 0 });
  const target = useRef({ x: 0, y: 0 });
  const enabled = useRef(true);

  const handleMove = useCallback((e) => {
    const x = (e.clientX / window.innerWidth) * 2 - 1;
    const y = -(e.clientY / window.innerHeight) * 2 + 1;
    target.current = { x, y };
    enabled.current = true;
  }, []);

  const handleLeave = useCallback(() => {
    target.current = { x: 0, y: 0 };
    enabled.current = false;
  }, []);

  const handleEnter = useCallback(() => {
    enabled.current = true;
  }, []);

  useEffect(() => {
    window.addEventListener('mousemove', handleMove);
    document.addEventListener('mouseleave', handleLeave);
    document.addEventListener('mouseenter', handleEnter);
    return () => {
      window.removeEventListener('mousemove', handleMove);
      document.removeEventListener('mouseleave', handleLeave);
      document.removeEventListener('mouseenter', handleEnter);
    };
  }, [handleMove, handleLeave, handleEnter]);

  // Lerp current toward target each frame
  const update = useCallback((factor = 0.05) => {
    current.current = {
      x: current.current.x + (target.current.x - current.current.x) * factor,
      y: current.current.y + (target.current.y - current.current.y) * factor,
    };
    setMouse(current.current);
  }, []);

  return { mouse, update };
}
