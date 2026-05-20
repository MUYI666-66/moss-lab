import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

/**
 * Generic pipeline execution engine.
 *
 * Props:
 *  - phases: array of { label, duration } (duration in ms)
 *  - logLines: array of { time, text, type } — pre-scripted log entries
 *  - onComplete: callback when all phases finish
 *  - title: pipeline title (e.g. "用户生成引擎")
 *  - children: rendered below the terminal during execution
 */
export default function PipelineRunner({ phases, logLines, onComplete, title, subtitle, children }) {
  const [currentPhase, setCurrentPhase] = useState(-1); // -1 = not started
  const [phaseProgress, setPhaseProgress] = useState(0);
  const [visibleLogs, setVisibleLogs] = useState([]);
  const [isComplete, setIsComplete] = useState(false);
  const [started, setStarted] = useState(false);
  const logContainerRef = useRef(null);
  const timersRef = useRef([]);

  const totalDuration = phases.reduce((sum, p) => sum + p.duration, 0);

  // Cleanup on unmount
  useEffect(() => {
    return () => timersRef.current.forEach(clearTimeout);
  }, []);

  // Start the pipeline
  const start = useCallback(() => {
    if (started) return;
    setStarted(true);

    // Phase progression
    let phaseStartTime = 0;
    phases.forEach((phase, idx) => {
      const t1 = setTimeout(() => {
        setCurrentPhase(idx);
        setPhaseProgress(0);

        // Animate phase progress
        const steps = 20;
        const interval = phase.duration / steps;
        let step = 0;
        const progressInterval = setInterval(() => {
          step++;
          setPhaseProgress(Math.min(100, (step / steps) * 100));
          if (step >= steps) clearInterval(progressInterval);
        }, interval);
        timersRef.current.push(progressInterval);
      }, phaseStartTime);
      timersRef.current.push(t1);
      phaseStartTime += phase.duration;
    });

    // Completion
    const tComplete = setTimeout(() => {
      setCurrentPhase(phases.length);
      setPhaseProgress(100);
      setTimeout(() => setIsComplete(true), 600);
      onComplete?.();
    }, totalDuration);
    timersRef.current.push(tComplete);

    // Log line streaming
    if (logLines) {
      logLines.forEach((log, idx) => {
        const t = setTimeout(() => {
          setVisibleLogs((prev) => [...prev, log]);
        }, log.delay || idx * 120);
        timersRef.current.push(t);
      });
    }
  }, [started, phases, logLines, onComplete, totalDuration]);

  // Auto-scroll log
  useEffect(() => {
    if (logContainerRef.current) {
      logContainerRef.current.scrollTop = logContainerRef.current.scrollHeight;
    }
  }, [visibleLogs]);

  return (
    <motion.div
      className="relative bg-moss-card/80 backdrop-blur border border-white/[0.06] rounded-2xl overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {/* ── Pipeline header ── */}
      <div className="relative flex items-center justify-between px-5 py-4 border-b border-white/[0.05] bg-moss-bg/40">
        <div className="flex items-center gap-3">
          {/* Status indicator */}
          <div className="flex items-center gap-2">
            <span className={`w-2 h-2 rounded-full ${
              isComplete ? 'bg-emerald-500' : started ? 'bg-amber-500 animate-pulse' : 'bg-moss-muted/30'
            }`} />
            <span className="text-xs font-bold tracking-wider uppercase text-moss-accent/70 font-mono">
              {isComplete ? 'COMPLETED' : started ? 'RUNNING' : 'READY'}
            </span>
          </div>
          <span className="text-xs font-mono text-moss-muted/30">|</span>
          <span className="text-xs font-mono text-moss-text/70 font-semibold">{title}</span>
        </div>

        {!started && (
          <motion.button
            onClick={start}
            className="relative px-5 py-2 rounded-xl bg-moss-accent/15 border border-moss-accent/30 text-moss-accent-light text-sm font-bold tracking-wider font-mono hover:bg-moss-accent/25 hover:border-moss-accent/50 transition-all duration-300 active:scale-95"
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
          >
            <span className="flex items-center gap-2">
              ▶ RUN PIPELINE
            </span>
          </motion.button>
        )}

        {started && !isComplete && (
          <span className="text-xs font-mono text-moss-muted/50 font-medium">
            {Math.round((currentPhase >= 0 ? phases.slice(0, currentPhase).reduce((s, p) => s + p.duration, 0) + (phaseProgress / 100) * (phases[currentPhase]?.duration || 0) : 0) / totalDuration * 100)}%
          </span>
        )}

        {isComplete && (
          <motion.span
            className="text-xs font-mono text-emerald-400/70 font-semibold"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            ✓ EXIT CODE 0
          </motion.span>
        )}
      </div>

      {/* ── Pipeline body ── */}
      <AnimatePresence mode="wait">
        {!isComplete ? (
          <motion.div key="executing" className="flex flex-col md:flex-row" exit={{ opacity: 0 }} transition={{ duration: 0.4 }}>
            {/* Terminal log panel */}
            <div className="flex-1 min-h-[320px] md:min-h-[360px] flex flex-col">
              {/* Phase indicators */}
              <div className="flex items-center gap-1 px-4 py-3 border-b border-white/[0.03] overflow-x-auto">
                {phases.map((phase, idx) => {
                  let status = 'pending';
                  if (idx < currentPhase) status = 'done';
                  else if (idx === currentPhase) status = 'active';

                  return (
                    <div key={phase.label} className="flex items-center gap-1 flex-shrink-0">
                      <div
                        className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-[11px] font-mono font-semibold transition-all duration-500 ${
                          status === 'active'
                            ? 'bg-moss-accent/10 border border-moss-accent/30 text-moss-accent-light'
                            : status === 'done'
                            ? 'bg-transparent border border-emerald-500/15 text-emerald-400/60'
                            : 'bg-transparent border border-transparent text-moss-muted/40'
                        }`}
                      >
                        <span className={
                          status === 'active' ? 'text-moss-accent' :
                          status === 'done' ? 'text-emerald-500/50' : 'text-moss-muted/30'
                        }>
                          {status === 'done' ? '✓' : status === 'active' ? '●' : '○'}
                        </span>
                        {phase.label}
                        {status === 'active' && (
                          <motion.span
                            className="text-[7px] text-moss-accent/40 ml-0.5"
                            animate={{ opacity: [0.4, 1, 0.4] }}
                            transition={{ duration: 1, repeat: Infinity }}
                          >
                            ...
                          </motion.span>
                        )}
                      </div>
                      {idx < phases.length - 1 && <span className="text-moss-muted/15 text-[8px] mx-0.5">→</span>}
                    </div>
                  );
                })}
              </div>

              {/* Terminal log */}
              <div
                ref={logContainerRef}
                className="flex-1 overflow-y-auto p-4 font-mono text-[11px] leading-relaxed space-y-0.5 custom-scrollbar"
                style={{ maxHeight: '280px' }}
              >
                {visibleLogs.map((log, i) => (
                  <motion.div
                    key={i}
                    className="flex items-start gap-3"
                    initial={{ opacity: 0, x: -5 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <span className={`flex-shrink-0 w-14 text-right ${
                      log.type === 'error' ? 'text-red-400/60' :
                      log.type === 'warn' ? 'text-amber-400/60' :
                      log.type === 'success' ? 'text-emerald-400/60' :
                      log.type === 'info' ? 'text-blue-400/50' :
                      'text-moss-muted/40'
                    }`}>
                      {log.time}
                    </span>
                    <span className={`flex-shrink-0 w-12 ${
                      log.type === 'error' ? 'text-red-400/40' :
                      log.type === 'warn' ? 'text-amber-400/40' :
                      log.type === 'success' ? 'text-emerald-400/40' :
                      log.type === 'info' ? 'text-blue-400/40' :
                      'text-moss-muted/30'
                    }`}>
                      [{log.type?.toUpperCase() || 'LOG'}]
                    </span>
                    <span className={`${
                      log.type === 'error' ? 'text-red-300/80' :
                      log.type === 'warn' ? 'text-amber-300/80' :
                      log.type === 'success' ? 'text-emerald-300/80' :
                      log.type === 'info' ? 'text-blue-300/70' :
                      'text-moss-text/60'
                    }`}>
                      {log.text}
                    </span>
                  </motion.div>
                ))}

                {/* Blinking cursor */}
                {!isComplete && started && (
                  <motion.span
                    className="inline-block w-2 h-4 bg-moss-accent/60 ml-2 align-middle"
                    animate={{ opacity: [1, 0] }}
                    transition={{ duration: 0.6, repeat: Infinity, repeatType: 'reverse' }}
                  />
                )}
              </div>
            </div>

            {/* Right panel: visual / children */}
            <div className="w-full md:w-80 flex-shrink-0 border-t md:border-t-0 md:border-l border-white/[0.04] p-4 bg-moss-bg/20 flex flex-col items-center justify-center min-h-[200px]">
              {children}
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="completed"
            className="p-5 flex items-center justify-center min-h-[320px]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4 }}
          >
            <div className="text-center">
              <motion.div
                className="w-16 h-16 rounded-full bg-emerald-500/10 border-2 border-emerald-500/30 flex items-center justify-center mx-auto mb-4"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 200, damping: 15 }}
              >
                <span className="text-2xl">✓</span>
              </motion.div>
              <p className="text-base font-display text-emerald-300/85 font-bold">Pipeline Complete</p>
              <p className="text-xs font-mono text-moss-muted/50 mt-1 font-medium">{subtitle || 'All phases executed successfully'}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
