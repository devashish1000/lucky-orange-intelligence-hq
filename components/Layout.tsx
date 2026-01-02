
import React, { useState, useRef, createContext, useContext, useEffect } from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { NAVIGATION, MOCK_KPI_DETAILS } from '../constants';
import { 
  Search, Bell, Sparkles, X, Mic, Copy, RefreshCw, CircleX, Check, 
  ArrowRight, Download, Mail, MessageSquare, Zap, TrendingUp, TrendingDown, Users, ExternalLink, Loader2
} from 'lucide-react';
import { askIntelligenceHQ } from '../services/geminiService';
import { KPIDetail } from '../types';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

const ToastContext = createContext<{ showToast: (msg: string) => void }>({ showToast: () => {} });
export const useToast = () => useContext(ToastContext);

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [aiQuery, setAiQuery] = useState('');
  const [aiResponse, setAiResponse] = useState<string | null>(null);
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [showAiModal, setShowAiModal] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  
  const [activeKPIDetail, setActiveKPIDetail] = useState<KPIDetail | null>(null);
  const [isDetailLoading, setIsDetailLoading] = useState(false);
  const [actionModal, setActionModal] = useState<{ type: string; title: string } | null>(null);

  const location = useLocation();
  const navigate = useNavigate();
  const inputRef = useRef<HTMLInputElement>(null);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 2500);
  };

  const handleAiSearch = async (e?: React.FormEvent, directQuery?: string) => {
    e?.preventDefault();
    const query = directQuery || aiQuery;
    if (!query.trim()) return;
    
    setAiQuery(query);
    setIsAiLoading(true);
    setAiResponse(null);
    setIsCopied(false);
    
    showToast("Discovery AI is analyzing core data...");
    
    const context = `Lucky Orange HQ Intelligence App. Current view: ${location.pathname}. 
    Formatting: Use emojis, bold key metrics, and keep it under 3 punchy paragraphs. Use INSIGHT: prefix for major findings.`;
    
    const response = await askIntelligenceHQ(query, context);
    setAiResponse(response || "Intelligence engine timeout. Please retry.");
    setIsAiLoading(false);
    showToast("✓ Analysis ready");
  };

  const handleCopy = async () => {
    if (aiResponse) {
      await navigator.clipboard.writeText(aiResponse);
      setIsCopied(true);
      showToast("✓ Copied to clipboard");
      setTimeout(() => setIsCopied(false), 2000);
    }
  };

  const closeModals = () => {
    setShowAiModal(false);
    setActiveKPIDetail(null);
    setIsDetailLoading(false);
    setActionModal(null);
    setAiResponse(null);
    setAiQuery('');
  };

  // Helper to highlight and badge metrics in AI responses
  const renderFormattedResponse = (text: string) => {
    if (!text) return null;
    const lines = text.split('\n').filter(l => l.trim());
    
    return (
      <div className="space-y-4">
        {lines.map((line, idx) => {
          const isInsight = line.startsWith('INSIGHT:') || line.startsWith('🎯');
          const parts = line.split(/(\d+(?:\.\d+)?%|\$\d+(?:,\d+)*(?:\.\d+)?|\d+\s*accounts)/gi);
          
          return (
            <p key={idx} className={`${isInsight ? 'text-[18px] font-bold text-slate-900 border-l-4 border-orange-500 pl-4 py-1 bg-orange-50/30' : 'text-[16px] text-slate-700'} leading-relaxed`}>
              {parts.map((part, i) => {
                if (part.match(/\d+(?:\.\d+)?%/)) return <mark key={i} className="bg-emerald-100 text-emerald-800 px-1.5 py-0.5 rounded-md font-black no-underline mx-0.5">{part}</mark>;
                if (part.match(/\$/)) return <mark key={i} className="bg-orange-100 text-orange-800 px-1.5 py-0.5 rounded-md font-black no-underline mx-0.5">{part}</mark>;
                if (part.match(/\d+\s*accounts/i)) return <mark key={i} className="bg-blue-100 text-blue-800 px-1.5 py-0.5 rounded-md font-black no-underline mx-0.5">{part}</mark>;
                return <span key={i}>{part}</span>;
              })}
            </p>
          );
        })}
      </div>
    );
  };

  // Expose modal functions to the window for page access
  useEffect(() => {
    (window as any).openKPIDetail = (id: string) => {
      setIsDetailLoading(true);
      setActiveKPIDetail(null);
      // Simulate API fetch delay
      setTimeout(() => {
        const detail = MOCK_KPI_DETAILS[id];
        if (detail) {
          setActiveKPIDetail(detail);
          setIsDetailLoading(false);
        } else {
          setIsDetailLoading(false);
          showToast("✗ Failed to load metric details");
        }
      }, 600);
    };
    (window as any).openActionModal = (type: string, title: string) => {
      setActionModal({ type, title });
    };
  }, []);

  return (
    <ToastContext.Provider value={{ showToast }}>
      <div className="flex flex-col h-screen overflow-hidden bg-[#f9fafb] safe-top safe-bottom">
        <div className="h-[env(safe-area-inset-top)] bg-white/80 glass fixed top-0 w-full z-[60]"></div>

        {toast && (
          <div className="fixed top-20 left-1/2 -translate-x-1/2 z-[1000] animate-in fade-in slide-in-from-top-4 duration-300">
            <div className={`backdrop-blur-md text-white px-6 py-3 rounded-full text-sm font-bold shadow-2xl border border-white/20 flex items-center gap-2 ${
              toast.includes('✗') ? 'bg-rose-600/90' : toast.includes('✓') ? 'bg-emerald-600/90' : 'bg-slate-900/90'
            }`}>
              {toast}
            </div>
          </div>
        )}

        <header className="shrink-0 glass border-b border-slate-200 sticky top-0 z-50">
          <div className="h-16 flex items-center justify-between px-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-[#f26522] rounded-xl flex items-center justify-center font-black text-xl text-white shadow-lg shadow-orange-500/20">L</div>
              <h1 className="text-[19px] font-extrabold tracking-tight text-slate-900">{NAVIGATION.find(n => n.path === location.pathname)?.name || 'Lucky Orange'}</h1>
            </div>
            <div className="flex items-center gap-4">
              <button className="text-slate-500 p-2 rounded-full hover:bg-slate-100 transition-colors"><Bell size={22} /></button>
              <div className="w-9 h-9 rounded-full bg-slate-200 border-2 border-white shadow-sm overflow-hidden">
                <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Growth" alt="user" />
              </div>
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto pt-6 pb-28 px-6 custom-scrollbar page-transition">
          <div className="mb-8 max-w-2xl mx-auto w-full">
            <div 
              onClick={() => setShowAiModal(true)}
              className="group flex items-center gap-3 px-6 py-4.5 bg-white border border-slate-200 rounded-2xl text-slate-400 cursor-pointer hover:border-[#f26522] hover:shadow-lg transition-all"
            >
              <Search size={20} className="text-slate-400 group-hover:text-[#f26522] transition-colors" />
              <span className="text-[16px] font-medium">Ask Discovery AI for a growth analysis...</span>
              <div className="ml-auto p-1.5 bg-orange-50 rounded-lg"><Mic size={18} className="text-[#f26522]" /></div>
            </div>
          </div>
          <div className="max-w-4xl mx-auto">{children}</div>
        </main>

        {/* Discovery AI Modal */}
        {showAiModal && (
          <div className="fixed inset-0 z-[100] bg-slate-900/70 backdrop-blur-md flex items-center justify-center p-4">
            <div className="w-full max-w-[560px] bg-white rounded-[32px] shadow-2xl animate-in zoom-in-95 fade-in duration-300 flex flex-col max-h-[85vh] overflow-hidden">
              <div className="p-8 pb-4 flex items-center justify-between border-b border-slate-50">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-orange-50 rounded-2xl flex items-center justify-center text-[#f26522]">
                    <Sparkles size={28} />
                  </div>
                  <div>
                    <h2 className="text-2xl font-black text-slate-900 tracking-tight leading-none">Discovery AI</h2>
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1.5">Intelligence HQ</p>
                  </div>
                </div>
                <button onClick={closeModals} className="bg-slate-50 hover:bg-slate-100 text-slate-500 p-3 rounded-full transition-all active:scale-90"><X size={20} /></button>
              </div>

              <div className="p-8 pt-6 flex flex-col flex-1 overflow-hidden">
                <form onSubmit={handleAiSearch} className="relative mb-6">
                  <input 
                    ref={inputRef} autoFocus type="text" value={aiQuery} onChange={(e) => setAiQuery(e.target.value)}
                    placeholder="Search accounts or ask a question..."
                    className="w-full pl-6 pr-24 py-5 bg-slate-50 border border-slate-100 rounded-[22px] text-[17px] font-semibold text-slate-900 outline-none focus:border-[#f26522]/30 shadow-inner"
                  />
                  <div className="absolute right-3 top-1/2 -translate-y-1/2">
                    <button type="submit" className="bg-[#f26522] text-white p-3.5 rounded-xl shadow-lg shadow-[#f26522]/20 hover:bg-orange-600 active:scale-90 transition-all">
                      <Search size={20} />
                    </button>
                  </div>
                </form>

                <div className="flex-1 overflow-y-auto custom-scrollbar pr-2">
                  {isAiLoading ? (
                    <div className="flex flex-col items-center justify-center py-20 gap-5">
                      <div className="flex gap-2">
                        <div className="w-3 h-3 bg-[#f26522] rounded-full animate-bounce [animation-duration:0.6s]"></div>
                        <div className="w-3 h-3 bg-[#f26522] rounded-full animate-bounce [animation-duration:0.6s] [animation-delay:0.1s]"></div>
                        <div className="w-3 h-3 bg-[#f26522] rounded-full animate-bounce [animation-duration:0.6s] [animation-delay:0.2s]"></div>
                      </div>
                      <p className="text-xs font-black text-slate-400 uppercase tracking-widest">Querying internal datasets...</p>
                    </div>
                  ) : aiResponse ? (
                    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                      <div className="bg-slate-50 p-7 rounded-[28px] border border-slate-200 mb-6 shadow-sm relative">
                        <div className="absolute top-0 left-0 w-1.5 h-full bg-[#f26522]"></div>
                        {renderFormattedResponse(aiResponse)}
                        
                        <div className="mt-8 pt-8 border-t border-slate-200 grid grid-cols-1 gap-3">
                          <button onClick={() => { navigate('/health'); closeModals(); }} className="flex items-center justify-between px-6 py-4.5 bg-white border border-slate-200 rounded-2xl hover:border-[#f26522] group shadow-sm transition-all">
                            <div className="flex items-center gap-3"><Users size={18} className="text-blue-500" /> <span className="font-bold">View Accounts List</span></div>
                            <ArrowRight size={16} className="text-slate-400 group-hover:text-[#f26522] group-hover:translate-x-1 transition-all" />
                          </button>
                          <button onClick={() => showToast("✓ Data exported to Growth_Insight.csv")} className="flex items-center justify-between px-6 py-4.5 bg-white border border-slate-200 rounded-2xl hover:border-emerald-500 group shadow-sm transition-all">
                            <div className="flex items-center gap-3"><Download size={18} className="text-emerald-500" /> <span className="font-bold">Export Detailed Dataset</span></div>
                            <ArrowRight size={16} className="text-slate-400 group-hover:text-emerald-500 group-hover:translate-x-1 transition-all" />
                          </button>
                        </div>
                      </div>
                      
                      <div className="flex gap-4">
                        <button onClick={handleCopy} className="flex-1 flex items-center justify-center gap-2 py-4.5 bg-slate-100 text-slate-700 rounded-[20px] font-bold active:scale-95 transition-all">
                          {isCopied ? <Check size={18} className="text-emerald-600" /> : <Copy size={18} />} {isCopied ? 'Copied' : 'Copy Response'}
                        </button>
                        <button onClick={() => handleAiSearch()} className="flex-1 flex items-center justify-center gap-2 py-4.5 bg-slate-900 text-white rounded-[20px] font-bold active:scale-95 transition-all">
                          <RefreshCw size={18} /> Regenerate Analysis
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-3 pb-8">
                      <p className="text-[11px] font-black text-slate-400 uppercase tracking-widest mb-4 px-1">Suggested Playbooks</p>
                      {[
                        "Summarize churn risk for Enterprise accounts this month",
                        "Which features correlate highest to retention in Retail?",
                        "Expansion opportunities for Heatmap power users",
                        "Create a win-back strategy for dormant Pro accounts"
                      ].map(s => (
                        <button key={s} onClick={() => handleAiSearch(undefined, s)} className="w-full text-left px-6 py-5 bg-white border border-slate-100 rounded-[22px] font-bold text-slate-700 hover:border-[#f26522] hover:bg-orange-50 transition-all shadow-sm group">
                          <div className="flex items-center gap-3">
                            <Zap size={18} className="text-slate-300 group-hover:text-[#f26522] transition-colors" /> {s}
                          </div>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* KPI Detail Modal with Loading State */}
        {(isDetailLoading || activeKPIDetail) && (
          <div className="fixed inset-0 z-[110] bg-slate-900/70 backdrop-blur-md flex items-end sm:items-center justify-center p-0 sm:p-4">
            <div className="w-full max-w-[680px] bg-white rounded-t-[40px] sm:rounded-[40px] shadow-2xl animate-in slide-in-from-bottom-full sm:zoom-in-95 duration-500 flex flex-col max-h-[90vh] overflow-hidden">
              <div className="p-10 pb-6 flex items-center justify-between border-b border-slate-50">
                <div className="flex flex-col gap-1">
                  <span className="text-[11px] font-black text-slate-400 uppercase tracking-[0.3em]">Performance Metric</span>
                  <h2 className="text-3xl font-black text-slate-900 tracking-tight leading-none">
                    {isDetailLoading ? 'Loading Insights...' : activeKPIDetail?.label}
                  </h2>
                </div>
                <button onClick={closeModals} className="bg-slate-50 hover:bg-slate-100 text-slate-500 p-3.5 rounded-full transition-all active:scale-90"><X size={24} /></button>
              </div>

              <div className="p-10 pt-8 flex-1 overflow-y-auto custom-scrollbar min-h-[400px]">
                {isDetailLoading ? (
                  <div className="flex flex-col items-center justify-center py-20 gap-4">
                    <Loader2 className="animate-spin text-orange-500" size={48} />
                    <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">Aggregating real-time data...</p>
                  </div>
                ) : activeKPIDetail ? (
                  <div className="animate-in fade-in duration-300">
                    <div className="grid grid-cols-2 gap-5 mb-10">
                      <div className="bg-slate-50 p-6 rounded-[28px] border border-slate-100 shadow-sm">
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Current Status</span>
                        <div className="text-4xl font-black text-slate-900 mt-2">{activeKPIDetail.value}</div>
                      </div>
                      <div className={`p-6 rounded-[28px] border shadow-sm ${activeKPIDetail.trend === 'up' ? 'bg-emerald-50 border-emerald-100' : 'bg-rose-50 border-rose-100'}`}>
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Growth Trend</span>
                        <div className={`text-4xl font-black mt-2 flex items-center gap-2 ${activeKPIDetail.trend === 'up' ? 'text-emerald-600' : 'text-rose-600'}`}>
                          {activeKPIDetail.trend === 'up' ? <TrendingUp size={32} /> : <TrendingDown size={32} />} {activeKPIDetail.change}%
                        </div>
                      </div>
                    </div>

                    <div className="mb-10">
                      <h3 className="text-[12px] font-black text-slate-400 uppercase tracking-[0.2em] mb-6">Historical Trend (90 Days)</h3>
                      <div className="h-[240px] w-full bg-slate-50 rounded-[32px] border border-slate-100 p-6 shadow-inner">
                        <ResponsiveContainer width="100%" height="100%">
                          <AreaChart data={activeKPIDetail.history}>
                            <defs>
                              <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#f26522" stopOpacity={0.2}/>
                                <stop offset="95%" stopColor="#f26522" stopOpacity={0}/>
                              </linearGradient>
                            </defs>
                            <Area type="monotone" dataKey="value" stroke="#f26522" strokeWidth={5} fillOpacity={1} fill="url(#colorValue)" animationDuration={1500} />
                            <XAxis dataKey="date" hide />
                            <YAxis hide domain={['dataMin - 100', 'dataMax + 100']} />
                            <Tooltip contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 25px rgba(0,0,0,0.1)' }} />
                          </AreaChart>
                        </ResponsiveContainer>
                      </div>
                    </div>

                    <div className="mb-10">
                       <h3 className="text-[12px] font-black text-slate-400 uppercase tracking-[0.2em] mb-6">Segment Breakdown</h3>
                       <div className="space-y-5">
                         {activeKPIDetail.breakdown.map((item, idx) => (
                           <div key={idx} className="group cursor-default">
                             <div className="flex justify-between items-center mb-2.5">
                                <span className="text-[15px] font-bold text-slate-700">{item.label}</span>
                                <span className="text-[15px] font-black text-slate-900">{item.percent}%</span>
                             </div>
                             <div className="h-4 bg-slate-100 rounded-full overflow-hidden border border-slate-200">
                               <div className="h-full bg-slate-900 rounded-full transition-all duration-1000 group-hover:bg-[#f26522]" style={{ width: `${item.percent}%` }}></div>
                             </div>
                           </div>
                         ))}
                       </div>
                    </div>
                    
                    <div className="flex gap-5">
                      <button onClick={() => showToast("✓ Dataset Exported")} className="flex-1 flex items-center justify-center gap-2.5 py-5 bg-slate-900 text-white rounded-[24px] text-[16px] font-black shadow-xl active:scale-95 transition-all"><Download size={20} /> Generate Data Report</button>
                      <button onClick={() => showToast("Opening period comparison...")} className="flex-1 flex items-center justify-center gap-2.5 py-5 bg-white text-slate-900 border-2 border-slate-100 rounded-[24px] text-[16px] font-black active:scale-95 transition-all hover:border-slate-200">Compare vs Prev Quarter</button>
                    </div>
                  </div>
                ) : null}
              </div>
            </div>
          </div>
        )}

        {actionModal && (
          <div className="fixed inset-0 z-[120] bg-slate-900/70 backdrop-blur-md flex items-center justify-center p-4">
            <div className="w-full max-w-[480px] bg-white rounded-[32px] shadow-2xl animate-in zoom-in-95 duration-300 overflow-hidden border border-slate-100">
              <div className="p-8 pb-5 flex items-center justify-between border-b border-slate-50">
                <h2 className="text-xl font-black text-slate-900">{actionModal.title}</h2>
                <button onClick={closeModals} className="p-2.5 bg-slate-50 rounded-full hover:bg-slate-100 text-slate-500"><X size={20} /></button>
              </div>
              <div className="p-8 space-y-6">
                {actionModal.type === 'campaign' && (
                  <div className="space-y-5">
                    <div className="space-y-2">
                      <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest px-1">Campaign Objective</label>
                      <input type="text" defaultValue="Expansion for Heatmap Power Users" className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-[#f26522] font-semibold" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest px-1">Target Slice</label>
                      <select className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-xl outline-none font-semibold">
                        <option>Enterprise (Retail Sector)</option>
                        <option>At-Risk Pro (E-commerce)</option>
                        <option>Inactive Starter Plans</option>
                      </select>
                    </div>
                  </div>
                )}
                {actionModal.type === 'abtest' && (
                  <div className="space-y-5">
                    <div className="space-y-2">
                      <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest px-1">Primary Metric</label>
                      <div className="grid grid-cols-2 gap-3">
                         <button className="py-3 px-4 bg-orange-50 border-2 border-[#f26522] rounded-xl text-[13px] font-black text-[#f26522]">Conv. Rate</button>
                         <button className="py-3 px-4 bg-white border-2 border-slate-100 rounded-xl text-[13px] font-black text-slate-400 hover:border-slate-200">Expansion</button>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest px-1">Traffic Allocation</label>
                      <div className="flex items-center gap-4">
                        <input type="range" className="flex-1 accent-[#f26522]" defaultValue="50" />
                        <span className="text-[16px] font-black text-slate-900">50%</span>
                      </div>
                    </div>
                  </div>
                )}
                {actionModal.type === 'share' && (
                  <div className="grid grid-cols-1 gap-3">
                    <button onClick={() => { showToast("✓ Synced to #hq-growth"); closeModals(); }} className="flex items-center gap-4 p-5 bg-slate-50 border border-slate-100 rounded-2xl hover:border-blue-500 hover:bg-blue-50/30 transition-all group">
                      <div className="p-3 bg-white rounded-xl text-blue-500 shadow-sm group-hover:shadow-md"><MessageSquare size={24} /></div>
                      <div className="text-left">
                        <div className="text-[15px] font-black text-slate-900">Push to Slack</div>
                        <div className="text-[11px] font-bold text-slate-400">#hq-growth-insights</div>
                      </div>
                    </button>
                    <button onClick={() => { showToast("✓ Intelligence brief emailed"); closeModals(); }} className="flex items-center gap-4 p-5 bg-slate-50 border border-slate-100 rounded-2xl hover:border-orange-500 hover:bg-orange-50/30 transition-all group">
                      <div className="p-3 bg-white rounded-xl text-orange-500 shadow-sm group-hover:shadow-md"><Mail size={24} /></div>
                      <div className="text-left">
                        <div className="text-[15px] font-black text-slate-900">Send Email Brief</div>
                        <div className="text-[11px] font-bold text-slate-400">All Product Managers</div>
                      </div>
                    </button>
                  </div>
                )}
                <button 
                  onClick={() => { 
                    showToast(`✓ Action Executed: ${actionModal.title}`);
                    closeModals();
                  }}
                  className="w-full py-5 bg-[#f26522] text-white font-black rounded-2xl shadow-xl shadow-[#f26522]/20 active:scale-95 transition-all text-[16px] mt-4"
                >
                  Deploy Strategy
                </button>
              </div>
            </div>
          </div>
        )}

        <nav className="shrink-0 glass border-t border-slate-200 fixed bottom-0 left-0 right-0 z-50 h-[84px] shadow-[0_-4px_12px_rgba(0,0,0,0.03)]">
          <div className="flex items-start justify-around pt-2 px-2 max-w-lg mx-auto">
            {NAVIGATION.map((item) => (
              <NavLink key={item.path} to={item.path}
                className={({ isActive }) => `flex flex-col items-center gap-1 transition-all w-[72px] ${isActive ? 'text-[#f26522]' : 'text-slate-400 hover:text-slate-600'}`}
              >
                <div className={`h-8 w-8 flex items-center justify-center rounded-xl transition-all ${location.pathname === item.path ? 'bg-orange-50' : 'bg-transparent'}`}>
                  {React.cloneElement(item.icon as React.ReactElement, { size: 22, strokeWidth: location.pathname === item.path ? 2.5 : 2 })}
                </div>
                <span className={`text-[11px] font-bold tracking-tight ${location.pathname === item.path ? 'text-orange-600' : 'text-slate-400'}`}>
                  {item.name.split(' ')[0]}
                </span>
              </NavLink>
            ))}
          </div>
        </nav>
      </div>
    </ToastContext.Provider>
  );
};

export default Layout;
export { ToastContext };
