import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import PipelineRunner from './PipelineRunner';

const BASE = import.meta.env.BASE_URL;

const PIPELINE_PHASES = [
  { label: '加载数据', duration: 1500 },
  { label: '生成地图', duration: 2500 },
  { label: '漏斗分析', duration: 2000 },
  { label: 'AI诊断', duration: 2500 },
  { label: '预测模型', duration: 1500 },
];

const PIPELINE_LOGS = [
  { time: '17:00:01', text: 'Initializing journey analysis engine v4.1...', type: 'info', delay: 100 },
  { time: '17:00:01', text: 'Loading interaction data from interaction_log.jsonl', type: 'info', delay: 250 },
  { time: '17:00:01', text: 'Parsed 17 interaction events across 6 pages', type: 'success', delay: 400 },
  { time: '17:00:02', text: 'Loading synthetic user profile data (800 records)...', type: 'info', delay: 600 },
  { time: '17:00:02', text: 'Data validation: 800/800 records valid, 0 corrupted', type: 'success', delay: 800 },
  { time: '17:00:02', text: 'Computing 7 journey stages: 认知→搜索→比较→购买→使用→客服→续费', type: 'info', delay: 1000 },
  { time: '17:00:02', text: 'Stage transition matrix computed: 7×7 nodes, 42 edges', type: 'info', delay: 1200 },
  { time: '17:00:03', text: 'Rendering journey map (1920×1080, 150 DPI)...', type: 'info', delay: 1600 },
  { time: '17:00:03', text: 'Drawing 7 stage zones with color-coded satisfaction levels', type: 'info', delay: 1800 },
  { time: '17:00:04', text: 'Plotting 28 touchpoint bubbles (size=volume, color=satisfaction)', type: 'info', delay: 2000 },
  { time: '17:00:04', text: 'Adding legends: 红(<3.0) 橙(3.0-3.5) 绿(>3.5)', type: 'info', delay: 2200 },
  { time: '17:00:05', text: 'Journey map saved → journey_map_overview.png (374 KB)', type: 'success', delay: 2600 },
  { time: '17:00:05', text: 'Building conversion funnel...', type: 'info', delay: 2900 },
  { time: '17:00:05', text: 'Funnel: 1000→650→420→280→250→180→140 (overall 14.0%)', type: 'info', delay: 3100 },
  { time: '17:00:06', text: 'High-churn stages identified:', type: 'warn', delay: 3400 },
  { time: '17:00:06', text: '  ⚠ 续费/流失: 50.0% drop rate — CRITICAL', type: 'error', delay: 3600 },
  { time: '17:00:06', text: '  ⚠ 比较评估: 35.4% drop rate — HIGH', type: 'warn', delay: 3800 },
  { time: '17:00:06', text: '  ⚠ 信息搜索: 35.0% drop rate — MEDIUM', type: 'warn', delay: 4000 },
  { time: '17:00:06', text: 'Funnel chart saved → funnel_analysis.png (88 KB)', type: 'success', delay: 4300 },
  { time: '17:00:07', text: 'Launching AI breakpoint analysis module...', type: 'info', delay: 4700 },
  { time: '17:00:07', text: 'Analyzing pain point impact matrix (5 issues × 7 stages)...', type: 'info', delay: 4900 },
  { time: '17:00:08', text: 'Computing improvement priority scores...', type: 'info', delay: 5200 },
  { time: '17:00:08', text: 'Priority #1: 续费/流失 — 携号转网门槛 (score: 9.2/10)', type: 'warn', delay: 5400 },
  { time: '17:00:08', text: 'Priority #2: 比较评估 — 套餐不透明 (score: 7.8/10)', type: 'warn', delay: 5600 },
  { time: '17:00:08', text: 'Priority #3: 购买办理 — 流程繁琐 (score: 7.5/10)', type: 'warn', delay: 5800 },
  { time: '17:00:09', text: 'Pain point analysis saved → pain_point_analysis.png (332 KB)', type: 'success', delay: 6200 },
  { time: '17:00:09', text: 'Training churn prediction model (RandomForest, n=100)...', type: 'info', delay: 6500 },
  { time: '17:00:10', text: 'Feature importance: satisfaction(0.38) tenure(0.22) arpu(0.18) complaints(0.12) age(0.10)', type: 'info', delay: 6700 },
  { time: '17:00:10', text: 'Prediction: Jul=28 churns, Aug=35 churns (rising trend)', type: 'warn', delay: 6900 },
  { time: '17:00:10', text: 'Churn dashboard saved → churn_prediction.png (139 KB)', type: 'success', delay: 7200 },
  { time: '17:00:10', text: 'Analysis complete. 4 charts, 5 insights, 4 recommendations.', type: 'success', delay: 7500 },
];

const charts = [
  { id: 'journey', title: '旅程全景地图', desc: '7阶段 × 4触点气泡图，颜色+大小标识满意度与流量', img: `${BASE}demo/charts/journey_map_overview.png` },
  { id: 'funnel', title: '转化漏斗分析', desc: '1000人→140人全链路漏斗，标注各阶段流失率', img: `${BASE}demo/charts/funnel_analysis.png` },
  { id: 'pain', title: '薄弱环节分析', desc: '流失率柱状图+痛点矩阵+满意度趋势+优先级排序', img: `${BASE}demo/charts/pain_point_analysis.png` },
  { id: 'churn', title: '流失预测仪表盘', desc: '5级风险构成饼图+未来2月流失趋势预测', img: `${BASE}demo/charts/churn_prediction.png` },
];

const painPoints = [
  { stage: '续费/流失', issue: '携号转网门槛降低', rate: '50.0%', impact: '极高', color: '#b71c1c', suggestion: '建立高价值用户预警系统，提前30天主动推送关怀优惠' },
  { stage: '比较评估', issue: '套餐信息展示不透明', rate: '35.4%', impact: '高', color: '#e53935', suggestion: '引入AI智能推荐，一键对比核心差异' },
  { stage: '信息搜索', issue: '搜索匹配精度不足', rate: '35.0%', impact: '中', color: '#ff9800', suggestion: '升级NLP语义搜索，增加智能导航引导' },
  { stage: '购买办理', issue: '办理流程繁琐', rate: '33.3%', impact: '高', color: '#e53935', suggestion: '优化至3步内完成，支持人脸识别认证' },
  { stage: '客服咨询', issue: '智能客服一次解决率低', rate: '22.2%', impact: '中', color: '#ff9800', suggestion: '扩展知识库，引入大模型提供精准回复' },
];

const funnelStages = [
  { name: '认知发现', value: 1000, color: '#66bb6a' }, { name: '信息搜索', value: 650, color: '#aed581' },
  { name: '比较评估', value: 420, color: '#ffb74d' }, { name: '购买办理', value: 280, color: '#ff8a65' },
  { name: '使用体验', value: 250, color: '#aed581' }, { name: '客服咨询', value: 180, color: '#ffb74d' },
  { name: '续费/流失', value: 140, color: '#e53935' },
];

const radarStages = ['认知发现', '信息搜索', '比较评估', '购买办理', '使用体验', '客服咨询', '续费/流失'];
const radarData = {
  overall: [3.57, 3.63, 3.45, 3.50, 3.38, 3.40, 2.97],
  digital: [3.65, 3.75, 3.20, 3.75, 3.47, 3.50, 3.50],
  offline: [3.50, 3.50, 3.70, 3.25, 3.28, 3.30, 2.60],
};

const kpis = [
  { label: '高风险流失用户', value: '100', unit: '人', sub: '12.5%', color: '#e53935' },
  { label: '平均满意度', value: '3.27', unit: '/5.0', sub: '中位水平', color: '#ff9800' },
  { label: '整体转化率', value: '14.0', unit: '%', sub: '1000→140', color: '#66bb6a' },
  { label: '预测下月流失', value: '28', unit: '人', sub: '持续上升', color: '#ff8a65' },
];

export default function Feature3Cards() {
  const [pipelineDone, setPipelineDone] = useState(false);
  const [activeChart, setActiveChart] = useState('journey');
  const [lightbox, setLightbox] = useState(null);
  const [expandedPain, setExpandedPain] = useState(null);
  const currentChart = charts.find(c => c.id === activeChart);

  return (
    <div className="space-y-5">
      {/* ═══ PIPELINE ═══ */}
      <PipelineRunner
        phases={PIPELINE_PHASES}
        logLines={PIPELINE_LOGS}
        title="旅程分析与断点诊断管线"
        subtitle="4 charts · 5 insights · 4 recommendations · 9.2s runtime"
        onComplete={() => setPipelineDone(true)}
      >
        <div className="text-center space-y-3">
          <div className="relative w-24 h-24 mx-auto">
            <motion.svg viewBox="0 0 100 100" className="w-full h-full" animate={{ rotate: 360 }}
              transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}>
              <circle cx="50" cy="50" r="40" fill="none" stroke="rgba(127,163,107,0.15)" strokeWidth="2" />
              <motion.circle cx="50" cy="50" r="35" fill="none" stroke="#7FA36B" strokeWidth="1.5" strokeDasharray="220"
                animate={{ strokeDashoffset: [220, 0] }} transition={{ duration: 3, repeat: Infinity }} />
              <circle cx="50" cy="50" r="2" fill="#A4C783" />
            </motion.svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-lg">📊</span>
            </div>
          </div>
          <div className="space-y-1">
            {['旅程地图', '转化漏斗', '痛点矩阵', '预测模型'].map((n, i) => (
              <motion.div key={n} className="text-xs font-semibold text-moss-accent/70"
                animate={{ opacity: [0.3, 0.7, 0.3] }} transition={{ duration: 1.5, delay: i * 0.15, repeat: Infinity }}>
                {n} · computing...
              </motion.div>
            ))}
          </div>
        </div>
      </PipelineRunner>

      {/* ═══ RESULTS ═══ */}
      <AnimatePresence>
        {pipelineDone && (
          <motion.div className="space-y-5" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.3 }}>
            {/* KPI dashboard */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {kpis.map((k, i) => (
                <motion.div key={k.label} className="relative bg-moss-card/50 backdrop-blur border border-white/[0.06] rounded-2xl p-4 md:p-5 overflow-hidden group hover:border-white/[0.1] transition-all duration-500"
                  initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }} whileHover={{ y: -2 }}>
                  <div className="absolute top-0 left-0 right-0 h-px" style={{ backgroundColor: k.color, opacity: 0.5 }} />
                  <div className="text-xs font-mono text-moss-muted/50 uppercase tracking-wider mb-2 font-semibold">{k.label}</div>
                  <div className="flex items-baseline gap-1">
                    <span className="text-3xl md:text-4xl font-display text-moss-text tracking-tight">{k.value}</span>
                    <span className="text-sm text-moss-muted/40 font-body">{k.unit}</span>
                  </div>
                  <div className="text-xs text-moss-muted/60 mt-1 font-medium">{k.sub}</div>
                </motion.div>
              ))}
            </div>

            {/* Chart gallery */}
            <div className="bg-moss-card/50 backdrop-blur border border-white/[0.06] rounded-2xl p-5 md:p-6">
              <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
                <div className="flex flex-wrap gap-1.5">
                  {charts.map((c, i) => (
                    <button key={c.id} onClick={() => setActiveChart(c.id)}
                      className={`px-4 py-2 rounded-xl text-xs font-mono font-semibold transition-all duration-300 ${activeChart===c.id ? 'bg-moss-accent/15 border border-moss-accent/30 text-moss-accent-light glow-accent' : 'bg-transparent border border-white/[0.05] text-moss-muted/70 hover:border-white/[0.1] hover:text-moss-text'}`}>
                      {c.title}
                    </button>
                  ))}
                </div>
                <button onClick={() => setLightbox(currentChart)} className="text-xs font-mono text-moss-muted/50 hover:text-moss-accent transition-colors font-medium">🔍 放大</button>
              </div>
              <AnimatePresence mode="wait">
                <motion.div key={activeChart} className="rounded-xl overflow-hidden border border-white/[0.04] bg-moss-bg cursor-pointer"
                  initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
                  onClick={() => setLightbox(currentChart)}>
                  <img src={currentChart?.img} alt={currentChart?.title} className="w-full" />
                  <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-moss-bg/80 to-transparent p-4">
                    <p className="text-xs text-moss-muted/70 font-medium">{currentChart?.desc}</p>
                  </div>
                </motion.div>
              </AnimatePresence>
              <div className="flex flex-wrap gap-3 mt-4">
                {charts.map(c => <a key={c.id} href={c.img} download className="text-xs font-mono text-moss-muted/40 hover:text-moss-accent/60 transition-colors font-medium">↓ {c.title}.png</a>)}
              </div>
            </div>

            {/* Lightbox */}
            <AnimatePresence>
              {lightbox && (
                <motion.div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/85 backdrop-blur-md p-4"
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setLightbox(null)}>
                  <motion.div className="relative max-w-[90vw] max-h-[90vh] overflow-auto rounded-2xl border border-white/[0.08]"
                    initial={{ scale: 0.9 }} animate={{ scale: 1 }} exit={{ scale: 0.9 }} onClick={e => e.stopPropagation()}>
                    <img src={lightbox?.img} alt={lightbox?.title} className="w-full" />
                    <button onClick={() => setLightbox(null)} className="absolute top-4 right-4 w-10 h-10 rounded-full bg-black/50 border border-white/10 text-white flex items-center justify-center hover:bg-black/70 transition-colors text-lg">✕</button>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Funnel + Radar */}
            <div className="grid md:grid-cols-2 gap-5">
              <motion.div className="bg-moss-card/50 backdrop-blur border border-white/[0.06] rounded-2xl p-5"
                initial={{ opacity: 0, x: -15 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}>
                <h4 className="text-sm font-bold tracking-widest uppercase text-moss-accent/70 font-mono mb-4">转化漏斗</h4>
                <div className="space-y-1">
                  {funnelStages.map((f, i) => {
                    const prev = funnelStages[i-1]?.value || f.value;
                    const dropRate = i > 0 ? ((prev-f.value)/prev*100).toFixed(1) : null;
                    const wp = (f.value/funnelStages[0].value)*100;
                    return (
                      <motion.div key={f.name} className="relative" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 + i*0.05 }}>
                        <div className="flex items-center gap-3">
                          <span className="w-16 text-xs font-mono text-moss-muted/60 text-right flex-shrink-0 font-medium">{f.name}</span>
                          <div className="flex-1 h-6 bg-moss-bg rounded-lg overflow-hidden">
                            <motion.div className="absolute inset-y-0 left-0 rounded-lg" style={{ backgroundColor: f.color, width: `${wp}%` }}
                              initial={{ width: 0 }} animate={{ width: `${wp}%` }} transition={{ duration: 0.8, delay: 0.4 + i*0.06 }} />
                            <span className="absolute inset-y-0 left-3 flex items-center text-[10px] font-mono text-black/70 font-semibold">{f.value}人</span>
                          </div>
                          {dropRate ? <span className="text-xs font-mono text-moss-danger/80 w-16 flex-shrink-0 font-semibold">↓{dropRate}%</span> : <span className="w-16 flex-shrink-0" />}
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </motion.div>

              <motion.div className="bg-moss-card/50 backdrop-blur border border-white/[0.06] rounded-2xl p-5"
                initial={{ opacity: 0, x: 15 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}>
                <h4 className="text-sm font-bold tracking-widest uppercase text-moss-accent/70 font-mono mb-4">满意度雷达图</h4>
                <div className="flex justify-center">
                  <svg viewBox="0 0 300 280" className="w-full max-w-[300px] h-auto">
                    {[1,2,3,4,5].map(r => (
                      <polygon key={r} points={radarStages.map((_,i) => { const a=Math.PI*2*i/7-Math.PI/2; const rad=20+r*20; return `${150+rad*Math.cos(a)},${140+rad*Math.sin(a)}`; }).join(' ')}
                        fill="none" stroke="rgba(255,255,255,0.04)" strokeWidth="0.5" />
                    ))}
                    {radarStages.map((_,i) => { const a=Math.PI*2*i/7-Math.PI/2; return <line key={i} x1="150" y1="140" x2={150+120*Math.cos(a)} y2={140+120*Math.sin(a)} stroke="rgba(255,255,255,0.04)" strokeWidth="0.5" />; })}
                    {[{data:radarData.overall,color:'#A4C783',label:'综合'},{data:radarData.digital,color:'#5b8def',label:'数字'},{data:radarData.offline,color:'#ff8a65',label:'线下'}].map(s => (
                      <polygon key={s.label} points={s.data.map((v,i)=>{ const a=Math.PI*2*i/7-Math.PI/2; const rad=20+(v/5)*100; return `${150+rad*Math.cos(a)},${140+rad*Math.sin(a)}`; }).join(' ')}
                        fill={s.color} fillOpacity="0.12" stroke={s.color} strokeWidth="1.5" strokeOpacity="0.7" />
                    ))}
                    {radarStages.map((s,i)=>{ const a=Math.PI*2*i/7-Math.PI/2; const lx=150+135*Math.cos(a); const ly=140+135*Math.sin(a);
                      return <text key={s} x={lx} y={ly} textAnchor="middle" dominantBaseline="middle" fill="#8E958B" fillOpacity="0.75" fontSize="10" fontWeight="500" fontFamily="'Noto Sans SC',sans-serif">{s}</text>; })}
                  </svg>
                </div>
                <div className="flex items-center justify-center gap-4 mt-2">
                  {[{color:'#A4C783',label:'综合'},{color:'#5b8def',label:'数字'},{color:'#ff8a65',label:'线下'}].map(l => (
                    <div key={l.label} className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full" style={{backgroundColor:l.color}}/><span className="text-xs text-moss-muted/60 font-medium">{l.label}</span></div>
                  ))}
                </div>
              </motion.div>
            </div>

            {/* AI Report */}
            <motion.div className="bg-moss-card/50 backdrop-blur border border-white/[0.06] rounded-2xl p-5 md:p-6"
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
              <div className="flex items-center gap-3 mb-5">
                <span className="text-lg">🤖</span>
                <div>
                  <h4 className="text-sm font-bold tracking-widest uppercase text-moss-accent/70 font-mono">AI 断点分析报告</h4>
                  <p className="text-xs text-moss-muted/50 mt-0.5 font-medium">规则引擎 + 数据驱动的智能分析</p>
                </div>
              </div>
              <div className="space-y-2">
                {painPoints.map((pp, i) => (
                  <motion.div key={pp.stage} className="group cursor-pointer" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 + i*0.06 }}
                    onClick={() => setExpandedPain(expandedPain===i ? null : i)}>
                    <div className="flex items-center gap-3 p-3 rounded-xl bg-moss-bg/30 border border-white/[0.03] hover:border-white/[0.06] transition-all duration-300">
                      <span className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-mono font-bold" style={{backgroundColor:pp.color+'20',color:pp.color}}>{i+1}</span>
                      <div className="w-1 h-8 rounded-full flex-shrink-0" style={{backgroundColor:pp.color}}/>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2"><span className="text-[11px] font-mono text-moss-muted/50 font-medium">{pp.stage}</span><span className="text-sm font-semibold text-moss-text/85">{pp.issue}</span></div>
                      </div>
                      <div className="text-right flex-shrink-0"><div className="text-sm font-mono text-moss-text font-bold">{pp.rate}</div><div className="text-[11px] font-mono font-semibold" style={{color:pp.color}}>{pp.impact}风险</div></div>
                      <span className="text-sm text-moss-muted/40 transition-transform duration-300" style={{transform:expandedPain===i?'rotate(180deg)':'rotate(0)'}}>▾</span>
                    </div>
                    <AnimatePresence>
                      {expandedPain===i && (
                        <motion.div className="mx-3 mt-1 mb-2 p-4 rounded-xl bg-moss-bg/50 border border-white/[0.04]"
                          initial={{height:0,opacity:0}} animate={{height:'auto',opacity:1}} exit={{height:0,opacity:0}}>
                          <div className="text-sm space-y-2">
                            <div><span className="text-moss-muted/50 font-mono font-semibold">根因分析</span><p className="text-moss-text/70 mt-1">{pp.suggestion}</p></div>
                            <div><span className="text-moss-muted/50 font-mono font-semibold">改进建议</span><p className="text-moss-accent/70 mt-1">{pp.suggestion}</p></div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Suggestions */}
            <div className="grid md:grid-cols-4 gap-3">
              {[{icon:'🔔',title:'高价值用户预警',desc:'提前30天识别流失风险'},{icon:'🤖',title:'AI智能推荐',desc:'一键对比套餐核心差异'},{icon:'🔍',title:'NLP语义搜索',desc:'升级搜索匹配精度'},{icon:'⚡',title:'3步极简办理',desc:'人脸识别快速认证'}].map((s,i) => (
                <motion.div key={s.title} className="bg-moss-card/50 backdrop-blur border border-white/[0.06] rounded-2xl p-4 hover:border-moss-accent/20 transition-all duration-500"
                  initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 + i*0.06 }} whileHover={{ y: -3 }}>
                  <div className="w-10 h-10 rounded-xl bg-moss-accent/10 flex items-center justify-center text-lg mb-3">{s.icon}</div>
                  <h5 className="text-sm font-bold text-moss-text/85">{s.title}</h5>
                  <p className="text-xs text-moss-muted/60 mt-1.5 font-medium">{s.desc}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
