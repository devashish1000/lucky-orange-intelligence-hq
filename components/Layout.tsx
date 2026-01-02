
import React, { useState, useRef, useEffect } from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { NAVIGATION } from '../constants';
import { 
  Search, Bell, Sparkles, X, Mic, Copy, RefreshCw, CircleX, Check, 
  ArrowRight, Users, MessageSquare, CheckCircle2, 
  Sun, Moon, Download as DownloadIcon, TrendingUp, TrendingDown,
  Zap, BarChart3, ChevronRight, Activity, DollarSign
} from 'lucide-react';
import { askIntelligenceHQ } from '../services/geminiService';
import { useAuth, useTheme, useUI } from '../App';

interface Metric {
  value: string;
  label: string;
  trend: 'positive' | 'negative' | 'neutral';
}

interface StructuredInsight {
  title: string;
  description: string;
  category: string;
  priority: string;
  metrics: Metric[];
}

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { isDarkMode, toggleDarkMode } = useTheme();
  const { triggerHaptic, showToast, toast } = useUI();
  
  const [aiQuery, setAiQuery] = useState('');
  const [aiResponse, setAiResponse] = useState<string | null>(null);
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState('Consulting Intelligence...');
  const [showAiModal, setShowAiModal] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const [recentSearches, setRecentSearches] = useState(['Churn risk Retail', 'Conversion by Plan', 'Adoption Heatmaps', 'Expansion opportunities']);
  const [isListening, setIsListening] = useState(false);
  const [isInputFocused, setIsInputFocused] = useState(false);
  
  const location = useLocation();
  const navigate = useNavigate();
  const inputRef = useRef<HTMLInputElement>(null);

  // Granular AI Loading Logic
  useEffect(() => {
    let timer: number;
    if (isAiLoading) {
      setLoadingMessage('Consulting Intelligence...');
      timer = window.setTimeout(() => {
        setLoadingMessage('Synthesizing behavior datasets...');
      }, 2000);
      const timer2 = window.setTimeout(() => {
        setLoadingMessage('Finalizing growth briefing...');
      }, 5000);
      return () => {
        window.clearTimeout(timer);
        window.clearTimeout(timer2);
      };
    }
  }, [isAiLoading]);

  const handleAiSearch = async (e?: React.FormEvent, directQuery?: string) => {
    e?.preventDefault();
    const query = directQuery || aiQuery;
    if (!query.trim()) return;
    
    if (!recentSearches.includes(query)) {
      setRecentSearches(prev => [query, ...prev.slice(0, 4)]);
    }

    setAiQuery(query);
    setIsAiLoading(true);
    setAiResponse(null);
    setIsCopied(false);
    setIsInputFocused(false);
    
    triggerHaptic('medium');
    const context = `Lucky Orange HQ Dashboard. Current route: ${location.pathname}. Provide growth and retention intelligence.`;
    const response = await askIntelligenceHQ(query, context);
    setAiResponse(response || null);
    setIsAiLoading(false);
    triggerHaptic('success');
  };

  const toggleVoice = () => {
    setIsListening(true);
    triggerHaptic('heavy');
    showToast("Listening...");
    setTimeout(() => {
      setIsListening(false);
      handleAiSearch(undefined, "Analyze segment adoption for Heatmaps");
    }, 2500);
  };

  const handleCopy = async () => {
    if (aiResponse) {
      await navigator.clipboard.writeText(aiResponse);
      setIsCopied(true);
      triggerHaptic('light');
      showToast("Copied to clipboard");
      setTimeout(() => setIsCopied(false), 2000);
    }
  };

  const closeModals = () => {
    setShowAiModal(false);
    setAiResponse(null);
    setAiQuery('');
    setIsInputFocused(false);
  };

  const renderInsightCard = (insight: StructuredInsight, index: number) => {
    const getCategoryStyles = (category: string) => {
      switch (category.toLowerCase()) {
        case 'revenue': return { color: '#10B981', bg: 'rgba(16, 185, 129, 0.1)', icon: <DollarSign size={18} /> };
        case 'retention': return { color: '#3B82F6', bg: 'rgba(59, 130, 246, 0.1)', icon: <RefreshCw size={18} /> };
        case 'adoption': return { color: '#8B5CF6', bg: 'rgba(139, 92, 246, 0.1)', icon: <Zap size={18} /> };
        case 'optimization': return { color: '#F59E0B', bg: 'rgba(245, 158, 11, 0.1)', icon: <BarChart3 size={18} /> };
        default: return { color: '#6B7280', bg: 'rgba(107, 114, 128, 0.1)', icon: <Activity size={18} /> };
      }
    };

    const styles = getCategoryStyles(insight.category);

    return (
      <div 
        key={index} 
        className="glass rounded-[24px] border-none shadow-sm overflow-hidden mb-4 animate-in slide-in-from-bottom-4 duration-500"
        style={{ animationDelay: `${index * 100}ms` }}
      >
        <div className="flex items-start gap-4 p-5">
          <div className="shrink-0 w-12 h-12 rounded-[14px] flex items-center justify-center shadow-inner" style={{ backgroundColor: styles.bg, color: styles.color }}>
            {styles.icon}
          </div>
          <div className="flex-1 text-left">
            <div className="flex items-center justify-between mb-1">
              <h3 className="headline text-[17px] !font-bold tracking-tight">{insight.title}</h3>
              <span className={`text-[10px] font-black px-2 py-0.5 rounded-md uppercase tracking-widest ${
                insight.priority === 'High' ? 'bg-[#FF3B30]/10 text-[#FF3B30]' : 'bg-[rgba(120,120,128,0.1)] text-secondary-text'
              }`}>
                {insight.priority}
              </span>
            </div>
            <p className="body-text text-[15px] leading-snug mb-5">{insight.description}</p>
            
            {insight.metrics && insight.metrics.length > 0 && (
              <div className="grid grid-cols-2 gap-3 mb-4">
                {insight.metrics.map((metric, mIdx) => (
                  <div key={mIdx} className="bg-[rgba(120,120,128,0.05)] rounded-[16px] p-4 flex flex-col items-center sm:items-start">
                    <div className="flex items-center gap-1.5 mb-1">
                      <span className="text-[22px] font-black tracking-tighter" style={{ 
                        color: metric.trend === 'positive' ? '#1E7D32' : metric.trend === 'negative' ? '#D70015' : 'var(--text-primary)' 
                      }}>
                        {metric.value}
                      </span>
                      {metric.trend === 'positive' && <TrendingUp size={14} className="text-[#1E7D32]" />}
                      {metric.trend === 'negative' && <TrendingDown size={14} className="text-[#D70015]" />}
                    </div>
                    <span className="caption-2 text-[11px] opacity-60 text-center sm:text-left">{metric.label}</span>
                  </div>
                ))}
              </div>
            )}

            <div className="flex items-center justify-between mt-2 pt-4 border-t border-[rgba(120,120,128,0.1)]">
              <div className="flex gap-2">
                <span className="px-3 py-1 bg-[rgba(120,120,128,0.1)] rounded-full text-[10px] font-bold uppercase tracking-tighter opacity-70">
                  {insight.category}
                </span>
              </div>
              <button 
                onClick={() => { triggerHaptic('light'); showToast(`Viewing deeper ${insight.category} insights...`); }}
                className="text-[#007AFF] text-[13px] font-bold flex items-center gap-1 tap-feedback"
              >
                Learn More <ChevronRight size={14} />
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderResponse = (raw: string | null) => {
    if (!raw) return null;
    try {
      const parsed = JSON.parse(raw);
      if (!parsed.insights || !Array.isArray(parsed.insights)) {
        throw new Error("Invalid structure");
      }
      return (
        <div className="space-y-4">
          <div className="flex items-center justify-between px-1 mb-2">
            <h4 className="caption-2 opacity-50">Discovery Intelligence</h4>
            <span className="text-[10px] font-black bg-[#FF9500]/10 text-[#FF9500] px-2 py-0.5 rounded-full uppercase tracking-tighter">Live Dataset</span>
          </div>
          {parsed.insights.map((insight: StructuredInsight, i: number) => renderInsightCard(insight, i))}
        </div>
      );
    } catch (e) {
      // Fallback if parsing fails
      return <div className="p-8 text-center text-secondary-text opacity-50">Error synthesizing intelligence card.</div>;
    }
  };

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-[var(--ios-bg)] safe-top safe-bottom">
      <header className="shrink-0 glass sticky top-0 z-[60]">
        <div className="h-14 flex items-center justify-between px-5">
          <div className="flex items-center gap-2">
            <div onClick={() => { triggerHaptic('light'); navigate('/'); }} className="cursor-pointer tap-feedback flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-tr from-[#FF9500] to-[#FFCC00] rounded-lg flex items-center justify-center text-white shadow-sm">
                 <Sparkles size={18} fill="white" />
              </div>
              <span className="text-[17px] font-black" style={{ color: 'var(--text-primary)' }}>HQ</span>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <button 
              onClick={() => { triggerHaptic('light'); toggleDarkMode(); }} 
              className="w-10 h-10 flex items-center justify-center text-[#007AFF] tap-feedback bg-[rgba(120,120,128,0.1)] rounded-full"
            >
              {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
            </button>
            
            <button onClick={() => { triggerHaptic('light'); showToast("No new alerts"); }} className="tap-feedback" style={{ color: 'var(--text-secondary)' }}><Bell size={24} /></button>
            
            <div 
              onClick={() => { triggerHaptic('light'); }}
              className="w-8 h-8 rounded-full bg-slate-200 overflow-hidden cursor-pointer tap-feedback border-[0.5px] border-[rgba(0,0,0,0.1)] shadow-sm"
            >
              <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${isDarkMode ? 'night' : 'day'}`} alt="user" />
            </div>
          </div>
        </div>
      </header>

      <main className="flex-1 overflow-y-auto pt-4 pb-32 px-5 custom-scrollbar relative">
        <div className="mb-8 max-w-2xl mx-auto w-full">
          <div 
            onClick={() => { triggerHaptic('heavy'); setShowAiModal(true); }}
            className="search-bar-ios flex items-center gap-2 px-4 py-1 cursor-pointer hover:bg-[rgba(120,120,128,0.18)] transition-all group shadow-sm border-[0.5px] border-[rgba(0,0,0,0.05)]"
          >
            <Search size={18} style={{ color: 'var(--text-tertiary)' }} />
            <span className="text-[17px] body-text" style={{ color: 'var(--text-tertiary)' }}>Ask Lucky Intelligence...</span>
            <div 
              onClick={(e) => { e.stopPropagation(); toggleVoice(); }}
              className="ml-auto p-1.5 rounded-full tap-feedback"
            >
              <Mic size={18} className={`${isListening ? 'text-[#FF3B30] animate-pulse' : ''}`} style={{ color: isListening ? '#FF3B30' : 'var(--text-tertiary)' }} />
            </div>
          </div>
        </div>
        
        <div className="max-w-4xl mx-auto">
          {children}
        </div>
      </main>

      {showAiModal && (
        <div className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-md flex items-end sm:items-center justify-center p-0 sm:p-4 animate-in fade-in duration-300">
          <div 
            className="w-full max-w-[600px] rounded-t-[28px] sm:rounded-[28px] shadow-2xl animate-in slide-in-from-bottom-full sm:zoom-in-95 duration-400 flex flex-col max-h-[85vh] sm:max-h-[80vh] overflow-hidden border-none sm:fixed sm:top-1/2 sm:-translate-y-1/2"
            style={{ backgroundColor: 'var(--ios-modal-bg)', border: '0.5px solid var(--separator)' }}
          >
            {/* Modal Header */}
            <div className="p-5 flex items-center justify-between border-b var(--separator) shrink-0">
              <button onClick={closeModals} className="text-[#007AFF] headline tap-feedback">Cancel</button>
              <h2 className="headline">Discovery AI</h2>
              <button disabled={!aiQuery} onClick={() => handleAiSearch()} className="text-[#007AFF] headline disabled:opacity-30 tap-feedback">Search</button>
            </div>

            {/* Modal Content Container */}
            <div className="flex flex-col flex-1 overflow-hidden">
              {/* Fixed Search Bar at Top of Content */}
              <div className="p-5 pb-2 shrink-0">
                <div className="search-bar-ios flex items-center gap-2 px-4 relative z-20">
                  <Search size={18} style={{ color: 'var(--text-tertiary)' }} />
                  <input 
                    ref={inputRef} 
                    autoFocus 
                    type="text" 
                    value={aiQuery} 
                    onChange={(e) => setAiQuery(e.target.value)}
                    onFocus={() => setIsInputFocused(true)}
                    placeholder="E.g. Which plans are churning most?"
                    className="w-full bg-transparent outline-none h-full text-[17px] py-3"
                    onKeyDown={(e) => e.key === 'Enter' && handleAiSearch()}
                  />
                  {aiQuery && <button onClick={() => setAiQuery('')}><CircleX size={16} style={{ color: 'var(--text-quaternary)' }} /></button>}
                </div>
              </div>

              {/* Scrollable Results Area */}
              <div className="flex-1 overflow-y-auto custom-scrollbar px-5 pb-10" onClick={() => setIsInputFocused(false)}>
                {isInputFocused && !aiResponse && !isAiLoading ? (
                  <div className="space-y-1 animate-in slide-in-from-top-2 duration-300">
                    <p className="caption-2 mb-3 mt-2 opacity-60">Recent & Suggested</p>
                    <div className="space-y-1">
                      {recentSearches.map((s, idx) => (
                        <button 
                          key={idx} 
                          onMouseDown={(e) => { e.preventDefault(); handleAiSearch(undefined, s); }} 
                          className="w-full text-left px-4 py-4 rounded-[16px] bg-[rgba(120,120,128,0.08)] hover:bg-[rgba(120,120,128,0.15)] flex items-center justify-between group tap-feedback transition-colors"
                        >
                          <span className="body-text" style={{ color: 'var(--system-blue)' }}>{s}</span>
                          <ArrowRight size={16} style={{ color: 'var(--text-quaternary)' }} className="group-hover:text-[#007AFF] transition-colors" />
                        </button>
                      ))}
                    </div>
                  </div>
                ) : isAiLoading ? (
                  <div className="flex flex-col items-center justify-center py-20 gap-6">
                    <div className="relative">
                       <div className="w-16 h-16 border-4 border-[rgba(120,120,128,0.1)] border-t-[#FF9500] rounded-full animate-spin"></div>
                       <Sparkles size={24} className="absolute inset-0 m-auto text-[#FFCC00] animate-pulse" />
                    </div>
                    <div className="text-center space-y-1">
                      <p className="headline">{loadingMessage}</p>
                      <p className="caption-2 opacity-60">Cross-referencing behavior & revenue datasets</p>
                    </div>
                  </div>
                ) : aiResponse ? (
                  <div className="animate-in fade-in duration-500 pt-4 pb-20">
                    {renderResponse(aiResponse)}
                    
                    <div className="mt-8 pt-8 border-t border-[rgba(0,0,0,0.05)] flex flex-col gap-3">
                      <div className="flex gap-2">
                        <button 
                          onClick={() => { triggerHaptic('medium'); navigate('/health'); closeModals(); }} 
                          className="flex-1 h-14 bg-[rgba(120,120,128,0.1)] rounded-[14px] headline text-[#007AFF] tap-feedback flex items-center justify-center gap-2"
                        >
                          <Users size={18} /> View Accounts
                        </button>
                        <button 
                          onClick={() => { triggerHaptic('medium'); showToast("Data export initiated"); }} 
                          className="flex-1 h-14 bg-[rgba(120,120,128,0.1)] rounded-[14px] headline text-[#007AFF] tap-feedback flex items-center justify-center gap-2"
                        >
                          <DownloadIcon size={18} /> Export Results
                        </button>
                      </div>
                      <button 
                        onClick={handleCopy} 
                        className={`w-full h-14 rounded-[14px] headline text-white tap-feedback flex items-center justify-center gap-2 transition-all ${isCopied ? 'bg-[#34C759]' : 'bg-[#007AFF]'}`}
                      >
                        {isCopied ? <CheckCircle2 size={18} /> : <Copy size={18} />}
                        {isCopied ? 'Intelligence Copied' : 'Copy Response'}
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="py-20 text-center space-y-4">
                     <div className="w-20 h-20 bg-gradient-to-br from-[#FF9500]/20 to-[#FFCC00]/20 rounded-[24px] flex items-center justify-center mx-auto text-[#FF9500]">
                        <MessageSquare size={36} />
                     </div>
                     <div>
                        <p className="headline text-[20px]">How can I help you scale today?</p>
                        <p className="body-text px-12" style={{ color: 'var(--text-tertiary)' }}>Ask about account health, revenue churn, or product adoption trends.</p>
                     </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      <nav className="shrink-0 fixed bottom-0 left-0 right-0 z-[60] h-[83px] glass border-t-[0.5px] border-[rgba(0,0,0,0.1)] shadow-none" style={{ background: 'var(--ios-tab-bg)' }}>
        <div className="flex items-start justify-around pt-2 px-2 max-w-lg mx-auto">
          {NAVIGATION.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <NavLink 
                key={item.path} 
                to={item.path}
                onClick={() => triggerHaptic('medium')}
                className={() => `flex flex-col items-center gap-1 transition-all w-[72px] tap-feedback ${isActive ? 'text-[#FF9500]' : ''}`}
                style={({ isActive }) => ({
                  color: isActive ? '#FF9500' : 'var(--text-secondary)'
                })}
              >
                <div className={`h-8 w-8 flex items-center justify-center transition-all`}>
                  {React.cloneElement(item.icon as React.ReactElement, { size: 28, strokeWidth: isActive ? 2.5 : 2 })}
                </div>
                <span className={`text-[11px] font-normal tracking-[0.06em] leading-none`}>
                  {item.name.split(' ')[0]}
                </span>
              </NavLink>
            );
          })}
        </div>
      </nav>

      {toast && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-[100] glass px-5 py-2.5 rounded-full shadow-2xl animate-in slide-in-from-top-4 duration-300 border-[0.5px] border-[rgba(0,0,0,0.05)]">
          <span className="headline text-[15px]">{toast}</span>
        </div>
      )}
    </div>
  );
};

export default Layout;
