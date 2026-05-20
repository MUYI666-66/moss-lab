import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Navbar from './components/Navbar';
import HeroSection from './components/HeroSection';
import DemoShowcase from './components/DemoShowcase';
import useDeviceDetect from './hooks/useDeviceDetect';

export default function App() {
  const isMobile = useDeviceDetect(768);
  const [showContent, setShowContent] = useState(false);
  const [transitioning, setTransitioning] = useState(false);
  const showcaseRef = useRef(null);

  const handleEnter = () => {
    setTransitioning(true);
    setTimeout(() => {
      setShowContent(true);
      setTransitioning(false);
      setTimeout(() => {
        showcaseRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 200);
    }, 1500);
  };

  return (
    <main className="relative w-full min-h-screen bg-moss-bg text-moss-text">
      <Navbar />
      <HeroSection isMobile={isMobile} onEnter={handleEnter} transitioning={transitioning} />

      <AnimatePresence>
        {showContent && (
          <motion.div
            ref={showcaseRef}
            initial={{ opacity: 0, y: 60 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
          >
            <DemoShowcase />
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}
