
import React from 'react';
import { TrendingUp, TrendingDown, ChevronRight, AlertCircle, Zap, TrendingUp as TrendingIcon } from 'lucide-react';
import { KPIStats, InsightCardData } from '../types';

interface StatCardProps extends KPIStats {
  onClick?: () => void;
}

export const StatCard: React.FC<StatCardProps> = ({ label, value, change, trend, suffix, onClick }) => (
  <div 
    onClick={onClick}
    className="bg-white p-4 rounded-[14px] shadow-[0_1px_2px_rgba(0,0,0,0.08)] flex flex-col justify-between active:scale-95 hover:shadow-lg transition-all duration-200 cursor-pointer border border-transparent hover:border-blue-100"
  >
    <div className="flex justify-between items-start mb-1">
      <span className="text-[11px] font-bold text-[#8e8e93] uppercase tracking-wide">{label}</span>
    </div>
    <div className="flex items-baseline gap-1 mt-0.5">
      <span className="text-[22px] font-extrabold text-black tracking-tight">{value}</span>
      {suffix && <span className="text-[10px] text-[#8e8e93] font-semibold">{suffix}</span>}
    </div>
    <div className={`mt-2 flex items-center gap-0.5 text-[11px] font-bold ${
      trend === 'up' ? 'text-[#34c759]' : 'text-[#ff3b30]'
    }`}>
      {trend === 'up' ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
      {change}%
    </div>
  </div>
);

interface InsightCardProps extends InsightCardData {
  onClick?: () => void;
}

export const InsightCard: React.FC<InsightCardProps> = ({ title, description, category, priority, onClick }) => {
  const getIcon = () => {
    switch (category) {
      case 'Alert': return <AlertCircle className="text-[#ff3b30]" size={18} />;
      case 'Opportunity': return <Zap className="text-[#ff9500]" size={18} />;
      case 'Trend': return <TrendingIcon className="text-[#007aff]" size={18} />;
    }
  };

  return (
    <div 
      onClick={onClick}
      className="bg-white p-4 rounded-[14px] shadow-[0_1px_2px_rgba(0,0,0,0.08)] flex gap-4 active:bg-[#f2f2f7] hover:shadow-md transition-all duration-200 border-l-[4px] cursor-pointer group"
      style={{ borderLeftColor: priority === 'High' ? '#ff3b30' : priority === 'Medium' ? '#ff9500' : 'transparent' }}
    >
      <div className="shrink-0 w-10 h-10 rounded-[10px] bg-slate-50 flex items-center justify-center group-hover:bg-slate-100 transition-colors">
        {getIcon()}
      </div>
      <div className="flex-1 pr-2">
        <div className="flex items-center justify-between mb-1">
          <h4 className="font-bold text-black text-[15px] leading-tight group-hover:text-blue-600 transition-colors">{title}</h4>
        </div>
        <p className="text-[13px] text-[#8e8e93] line-clamp-2 leading-[1.3]">{description}</p>
      </div>
      <div className="flex items-center text-slate-300 group-hover:text-blue-500 transition-colors">
        <ChevronRight size={18} />
      </div>
    </div>
  );
};
