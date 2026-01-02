
import React, { useState } from 'react';
import { MOCK_KPIS, MOCK_INSIGHTS } from '../constants';
import { StatCard, InsightCard } from '../components/DashboardCards';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { Sparkles, ChevronRight, RefreshCw, Clock, TrendingUp } from 'lucide-react';
import { useToast } from '../components/Layout';
import { useNavigate } from 'react-router-dom';

const chartData = [
  { month: 'Jan', mrr: 720000 }, { month: 'Feb', mrr: 745000 }, { month: 'Mar', mrr: 760000 },
  { month: 'Apr', mrr: 785000 }, { month: 'May', mrr: 810000 }, { month: 'Jun', mrr: 842500 },
];

const ExecutiveOverview: React.FC = () => {
  const { showToast } = useToast();
  const navigate = useNavigate();
  const [lastUpdated, setLastUpdated] = useState<string>(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = () => {
    setIsRefreshing(true);
    showToast("Updating growth engine data...");
    setTimeout(() => {
      setLastUpdated(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
      setIsRefreshing(false);
      showToast("✓ Real-time data synced");
    }, 1000);
  };

  const handleKPIClick = (id: string) => {
    // Calling the function injected into window in Layout.tsx
    if ((window as any).openKPIDetail) {
      (window as any).openKPIDetail(id);
    }
  };

  const handleInsightClick = (insight: any) => {
    showToast(`Navigating to ${insight.targetPath}...`);
    navigate(insight.targetPath, { state: { filters: insight.targetFilter } });
  };

  const handleLaunchCampaign = () => {
    if ((window as any).openActionModal) {
      (window as any).openActionModal('campaign', 'Growth Expansion Campaign');
    }
  };

  return (
    <div className="space-y-10 pb-12">
      {/* KPI Section */}
      <section>
        <div className="flex justify-between items-end mb-6">
          <div className="flex flex-col gap-1">
            <h2 className="text-[24px] font-black text-slate-900 tracking-tight leading-none">Global Pulse</h2>
            <div className="flex items-center gap-1.5 text-[11px] text-slate-500 font-bold uppercase tracking-widest">
              <Clock size={12} className="text-slate-400" />
              Live Sync: {lastUpdated}
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button 
              onClick={handleRefresh} 
              className={`w-10 h-10 bg-white border border-slate-200 rounded-xl shadow-sm flex items-center justify-center text-[#0066cc] transition-all hover:border-blue-200 active:scale-90 ${isRefreshing ? 'animate-spin opacity-50' : ''}`}
              title="Refresh Data"
            >
              <RefreshCw size={18} />
            </button>
            <button onClick={() => showToast("Customization enabled")} className="text-[14px] font-bold text-[#0066cc] active:opacity-50">Configure</button>
          </div>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {MOCK_KPIS.map((kpi, idx) => (
            <div key={idx} onClick={() => handleKPIClick(kpi.id!)}>
              <StatCard {...kpi} />
            </div>
          ))}
        </div>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Revenue Chart Section */}
        <section className="lg:col-span-2">
          <div className="flex justify-between items-baseline mb-5">
            <h2 className="text-[20px] font-black text-slate-900">MRR Performance</h2>
            <button onClick={() => navigate('/revenue')} className="text-[13px] font-bold text-[#0066cc] hover:underline">Full Analysis</button>
          </div>
          <div className="bg-white p-7 rounded-[24px] shadow-sm border border-slate-100 hover:border-orange-500/20 transition-all cursor-pointer" onClick={() => handleKPIClick('mrr')}>
            <div className="h-[220px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData}>
                  <defs>
                    <linearGradient id="colorMrr" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#f26522" stopOpacity={0.15}/>
                      <stop offset="95%" stopColor="#f26522" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <Area 
                    type="monotone" 
                    dataKey="mrr" 
                    stroke="#f26522" 
                    strokeWidth={4} 
                    fillOpacity={1} 
                    fill="url(#colorMrr)" 
                    animationDuration={2000} 
                  />
                  <Tooltip 
                    contentStyle={{ borderRadius: '14px', border: 'none', boxShadow: '0 10px 25px rgba(0,0,0,0.1)', padding: '12px' }}
                    formatter={(value: any) => [`$${value.toLocaleString()}`, 'MRR']}
                  />
                  <XAxis dataKey="month" hide />
                  <YAxis hide domain={['dataMin - 50000', 'dataMax + 50000']} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
            <div className="flex justify-between items-center mt-6 pt-6 border-t border-slate-50">
              <div className="flex flex-col">
                <span className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Growth vs Last Month</span>
                <span className="text-[20px] font-black text-slate-900 leading-tight flex items-center gap-1.5">
                  +$32,500 <TrendingUp size={18} className="text-emerald-500" />
                </span>
              </div>
              <div className="flex flex-col text-right">
                <span className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Projected Year End</span>
                <span className="text-[20px] font-black text-slate-900 leading-tight">$10.2M</span>
              </div>
            </div>
          </div>
        </section>

        {/* Discovery Insights Section */}
        <section>
          <div className="flex justify-between items-baseline mb-5">
            <h2 className="text-[20px] font-black text-slate-900">Intelligence</h2>
            <button onClick={() => showToast("Deep analysis opening")} className="text-[13px] font-bold text-[#0066cc]">All Alerts</button>
          </div>
          <div className="space-y-4">
            {MOCK_INSIGHTS.map((insight, idx) => (
              <InsightCard key={idx} {...insight} onClick={() => handleInsightClick(insight)} />
            ))}
          </div>
        </section>
      </div>

      {/* AI Growth Play Call to Action */}
      <section className="bg-slate-900 p-8 rounded-[32px] shadow-2xl text-white relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-80 h-80 bg-[#f26522]/20 rounded-full blur-3xl -mr-32 -mt-32 transition-all group-hover:bg-[#f26522]/30"></div>
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-[#f26522] rounded-xl flex items-center justify-center shadow-lg shadow-orange-500/40">
              <Sparkles size={20} className="text-white" />
            </div>
            <div>
              <h3 className="font-black text-[18px] tracking-tight leading-none">Smart Expansion Opportunity</h3>
              <p className="text-[10px] font-bold text-orange-400 uppercase tracking-widest mt-1">AI Recommendation</p>
            </div>
          </div>
          <p className="text-[16px] font-medium leading-relaxed text-slate-300 mb-6 max-w-2xl">
            We found 12 Enterprise accounts with <span className="text-white font-bold">high heatmap activity</span> but low recording usage. Converting these to the Pro+ plan adds <span className="text-white font-black underline decoration-orange-500/50 decoration-4">$12,400/mo</span> to your baseline.
          </p>
          <button 
            onClick={handleLaunchCampaign}
            className="w-full sm:w-auto px-8 py-4 bg-white text-[#f26522] rounded-2xl font-black text-[15px] flex items-center justify-center gap-2 hover:bg-slate-50 active:scale-[0.98] transition-all shadow-xl shadow-black/20"
          >
            Deploy Targeted Campaign <ChevronRight size={18} />
          </button>
        </div>
      </section>
    </div>
  );
};

export default ExecutiveOverview;
