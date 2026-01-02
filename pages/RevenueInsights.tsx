
import React, { useState, useMemo, useEffect } from 'react';
import { MOCK_REVENUE } from '../constants';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, AreaChart, Area } from 'recharts';
import { DollarSign, UserPlus, TrendingDown, Layers, ChevronRight, Zap, Download, X, TrendingUp, Info, Loader2 } from 'lucide-react';
// Import useUI from App instead of useToast from Layout
import { useUI } from '../App';

const SYSTEM_TINTS = ['#007AFF', '#AF52DE', '#FF2D55', '#5AC8FA'];

const RevenueInsights: React.FC = () => {
  // Use useUI to get showToast and triggerHaptic
  const { showToast, triggerHaptic } = useUI();
  const [multiplier, setMultiplier] = useState(0);
  const [isSimulating, setIsSimulating] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [activePlanFilter, setActivePlanFilter] = useState<string | null>(null);

  const handleRunSimulation = () => {
    setIsSimulating(true);
    triggerHaptic('heavy');
    setTimeout(() => {
      setIsSimulating(false);
      showToast("Simulated Complete");
    }, 1500);
  };

  const handleDownloadReport = () => {
    setIsDownloading(true);
    triggerHaptic('medium');
    showToast("Preparing Revenue Report...");

    setTimeout(() => {
      try {
        const timestamp = new Date().toISOString().split('T')[0];
        const filename = `Lucky_Orange_Revenue_Report_${timestamp}.csv`;
        
        // Build CSV Content
        const headers = ['Plan Tier', 'MRR (USD)', 'Active Accounts', 'Churn Rate (%)'].join(',');
        const rows = MOCK_REVENUE.map(metric => [
          metric.plan,
          metric.mrr,
          metric.accounts,
          metric.churnRate
        ].join(',')).join('\n');
        
        const summary = [
          '',
          'SUMMARY',
          `Total MRR,$842500`,
          `Gross Churn,1.8%`,
          `Report Generated,${new Date().toLocaleString()}`
        ].join('\n');

        const csvContent = "data:text/csv;charset=utf-8," + headers + "\n" + rows + "\n" + summary;
        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", filename);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        showToast("Report Downloaded Successfully");
      } catch (err) {
        showToast("Export failed. Try again.");
      } finally {
        setIsDownloading(false);
      }
    }, 2000);
  };

  const estimatedImpact = (12400 + (multiplier * 500)).toLocaleString();

  return (
    <div className="pb-24 apple-spring">
      <div className="text-left mb-8 px-1 flex justify-between items-end">
        <div>
          <h1 className="title-large mb-1">Revenue</h1>
          <p className="caption-2 tracking-[0.06em]">Fiscal Performance</p>
        </div>
        <button 
          onClick={handleDownloadReport} 
          disabled={isDownloading}
          className="headline text-[#007AFF] tap-feedback flex items-center gap-2 px-4 py-2 bg-[#007AFF]/10 rounded-full transition-all hover:bg-[#007AFF]/20 disabled:opacity-50"
        >
          {isDownloading ? <Loader2 size={18} className="animate-spin" /> : <Download size={18} />}
          <span>{isDownloading ? 'Exporting...' : 'Reports'}</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        <div className="glass p-5 rounded-[20px] text-left tap-feedback cursor-pointer border-none shadow-none">
          <span className="caption-2 mb-1 opacity-60">Total MRR</span>
          <div className="value-large leading-tight">$842.5k</div>
          <div className="flex items-center gap-1 font-semibold mt-2" style={{ color: 'var(--success-text)' }}>
            <TrendingUp size={16} /> +8.2%
          </div>
        </div>
        <div className="glass p-5 rounded-[20px] text-left tap-feedback cursor-pointer border-none shadow-none">
          <span className="caption-2 mb-1 opacity-60">Gross Churn</span>
          <div className="value-large leading-tight">1.8%</div>
          <div className="flex items-center gap-1 font-semibold mt-2" style={{ color: 'var(--error-text)' }}>
            <TrendingDown size={16} /> +0.2%
          </div>
        </div>
      </div>

      <section className="glass rounded-[20px] p-6 mb-8 text-left border-none">
        <h3 className="title-2 mb-8">Tier Distribution</h3>
        <div className="flex flex-col items-center gap-8">
          <div className="h-48 min-h-[192px] min-w-0 w-full max-w-[200px] relative">
            <ResponsiveContainer width="100%" height="100%" minWidth={0}>
              <PieChart>
                <Pie 
                  data={MOCK_REVENUE} 
                  innerRadius={60} 
                  outerRadius={85} 
                  paddingAngle={5} 
                  dataKey="mrr" 
                  animationDuration={1500}
                >
                  {MOCK_REVENUE.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={SYSTEM_TINTS[index % SYSTEM_TINTS.length]} stroke="none" />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="w-full grid grid-cols-2 gap-4">
            {MOCK_REVENUE.map((item, i) => (
              <div key={item.plan} className="flex flex-col gap-1">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full" style={{ background: SYSTEM_TINTS[i % SYSTEM_TINTS.length] }}></div>
                  <span className="caption-2 lowercase opacity-70">{item.plan}</span>
                </div>
                <span className="headline text-[15px]">${(item.mrr / 1000).toFixed(0)}k</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Simulator - Refined HIG Input Pattern */}
      <section className="glass rounded-[20px] p-6 text-left border-none relative overflow-hidden group">
        <h3 className="headline mb-6">Monte Carlo Projection</h3>
        
        <div className="space-y-10">
          <div className="space-y-4">
            <div className="flex justify-between items-baseline">
              <label className="caption-2 opacity-70">Expansion Multiplier</label>
              <span className="headline text-[#FF9500]">{multiplier > 0 ? '+' : ''}{multiplier * 5}% Δ</span>
            </div>
            <input 
              type="range" 
              min="-10" 
              max="20" 
              value={multiplier}
              onChange={(e) => { triggerHaptic('light'); setMultiplier(parseInt(e.target.value)); }}
              className="w-full h-1 bg-[rgba(120,120,128,0.12)] rounded-full appearance-none cursor-pointer accent-[#FF9500]" 
            />
          </div>
          
          <div className="bg-[#000000] dark:bg-white/5 rounded-[16px] p-5 text-white">
            <span className="caption-2 opacity-50 mb-1">Projected MRR Impact</span>
            <div className="headline text-[34px] tracking-tight text-[#34C759]">+$<AnimatedImpact value={estimatedImpact} /></div>
            <p className="caption-2 opacity-40 mt-2 lowercase">Confidence Interval: 94%</p>
          </div>

          <button 
            onClick={handleRunSimulation}
            disabled={isSimulating}
            className={`w-full h-14 primary-button tap-feedback flex items-center justify-center gap-2 ${isSimulating ? 'opacity-50' : ''}`}
          >
            {isSimulating ? 'Processing...' : 'Run Simulation'}
          </button>
        </div>
      </section>
    </div>
  );
};

const AnimatedImpact: React.FC<{ value: string }> = ({ value }) => {
  const [displayValue, setDisplayValue] = useState(0);
  const numericVal = parseFloat(value.replace(/,/g, '')) || 0;
  useEffect(() => {
    let start = 0;
    const duration = 1000;
    const startTime = performance.now();
    const update = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      setDisplayValue(progress * numericVal);
      if (progress < 1) requestAnimationFrame(update);
    };
    requestAnimationFrame(update);
  }, [numericVal]);
  return <>{displayValue.toLocaleString(undefined, { maximumFractionDigits: 0 })}</>;
};

export default RevenueInsights;
