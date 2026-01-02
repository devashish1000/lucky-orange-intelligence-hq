
import React, { useState, useMemo } from 'react';
import { MOCK_REVENUE } from '../constants';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { DollarSign, UserPlus, TrendingDown, Layers, ChevronRight, Zap, Download, X } from 'lucide-react';
import { useToast } from '../components/Layout';

const COLORS = ['#f26522', '#6366f1', '#94a3b8', '#cbd5e1'];

const RevenueInsights: React.FC = () => {
  const { showToast } = useToast();
  const [multiplier, setMultiplier] = useState(0);
  const [isSimulating, setIsSimulating] = useState(false);
  const [activePlanFilter, setActivePlanFilter] = useState<string | null>(null);
  const [isExporting, setIsExporting] = useState(false);

  const handleRunSimulation = () => {
    setIsSimulating(true);
    setTimeout(() => {
      setIsSimulating(false);
      showToast("Simulation complete: Confidence 94%");
    }, 1500);
  };

  const handleExport = () => {
    setIsExporting(true);
    showToast("Generating revenue report...");
    setTimeout(() => {
      setIsExporting(false);
      showToast("Revenue_Metrics_Q2.csv exported!");
    }, 1500);
  };

  const estimatedImpact = (12400 + (multiplier * 500)).toLocaleString();

  const filteredRevenue = useMemo(() => {
    if (!activePlanFilter) return MOCK_REVENUE;
    return MOCK_REVENUE.filter(r => r.plan === activePlanFilter);
  }, [activePlanFilter]);

  const onPieClick = (data: any) => {
    const plan = data.plan;
    if (activePlanFilter === plan) {
      setActivePlanFilter(null);
      showToast("Showing all plans");
    } else {
      setActivePlanFilter(plan);
      showToast(`Filtering by ${plan}`);
    }
  };

  return (
    <div className="space-y-6 pb-6">
      <div className="flex justify-between items-center">
        <h2 className="text-[28px] font-extrabold tracking-tight text-black">Revenue</h2>
        <div className="flex gap-2">
          <button 
            onClick={handleExport}
            className={`p-2 bg-white shadow-sm rounded-full text-[#007aff] active:scale-90 transition-all ${isExporting ? 'animate-pulse opacity-50' : ''}`}
          >
            <Download size={20} />
          </button>
          <button onClick={() => showToast("Opening fiscal reports...")} className="text-[15px] font-semibold text-[#007aff] active:opacity-50">Reports</button>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="bg-white p-4 rounded-xl shadow-sm active:scale-95 transition-transform" onClick={() => showToast("Inspecting MRR breakdown")}>
          <div className="text-[10px] font-black text-slate-400 uppercase tracking-wider mb-1">Total MRR</div>
          <div className="text-[22px] font-black text-black leading-none">$842k</div>
          <div className="text-[11px] font-bold text-[#34c759] mt-2">+8.2%</div>
        </div>
        <div className="bg-white p-4 rounded-xl shadow-sm active:scale-95 transition-transform" onClick={() => showToast("Inspecting Churn details")}>
          <div className="text-[10px] font-black text-slate-400 uppercase tracking-wider mb-1">Gross Churn</div>
          <div className="text-[22px] font-black text-black leading-none">1.8%</div>
          <div className="text-[11px] font-bold text-[#ff3b30] mt-2">+0.2%</div>
        </div>
      </div>

      <section className="ios-card p-5">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-[15px] font-bold text-black">Plan Distribution</h3>
          {activePlanFilter && (
            <button onClick={() => setActivePlanFilter(null)} className="text-[11px] font-bold text-[#ff3b30] flex items-center gap-1">
              <X size={12} /> Clear
            </button>
          )}
        </div>
        <div className="h-[180px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie 
                data={MOCK_REVENUE} 
                cx="50%" 
                cy="50%" 
                innerRadius={45} 
                outerRadius={70} 
                paddingAngle={4} 
                dataKey="mrr" 
                nameKey="plan"
                onClick={onPieClick}
              >
                {MOCK_REVENUE.map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={COLORS[index % COLORS.length]} 
                    stroke={activePlanFilter === entry.plan ? '#000' : 'none'}
                    strokeWidth={2}
                    className="cursor-pointer outline-none"
                  />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                formatter={(value: any) => [`$${(value / 1000).toFixed(0)}k`, 'MRR']}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="grid grid-cols-2 gap-y-3 mt-4">
          {MOCK_REVENUE.map((item, i) => (
            <div 
              key={item.plan} 
              className={`flex items-center gap-2 transition-all cursor-pointer ${activePlanFilter && activePlanFilter !== item.plan ? 'opacity-30 scale-95' : 'opacity-100'}`} 
              onClick={() => onPieClick(item)}
            >
              <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: COLORS[i] }}></div>
              <span className="text-[12px] font-bold text-slate-700">{item.plan}</span>
              <span className="text-[12px] font-medium text-slate-400">${(item.mrr / 1000).toFixed(0)}k</span>
            </div>
          ))}
        </div>
      </section>

      {/* Filtered Segment Details */}
      {activePlanFilter && (
        <section className="animate-in slide-in-from-bottom-2 duration-300">
          <div className="ios-card p-4 bg-[#f26522]/5 border border-[#f26522]/10">
            <h4 className="text-[13px] font-black uppercase text-[#f26522] mb-2 tracking-widest">{activePlanFilter} Snapshot</h4>
            {filteredRevenue.map(r => (
              <div key={r.plan} className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-[10px] font-bold text-slate-400 uppercase">Accounts</div>
                  <div className="text-[18px] font-black text-black">{r.accounts}</div>
                </div>
                <div>
                  <div className="text-[10px] font-bold text-slate-400 uppercase">Churn Rate</div>
                  <div className="text-[18px] font-black text-[#ff3b30]">{r.churnRate}%</div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      <section className="bg-white p-6 rounded-[22px] shadow-sm border border-slate-100">
        <div className="flex justify-between items-center mb-5">
          <div className="flex items-center gap-2">
            <Zap size={18} className="text-[#f26522]" />
            <h3 className="font-extrabold text-[15px] tracking-tight text-black uppercase">Revenue Simulator</h3>
          </div>
          <span className="text-[9px] bg-indigo-50 text-[#007aff] px-2 py-0.5 rounded-full font-black uppercase tracking-tighter border border-indigo-100">Beta Intelligence</span>
        </div>
        
        <div className="space-y-6">
          <div>
            <div className="flex justify-between mb-3">
              <label className="text-[11px] font-black text-slate-400 uppercase">Recording Limits</label>
              <span className="text-[11px] font-black text-[#f26522]">+{multiplier * 5}%</span>
            </div>
            <input 
              type="range" 
              min="-10" 
              max="20" 
              value={multiplier}
              onChange={(e) => setMultiplier(parseInt(e.target.value))}
              className="w-full h-1.5 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-[#f26522]" 
            />
          </div>
          
          <div className="bg-[#f2f2f7] p-4 rounded-xl border border-slate-200 shadow-inner">
            <div className="text-[11px] font-bold text-slate-500 mb-1">Estimated MRR Impact</div>
            <div className="text-[24px] font-black text-[#34c759] tracking-tight">+${estimatedImpact} <span className="text-[14px] font-medium text-slate-400">/mo</span></div>
          </div>
          
          <button 
            onClick={handleRunSimulation}
            disabled={isSimulating}
            className={`w-full py-3.5 rounded-xl font-black text-[14px] uppercase tracking-widest transition-all shadow-md active:scale-95 ${
              isSimulating ? 'bg-slate-400 text-white animate-pulse' : 'bg-black text-white'
            }`}
          >
            {isSimulating ? 'Processing Simulation...' : 'Run Monte Carlo Analysis'}
          </button>
        </div>
      </section>
    </div>
  );
};

export default RevenueInsights;
