import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.9, delay, ease: [0.25, 0.1, 0.25, 1] },
});

export default function HeroUI({ onEnter }) {
  const [showRegister, setShowRegister] = useState(false);

  return (
    <div className="relative z-10 flex flex-col justify-center px-6 md:px-10 lg:px-16 max-w-3xl pointer-events-none">
      {/* Brand label */}
      <motion.p
        {...fadeUp(0.1)}
        className="text-sm font-bold tracking-[0.25em] uppercase text-moss-accent mb-6"
      >
        麦克利兰
      </motion.p>

      {/* Main heading */}
      <motion.h1
        {...fadeUp(0.3)}
        className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold leading-[1.15] tracking-tight text-moss-text mb-10"
      >
        中国移动全旅程客户体验
        <br />
        支撑服务分析平台
      </motion.h1>

      {/* Buttons */}
      <motion.div
        {...fadeUp(0.7)}
        className="flex flex-wrap gap-5 pointer-events-auto"
      >
        <button
          onClick={onEnter}
          className="px-10 py-3.5 rounded-full border border-moss-accent/40 bg-moss-accent/10 text-base md:text-lg font-bold text-moss-accent-light hover:bg-moss-accent/20 hover:border-moss-accent/70 hover:scale-105 active:scale-95 transition-all duration-500 shadow-lg shadow-moss-accent/10"
        >
          进入
        </button>
        <button
          onClick={() => setShowRegister(true)}
          className="px-10 py-3.5 rounded-full border border-white/20 bg-white/5 text-base md:text-lg font-semibold text-moss-text/80 hover:bg-white/10 hover:border-white/40 hover:text-moss-text transition-all duration-500"
        >
          注册
        </button>
      </motion.div>

      {/* Registration Modal */}
      <AnimatePresence>
        {showRegister && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center pointer-events-auto"
          >
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
              onClick={() => setShowRegister(false)}
            />

            {/* Modal */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
              className="relative z-10 w-full max-w-md mx-4 p-8 rounded-2xl bg-moss-card border border-white/10 glow-accent"
            >
              <h2 className="text-xl font-bold text-moss-text mb-6">注册账号</h2>

              <form onSubmit={(e) => { e.preventDefault(); setShowRegister(false); }} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-moss-muted mb-1.5">用户名</label>
                  <input
                    type="text"
                    className="w-full px-4 py-2.5 rounded-lg bg-moss-bg border border-white/10 text-moss-text text-sm focus:outline-none focus:border-moss-accent/50 transition-colors"
                    placeholder="请输入用户名"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-moss-muted mb-1.5">邮箱</label>
                  <input
                    type="email"
                    className="w-full px-4 py-2.5 rounded-lg bg-moss-bg border border-white/10 text-moss-text text-sm focus:outline-none focus:border-moss-accent/50 transition-colors"
                    placeholder="请输入邮箱地址"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-moss-muted mb-1.5">密码</label>
                  <input
                    type="password"
                    className="w-full px-4 py-2.5 rounded-lg bg-moss-bg border border-white/10 text-moss-text text-sm focus:outline-none focus:border-moss-accent/50 transition-colors"
                    placeholder="请输入密码"
                  />
                </div>

                <div className="flex gap-3 pt-2">
                  <button
                    type="submit"
                    className="flex-1 px-6 py-2.5 rounded-full bg-moss-accent/20 border border-moss-accent/40 text-sm font-bold text-moss-accent-light hover:bg-moss-accent/30 transition-all"
                  >
                    注册
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowRegister(false)}
                    className="px-6 py-2.5 rounded-full border border-white/10 text-sm font-medium text-moss-muted hover:text-moss-text transition-all"
                  >
                    取消
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
