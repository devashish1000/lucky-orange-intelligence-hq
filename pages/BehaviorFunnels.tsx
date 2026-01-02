
import React, { useState } from 'react';
import { MOCK_FUNNEL } from '../constants';
import { 
  Info, Users, Layers, Target, RefreshCw, ChevronRight, Zap, MousePointer2, X, 
  BarChart3, Clock, PlayCircle, Map as MapIcon, Download, FileText, AlertCircle,
  Eye, Monitor, Smartphone, Tablet, Sparkles
} from 'lucide-react';
import { useUI } from '../App';

interface AnalysisData {
  title: string;
  tool: 'Forms' | 'Recordings' | 'Heatmaps';
  metrics: { label: string; value: string; trend?: string }[];
  details: any[];
}

const BehaviorFunnels: React.FC = () => {
  const { showToast, triggerHaptic } = useUI();
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);
  const [pinnedIdx, setPinnedIdx] = useState<number | null>(null);
  const [isSyncing, setIsSyncing] = useState(false);
  
  // Analysis Modal State
  const [analysisData, setAnalysisData] = useState<AnalysisData | null>(null);
  const [isAnalysisLoading, setIsAnalysisLoading] = useState(false);

  const handleSync = () => {
    setIsSyncing(true);
    triggerHaptic('medium');
    setTimeout(() => {
      setIsSyncing(false);
      showToast("Funnel Synced");
    }, 1500);
  };

  const handleStageClick = (idx: number, e: React.MouseEvent) => {
    e.stopPropagation();
    triggerHaptic('medium');
    if (pinnedIdx === idx) {
      setPinnedIdx(null);
    } else {
      setPinnedIdx(idx);
    }
  };

  const handleBackgroundClick = () => {
    if (pinnedIdx !== null) {
      setPinnedIdx(null);
      triggerHaptic('light');
    }
  };

  const openAnalysis = (tool: 'Recordings' | 'Heatmaps' | 'Forms', stageName: string) => {
    triggerHaptic('heavy');
    setIsAnalysisLoading(true);
    showToast(`Initializing ${tool} Analysis...`);

    // Simulate data fetch and synthesis
    setTimeout(() => {
      let mockData: AnalysisData;

      if (tool === 'Forms') {
        mockData = {
          title: `Form Analysis: ${stageName}`,
          tool: 'Forms',
          metrics: [
            { label: 'Completion Rate', value: '72%', trend: '+4%' },
            { label: 'Avg. Time to Fill', value: '42s' },
            { label: 'Abandonment', value: '28%', trend: '-2%' }
          ],
          details: [
            { field: 'Email Address', type: 'text', completions: 8400, time: '5.2s', errors: '2%', abandon: '10%' },
            { field: 'Password', type: 'password', completions: 7800, time: '8.1s', errors: '12%', abandon: '15%' },
            { field: 'Confirm Password', type: 'password', completions: 7200, time: '6.4s', errors: '8%', abandon: '5%' },
            { field: 'Submit Button', type: 'button', completions: 7150, time: '0.8s', errors: '<1%', abandon: '<1%' }
          ]
        };
      } else if (tool === 'Recordings') {
        mockData = {
          title: `Recordings for ${stageName}`,
          tool: 'Recordings',
          metrics: [
            { label: 'Total Sessions', value: '1,240' },
            { label: 'Avg. Duration', value: '3m 12s' },
            { label: 'Frustration Score', value: 'Low' }
          ],
          details: [
            { id: 'REC-9012', user: 'User 821', duration: '2:15', device: 'Desktop', date: 'Just now' },
            { id: 'REC-9013', user: 'User 104', duration: '5:42', device: 'Mobile', date: '2 mins ago' },
            { id: 'REC-9014', user: 'User 552', duration: '1:10', device: 'Tablet', date: '10 mins ago' },
            { id: 'REC-9015', user: 'User 291', duration: '4:22', device: 'Desktop', date: '25 mins ago' }
          ]
        };
      } else {
        mockData = {
          title: `Heatmap Insights: ${stageName}`,
          tool: 'Heatmaps',
          metrics: [
            { label: 'Total Clicks', value: '42.5k' },
            { label: 'Scroll Depth', value: '68%' },
            { label: 'Move Density', value: 'High' }
          ],
          details: [
            { element: 'Primary CTA', clicks: '12,400', intensity: '95%' },
            { element: 'Navigation Menu', clicks: '8,200', intensity: '72%' },
            { element: 'Footer Links', clicks: '450', intensity: '12%' },
            { element: 'Price Table', clicks: '5,100', intensity: '88%' }
          ]
        };
      }

      setAnalysisData(mockData);
      setIsAnalysisLoading(false);
      triggerHaptic('success');
    }, 1800);
  };

  const handleDownloadReport = () => {
    if (!analysisData) return;
    triggerHaptic('medium');
    showToast("Generating CSV Report...");
    
    setTimeout(() => {
      const timestamp = new Date().toISOString().split('T')[0];
      const filename = `${analysisData.tool}_Analysis_${analysisData.title.split(': ')[1]}_${timestamp}.csv`.replace(/ /g, '_');
      
      let headers = "";
      let rows = "";

      if (analysisData.tool === 'Forms') {
        headers = "Field Name,Type,Completions,Avg Time,Errors,Abandonment";
        rows = analysisData.details.map(d => `${d.field},${d.type},${d.completions},${d.time},${d.errors},${d.abandon}`).join('\n');
      } else if (analysisData.tool === 'Recordings') {
        headers = "Session ID,User,Duration,Device,Date";
        rows = analysisData.details.map(d => `${d.id},${d.user},${d.duration},${d.device},${d.date}`).join('\n');
      } else {
        headers = "Element,Clicks,Intensity";
        rows = analysisData.details.map(d => `${d.element},${d.clicks},${d.intensity}`).join('\n');
      }

      const csvContent = "data:text/csv;charset=utf-8," + headers + "\n" + rows;
      const encodedUri = encodeURI(csvContent);
      const link = document.createElement("a");
      link.setAttribute("href", encodedUri);
      link.setAttribute("download", filename);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      showToast("Report Downloaded Successfully");
    }, 1200);
  };

  const maxVisitors = MOCK_FUNNEL[0].visitors;
  const funnelWidth = 500;
  const funnelHeight = 480;
  const stepHeight = funnelHeight / MOCK_FUNNEL.length;

  const getDropOffColor = (rate: number) => {
    if (rate < 25) return 'var(--system-green)';
    if (rate < 50) return 'var(--system-orange)';
    return 'var(--system-red)';
  };

  const activeIdx = pinnedIdx !== null ? pinnedIdx : hoveredIdx;
  const isPinned = pinnedIdx !== null;

  return (
    <div className="pb-24 apple-spring" onClick={handleBackgroundClick}>
      <div className="text-left mb-8 px-1 flex justify-between items-end">
        <div>
          <h1 className="title-large page-title mb-1">Behavior</h1>
          <p className="caption-2 timestamp tracking-[0.06em]">Conversion Intelligence</p>
        </div>
        <button 
          onClick={handleSync} 
          disabled={isSyncing}
          className="headline text-[#007AFF] tap-feedback flex items-center gap-1.5"
        >
          {isSyncing ? <RefreshCw className="animate-spin" size={16} /> : <Layers size={16} />} Sync
        </button>
      </div>

      <section className="glass rounded-[20px] p-6 mb-8 text-left relative overflow-hidden border-none">
        <div className="flex items-center justify-between mb-8">
          <h3 className="title-2 section-header">Funnel Visualizer</h3>
          <div className="flex gap-4">
            <div className="flex items-center gap-1.5 caption-2">
              <Users size={14} className="text-[#FF9500]" /> {maxVisitors / 1000}k
            </div>
            <div className="flex items-center gap-1.5 caption-2">
              <Target size={14} className="text-[#34C759]" /> 3.2% Conv.
            </div>
          </div>
        </div>

        <div className="flex flex-col md:flex-row gap-10 items-center justify-center">
          <div className="w-full max-w-[400px]">
            <svg 
              viewBox={`0 0 ${funnelWidth} ${funnelHeight}`} 
              className="overflow-visible w-full h-auto select-none"
              onClick={(e) => e.stopPropagation()}
            >
              <defs>
                <linearGradient id="stepGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#FF9500" stopOpacity="0.9" />
                  <stop offset="100%" stopColor="#FF6B00" stopOpacity="1" />
                </linearGradient>
                <filter id="glow">
                  <feGaussianBlur stdDeviation="3.5" result="coloredBlur"/>
                  <feMerge>
                    <feMergeNode in="coloredBlur"/>
                    <feMergeNode in="SourceGraphic"/>
                  </feMerge>
                </filter>
              </defs>
              {MOCK_FUNNEL.map((step, idx) => {
                const currentWidth = (step.visitors / maxVisitors) * funnelWidth;
                const nextStep = MOCK_FUNNEL[idx + 1];
                const nextWidth = nextStep ? (nextStep.visitors / maxVisitors) * funnelWidth : (currentWidth * 0.4);
                
                const xOffset = (funnelWidth - currentWidth) / 2;
                const nextXOffset = (funnelWidth - nextWidth) / 2;
                
                const top = idx * stepHeight;
                const bottom = (idx + 1) * stepHeight - 20;
                
                const points = [
                  `${xOffset},${top}`,
                  `${xOffset + currentWidth},${top}`,
                  `${nextXOffset + nextWidth},${bottom}`,
                  `${nextXOffset},${bottom}`
                ].join(' ');

                const isHovered = hoveredIdx === idx;
                const isCurrentPinned = pinnedIdx === idx;

                return (
                  <g 
                    key={step.name} 
                    onMouseEnter={() => { if (pinnedIdx === null) { triggerHaptic('light'); } setHoveredIdx(idx); }}
                    onMouseLeave={() => setHoveredIdx(null)}
                    onClick={(e) => handleStageClick(idx, e)}
                    className="cursor-pointer transition-all duration-300 group"
                    role="button"
                    aria-expanded={isCurrentPinned}
                    tabIndex={0}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        handleStageClick(idx, e as any);
                      }
                    }}
                  >
                    <polygon 
                      points={points} 
                      fill={isCurrentPinned || isHovered ? 'var(--system-orange)' : 'url(#stepGradient)'} 
                      className="apple-spring shadow-sm"
                      opacity={isCurrentPinned || isHovered ? 1 : 0.85}
                      stroke={isCurrentPinned ? 'white' : 'transparent'}
                      strokeWidth={isCurrentPinned ? 3 : 0}
                      filter={isCurrentPinned ? 'url(#glow)' : 'none'}
                      style={{ transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)' }}
                    />
                    <text 
                      x={funnelWidth / 2} 
                      y={top + (bottom - top) / 2 + 5} 
                      textAnchor="middle" 
                      fill="white" 
                      className="font-bold text-[14px] pointer-events-none"
                    >
                      {step.visitors.toLocaleString()}
                    </text>

                    {idx < MOCK_FUNNEL.length - 1 && (
                      <g className="pointer-events-none">
                        <path 
                          d={`M ${funnelWidth/2} ${bottom} L ${funnelWidth/2} ${bottom + 20}`} 
                          stroke="rgba(120, 120, 128, 0.2)" 
                          strokeWidth="1.5" 
                          strokeDasharray="4 2" 
                        />
                        <rect 
                          x={funnelWidth/2 + (currentWidth/2.5)} 
                          y={bottom - 10} 
                          width="45" 
                          height="20" 
                          rx="4" 
                          fill="var(--ios-card)" 
                          className="glass"
                        />
                        <text 
                          x={funnelWidth/2 + (currentWidth/2.5) + 22.5} 
                          y={bottom + 4} 
                          textAnchor="middle" 
                          fill={getDropOffColor(step.dropOff)} 
                          className="font-black text-[10px]"
                        >
                          -{Math.round(step.dropOff)}%
                        </text>
                      </g>
                    )}
                  </g>
                );
              })}
            </svg>
          </div>

          <div className="flex-1 w-full space-y-4" onClick={(e) => e.stopPropagation()}>
             <div className={`glass p-5 rounded-[20px] transition-all border-none relative ${activeIdx !== null ? 'ring-2 ring-[#FF9500]/30 scale-[1.02]' : 'opacity-40'}`}>
                {activeIdx !== null ? (
                  <div className="animate-in fade-in zoom-in-95 duration-200">
                    {isPinned && (
                      <button 
                        onClick={() => setPinnedIdx(null)}
                        className="absolute top-4 right-4 p-1 rounded-full bg-[rgba(120,120,128,0.1)] text-secondary-text tap-feedback"
                      >
                        <X size={16} />
                      </button>
                    )}
                    <div className="flex items-center gap-3 mb-4">
                       <div className="w-10 h-10 rounded-xl bg-[#FF9500]/10 flex items-center justify-center text-[#FF9500]">
                          <Zap size={20} />
                       </div>
                       <div className="text-left">
                          <h4 className="headline leading-none">{MOCK_FUNNEL[activeIdx].name}</h4>
                          <div className="flex items-center gap-1.5 mt-1">
                            <p className="caption-2">Stage Details</p>
                            {isPinned && <span className="text-[9px] font-black bg-[#FF9500]/20 text-[#FF9500] px-1.5 rounded-sm">PINNED</span>}
                          </div>
                       </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4 text-left">
                       <div className="space-y-1">
                          <span className="caption-2 opacity-60">Visitors</span>
                          <p className="headline text-[20px]">{MOCK_FUNNEL[activeIdx].visitors.toLocaleString()}</p>
                       </div>
                       <div className="space-y-1">
                          <span className="caption-2 opacity-60">Conv. Rate</span>
                          <p className="headline text-[20px]">{MOCK_FUNNEL[activeIdx].conversionRate}%</p>
                       </div>
                    </div>

                    {MOCK_FUNNEL[activeIdx].linkToTool && (
                       <button 
                        onClick={() => openAnalysis(MOCK_FUNNEL[activeIdx!].linkToTool!, MOCK_FUNNEL[activeIdx!].name)}
                        className="w-full mt-6 primary-button tap-feedback flex items-center justify-center gap-2 group"
                       >
                          Analyze {MOCK_FUNNEL[activeIdx].linkToTool} <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
                       </button>
                    )}
                    {!isPinned && (
                      <p className="text-[10px] opacity-40 mt-4 text-center font-bold">CLICK STAGE TO PIN DETAILS</p>
                    )}
                  </div>
                ) : (
                  <div className="py-12 text-center text-secondary-text">
                    <MousePointer2 size={32} className="mx-auto mb-2 opacity-20" />
                    <p className="body-text">Tap or hover funnel stages<br/>to view statistics</p>
                  </div>
                )}
             </div>
          </div>
        </div>
      </section>

      {/* Analysis Modal */}
      {(analysisData || isAnalysisLoading) && (
        <div className="fixed inset-0 z-[200] bg-black/40 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4 animate-in fade-in duration-300" onClick={() => setAnalysisData(null)}>
          <div 
            className="w-full max-w-[700px] glass rounded-t-[28px] sm:rounded-[28px] shadow-2xl animate-in slide-in-from-bottom-full sm:zoom-in-95 duration-400 flex flex-col max-h-[90vh] overflow-hidden border-none"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-5 flex items-center justify-between border-b var(--separator) shrink-0">
              <button onClick={() => setAnalysisData(null)} className="text-[#007AFF] headline tap-feedback flex items-center gap-1"><X size={20}/> Close</button>
              <h2 className="headline truncate px-4">{isAnalysisLoading ? 'Intelligence Synthesis' : analysisData?.title}</h2>
              <button 
                disabled={isAnalysisLoading} 
                onClick={handleDownloadReport} 
                className="text-[#007AFF] headline tap-feedback disabled:opacity-30 flex items-center gap-1"
              >
                <Download size={18}/> <span className="hidden sm:inline">Export</span>
              </button>
            </div>

            <div className="p-6 flex-1 overflow-y-auto custom-scrollbar text-left">
              {isAnalysisLoading ? (
                <div className="flex flex-col items-center justify-center py-24 gap-6">
                  <div className="relative">
                    <div className="w-16 h-16 border-4 border-[rgba(120,120,128,0.1)] border-t-[#FF9500] rounded-full animate-spin"></div>
                    <Target size={24} className="absolute inset-0 m-auto text-[#FFCC00] animate-pulse" />
                  </div>
                  <div className="text-center space-y-1">
                    <p className="headline">Aggregating Behavioral Data...</p>
                    <p className="caption-2 opacity-60">Cross-referencing funnel cohorts</p>
                  </div>
                </div>
              ) : analysisData && (
                <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                  {/* Summary Cards */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {analysisData.metrics.map((m, i) => (
                      <div key={i} className="glass bg-[rgba(120,120,128,0.05)] p-4 rounded-2xl border-none">
                        <span className="caption-2 opacity-60 block mb-1">{m.label}</span>
                        <div className="flex items-baseline gap-2">
                          <span className="headline text-[24px]">{m.value}</span>
                          {m.trend && <span className={`text-[12px] font-black ${m.trend.startsWith('+') ? 'text-green-500' : 'text-red-500'}`}>{m.trend}</span>}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Tool Specific Content */}
                  <div className="space-y-4">
                    <div className="flex items-center justify-between px-1">
                      <h3 className="headline section-header">Detailed Breakdown</h3>
                      <div className="flex gap-2">
                        <span className="bg-[#007AFF]/10 text-[#007AFF] px-3 py-1 rounded-full text-[11px] font-black uppercase tracking-tighter">Live Dataset</span>
                      </div>
                    </div>

                    {analysisData.tool === 'Forms' && (
                      <div className="space-y-3">
                        {analysisData.details.map((field, i) => (
                          <div key={i} className="glass p-4 rounded-2xl border-none hover:bg-[rgba(120,120,128,0.05)] transition-colors">
                            <div className="flex justify-between items-start mb-3">
                              <div>
                                <h4 className="headline text-[16px]">{field.field}</h4>
                                <span className="caption-2 text-[10px] opacity-40">{field.type} • {field.completions.toLocaleString()} views</span>
                              </div>
                              <div className="text-right">
                                <span className="headline text-[18px] text-green-500">{(100 - parseFloat(field.abandon)).toFixed(0)}%</span>
                                <p className="caption-2 text-[10px] opacity-40">Success</p>
                              </div>
                            </div>
                            <div className="space-y-2">
                              <div className="flex justify-between text-[11px] font-bold opacity-60">
                                <span>Abandonment: {field.abandon}</span>
                                <span>Avg. Interaction: {field.time}</span>
                              </div>
                              <div className="h-1.5 bg-[rgba(120,120,128,0.1)] rounded-full overflow-hidden">
                                <div 
                                  className={`h-full rounded-full transition-all duration-1000 ${parseFloat(field.abandon) > 10 ? 'bg-orange-500' : 'bg-green-500'}`} 
                                  style={{ width: `${100 - parseFloat(field.abandon)}%` }}
                                ></div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                    {analysisData.tool === 'Recordings' && (
                      <div className="glass rounded-2xl overflow-hidden border-none bg-[rgba(120,120,128,0.02)]">
                        {analysisData.details.map((rec, i) => (
                          <div key={i} className={`p-4 flex items-center gap-4 hover:bg-[rgba(0,122,255,0.05)] cursor-pointer transition-colors ${i !== 0 ? 'border-t border-[rgba(120,120,128,0.1)]' : ''}`} onClick={() => showToast(`Streaming Recording ${rec.id}...`)}>
                            <div className="w-10 h-10 rounded-full bg-[#007AFF]/10 flex items-center justify-center text-[#007AFF]">
                              <PlayCircle size={24} />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex justify-between">
                                <span className="headline text-[15px] truncate">{rec.user}</span>
                                <span className="caption-2 opacity-40">{rec.date}</span>
                              </div>
                              <div className="flex items-center gap-3 mt-1">
                                <span className="flex items-center gap-1 text-[11px] font-bold opacity-60">
                                  {rec.device === 'Desktop' ? <Monitor size={12}/> : rec.device === 'Mobile' ? <Smartphone size={12}/> : <Tablet size={12}/>}
                                  {rec.device}
                                </span>
                                <span className="flex items-center gap-1 text-[11px] font-bold opacity-60"><Clock size={12}/> {rec.duration}</span>
                              </div>
                            </div>
                            <ChevronRight size={18} className="opacity-20" />
                          </div>
                        ))}
                      </div>
                    )}

                    {analysisData.tool === 'Heatmaps' && (
                      <div className="space-y-4">
                        <div className="h-48 glass bg-gradient-to-tr from-blue-500/10 via-red-500/20 to-yellow-500/10 rounded-2xl flex items-center justify-center relative overflow-hidden border-none">
                           <MapIcon size={48} className="text-[#FF9500] opacity-30 animate-pulse" />
                           <div className="absolute top-4 left-4 flex gap-2">
                             <span className="px-3 py-1 bg-white/10 backdrop-blur-md rounded-full text-[10px] font-black uppercase">Click Map</span>
                           </div>
                           <div className="absolute inset-0 bg-heatmap-gradient opacity-40"></div>
                        </div>
                        <div className="space-y-2">
                          {analysisData.details.map((item, i) => (
                            <div key={i} className="flex items-center gap-4 p-3 hover:bg-[rgba(120,120,128,0.05)] rounded-xl transition-colors">
                              <div className="w-2 h-8 rounded-full" style={{ backgroundColor: `rgba(255, 149, 0, ${parseFloat(item.intensity)/100})` }}></div>
                              <div className="flex-1">
                                <h4 className="headline text-[14px]">{item.element}</h4>
                                <span className="caption-2 text-[10px] opacity-40">{item.clicks} total interactions</span>
                              </div>
                              <div className="text-right">
                                <span className="headline text-[16px]">{item.intensity}</span>
                                <p className="caption-2 text-[10px] opacity-40">Intensity</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="p-5 bg-blue-500/5 rounded-[24px] border border-blue-500/10 flex gap-4 items-start">
                    <div className="w-10 h-10 rounded-xl bg-blue-500 flex items-center justify-center text-white shrink-0 shadow-lg shadow-blue-500/20">
                      {/* Fixed missing icon import below */}
                      <Sparkles size={20} />
                    </div>
                    <div className="text-left space-y-1">
                      <h4 className="headline text-[15px]">Intelligence Reco</h4>
                      <p className="body-text text-[14px] leading-snug">
                        Analysis indicates <span className="font-bold">high friction</span> on the {analysisData.tool === 'Forms' ? 'Password field' : 'Primary CTA'}. 
                        Reducing validation complexity could lift conversion by <span className="text-[#34C759] font-black">~4.2%</span>.
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      <div className="space-y-3" onClick={(e) => e.stopPropagation()}>
        <h3 className="caption-2 px-1 mb-2">Stage Breakdown</h3>
        {MOCK_FUNNEL.map((step, idx) => (
          <div 
            key={idx} 
            onClick={(e) => handleStageClick(idx, e)}
            className={`w-full glass rounded-[16px] p-4 flex items-center justify-between shadow-none border-none cursor-pointer tap-feedback transition-all ${pinnedIdx === idx ? 'ring-2 ring-[#FF9500]/30' : ''}`}
          >
            <div className="flex items-center gap-4">
              <span className={`w-8 h-8 rounded-full text-[13px] font-bold flex items-center justify-center transition-colors ${pinnedIdx === idx ? 'bg-[#FF9500] text-white' : 'bg-[rgba(120,120,128,0.12)] text-secondary-text'}`}>
                {idx + 1}
              </span>
              <div className="text-left">
                <span className="headline !font-medium text-[16px] block">{step.name}</span>
                <span className="caption-2 !text-[10px] opacity-40">{step.conversionRate}% cohort conversion</span>
              </div>
            </div>
            <div className="text-right">
               <span className="headline !font-bold text-[14px]">{step.visitors > 1000 ? (step.visitors/1000).toFixed(1) + 'k' : step.visitors}</span>
               {idx > 0 && (
                 <p className={`text-[10px] font-bold ${getDropOffColor(MOCK_FUNNEL[idx-1].dropOff)}`}>
                    -{MOCK_FUNNEL[idx-1].dropOff}%
                 </p>
               )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BehaviorFunnels;
