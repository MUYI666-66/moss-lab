import { motion } from 'framer-motion';

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.9, delay, ease: [0.25, 0.1, 0.25, 1] },
});

export default function HeroUI() {
  return (
    <div className="relative z-10 flex flex-col justify-center px-6 md:px-10 lg:px-16 max-w-2xl pointer-events-none">
      <motion.p
        {...fadeUp(0.1)}
        className="text-xs font-medium tracking-[0.2em] uppercase text-moss-accent/80 mb-6"
      >
        Organic WebGL Experiment
      </motion.p>

      <motion.h1
        {...fadeUp(0.3)}
        className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold leading-[1.08] tracking-tight text-moss-text mb-6"
      >
        Grow with the quiet
        <br />
        texture of nature
      </motion.h1>

      <motion.p
        {...fadeUp(0.5)}
        className="text-sm md:text-base leading-relaxed text-moss-muted max-w-md mb-10"
      >
        A conceptual WebGL experience exploring organic motion, moss textures,
        and interactive digital ecosystems — rendered in real time.
      </motion.p>

      <motion.div
        {...fadeUp(0.7)}
        className="flex flex-wrap gap-4 pointer-events-auto"
      >
        <button className="px-6 py-2.5 rounded-full border border-white/20 bg-white/5 text-sm font-medium text-moss-text hover:bg-white/10 hover:border-moss-accent/50 transition-all duration-500">
          Explore Moss
        </button>
        <button className="px-6 py-2.5 rounded-full border border-transparent text-sm font-medium text-moss-muted hover:text-moss-text hover:border-white/10 transition-all duration-500">
          View Concept
        </button>
      </motion.div>

      <motion.p
        {...fadeUp(1.0)}
        className="mt-16 text-xs text-moss-muted/60 max-w-sm leading-relaxed"
      >
        An experimental interface built with procedural geometry, organic
        particles and real-time motion.
      </motion.p>
    </div>
  );
}
