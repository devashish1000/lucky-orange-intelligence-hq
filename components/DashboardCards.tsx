
import React, { useState, useEffect } from 'react';
// Added TrendingUp to the imports from lucide-react
import { ArrowUpRight, ArrowDownRight, ChevronRight, AlertCircle, Zap, X, BarChart3, CheckCircle2, MoreHorizontal, Maximize2, Clock, TrendingUp } from 'lucide-react';
import { KPIStats, InsightCardData, KPIDetail } from '../types';
import { AreaChart, Area, ResponsiveContainer, XAxis, YAxis, Tooltip } from 'recharts';

interface StatCardProps extends KPIStats {
  onClick?: () => void;
  isExpanded?: boolean;
  detail?: KPIDetail;
  isLoading?: boolean;
}

const AnimatedNumber: React.FC<{ value: string }> = ({ value }) => {
  const [displayValue, setDisplayValue] = useState(0);
  const numericVal = parseFloat(value.replace(/[^0-9.-]+/g, "")) || 0;
  const isPercent = value.includes('%');
  const isDollar = value.includes('$');
  const hasK = value.includes('k');
  const hasB = value.includes('B');

  useEffect(() => {
    let startTime: number;
    const duration = 1200;
    const step = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      const eased = progress === 1 ? progress : 1 - Math.pow(2, -10 * progress);
      setDisplayValue(eased * numericVal);
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [numericVal]);

  let final = displayValue.toLocaleString(undefined, { maximumFractionDigits: (hasB || hasK || isPercent) ? 1 : 0 });
  if (isDollar) final = '$' + final;
  if (hasK) final += 'k';
  if (hasB) final += 'B';
  if (isPercent) final += '%';
  return <>{final}</>;
};

export const StatCard: React.FC<StatCardProps> = ({ 
  label, value, change, trend, suffix, onClick, isExpanded, detail, isLoading 
}) => {
  if (isLoading) {
    return (
      <div className="glass p-5 rounded-[20px] shimmer h-[140px] w-full relative overflow-hidden flex flex-col justify-center">
        <div className="h-3 w-24 bg-slate-200/50 rounded mb-4"></div>
        <div className="h-10 w-40 bg-slate-200/50 rounded"></div>
        <div className="h-5 w-16 bg-slate-200/50 rounded mt-3"></div>
      </div>
    );
  }

  return (
    <div 
      onClick={onClick}
      className={`glass p-5 rounded-[20px] apple-spring tap-feedback cursor-pointer relative overflow-hidden flex flex-col justify-center border-none ${
        isExpanded ? 'z-50 ring-2 ring-[#FF9500]/30 !bg-white dark:!bg-[#1C1C1E]' : ''
      }`}
    >
      <div className="flex justify-between items-center mb-1">
        <span className="caption-2 leading-none" style={{ color: 'var(--text-secondary)' }}>{label}</span>
        {isExpanded ? (
           <X size={20} style={{ color: 'var(--text-tertiary)' }} />
        ) : (
           <Maximize2 size={16} style={{ color: 'var(--text-quaternary)' }} />
        )}
      </div>
      
      <div className="flex items-baseline gap-1 mb-1">
        <span className="value-large leading-tight">
          <AnimatedNumber value={String(value)} />
        </span>
        {suffix && <span className="caption-2 lowercase" style={{ color: 'var(--text-tertiary)' }}>{suffix}</span>}
      </div>

      <div className={`flex items-center gap-1 font-bold text-[17px] ${
        trend === 'up' ? 'text-[#34C759]' : 'text-[#FF3B30]'
      }`}>
        {trend === 'up' ? <ArrowUpRight size={18} strokeWidth={3} /> : <ArrowDownRight size={18} strokeWidth={3} />}
        {change}%
      </div>

      {isExpanded && detail && (
        <div className="mt-8 pt-6 border-t-[0.5px] border-[rgba(0,0,0,0.15)] animate-in fade-in duration-300">
          <div className="mb-6">
             <h4 className="caption-2 mb-4 flex items-center gap-2">
                <Clock size={14} className="text-[#FF9500]" /> 90-Day Trend
             </h4>
             <div className="h-40 min-h-[160px] w-full bg-[rgba(120,120,128,0.1)] rounded-[12px] p-3 relative">
               <ResponsiveContainer width="100%" height="100%" minWidth={0}>
                 <AreaChart data={detail.history}>
                   <Area 
                     type="monotone" 
                     dataKey="value" 
                     stroke="#FF9F0A" 
                     strokeWidth={4} 
                     fill="#FF9F0A15" 
                     animationDuration={1500}
                   />
                   <Tooltip 
                     contentStyle={{ 
                        borderRadius: '12px', 
                        border: 'none', 
                        boxShadow: '0 8px 16px rgba(0,0,0,0.2)',
                        backgroundColor: 'var(--ios-card)',
                        color: 'var(--text-primary)'
                      }} 
                   />
                 </AreaChart>
               </ResponsiveContainer>
             </div>
          </div>
          
          <div className="flex gap-2">
            <button className="flex-1 secondary-button !bg-[#007AFF] text-white tap-feedback text-[15px]">Detailed Analysis</button>
            <button className="px-5 secondary-button tap-feedback text-[15px]">Export</button>
          </div>
        </div>
      )}
    </div>
  );
};

export const InsightCard: React.FC<InsightCardData & { onClick?: () => void }> = ({ title, description, category, priority, onClick }) => {
  const getIcon = () => {
    switch (category) {
      case 'Alert': return <AlertCircle className="text-[#FF3B30]" size={22} />;
      case 'Opportunity': return <Zap className="text-[#FF9F0A]" size={22} fill="#FF9F0A" />;
      case 'Trend': return <TrendingUp className="text-[#007AFF]" size={22} />;
    }
  };

  return (
    <div 
      onClick={onClick}
      className="rounded-[16px] apple-spring tap-feedback cursor-pointer flex gap-4 p-4 border-l-[3px] border-[#FF9500] group relative overflow-hidden"
      style={{ background: 'linear-gradient(135deg, rgba(255, 159, 10, 0.12) 0%, rgba(255, 159, 10, 0.05) 100%)' }}
    >
      <div className="shrink-0 w-12 h-12 rounded-[12px] bg-white dark:bg-[#2C2C2E] flex items-center justify-center shadow-sm">
        {getIcon()}
      </div>
      <div className="flex-1 py-0.5 text-left">
        <h4 className="headline alert-title leading-tight mb-1">{title}</h4>
        <p className="body-text alert-description text-[15px] leading-snug">{description}</p>
      </div>
      <div className="flex items-center text-[rgba(120,120,128,0.4)]">
        <ChevronRight size={24} />
      </div>
    </div>
  );
};
