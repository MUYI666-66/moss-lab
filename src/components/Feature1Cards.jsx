import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import PipelineRunner from './PipelineRunner';

// ── Pipeline configuration ──
const PIPELINE_PHASES = [
  { label: '初始化模板', duration: 1800 },
  { label: '加载分布', duration: 1500 },
  { label: '批量生成', duration: 3500 },
  { label: '统计计算', duration: 2000 },
  { label: '写入CSV', duration: 1200 },
];

const PIPELINE_LOGS = [
  { time: '15:30:01', text: 'Initializing persona generation engine v3.2...', type: 'info', delay: 100 },
  { time: '15:30:01', text: 'Loading 6 persona templates with statistical distributions', type: 'info', delay: 300 },
  { time: '15:30:02', text: '[商务精英] age~N(42,12) ARPU~Exp(0.004) weight=0.15', type: 'info', delay: 500 },
  { time: '15:30:02', text: '[潮流青年] age~N(22,6)  ARPU~Exp(0.008) weight=0.25', type: 'info', delay: 650 },
  { time: '15:30:02', text: '[家庭用户] age~N(40,9)  ARPU~Exp(0.005) weight=0.22', type: 'info', delay: 800 },
  { time: '15:30:02', text: '[银发一族] age~N(67,8)  ARPU~Exp(0.015) weight=0.13', type: 'warn', delay: 950 },
  { time: '15:30:02', text: '[学生群体] age~N(17,4)  ARPU~Exp(0.018) weight=0.15', type: 'info', delay: 1100 },
  { time: '15:30:02', text: '[蓝领工人] age~N(36,11) ARPU~Exp(0.009) weight=0.10', type: 'info', delay: 1250 },
  { time: '15:30:03', text: 'Template initialization complete. Memory: 24.7 MB', type: 'success', delay: 1500 },
  { time: '15:30:03', text: 'Loading province/city dictionaries (31 provinces, 155 cities)...', type: 'info', delay: 1700 },
  { time: '15:30:04', text: 'Loading device catalog (14 models), plan catalog (15 plans)...', type: 'info', delay: 1900 },
  { time: '15:30:04', text: 'Loading channel preferences (6 channels) & satisfaction weights...', type: 'info', delay: 2100 },
  { time: '15:30:04', text: 'Distribution tables loaded. Total parameter space: 2.4M combinations', type: 'success', delay: 2300 },
  { time: '15:30:05', text: 'Starting batch generation: target=800 users, batch_size=50', type: 'info', delay: 2700 },
  { time: '15:30:05', text: 'Batch 1/16: Generated 50 users (CM000001-CM000050)', type: 'info', delay: 2900 },
  { time: '15:30:05', text: 'Batch 2/16: Generated 50 users (CM000051-CM000100)', type: 'info', delay: 3100 },
  { time: '15:30:06', text: 'Batch 3/16: Generated 50 users. ARPU outlier detected — applying winsorization', type: 'warn', delay: 3300 },
  { time: '15:30:06', text: 'Batch 4/16: Generated 50 users (CM000151-CM000200)', type: 'info', delay: 3500 },
  { time: '15:30:06', text: 'Batch 5/16-8/16: 150 users generated. Data quality check: PASSED', type: 'success', delay: 3800 },
  { time: '15:30:07', text: 'Batch 9/16-12/16: 200 users generated. Distribution alignment: 97.3%', type: 'info', delay: 4200 },
  { time: '15:30:08', text: 'Batch 13/16-16/16: Final 200 users. Coverage: all 31 provinces', type: 'success', delay: 4600 },
  { time: '15:30:08', text: 'Generation complete. 800/800 users created. Runtime: 4.2s', type: 'success', delay: 5000 },
  { time: '15:30:09', text: 'Computing statistical summaries...', type: 'info', delay: 5300 },
  { time: '15:30:09', text: 'Persona distribution: 商务精英(121) 潮流青年(197) 家庭用户(178)...', type: 'info', delay: 5500 },
  { time: '15:30:09', text: 'Gender: 男(52.1%) 女(47.9%). avg_age=37.2 avg_arpu=¥126.35', type: 'info', delay: 5700 },
  { time: '15:30:09', text: 'Satisfaction: 非常满意(12%) 满意(33%) 一般(30%) 不满意(18%) 非常不满意(7%)', type: 'warn', delay: 5900 },
  { time: '15:30:09', text: 'Churn risk distribution: High-risk=80(10%) Medium-risk=296(37%) Low-risk=424(53%)', type: 'warn', delay: 6100 },
  { time: '15:30:10', text: 'Writing output to: output/synthetic_users.csv', type: 'info', delay: 6400 },
  { time: '15:30:10', text: 'Format: UTF-8 BOM. Columns: 16. Rows: 800 (+ header)', type: 'info', delay: 6600 },
  { time: '15:30:10', text: 'File size: 136.7 KB. Compression ratio: 4.2:1', type: 'info', delay: 6800 },
  { time: '15:30:10', text: '✓ CSV export complete. File ready for downstream consumption.', type: 'success', delay: 7000 },
];

// ── Existing showcase data (unchanged) ──
const PERSONA_TYPES = [
  { name: '商务精英', pct: 15, color: '#5b8def', age: '28-55', arpu: '¥128-588', features: '国际漫游, 企业VPN' },
  { name: '潮流青年', pct: 25, color: '#e85d75', age: '16-28', arpu: '¥38-128', features: '大流量, 视频会员' },
  { name: '家庭用户', pct: 22, color: '#7FA36B', age: '30-50', arpu: '¥88-238', features: '共享套餐, 宽带融合' },
  { name: '银发一族', pct: 13, color: '#f4a261', age: '55-80', arpu: '¥18-58', features: '健康监测, 防诈提醒' },
  { name: '学生群体', pct: 15, color: '#9b5de5', age: '12-22', arpu: '¥18-58', features: '校园流量, 学习免流' },
  { name: '蓝领工人', pct: 10, color: '#00b4d8', age: '22-50', arpu: '¥38-98', features: '语音优惠, 务工套餐' },
];

const DUMMY_USERS = Array.from({ length: 50 }, (_, i) => {
  const p = PERSONA_TYPES[Math.floor(Math.random() * PERSONA_TYPES.length)];
  const genders = ['男', '女'];
  const provinces = ['北京', '上海', '广东', '浙江', '江苏', '四川', '湖北', '湖南', '河南', '山东'];
  const cities = ['朝阳区', '浦东新区', '广州', '杭州', '南京', '成都', '武汉', '长沙', '郑州', '青岛'];
  const plans = ['全球通88元', '全球通128元', '动感地带18元', '神州行38元', '5G智享套餐'];
  const satLevels = ['非常满意', '满意', '一般', '不满意', '非常不满意'];
  const risks = ['低风险', '中低风险', '中风险', '中高风险', '高风险'];
  return {
    user_id: `CM${String(i + 1).padStart(6, '0')}`,
    persona_type: p.name,
    gender: genders[Math.floor(Math.random() * 2)],
    age: Math.floor(Math.random() * 50) + 18,
    province: provinces[Math.floor(Math.random() * provinces.length)],
    city: cities[Math.floor(Math.random() * cities.length)],
    arpu_yuan: (Math.random() * 400 + 18).toFixed(2),
    data_usage_gb: (Math.random() * 100 + 1).toFixed(1),
    current_plan: plans[Math.floor(Math.random() * plans.length)],
    satisfaction: satLevels[Math.floor(Math.random() * satLevels.length)],
    churn_risk: risks[Math.floor(Math.random() * risks.length)],
  };
});

const stats = { totalUsers: 800, avgAge: 37.2, avgARPU: 126.35, avgData: 42.8, avgTenure: 58, malePct: 52.1, femalePct: 47.9 };
const satisfactionDist = [
  { label: '非常满意', pct: 12, color: '#66bb6a' }, { label: '满意', pct: 33, color: '#aed581' },
  { label: '一般', pct: 30, color: '#ffb74d' }, { label: '不满意', pct: 18, color: '#ff8a65' },
  { label: '非常不满意', pct: 7, color: '#e53935' },
];
const channelDist = [
  { label: 'APP', pct: 34, color: '#7FA36B' }, { label: '公众号', pct: 22, color: '#5b8def' },
  { label: '营业厅', pct: 18, color: '#f4a261' }, { label: '热线', pct: 14, color: '#e85d75' },
  { label: '网厅', pct: 8, color: '#00b4d8' }, { label: '短信', pct: 4, color: '#9b5de5' },
];

export default function Feature1Cards() {
  const [pipelineDone, setPipelineDone] = useState(false);
  const [filterPersona, setFilterPersona] = useState('all');
  const [filterGender, setFilterGender] = useState('all');
  const [sortKey, setSortKey] = useState(null);
  const [sortDir, setSortDir] = useState('asc');

  const filtered = (() => {
    let list = [...DUMMY_USERS];
    if (filterPersona !== 'all') list = list.filter(u => u.persona_type === filterPersona);
    if (filterGender !== 'all') list = list.filter(u => u.gender === filterGender);
    if (sortKey) {
      list.sort((a, b) => {
        const va = isNaN(a[sortKey]) ? a[sortKey] : Number(a[sortKey]);
        const vb = isNaN(b[sortKey]) ? b[sortKey] : Number(b[sortKey]);
        return sortDir === 'asc' ? (va > vb ? 1 : -1) : (vb < va ? 1 : -1);
      });
    }
    return list;
  })();

  const handleSort = (key) => {
    if (sortKey === key) setSortDir(d => d === 'asc' ? 'desc' : 'asc');
    else { setSortKey(key); setSortDir('asc'); }
  };
  const SortArrow = ({ col }) => sortKey !== col ? <span className="text-moss-muted/30 ml-1">↕</span> : <span className="text-moss-accent ml-1">{sortDir === 'asc' ? '↑' : '↓'}</span>;

  return (
    <div className="space-y-5">
      {/* ═══ PIPELINE RUNNER ═══ */}
      <PipelineRunner
        phases={PIPELINE_PHASES}
        logLines={PIPELINE_LOGS}
        title="大规模合成用户生成管线"
        subtitle="800 users · 6 personas · 16 attributes · 136.7 KB CSV output"
        onComplete={() => setPipelineDone(true)}
      >
        {/* Visual panel during execution */}
        <div className="text-center space-y-4">
          {!pipelineDone && (
            <>
              <div className="relative w-20 h-20 mx-auto">
                <motion.div
                  className="absolute inset-0 rounded-full border-2 border-moss-accent/30"
                  animate={{ rotate: 360, scale: [1, 1.1, 1] }}
                  transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
                />
                <motion.div
                  className="absolute inset-2 rounded-full border border-moss-accent-light/40"
                  animate={{ rotate: -360, scale: [1, 0.9, 1] }}
                  transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                />
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-2xl">👥</span>
                </div>
              </div>
              <div className="space-y-1">
                {['商务精英', '潮流青年', '家庭用户', '银发一族', '学生群体', '蓝领工人'].map((name, i) => (
                  <motion.div
                    key={name}
                    className="text-xs font-semibold text-moss-accent/70"
                    animate={{ opacity: [0.3, 0.7, 0.3] }}
                    transition={{ duration: 1.5, delay: i * 0.1, repeat: Infinity }}
                  >
                    {name} · loading...
                  </motion.div>
                ))}
              </div>
            </>
          )}
        </div>
      </PipelineRunner>

      {/* ═══ RESULTS (fade in after pipeline) ═══ */}
      <AnimatePresence>
        {pipelineDone && (
          <motion.div
            className="space-y-5"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
          >
            {/* Stat cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {[
                { label: '生成用户', value: stats.totalUsers, unit: '人', sub: '6种画像 × 16属性' },
                { label: '平均ARPU', value: `¥${stats.avgARPU}`, unit: '', sub: `年龄均值 ${stats.avgAge}岁` },
                { label: '性别比例', value: `${stats.malePct}%`, unit: '男', sub: `${stats.femalePct}% 女` },
                { label: '平均流量', value: stats.avgData, unit: 'GB', sub: `在网 ${stats.avgTenure}月` },
              ].map((s, i) => (
                <motion.div
                  key={s.label}
                  className="bg-moss-card/40 backdrop-blur border border-white/[0.05] rounded-xl p-4 hover:border-moss-accent/20 transition-all duration-500"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 + i * 0.06 }}
                  whileHover={{ y: -2 }}
                >
                  <div className="text-xs font-bold font-mono text-moss-muted/70 uppercase tracking-wider">{s.label}</div>
                  <div className="mt-1.5 text-2xl md:text-3xl font-display text-moss-text tracking-tight">
                    {s.value}<span className="text-sm text-moss-muted/40 ml-1 font-body">{s.unit}</span>
                  </div>
                  <div className="text-xs text-moss-muted/50 mt-1 font-medium">{s.sub}</div>
                </motion.div>
              ))}
            </div>

            {/* Charts */}
            <div className="grid md:grid-cols-2 gap-5">
              <motion.div className="bg-moss-card/50 backdrop-blur border border-white/[0.06] rounded-2xl p-5"
                initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }}>
                <h4 className="text-sm font-bold tracking-widest uppercase text-moss-accent/70 font-mono mb-4">用户画像分布</h4>
                <div className="space-y-3">
                  {PERSONA_TYPES.map((p, i) => (
                    <div key={p.name} className="group">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm font-semibold text-moss-text/80">{p.name}</span>
                        <span className="text-xs font-mono text-moss-muted/60">{p.pct}%</span>
                      </div>
                      <div className="relative h-2.5 bg-moss-bg rounded-full overflow-hidden">
                        <motion.div className="absolute inset-y-0 left-0 rounded-full" style={{ backgroundColor: p.color }}
                          initial={{ width: 0 }} animate={{ width: `${p.pct}%` }}
                          transition={{ duration: 1, delay: 0.4 + i * 0.08, ease: [0.22, 1, 0.36, 1] }} />
                      </div>
                      <div className="flex gap-2 text-[11px] text-moss-muted/50 mt-0.5 opacity-0 group-hover:opacity-100 transition-opacity font-medium">
                        <span>{p.age}岁</span><span>{p.arpu}</span><span>{p.features}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>

              <motion.div className="bg-moss-card/50 backdrop-blur border border-white/[0.06] rounded-2xl p-5"
                initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }}>
                <h4 className="text-sm font-bold tracking-widest uppercase text-moss-accent/70 font-mono mb-4">满意度分布</h4>
                <div className="space-y-2 mb-5">
                  {satisfactionDist.map((s, i) => (
                    <motion.div key={s.label} className="flex items-center gap-2"
                      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 + i * 0.06 }}>
                      <span className="w-14 text-xs text-moss-muted/70 text-right flex-shrink-0 font-medium">{s.label}</span>
                      <div className="flex-1 h-3 bg-moss-bg rounded-full overflow-hidden">
                        <motion.div className="h-full rounded-full" style={{ backgroundColor: s.color }}
                          initial={{ width: 0 }} animate={{ width: `${s.pct}%` }}
                          transition={{ duration: 0.8, delay: 0.5 + i * 0.06, ease: 'easeOut' }} />
                      </div>
                      <span className="w-8 text-xs font-mono text-moss-muted/60 text-right">{s.pct}%</span>
                    </motion.div>
                  ))}
                </div>
                <h4 className="text-[11px] font-semibold tracking-widest uppercase text-moss-accent/50 font-mono mb-3">渠道偏好</h4>
                <div className="flex items-end gap-1 h-16">
                  {channelDist.map((c, i) => (
                    <motion.div key={c.label} className="flex-1 flex flex-col items-center gap-1"
                      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 + i * 0.05 }}>
                      <span className="text-xs font-mono text-moss-muted/60">{c.pct}%</span>
                      <motion.div className="w-full rounded-t-sm" style={{ backgroundColor: c.color }}
                        initial={{ height: 0 }} animate={{ height: `${c.pct * 1.4}px` }}
                        transition={{ duration: 0.7, delay: 0.6 + i * 0.06 }} />
                      <span className="text-[10px] text-moss-muted/50 text-center font-medium">{c.label}</span>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            </div>

            {/* Data table */}
            <motion.div className="bg-moss-card/50 backdrop-blur border border-white/[0.06] rounded-2xl overflow-hidden"
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
              <div className="flex flex-wrap items-center justify-between gap-3 p-4 border-b border-white/[0.04]">
                <div className="flex items-center gap-3 flex-wrap">
                  <span className="text-xs font-mono text-moss-muted/50 uppercase tracking-wider font-semibold">数据预览 (50/800)</span>
                  <select value={filterPersona} onChange={e => setFilterPersona(e.target.value)}
                    className="text-xs font-mono bg-moss-bg border border-white/[0.08] rounded-lg px-3 py-1.5 text-moss-text/80 outline-none focus:border-moss-accent/30 font-medium">
                    <option value="all">全部画像</option>
                    {PERSONA_TYPES.map(p => <option key={p.name} value={p.name}>{p.name}</option>)}
                  </select>
                  <select value={filterGender} onChange={e => setFilterGender(e.target.value)}
                    className="text-xs font-mono bg-moss-bg border border-white/[0.08] rounded-lg px-3 py-1.5 text-moss-text/80 outline-none focus:border-moss-accent/30 font-medium">
                    <option value="all">全部性别</option>
                    <option value="男">男</option><option value="女">女</option>
                  </select>
                </div>
                <a href="/demo/synthetic_users.csv" download
                  className="text-xs font-mono text-moss-accent/70 hover:text-moss-accent border border-moss-accent/20 hover:border-moss-accent/40 rounded-lg px-3 py-1.5 transition-all duration-300 font-semibold">
                  ↓ CSV 下载
                </a>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-xs font-mono">
                  <thead>
                    <tr className="border-b border-white/[0.04] text-moss-muted/60">
                      {[['user_id','用户ID'],['persona_type','画像'],['gender','性别'],['age','年龄'],['province','省份'],['arpu_yuan','ARPU'],['satisfaction','满意度'],['churn_risk','流失风险']].map(([k,l]) => (
                        <th key={k} className="text-left py-2.5 px-3 font-medium cursor-pointer hover:text-moss-accent-light transition-colors whitespace-nowrap" onClick={() => handleSort(k)}>
                          {l}<SortArrow col={k} />
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.slice(0, 8).map(u => (
                      <tr key={u.user_id} className="border-b border-white/[0.02] hover:bg-white/[0.02] transition-colors">
                        <td className="py-2 px-3 text-moss-accent/70">{u.user_id}</td>
                        <td className="py-2 px-3 text-moss-text/70">{u.persona_type}</td>
                        <td className="py-2 px-3 text-moss-text/50">{u.gender}</td>
                        <td className="py-2 px-3 text-moss-text/50">{u.age}</td>
                        <td className="py-2 px-3 text-moss-text/50">{u.province}</td>
                        <td className="py-2 px-3 text-moss-text/70">¥{u.arpu_yuan}</td>
                        <td className="py-2 px-3">
                          <span className={`px-1.5 py-0.5 rounded text-[10px] font-medium ${u.satisfaction.includes('满意') ? 'bg-green-900/20 text-green-400/70' : u.satisfaction==='一般' ? 'bg-yellow-900/20 text-yellow-400/70' : 'bg-red-900/20 text-red-400/70'}`}>{u.satisfaction}</span>
                        </td>
                        <td className="py-2 px-3">
                          <span className={`px-1.5 py-0.5 rounded text-[10px] font-medium ${u.churn_risk.includes('低') ? 'bg-green-900/15 text-green-400/60' : u.churn_risk.includes('中') ? 'bg-yellow-900/15 text-yellow-400/60' : 'bg-red-900/15 text-red-400/60'}`}>{u.churn_risk}</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="px-4 py-2 border-t border-white/[0.04] text-xs font-mono text-moss-muted/40 font-medium">共 800 条 · 16 属性 · UTF-8 BOM · Excel兼容</div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
