
import React, { useState } from 'react';
import { MOCK_FUNNEL } from '../constants';
// Added ChevronRight to the lucide-react imports
import { PlayCircle, Map as MapIcon, MousePointer2, Sparkles, Info, TrendingDown, Users, ArrowRight, BarChart3, ChevronRight } from 'lucide-react';
import { useToast } from '../components/Layout';

const BehaviorFunnels: React.FC = () => {
  const { showToast } = useToast();
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

  const handleWatch = (tool: string) => {
    showToast(`Opening ${tool} analysis deep dive...`);
  };

  const handleRunTest = () => {
    if ((window as any).openActionModal) {
      (window as any).openActionModal('abtest', 'Checkout Conversion A/B Test');
    }
  };

  const maxVisitors = MOCK_FUNNEL[0].visitors;

  // Funnel SVG Design
  const funnelWidth = 500;
  const funnelHeight = 400;
  const stepHeight = funnelHeight / MOCK_FUNNEL.length;

  const getDropOffColor = (rate: number) => {
    if (rate < 30) return '#10b981'; // Emerald (Good)
    if (rate < 60) return '#f59e0b'; // Amber (Moderate)
    return '#ef4444'; // Rose (Critical)
  };

  const activeStep = hoveredIdx !== null ? MOCK_FUNNEL[hoveredIdx] : null;

  return (
    <div className="space-y-8 pb-10">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-[32px] font-black tracking-tight text-slate-900">Conversion</h2>
          <p className="text-sm font-semibold text-slate-500">Global Customer Acquisition Pipeline</p>
        </div>
        <button onClick={() => showToast("✓ Parameters re-synced")} className="px-5 py-2.5 bg-white border border-slate-200 rounded-xl text-[14px] font-bold text-slate-700 shadow-sm active:bg-slate-50 transition-all">
          Sync Metrics
        </button>
      </div>

      <section className="bg-white p-8 rounded-[32px] shadow-xl border border-slate-100 overflow-hidden relative">
        <div className="flex items-center justify-between mb-8">
          <h3 className="text-xl font-black text-slate-900 flex items-center gap-3">
            <div className="w-1.5 h-6 bg-[#f26522] rounded-full"></div>
            Conversion Visualizer
          </h3>
          <div className="flex gap-4">
            <div className="flex items-center gap-2 text-[11px] font-black text-slate-400 uppercase tracking-widest">
              <Users size={14} className="text-[#f26522]" /> {maxVisitors.toLocaleString()} Total
            </div>
            <div className="flex items-center gap-2 text-[11px] font-black text-slate-400 uppercase tracking-widest">
              <TrendingDown size={14} className="text-rose-500" /> 3.2% Conv Rate
            </div>
          </div>
        </div>

        <div className="relative flex flex-col md:flex-row items-start gap-10">
          {/* Proportional SVG Funnel */}
          <div className="flex-1 w-full max-w-[500px]">
            <svg viewBox={`0 0 ${funnelWidth} ${funnelHeight}`} className="overflow-visible drop-shadow-sm">
              {MOCK_FUNNEL.map((step, idx) => {
                const currentWidth = (step.visitors / maxVisitors) * funnelWidth;
                const nextVisitors = MOCK_FUNNEL[idx + 1]?.visitors || 0;
                const nextWidth = (nextVisitors / maxVisitors) * funnelWidth;
                
                const xOffset = (funnelWidth - currentWidth) / 2;
                const nextXOffset = (funnelWidth - nextWidth) / 2;
                
                const top = idx * stepHeight;
                const bottom = (idx + 1) * stepHeight;
                const isHovered = hoveredIdx === idx;

                const points = [
                  `${xOffset},${top}`,
                  `${xOffset + currentWidth},${top}`,
                  `${nextXOffset + nextWidth},${bottom}`,
                  `${nextXOffset},${bottom}`
                ].join(' ');

                return (
                  <g key={step.name} 
                    onMouseEnter={() => setHoveredIdx(idx)} 
                    onMouseLeave={() => setHoveredIdx(null)}
                    className="cursor-pointer transition-all duration-300 group"
                  >
                    <polygon 
                      points={points} 
                      fill={isHovered ? '#f26522' : idx % 2 === 0 ? '#f26522' : '#ff7e41'} 
                      fillOpacity={isHovered ? 1 : 0.9 - (idx * 0.15)}
                      className="transition-all duration-300"
                    />
                    
                    <text 
                      x={funnelWidth / 2} 
                      y={top + stepHeight / 2} 
                      textAnchor="middle" 
                      fill="white" 
                      className={`text-[14px] font-black pointer-events-none transition-all ${isHovered ? 'scale-110' : ''}`}
                    >
                      {step.visitors.toLocaleString()}
                    </text>

                    {idx < MOCK_FUNNEL.length - 1 && (
                      <g className="pointer-events-none">
                        <line 
                          x1={funnelWidth / 2} y1={bottom - 10} 
                          x2={funnelWidth / 2} y2={bottom + 10} 
                          stroke="white" strokeWidth="2" strokeDasharray="2,2" 
                        />
                        <circle cx={funnelWidth / 2 + currentWidth / 2.5} cy={bottom} r="14" fill="white" stroke={getDropOffColor(step.dropOff)} strokeWidth="2" shadow="sm" />
                        <text x={funnelWidth / 2 + currentWidth / 2.5} y={bottom + 3} textAnchor="middle" fill={getDropOffColor(step.dropOff)} className="text-[9px] font-black">-{Math.round(step.dropOff)}%</text>
                      </g>
                    )}
                  </g>
                );
              })}
            </svg>
          </div>

          {/* Detailed Statistics Detail Panel */}
          <div className="flex-1 w-full space-y-4">
            <div className="bg-slate-50 p-6 rounded-[24px] border border-slate-100 min-h-[160px] animate-in fade-in duration-300">
              {activeStep ? (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="text-[18px] font-black text-slate-900">{activeStep.name}</h4>
                    <span className="px-3 py-1 bg-white border border-slate-200 rounded-full text-[11px] font-bold text-slate-500 uppercase tracking-widest">Step {hoveredIdx! + 1}</span>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-50">
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Visitors</p>
                      <p className="text-[20px] font-black text-slate-900">{activeStep.visitors.toLocaleString()}</p>
                    </div>
                    <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-50">
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Conv. Rate</p>
                      <p className="text-[20px] font-black text-[#f26522]">{activeStep.conversionRate}%</p>
                    </div>
                  </div>
                  {activeStep.linkToTool && (
                    <button 
                      onClick={() => handleWatch(activeStep.linkToTool!)}
                      className="w-full flex items-center justify-center gap-2 py-3.5 bg-slate-900 text-white rounded-xl text-[13px] font-bold active:scale-95 transition-all"
                    >
                      <BarChart3 size={16} /> Open {activeStep.linkToTool} Tool
                    </button>
                  )}
                </div>
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-center py-6 opacity-40">
                  <Info size={32} className="text-slate-400 mb-2" />
                  <p className="text-[14px] font-bold text-slate-500">Hover over a funnel step to<br/>view detailed performance stats</p>
                </div>
              )}
            </div>

            <div className="space-y-3">
              {MOCK_FUNNEL.map((step, idx) => (
                <div key={step.name}
                  onMouseEnter={() => setHoveredIdx(idx)}
                  onMouseLeave={() => setHoveredIdx(null)}
                  className={`p-4 rounded-2xl border transition-all duration-300 cursor-pointer ${
                    hoveredIdx === idx ? 'bg-white border-[#f26522] shadow-lg -translate-x-2' : 'bg-white border-slate-100'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className={`w-6 h-6 rounded-full text-[10px] font-black flex items-center justify-center transition-colors ${hoveredIdx === idx ? 'bg-[#f26522] text-white' : 'bg-slate-100 text-slate-400'}`}>
                        {idx + 1}
                      </span>
                      <h4 className="text-[14px] font-bold text-slate-900">{step.name}</h4>
                    </div>
                    <ChevronRight size={16} className={`transition-all ${hoveredIdx === idx ? 'text-[#f26522] translate-x-1' : 'text-slate-300'}`} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <div className="bg-slate-900 p-10 rounded-[40px] text-white shadow-2xl relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-80 h-80 bg-orange-500/10 rounded-full blur-[100px] -mr-40 -mt-40 transition-all group-hover:bg-orange-500/20"></div>
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 bg-orange-500/20 rounded-2xl text-orange-400">
              <Sparkles size={24} />
            </div>
            <div>
              <h3 className="font-black text-[22px] tracking-tight">Growth Insight</h3>
              <p className="text-[11px] font-black text-orange-400 uppercase tracking-widest mt-0.5">Recommended Playbook</p>
            </div>
          </div>
          <p className="text-[18px] font-medium leading-relaxed text-slate-200 mb-8 max-w-2xl">
            Removing the <span className="text-white font-black underline decoration-orange-500 decoration-4 underline-offset-4">Checkout Step 2</span> modal for mobile users is predicted to reduce drop-off by <span className="text-orange-400 font-black">24%</span>, generating an estimated <span className="text-white font-black">$42k/mo</span> in recovered revenue.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <button onClick={handleRunTest} className="px-8 py-4 bg-orange-500 rounded-2xl text-sm font-black uppercase tracking-widest text-white shadow-xl shadow-orange-500/30 active:scale-95 transition-all hover:bg-orange-600">Initialize A/B Test</button>
            <button onClick={() => showToast("✓ Strategy shared with product-leads@luckyorange.com")} className="px-8 py-4 bg-white/10 rounded-2xl text-sm font-black uppercase tracking-widest text-slate-300 border border-white/10 active:scale-95 transition-all hover:bg-white/20">Share Strategy</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BehaviorFunnels;
