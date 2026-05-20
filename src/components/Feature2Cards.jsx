import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import PipelineRunner from './PipelineRunner';

const BASE = import.meta.env.BASE_URL;

const PIPELINE_PHASES = [
  { label: '启动服务', duration: 1500 },
  { label: '加载页面', duration: 1800 },
  { label: '执行旅程', duration: 4000 },
  { label: '记录日志', duration: 1500 },
  { label: '生成截图', duration: 1200 },
];

const PIPELINE_LOGS = [
  { time: '16:01:02', text: 'Starting Flask mock server on 127.0.0.1:5099', type: 'info', delay: 100 },
  { time: '16:01:02', text: 'Loading mock app templates (6 pages)...', type: 'info', delay: 250 },
  { time: '16:01:02', text: '  [/] - 首页 (home) — balance display + recommendations', type: 'info', delay: 400 },
  { time: '16:01:02', text: '  [/products] - 产品中心 (5 products, 4 tabs)', type: 'info', delay: 550 },
  { time: '16:01:02', text: '  [/product/:id] - 产品详情 (specs + buy button)', type: 'info', delay: 700 },
  { time: '16:01:02', text: '  [/search] - 搜索页 (hot tags + results)', type: 'info', delay: 850 },
  { time: '16:01:02', text: '  [/my-account] - 我的账户 (orders + services)', type: 'info', delay: 1000 },
  { time: '16:01:02', text: '  [/support] - 在线客服 (FAQ + chat simulation)', type: 'info', delay: 1150 },
  { time: '16:01:02', text: 'Mock server ready. PID: 8921. Port: 5099', type: 'success', delay: 1300 },
  { time: '16:01:03', text: 'Launching Chromium via Playwright...', type: 'info', delay: 1600 },
  { time: '16:01:04', text: 'Browser config: viewport=420x850, UA=Android 13 Chrome 120', type: 'info', delay: 1800 },
  { time: '16:01:04', text: 'Chromium launched. Window positioned at (100, 50)', type: 'success', delay: 2000 },
  { time: '16:01:05', text: 'Navigating to http://127.0.0.1:5099 (首页)', type: 'info', delay: 2300 },
  { time: '16:01:05', text: 'Step 1/8: Browsing home page — balance ¥126.50, data 12.5GB', type: 'info', delay: 2600 },
  { time: '16:01:06', text: 'Step 2/8: Clicking search bar → type "移动产品资费"', type: 'info', delay: 2900 },
  { time: '16:01:07', text: 'Step 3/8: Search results returned — 4 products + 2 extras', type: 'success', delay: 3200 },
  { time: '16:01:08', text: 'Step 4/8: Clicking "移动产品资费大全" → /products', type: 'info', delay: 3500 },
  { time: '16:01:09', text: 'Step 5/8: Viewing 5G智享套餐 detail page (128元/月)', type: 'info', delay: 3800 },
  { time: '16:01:10', text: 'Step 6/8: Clicking 立即办理 → Order CM_L9XK7A submitted ✓', type: 'success', delay: 4200 },
  { time: '16:01:11', text: 'Step 7/8: Navigating to /my-account — 在网12月, 2860积分', type: 'info', delay: 4600 },
  { time: '16:01:12', text: 'Step 8/8: Entering /support → asking "移动产品资费有哪些"', type: 'info', delay: 5000 },
  { time: '16:01:13', text: 'AI客服回复: "包括动感地带、神州行、全球通等品牌..."', type: 'success', delay: 5300 },
  { time: '16:01:14', text: 'Journey complete. 8/8 steps executed. 1 conversion recorded.', type: 'success', delay: 5600 },
  { time: '16:01:14', text: 'Writing interaction log to output/interaction_log.jsonl', type: 'info', delay: 5900 },
  { time: '16:01:14', text: 'Log entries: 17. Event types: page_enter(1) search(2) click(4) page_view(4) conversion(1) interaction(1) complete(1)', type: 'info', delay: 6200 },
  { time: '16:01:14', text: 'Screenshots captured: 12/12 (PNG, 420x850)', type: 'success', delay: 6600 },
];

const journeySteps = [
  { step: 1, title: '浏览首页', desc: '余额¥126.50、已用流量12.5GB', type: 'page_enter', icon: '🏠', img: `${BASE}demo/screenshots/01_home.png` },
  { step: 2, title: '搜索资费', desc: '输入"移动产品资费"', type: 'search', icon: '🔍', img: `${BASE}demo/screenshots/02_search_page.png` },
  { step: 3, title: '查看结果', desc: '资费大全/5G套餐/优惠', type: 'result', icon: '📋', img: `${BASE}demo/screenshots/04_search_results.png` },
  { step: 4, title: '产品中心', desc: '浏览全部套餐资费', type: 'page_view', icon: '📦', img: `${BASE}demo/screenshots/05_products_list.png` },
  { step: 5, title: '套餐详情', desc: '30GB/500min/¥128', type: 'page_view', icon: '📱', img: `${BASE}demo/screenshots/06_product_detail.png` },
  { step: 6, title: '立即办理', desc: '订单提交成功 ✅', type: 'conversion', icon: '🛒', img: `${BASE}demo/screenshots/07_order_submitted.png` },
  { step: 7, title: '个人中心', desc: '12月在网/会员/2860积分', type: 'page_view', icon: '👤', img: `${BASE}demo/screenshots/08_my_account.png` },
  { step: 8, title: '客服咨询', desc: '智能客服回复资费问题', type: 'interaction', icon: '💬', img: `${BASE}demo/screenshots/09_support_page.png` },
];

const interactionLog = [
  { time: '16:01:05', type: 'page_enter', msg: '用户打开APP，进入首页' },
  { time: '16:01:06', type: 'click', msg: '点击搜索栏' },
  { time: '16:01:06', type: 'search', msg: '输入"移动产品资费"并搜索' },
  { time: '16:01:07', type: 'result', msg: '查看搜索结果列表' },
  { time: '16:01:08', type: 'click', msg: '点击"移动产品资费大全"' },
  { time: '16:01:08', type: 'page_view', msg: '进入产品中心浏览资费' },
  { time: '16:01:09', type: 'click', msg: '点击5G智享套餐查看详情' },
  { time: '16:01:09', type: 'page_view', msg: '查看套餐详情页' },
  { time: '16:01:10', type: 'conversion', msg: '点击立即办理，订单生成 ✅' },
  { time: '16:01:11', type: 'navigate', msg: '进入个人中心' },
  { time: '16:01:11', type: 'page_view', msg: '查看我的账户信息' },
  { time: '16:01:12', type: 'click', msg: '进入在线客服' },
  { time: '16:01:13', type: 'interaction', msg: '咨询移动产品资费，收到回复' },
  { time: '16:01:14', type: 'complete', msg: '旅程模拟完成' },
];

export default function Feature2Cards() {
  const [pipelineDone, setPipelineDone] = useState(false);
  const [activeStep, setActiveStep] = useState(null);
  const [showLog, setShowLog] = useState(true);

  return (
    <div className="space-y-5">
      {/* ═══ PIPELINE ═══ */}
      <PipelineRunner
        phases={PIPELINE_PHASES}
        logLines={PIPELINE_LOGS}
        title="交互式任务模拟管线"
        subtitle="8 steps · 6 pages · 1 conversion · 12 screenshots"
        onComplete={() => setPipelineDone(true)}
      >
        <div className="text-center space-y-3">
          <motion.div className="relative w-24 h-40 mx-auto border-2 border-moss-accent/20 rounded-2xl overflow-hidden bg-moss-bg"
            animate={{ borderColor: ['rgba(127,163,107,0.2)', 'rgba(127,163,107,0.5)', 'rgba(127,163,107,0.2)'] }}
            transition={{ duration: 2, repeat: Infinity }}>
            <div className="absolute inset-x-0 top-0 h-5 bg-moss-accent/10 flex items-center px-2">
              <span className="text-[7px] text-moss-accent/50">中国移动</span>
            </div>
            <motion.div className="absolute inset-x-0 bottom-8 text-center"
              animate={{ y: [0, -10, 0] }} transition={{ duration: 1.5, repeat: Infinity }}>
              <span className="text-xl">👆</span>
            </motion.div>
            <motion.div className="absolute inset-x-0 bottom-1 flex justify-center gap-1"
              animate={{ opacity: [0.5, 1, 0.5] }} transition={{ duration: 1, repeat: Infinity }}>
              <span className="w-1.5 h-1.5 rounded-full bg-moss-accent/40" />
              <span className="w-1.5 h-1.5 rounded-full bg-moss-accent/60" />
              <span className="w-1.5 h-1.5 rounded-full bg-moss-accent/80" />
            </motion.div>
          </motion.div>
          <p className="text-xs font-semibold font-mono text-moss-muted/50">Playwright · Chromium</p>
        </div>
      </PipelineRunner>

      {/* ═══ RESULTS ═══ */}
      <AnimatePresence>
        {pipelineDone && (
          <motion.div className="space-y-5" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.3 }}>
            {/* Journey nodes */}
            <div className="bg-moss-card/50 backdrop-blur border border-white/[0.06] rounded-2xl p-6">
              <div className="flex items-center gap-3 mb-1">
                <span className="w-2 h-2 rounded-full bg-emerald-500 live-dot" />
                <h4 className="text-sm font-bold tracking-widest uppercase text-moss-accent/70 font-mono">用户操作旅程</h4>
                <span className="text-xs font-mono text-moss-muted/40 font-medium">8步 · 6页面 · 1转化</span>
              </div>
              <div className="relative py-6 overflow-x-auto">
                <div className="flex items-start min-w-[700px] gap-0">
                  {journeySteps.map((s, i) => (
                    <div key={s.step} className="flex items-center flex-shrink-0">
                      <motion.button
                        onClick={() => setActiveStep(activeStep === s.step ? null : s.step)}
                        className={`relative flex flex-col items-center ${s.type === 'conversion' ? 'scale-110' : ''}`}
                        initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 + i * 0.06 }} whileHover={{ scale: 1.08 }}
                      >
                        <div className={`w-12 h-12 rounded-full flex items-center justify-center text-lg transition-all duration-500 ${
                          activeStep === s.step ? 'bg-moss-accent/20 border-2 border-moss-accent glow-accent' :
                          s.type === 'conversion' ? 'bg-emerald-900/30 border-2 border-emerald-500/50' :
                          'bg-moss-card border border-white/10'}`}>
                          {s.icon}
                        </div>
                        <span className="text-xs font-semibold text-moss-text/85 mt-2.5 text-center">{s.title}</span>
                        <span className={`text-[10px] font-mono mt-0.5 font-medium ${s.type === 'conversion' ? 'text-emerald-400' : s.type === 'search' ? 'text-amber-300/60' : 'text-moss-muted/40'}`}>{s.type}</span>
                      </motion.button>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Screenshot + Log */}
            <div className="grid md:grid-cols-3 gap-5">
              <div className="md:col-span-2 bg-moss-card/50 backdrop-blur border border-white/[0.06] rounded-2xl p-5">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="text-sm font-bold tracking-widest uppercase text-moss-accent/70 font-mono">
                    {activeStep ? `步骤 ${activeStep} — ${journeySteps[activeStep-1]?.title}` : '选择旅程节点查看截图'}
                  </h4>
                </div>
                <AnimatePresence mode="wait">
                  {activeStep ? (
                    <motion.div key={activeStep} className="rounded-xl overflow-hidden border border-white/[0.04] bg-moss-bg"
                      initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}>
                      <img src={journeySteps[activeStep-1]?.img} alt={`步骤${activeStep}`} className="w-full max-w-[360px] mx-auto" />
                    </motion.div>
                  ) : (
                    <div className="grid grid-cols-4 gap-2">
                      {journeySteps.map(s => (
                        <button key={s.step} onClick={() => setActiveStep(s.step)}
                          className="relative aspect-[9/16] rounded-lg overflow-hidden border border-white/[0.04] hover:border-moss-accent/30 transition-all duration-300 group bg-moss-bg">
                          <img src={s.img} alt={s.title} className="w-full h-full object-cover opacity-60 group-hover:opacity-100 transition-opacity" />
                          <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-moss-bg/90 to-transparent p-1.5">
                            <span className="text-[10px] text-moss-text/70 font-medium">{s.step}. {s.title}</span>
                          </div>
                        </button>
                      ))}
                    </div>
                  )}
                </AnimatePresence>
              </div>

              <div className="bg-moss-card/50 backdrop-blur border border-white/[0.06] rounded-2xl p-5 flex flex-col">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="text-sm font-bold tracking-widest uppercase text-moss-accent/70 font-mono">交互日志</h4>
                  <button onClick={() => setShowLog(!showLog)} className="text-xs font-mono text-moss-muted/50 hover:text-moss-text font-medium">{showLog ? '折叠' : '展开'}</button>
                </div>
                {showLog && (
                  <div className="flex-1 overflow-y-auto max-h-[400px] space-y-0.5 pr-1">
                    {interactionLog.map((e, i) => (
                      <motion.div key={i} className="flex items-center gap-2 py-1.5 px-2 rounded hover:bg-white/[0.02] transition-colors"
                        initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 + i * 0.015 }}>
                        <span className="text-[10px] font-mono text-moss-muted/40 w-12 flex-shrink-0">{e.time}</span>
                        <span className={`text-[10px] font-mono w-16 flex-shrink-0 font-medium ${e.type==='conversion'?'text-emerald-400/70':e.type==='search'?'text-amber-300/60':'text-moss-muted/50'}`}>{e.type}</span>
                        <span className="text-xs text-moss-text/70 truncate">{e.msg}</span>
                      </motion.div>
                    ))}
                  </div>
                )}
                <div className="border-t border-white/[0.04] pt-3 mt-3">
                  <div className="grid grid-cols-2 gap-2">
                    {[{label:'访问页面',val:'6个'},{label:'搜索',val:'1次'},{label:'转化',val:'1次'},{label:'步数',val:'8步'}].map(d => (
                      <div key={d.label} className="text-center"><div className="text-sm font-display text-moss-accent-light">{d.val}</div><div className="text-[10px] text-moss-muted/50 font-medium">{d.label}</div></div>
                    ))}
                  </div>
                </div>
                <a href={`${BASE}demo/interaction_log.jsonl`} download className="block mt-3 text-center text-xs font-mono text-moss-accent/60 hover:text-moss-accent border border-moss-accent/15 hover:border-moss-accent/30 rounded-lg py-1.5 transition-all duration-300 font-semibold">↓ 下载日志 (JSONL)</a>
              </div>
            </div>

            {/* Tech + Pages */}
            <div className="grid md:grid-cols-2 gap-5">
              <div className="bg-moss-card/50 backdrop-blur border border-white/[0.06] rounded-2xl p-5">
                <h4 className="text-[11px] font-semibold tracking-widest uppercase text-moss-accent/50 font-mono mb-3">技术栈</h4>
                <div className="space-y-2">
                  {[{name:'Flask',ver:'3.0+',role:'Mock APP Server'},{name:'Playwright',ver:'1.40+',role:'Chromium自动化'},{name:'Chromium',ver:'',role:'420×850移动端视口'},{name:'JSONL',ver:'',role:'结构化交互日志'}].map(t => (
                    <div key={t.name} className="flex items-center gap-3">
                      <span className="w-20 text-xs font-mono text-moss-accent/70 font-semibold">{t.name}</span>
                      {t.ver && <span className="text-[10px] font-mono text-moss-muted/40 bg-white/[0.03] px-1.5 py-0.5 rounded font-medium">{t.ver}</span>}
                      <span className="text-xs text-moss-muted/60 font-medium">{t.role}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="bg-moss-card/50 backdrop-blur border border-white/[0.06] rounded-2xl p-5">
                <h4 className="text-[11px] font-semibold tracking-widest uppercase text-moss-accent/50 font-mono mb-3">Mock APP 页面</h4>
                <div className="grid grid-cols-3 gap-2">
                  {[{path:'/',name:'首页',desc:'余额+流量'},{path:'/products',name:'产品中心',desc:'5套餐+分类'},{path:'/product/:id',name:'产品详情',desc:'详情+办理'},{path:'/search',name:'搜索',desc:'搜索+标签'},{path:'/my-account',name:'个人中心',desc:'订单+服务'},{path:'/support',name:'在线客服',desc:'FAQ+聊天'}].map(p => (
                    <div key={p.path} className="bg-moss-bg/40 border border-white/[0.03] rounded-lg p-2.5 text-center hover:border-moss-accent/20 transition-all duration-300">
                      <span className="text-[10px] font-mono text-moss-accent/60 font-semibold">{p.path}</span>
                      <div className="text-xs font-bold text-moss-text/80 mt-1">{p.name}</div>
                      <div className="text-[10px] text-moss-muted/50 mt-0.5 font-medium">{p.desc}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
