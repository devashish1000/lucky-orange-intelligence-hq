
import React, { useState, useMemo } from 'react';
import { MOCK_FEATURE_USAGE } from '../constants';
import { 
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  Tooltip,
  ResponsiveContainer,
  Legend
} from 'recharts';
// Import useUI from App instead of useToast from Layout
import { useUI } from '../App';
import { Layers, Puzzle, ChevronRight, Zap, Target, Search, BarChart3, Filter, Download } from 'lucide-react';

const FeatureAdoption: React.FC = () => {
  // Use useUI to get showToast
  const { showToast } = useUI();
  const [filterPlan, setFilterPlan] = useState('All');
  const [filterIndustry, setFilterIndustry] = useState('All');
  const [activeFeature, setActiveFeature] = useState<string | null>(null);

  const filteredData = useMemo(() => {
    return MOCK_FEATURE_USAGE.map(f => ({
      ...f,
      engagement: filterPlan === 'Enterprise' ? Math.min(100, f.engagement + 15) : f.engagement,
      adoption: filterIndustry === 'Retail' ? Math.min(100, f.adoption + 10) : f.adoption
    }));
  }, [filterPlan, filterIndustry]);

  const sortedData = useMemo(() => {
    return [...filteredData].sort((a, b) => b.correlationToRetention - a.correlationToRetention);
  }, [filteredData]);

  const handleFeatureClick = (data: any) => {
    const featureName = data.payload ? data.payload.feature : data.feature;
    setActiveFeature(featureName);
    showToast(`Deep Dive: ${featureName} adoption intelligence`);
  };

  return (
    <div className="space-y-10 pb-20 animate-in fade-in duration-500">
      <div className="flex justify-between items-end px-2">
        <div className="text-left">
          <h2 className="title-large page-title leading-none">Adoption</h2>
          <p className="caption-2 timestamp mt-2">Usage Sentiment & Engagement Metrics</p>
        </div>
        <div className="flex gap-3">
          <div className="relative group">
            <button className="flex items-center gap-2 px-5 py-3 filter-chip rounded-2xl text-[13px] font-black transition-all hover:border-[#f26522]/30 active:scale-95 whitespace-nowrap">
              <Filter size={16} /> {filterPlan}
            </button>
            <div className="absolute top-14 right-0 w-48 glass rounded-3xl shadow-2xl p-2 hidden group-hover:block z-50 animate-in zoom-in-95 duration-200">
               {['All', 'Enterprise', 'Pro', 'Basic'].map(p => (
                 <button key={p} onClick={() => { setFilterPlan(p); showToast(`✓ Plan Scope: ${p}`); }} className="w-full text-left px-5 py-3 rounded-2xl hover:bg-orange-50 hover:text-[#f26522] font-bold text-sm transition-all whitespace-nowrap">{p}</button>
               ))}
            </div>
          </div>
          <div className="relative group">
            <button className="flex items-center gap-2 px-5 py-3 filter-chip rounded-2xl text-[13px] font-black transition-all hover:border-[#f26522]/30 active:scale-95 whitespace-nowrap">
              <Filter size={16} /> {filterIndustry}
            </button>
            <div className="absolute top-14 right-0 w-48 glass rounded-3xl shadow-2xl p-2 hidden group-hover:block z-50 animate-in zoom-in-95 duration-200">
               {['All', 'Retail', 'SaaS', 'E-commerce'].map(i => (
                 <button key={i} onClick={() => { setFilterIndustry(i); showToast(`✓ Industry Scope: ${i}`); }} className="w-full text-left px-5 py-3 rounded-2xl hover:bg-orange-50 hover:text-[#f26522] font-bold text-sm transition-all whitespace-nowrap">{i}</button>
               ))}
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="glass p-10 rounded-[48px] flex flex-col items-center">
          <div className="flex justify-between w-full mb-10">
             <h3 className="headline section-header uppercase tracking-widest">Engagement Index</h3>
             <span className="text-[10px] font-black text-secondary-text bg-[rgba(120,120,128,0.12)] px-3 py-1 rounded-full uppercase tracking-tighter whitespace-nowrap">Live Radar</span>
          </div>
          <div className="h-[340px] min-h-[340px] min-w-0 w-full relative">
            <ResponsiveContainer width="100%" height="100%" minWidth={0}>
              <RadarChart cx="50%" cy="50%" outerRadius="80%" data={filteredData}>
                <PolarGrid stroke="var(--separator)" />
                <PolarAngleAxis dataKey="feature" tick={{fill: 'var(--text-secondary)', fontSize: 11, fontWeight: 800}} />
                <PolarRadiusAxis angle={30} domain={[0, 100]} hide />
                <Radar
                  name="Engagement %"
                  dataKey="engagement"
                  stroke="#f26522"
                  fill="#f26522"
                  fillOpacity={0.6}
                  animationBegin={200}
                  animationDuration={1500}
                  onClick={handleFeatureClick}
                  className="cursor-pointer"
                />
                <Radar
                  name="Adoption %"
                  dataKey="adoption"
                  stroke="#6366f1"
                  fill="#6366f1"
                  fillOpacity={0.2}
                  animationBegin={400}
                  animationDuration={1500}
                  onClick={handleFeatureClick}
                  className="cursor-pointer"
                />
                <Tooltip 
                  contentStyle={{ 
                    borderRadius: '24px', 
                    border: 'none', 
                    boxShadow: '0 12px 48px rgba(0,0,0,0.1)',
                    backgroundColor: 'var(--ios-card)',
                    color: 'var(--text-primary)'
                  }} 
                />
                <Legend iconType="circle" wrapperStyle={{ paddingTop: '20px', fontWeight: 800, fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--text-secondary)' }} />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="glass p-10 rounded-[48px] border-none text-left">
          <div className="flex justify-between items-baseline mb-8">
             <div>
                <h3 className="headline section-header uppercase tracking-widest">Retention Correlation</h3>
                <p className="body-text text-[12px] mt-1 font-bold">Drill into feature-to-stickiness metrics.</p>
             </div>
             <BarChart3 size={24} style={{ color: 'var(--text-quaternary)' }} />
          </div>
          <div className="space-y-8">
            {sortedData.map((f, idx) => (
                <div 
                  key={f.feature} 
                  className={`flex items-center gap-6 cursor-pointer group transition-all animate-in slide-in-from-right-4`}
                  style={{ animationDelay: `${idx * 100}ms` }}
                  onClick={() => handleFeatureClick(f)}
                >
                  <div className="w-32 shrink-0 text-[14px] font-black leading-tight group-hover:text-[#f26522] whitespace-nowrap" style={{ color: 'var(--text-primary)' }}>{f.feature}</div>
                  <div className="flex-1 h-3 bg-[rgba(120,120,128,0.12)] rounded-full overflow-hidden border border-[rgba(120,120,128,0.2)]">
                    <div 
                      className="h-full bg-slate-900 dark:bg-slate-200 rounded-full transition-all duration-1000 group-hover:bg-[#f26522]" 
                      style={{ width: `${f.correlationToRetention * 100}%` }}
                    ></div>
                  </div>
                  <div className="w-12 text-right text-[15px] font-black" style={{ color: 'var(--text-primary)' }}>{(f.correlationToRetention * 10).toFixed(1)}</div>
                </div>
              ))}
          </div>
          
          <div className="mt-12 p-8 bg-[#f26522]/5 rounded-[32px] border border-[#f26522]/10 flex gap-6 items-center shadow-inner">
             <div className="shrink-0 w-14 h-14 bg-[#f26522] rounded-[22px] flex items-center justify-center text-white shadow-xl shadow-orange-500/30">
                <Zap size={28} />
             </div>
             <p className="text-[16px] leading-relaxed font-bold" style={{ color: 'var(--text-secondary)' }}>
               <span className="font-black" style={{ color: 'var(--text-primary)' }}>Discovery AI</span> shows the highest retention correlation (9.5/10). We recommend a targeted onboarding blitz for all Pro accounts.
             </p>
          </div>
        </div>
      </div>

      <div className="glass rounded-[48px] overflow-hidden border-none">
        <div className="p-8 border-b var(--separator) bg-white/50 dark:bg-black/20 flex justify-between items-center">
          <h3 className="headline section-header uppercase tracking-widest whitespace-nowrap">Adoption by Traffic Segment</h3>
          <button onClick={() => showToast("Exporting Segment Analysis...")} className="p-3 bg-[rgba(120,120,128,0.12)] rounded-2xl hover:bg-[rgba(120,120,128,0.24)] transition-colors"><Download size={20} style={{ color: 'var(--text-secondary)' }} /></button>
        </div>
        <div className="overflow-x-auto no-scrollbar">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[rgba(120,120,128,0.04)] text-secondary-text text-[11px] font-black uppercase tracking-[0.2em] border-b var(--separator)">
                <th className="px-8 py-5 whitespace-nowrap">Plan Tier</th>
                <th className="px-8 py-5 whitespace-nowrap">Recordings</th>
                <th className="px-8 py-5 whitespace-nowrap">Heatmaps</th>
                <th className="px-8 py-5 text-right whitespace-nowrap">Discovery AI</th>
              </tr>
            </thead>
            <tbody className="divide-y var(--separator)">
              {[
                { band: 'Enterprise', r: '98%', h: '94%', a: '45%', colorClass: 'text-emerald-500' },
                { band: 'Mid-Market Pro', r: '92%', h: '88%', a: '22%', colorClass: 'text-amber-500' },
                { band: 'Growth Basic', r: '85%', h: '62%', a: '8%', colorClass: 'text-[#f26522]' },
                { band: 'Micro Starter', r: '62%', h: '45%', a: '3%', colorClass: 'text-rose-500' },
              ].map((row, i) => (
                <tr key={i} className="active:bg-orange-50/50 cursor-pointer transition-colors group" onClick={() => showToast(`Segment Filter: ${row.band}`)}>
                  <td className="px-8 py-6 text-[15px] font-black group-hover:text-[#f26522] whitespace-nowrap" style={{ color: 'var(--text-primary)' }}>{row.band}</td>
                  <td className="px-8 py-6 text-[15px] text-emerald-600 font-black whitespace-nowrap">{row.r}</td>
                  <td className="px-8 py-6 text-[15px] text-emerald-600 font-black whitespace-nowrap">{row.h}</td>
                  <td className={`px-8 py-6 text-[15px] font-black text-right whitespace-nowrap ${row.colorClass}`}>{row.a}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default FeatureAdoption;
