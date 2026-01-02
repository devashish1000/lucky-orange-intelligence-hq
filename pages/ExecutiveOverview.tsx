
import React, { useState, useEffect, useRef } from 'react';
import { MOCK_KPIS, MOCK_INSIGHTS, MOCK_KPI_DETAILS } from '../constants';
import { StatCard, InsightCard } from '../components/DashboardCards';
import { Sparkles, RefreshCw, BarChart3, Target, Download, TrendingUp, TrendingDown, AlertTriangle, Zap, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { AreaChart, Area, Tooltip, ResponsiveContainer } from 'recharts';
import { KPIDetail } from '../types';
import { useUI } from '../App';

const ExecutiveOverview: React.FC = () => {
  const { showToast, triggerHaptic } = useUI();
  const navigate = useNavigate();
  const [lastUpdated, setLastUpdated] = useState<string>(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isExporting, setIsExporting] = useState(false);

  // Detail Modal State
  const [activeKPIDetail, setActiveKPIDetail] = useState<KPIDetail | null>(null);
  const [isDetailLoading, setIsDetailLoading] = useState(false);
  const [detailLoadingMsg, setDetailLoadingMsg] = useState('Fetching details...');
  const [isDetailError, setIsDetailError] = useState(false);

  // Pull-to-refresh state
  const [startY, setStartY] = useState(0);
  const [pullDist, setPullDist] = useState(0);
  const [hasTriggeredHaptic, setHasTriggeredHaptic] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoaded(true), 100);
    return () => clearTimeout(timer);
  }, []);

  const handleTouchStart = (e: React.TouchEvent) => {
    if (window.scrollY === 0) {
      setStartY(e.touches[0].pageY);
      setHasTriggeredHaptic(false);
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (startY > 0) {
      const dist = e.touches[0].pageY - startY;
      if (dist > 0) {
        // Logarithmic pull resistance
        const pull = Math.pow(dist, 0.75) * 2.5;
        const currentPull = Math.min(pull, 140);
        setPullDist(currentPull);
        
        // Haptic feedback when reaching threshold
        if (currentPull > 85 && !hasTriggeredHaptic) {
          triggerHaptic('medium');
          setHasTriggeredHaptic(true);
        } else if (currentPull <= 85 && hasTriggeredHaptic) {
          setHasTriggeredHaptic(false);
        }
        
        e.preventDefault();
      }
    }
  };

  const handleTouchEnd = () => {
    if (pullDist > 85) {
      handleRefresh();
    }
    setPullDist(0);
    setStartY(0);
    setHasTriggeredHaptic(false);
  };

  const handleRefresh = () => {
    setIsRefreshing(true);
    setIsLoading(true);
    triggerHaptic('success');
    
    // Simulate data refresh
    setTimeout(() => {
      setLastUpdated(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
      setIsRefreshing(false);
      setIsLoading(false);
      showToast("Intelligence HQ Synced");
    }, 1800);
  };

  const handleDownloadReport = () => {
    setIsExporting(true);
    triggerHaptic('medium');
    showToast("Preparing Executive Report...");

    setTimeout(() => {
      try {
        const timestamp = new Date().toISOString().split('T')[0];
        const filename = `Lucky_Orange_Executive_Report_${timestamp}.csv`;
        
        const headers = ['Metric', 'Current Value', 'Growth %', 'Trend'].join(',');
        const rows = MOCK_KPIS.map(kpi => [
          kpi.label,
          kpi.value,
          kpi.change,
          kpi.trend
        ].join(',')).join('\n');
        
        const csvContent = "data:text/csv;charset=utf-8," + headers + "\n" + rows;
        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", filename);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        showToast("Report Downloaded Successfully");
      } catch (err) {
        showToast("Export failed.");
      } finally {
        setIsExporting(false);
      }
    }, 2000);
  };

  const openKPIDetail = (id: string) => {
    triggerHaptic('medium');
    setIsDetailLoading(true);
    setIsDetailError(false);
    setActiveKPIDetail(null);
    setDetailLoadingMsg('Querying Intelligence...');

    setTimeout(() => setDetailLoadingMsg('Synthesizing metrics...'), 1000);
    
    setTimeout(() => {
      const detail = MOCK_KPI_DETAILS[id];
      if (detail) {
        setActiveKPIDetail(detail);
        setIsDetailLoading(false);
      } else {
        setIsDetailLoading(false);
        setIsDetailError(true);
      }
    }, 1800);
  };

  const closeModals = () => {
    setActiveKPIDetail(null);
    setIsDetailLoading(false);
    setIsDetailError(false);
  };

  const handleInsightClick = (insight: any) => {
    triggerHaptic('light');
    navigate(insight.targetPath, { state: { filters: insight.targetFilter } });
  };

  return (
    <div 
      ref={containerRef}
      className="pb-24 relative apple-spring"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      style={{ 
        transform: `translateY(${pullDist}px)`, 
        transition: pullDist === 0 ? 'transform 0.5s cubic-bezier(0.36, 0.66, 0.04, 1)' : 'none' 
      }}
    >
      {/* Pull-to-refresh Indicator */}
      <div 
        className="absolute -top-16 left-0 w-full flex flex-col justify-center items-center pointer-events-none" 
        style={{ 
          opacity: Math.min(pullDist / 85, 1),
          transform: `scale(${Math.min(0.5 + pullDist / 170, 1)})`
        }}
      >
        <div className="flex items-center gap-2 bg-[#FF9500] text-white px-4 py-1.5 rounded-full shadow-lg">
          <RefreshCw size={16} className={`${isRefreshing ? 'animate-spin' : ''}`} />
          <span className="text-[11px] font-black tracking-widest">LIVE SYNC</span>
        </div>
      </div>

      <div className="text-left mb-8 px-1 flex justify-between items-end">
        <div>
          <h1 className="title-large page-title mb-1">Executive</h1>
          <p className="caption-2 timestamp tracking-[0.06em]">Updated {lastUpdated}</p>
        </div>
        <button 
          onClick={handleDownloadReport} 
          disabled={isExporting}
          className="headline text-[#007AFF] tap-feedback flex items-center gap-2 px-4 py-2 bg-[#007AFF]/10 rounded-full transition-all hover:bg-[#007AFF]/20 disabled:opacity-50"
        >
          {isExporting ? <Loader2 size={18} className="animate-spin" /> : <Download size={18} />}
          <span>{isExporting ? 'Exporting...' : 'Reports'}</span>
        </button>
      </div>

      <section className="glass rounded-[20px] p-6 mb-8 text-left border-none relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-48 h-48 bg-[#FF9500]/5 rounded-full blur-3xl -mr-24 -mt-24"></div>
        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 px-2.5 py-1 bg-[#FF9500]/10 text-[#FF9500] rounded-[8px] caption-2 mb-4">
            <Sparkles size={14} /> Intelligence HQ
          </div>
          <h2 className="title-2 mb-4 leading-tight">Data that drives <span className="text-[#FF9500]">expansion</span>.</h2>
          <p className="body-text mb-8">
            Sentinel AI identified <span className="font-bold" style={{ color: 'var(--text-primary)' }}>12 high-impact growth plays</span> ready for deployment this week.
          </p>
          <button 
            onClick={() => { triggerHaptic('medium'); navigate('/revenue'); }}
            className="w-full primary-button tap-feedback flex items-center justify-center gap-3"
          >
            Analyze Performance <BarChart3 size={20} />
          </button>
        </div>
      </section>

      <section className="mb-10">
        <div className="flex justify-between items-center mb-4 px-1">
          <h3 className="headline section-header">Global Pulse</h3>
          <div className="flex items-center gap-3">
            {isRefreshing && (
              <div className="flex items-center gap-1.5 text-[#FF9500] animate-pulse">
                <Zap size={14} fill="#FF9500" />
                <span className="text-[11px] font-bold">SYNCING...</span>
              </div>
            )}
            <button onClick={() => triggerHaptic('light')} className="text-[#007AFF] headline tap-feedback">See All</button>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {MOCK_KPIS.map((kpi) => (
            <StatCard 
              key={kpi.id} 
              {...kpi} 
              isLoading={isLoading || !isLoaded}
              onClick={() => openKPIDetail(kpi.id!)} 
            />
          ))}
        </div>
      </section>

      {(isDetailLoading || activeKPIDetail || isDetailError) && (
        <div className="fixed inset-0 z-[110] bg-black/40 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4 animate-in fade-in duration-300">
          <div className="w-full max-w-[600px] glass rounded-t-[28px] sm:rounded-[28px] shadow-2xl animate-in slide-in-from-bottom-full sm:zoom-in-95 duration-400 flex flex-col max-h-[90vh] overflow-hidden border-none sm:fixed sm:top-1/2 sm:-translate-y-1/2">
            <div className="p-5 flex items-center justify-between border-b var(--separator)">
              <button onClick={closeModals} className="text-[#007AFF] headline tap-feedback">Done</button>
              <h2 className="headline">{isDetailLoading ? 'Analyzing...' : activeKPIDetail?.label}</h2>
              <button onClick={() => { triggerHaptic('medium'); handleDownloadReport(); }} className="text-[#007AFF] tap-feedback"><Download size={20} /></button>
            </div>

            <div className="p-6 pt-8 flex-1 overflow-y-auto custom-scrollbar text-left space-y-8">
              {isDetailLoading ? (
                <div className="flex flex-col items-center justify-center py-24 gap-4">
                  <div className="w-12 h-12 border-4 border-[rgba(120,120,128,0.2)] border-t-[#FF9500] rounded-full animate-spin"></div>
                  <p className="caption-2 animate-pulse">{detailLoadingMsg}</p>
                </div>
              ) : isDetailError ? (
                <div className="flex flex-col items-center justify-center py-20 gap-4 text-center">
                  <AlertTriangle size={48} className="text-[#FF3B30] opacity-20" />
                  <p className="headline">Failed to load metric depth</p>
                  <button onClick={closeModals} className="secondary-button px-8">Retry Connection</button>
                </div>
              ) : activeKPIDetail ? (
                <div className="animate-in fade-in duration-300 space-y-10 pb-10">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="glass p-5 rounded-[22px] shadow-none border-[rgba(0,0,0,0.03)]">
                      <span className="caption-2 mb-1 opacity-65">Value</span>
                      <div className="headline text-[32px] font-black">{activeKPIDetail.value}</div>
                    </div>
                    <div className={`glass p-5 rounded-[22px] shadow-none border-[rgba(0,0,0,0.03)] ${activeKPIDetail.trend === 'up' ? 'text-[#34C759]' : 'text-[#FF3B30]'}`}>
                      <span className="caption-2 mb-1 opacity-65">Vs Last Month</span>
                      <div className="headline text-[32px] font-black flex items-center gap-1">
                        {activeKPIDetail.trend === 'up' ? <TrendingUp size={28} /> : <TrendingDown size={28} />} {activeKPIDetail.change}%
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between px-1">
                    <h3 className="caption-2">90-Day Trajectory</h3>
                    <div className="flex gap-2">
                       <button className="px-3 py-1 bg-[#FF9500]/15 text-[#FF9500] rounded-full text-[12px] font-bold">Daily</button>
                       <button className="px-3 py-1 bg-[rgba(120,120,128,0.2)] text-secondary-text rounded-full text-[12px] font-bold">Weekly</button>
                    </div>
                  </div>

                  <div className="h-56 min-h-[224px] w-full glass rounded-[24px] p-6 shadow-none border-none relative overflow-hidden">
                    <ResponsiveContainer width="100%" height="100%" minWidth={100} minHeight={100}>
                      <AreaChart data={activeKPIDetail.history}>
                        <defs>
                          <linearGradient id="metricGradient" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#FF9500" stopOpacity={0.4}/>
                            <stop offset="95%" stopColor="#FF9500" stopOpacity={0}/>
                          </linearGradient>
                        </defs>
                        <Area 
                          type="monotone" 
                          dataKey="value" 
                          stroke="#FF9F0A" 
                          strokeWidth={5} 
                          fillOpacity={1} 
                          fill="url(#metricGradient)" 
                          animationDuration={1500}
                        />
                        <Tooltip 
                          contentStyle={{ 
                            borderRadius: '16px', 
                            border: 'none', 
                            boxShadow: '0 8px 32px rgba(0,0,0,0.2)',
                            backgroundColor: 'var(--ios-card)',
                            color: 'var(--text-primary)'
                          }} 
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>

                  <div>
                     <h3 className="caption-2 mb-4 px-1">Segment Breakdown</h3>
                     <div className="space-y-4">
                       {activeKPIDetail.breakdown.map((item, idx) => (
                         <div key={idx} className="glass p-4 rounded-[18px] shadow-none border-none flex flex-col gap-3">
                           <div className="flex justify-between items-center">
                              <span className="headline text-[15px]">{item.label}</span>
                              <span className="font-black text-[#FF9F0A]">{item.percent}%</span>
                           </div>
                           <div className="h-2 bg-[rgba(120,120,128,0.2)] rounded-full overflow-hidden">
                             <div 
                               className="h-full bg-gradient-to-r from-[#FF9500] to-[#FF6B00] rounded-full transition-all duration-1000" 
                               style={{ width: `${item.percent}%` }}
                             ></div>
                           </div>
                         </div>
                       ))}
                     </div>
                  </div>
                </div>
              ) : null}
            </div>
          </div>
        </div>
      )}

      <section className="mb-10">
        <div className="flex justify-between items-center mb-4 px-1">
          <h3 className="headline section-header">Alerts</h3>
          <button onClick={() => triggerHaptic('light')} className="text-[#007AFF] headline tap-feedback">Full Archive</button>
        </div>
        <div className="space-y-4">
          {MOCK_INSIGHTS.map((insight, idx) => (
            <InsightCard key={idx} {...insight} onClick={() => handleInsightClick(insight)} />
          ))}
        </div>
      </section>
    </div>
  );
};

export default ExecutiveOverview;
