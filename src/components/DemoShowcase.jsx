import { useRef, useState, useEffect } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import Feature1Cards from './Feature1Cards';
import Feature2Cards from './Feature2Cards';
import Feature3Cards from './Feature3Cards';

const features = [
  {
    id: 'feature1',
    num: '01',
    title: '大规模合成用户生成',
    en: 'Synthetic Persona Engine',
    tag: 'Python · Statistics',
    desc: '基于统计学分布自动生成800个用户画像，6种Persona类型，16个属性字段',
  },
  {
    id: 'feature2',
    num: '02',
    title: '交互式任务模拟',
    en: 'Interactive Task Simulation',
    tag: 'Flask · Playwright',
    desc: '模拟用户在Mock中国移动APP上的8步完整操作旅程，记录全部交互日志',
  },
  {
    id: 'feature3',
    num: '03',
    title: '旅程可视化与断点分析',
    en: 'Journey Visualization & Analytics',
    tag: 'Matplotlib · AI Analysis',
    desc: '4张专业级可视化图表 + AI断点分析报告，识别高流失环节',
  },
];

export default function DemoShowcase() {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start end', 'end start'],
  });

  const [activeSection, setActiveSection] = useState(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      { threshold: 0.3 }
    );

    document.querySelectorAll('[data-feature-section]').forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={containerRef} className="relative w-full bg-moss-bg">
      {/* Ambient gradient backdrop */}
      <div className="fixed inset-0 pointer-events-none z-0 opacity-20">
        <div className="absolute top-1/4 -left-1/4 w-96 h-96 rounded-full bg-moss-accent/10 blur-[120px]" />
        <div className="absolute bottom-1/3 -right-1/4 w-80 h-80 rounded-full bg-emerald-700/8 blur-[100px]" />
      </div>

      {/* ── Header ── */}
      <motion.div
        className="relative z-10 max-w-6xl mx-auto px-6 md:px-10 pt-36 pb-16"
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 1, ease: 'easeOut' }}
      >
        <div className="flex items-center gap-3 mb-6">
          <span className="w-8 h-px bg-moss-accent/40" />
          <span className="text-sm font-bold tracking-[0.25em] uppercase text-moss-accent/80 font-mono">
            Product Demonstration
          </span>
        </div>

        <h2 className="text-4xl md:text-6xl lg:text-7xl font-display leading-none tracking-tight">
          <span className="text-moss-text">客户体验</span>
          <br />
          <span className="text-moss-accent-light italic">分析平台</span>
        </h2>

        <p className="mt-6 text-base md:text-lg text-moss-muted/85 max-w-xl leading-relaxed font-medium">
          覆盖从用户画像生成、交互行为模拟到旅程分析与断点识别的完整链路，
          三大核心模块协同工作，为运营商提供数据驱动的体验优化决策支持。
        </p>

        {/* Platform badges */}
        <div className="flex flex-wrap gap-2 mt-8">
          {['Python 3.12', 'Flask', 'Playwright', 'Matplotlib', 'React 18', 'Three.js'].map(
            (tech) => (
              <span
                key={tech}
                className="px-3 py-1.5 text-xs font-mono font-medium text-moss-muted/70 border border-white/[0.08] rounded-full bg-white/[0.03]"
              >
                {tech}
              </span>
            )
          )}
        </div>
      </motion.div>

      <div className="section-divider max-w-6xl mx-auto" />

      {/* ── Feature Sections ── */}
      {features.map((feat, i) => {
        const isActive = activeSection === feat.id;
        return (
          <div key={feat.id} id={feat.id} data-feature-section>
            {/* Section header */}
            <motion.div
              className="relative z-10 max-w-6xl mx-auto px-6 md:px-10 pt-24 pb-6"
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-80px' }}
              transition={{ duration: 0.8, delay: 0.1 }}
            >
              <div className="flex items-start md:items-center gap-5 md:gap-8 flex-col md:flex-row">
                {/* Number badge */}
                <div
                  className={`flex-shrink-0 w-14 h-14 md:w-16 md:h-16 rounded-2xl flex items-center justify-center border transition-all duration-700 ${
                    isActive
                      ? 'border-moss-accent/40 bg-moss-accent/10 glow-accent'
                      : 'border-white/8 bg-moss-surface/60'
                  }`}
                >
                  <span className="text-xl font-light font-mono text-moss-accent-light tracking-wider">
                    {feat.num}
                  </span>
                </div>

                <div className="flex-1">
                  <div className="flex items-center gap-3 flex-wrap">
                    <span className="text-xs font-bold tracking-[0.2em] uppercase text-moss-accent/70 font-mono">
                      {feat.en}
                    </span>
                    <span className="text-[11px] font-mono font-medium text-moss-muted/50 bg-white/[0.04] px-2 py-0.5 rounded">
                      {feat.tag}
                    </span>
                    {isActive && (
                      <span className="flex items-center gap-1.5 text-xs font-semibold text-moss-accent/80 font-mono">
                        <span className="w-1.5 h-1.5 rounded-full bg-moss-accent live-dot" />
                        查看中
                      </span>
                    )}
                  </div>
                  <h3 className="text-2xl md:text-3xl font-display text-moss-text mt-2 tracking-tight">
                    {feat.title}
                  </h3>
                  <p className="text-base text-moss-muted/80 mt-2 max-w-lg font-medium">{feat.desc}</p>
                </div>
              </div>
            </motion.div>

            {/* Feature content */}
            <div className="relative z-10 max-w-6xl mx-auto px-6 md:px-10 pb-12">
              {feat.id === 'feature1' && <Feature1Cards />}
              {feat.id === 'feature2' && <Feature2Cards />}
              {feat.id === 'feature3' && <Feature3Cards />}
            </div>

            {i < features.length - 1 && (
              <div className="section-divider max-w-6xl mx-auto" />
            )}
          </div>
        );
      })}

      {/* ── Footer ── */}
      <div className="relative z-10 max-w-6xl mx-auto px-6 md:px-10 py-20 text-center">
        <div className="section-divider mb-12" />
        <p className="text-xs font-mono text-moss-muted/40 tracking-widest uppercase font-medium">
          Python · Flask · Playwright · Matplotlib · NumPy · Pandas · React · Three.js · Framer Motion
        </p>
        <p className="text-xs text-moss-muted/30 mt-2 font-medium">
          China Mobile Customer Experience Analytics Platform &copy; 2026
        </p>
      </div>
    </div>
  );
}
