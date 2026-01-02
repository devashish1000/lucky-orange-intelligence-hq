
import React, { useState, useMemo, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { MOCK_HEALTH_ACCOUNTS } from '../constants';
import { ChevronRight, Search, Download, X, CircleX, Loader2, ShieldCheck } from 'lucide-react';
import { useUI, useTheme } from '../App';

const Tooltip: React.FC<{ text: string; children: React.ReactNode }> = ({ text, children }) => {
  const [show, setShow] = useState(false);
  return (
    <div className="relative inline-block" onMouseEnter={() => setShow(true)} onMouseLeave={() => setShow(false)}>
      {children}
      {show && (
        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-1 bg-black/80 backdrop-blur-md text-white text-[11px] font-bold rounded-lg whitespace-nowrap z-[100] animate-in fade-in zoom-in-95 duration-200 shadow-xl">
          {text}
          <div className="absolute top-full left-1/2 -translate-x-1/2 border-8 border-transparent border-t-black/80"></div>
        </div>
      )}
    </div>
  );
};

const CustomerHealth: React.FC = () => {
  const { showToast, triggerHaptic } = useUI();
  const { isDarkMode } = useTheme();
  const location = useLocation();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterPlan, setFilterPlan] = useState<string>('All');
  const [filterIndustry, setFilterIndustry] = useState<string>('All');
  const [expandedAccountId, setExpandedAccountId] = useState<string | null>(null);
  const [isExporting, setIsExporting] = useState(false);
  const [exportProgress, setExportProgress] = useState(0);

  useEffect(() => {
    const navState = location.state as any;
    if (navState?.filters) {
      if (navState.filters.plan) setFilterPlan(navState.filters.plan);
      if (navState.filters.driver) setSearchTerm(navState.filters.driver);
    }
  }, [location.state]);

  const industries = useMemo(() => ['All', ...new Set(MOCK_HEALTH_ACCOUNTS.map(a => a.industry))], []);
  const plans = ['All', 'Enterprise', 'Pro', 'Basic'];

  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (filterPlan !== 'All') count++;
    if (filterIndustry !== 'All') count++;
    if (searchTerm !== '') count++;
    return count;
  }, [filterPlan, filterIndustry, searchTerm]);

  const processedAccounts = useMemo(() => {
    return MOCK_HEALTH_ACCOUNTS.filter(acc => {
      const planMatch = filterPlan === 'All' || acc.plan === filterPlan;
      const industryMatch = filterIndustry === 'All' || acc.industry === filterIndustry;
      const searchMatch = acc.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          acc.drivers.some(d => d.toLowerCase().includes(searchTerm.toLowerCase()));
      return planMatch && industryMatch && searchMatch;
    });
  }, [filterPlan, filterIndustry, searchTerm]);

  const handleExport = () => {
    setIsExporting(true);
    setExportProgress(0);
    triggerHaptic('medium');
    
    const interval = setInterval(() => {
      setExportProgress(p => {
        if (p >= 100) {
          clearInterval(interval);
          return 100;
        }
        return p + 20;
      });
    }, 300);

    setTimeout(() => {
      const timestamp = new Date().toISOString().split('T')[0];
      const headers = ['ID', 'Name', 'Plan', 'MRR', 'Health Score', 'Industry', 'Last Active'].join(',');
      const rows = processedAccounts.map(a => 
        [a.id, a.name, a.plan, a.mrr, a.healthScore, a.industry, a.lastActive].join(',')
      ).join('\n');
      const csvContent = "data:text/csv;charset=utf-8," + headers + "\n" + rows;
      const encodedUri = encodeURI(csvContent);
      const link = document.createElement("a");
      link.setAttribute("href", encodedUri);
      link.setAttribute("download", `Lucky_Orange_Customer_Health_${timestamp}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      setIsExporting(false);
      showToast("Report Downloaded Successfully");
    }, 1800);
  };

  const clearAllFilters = () => {
    triggerHaptic('light');
    setFilterPlan('All');
    setFilterIndustry('All');
    setSearchTerm('');
    showToast("Filters Cleared");
  };

  return (
    <div className="pb-24 apple-spring">
      <div className="text-left mb-6 px-1 flex justify-between items-start sm:items-end">
        <div>
          <h1 className="title-large page-title mb-1">Health</h1>
          <p className="caption-2 timestamp tracking-[0.06em]">Account Sentinels</p>
        </div>
        <button 
          onClick={handleExport}
          disabled={isExporting}
          className={`headline text-[#007AFF] tap-feedback flex items-center gap-1.5 h-10 px-3 bg-[#007AFF]/10 rounded-full transition-all ${isExporting ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          {isExporting ? <Loader2 className="animate-spin" size={16} /> : <Download size={18} />} 
          <span className="text-[15px] whitespace-nowrap">{isExporting ? `Exporting ${exportProgress}%` : 'Reports'}</span>
        </button>
      </div>

      <div className="search-bar-ios flex items-center gap-2 px-3 mb-6">
        <Search size={18} style={{ color: 'var(--text-tertiary)' }} />
        <input
          type="text"
          className="w-full bg-transparent outline-none h-full text-[17px] font-normal"
          placeholder="Search accounts or drivers..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        {searchTerm && (
          <button onClick={() => setSearchTerm('')} className="tap-feedback" style={{ color: 'var(--text-quaternary)' }}><CircleX size={18} /></button>
        )}
      </div>

      <section className="mb-6">
        <div className="flex justify-between items-center mb-4 px-1">
          <div className="flex items-center gap-2">
            <h3 className="headline section-header">Filters</h3>
            {activeFilterCount > 0 && (
              <span className="bg-[#FF9500] text-white text-[11px] font-bold px-2 py-0.5 rounded-full animate-in zoom-in">
                {activeFilterCount}
              </span>
            )}
          </div>
          {activeFilterCount > 0 && (
            <button 
              onClick={clearAllFilters} 
              className="text-[#FF3B30] caption-2 tap-feedback flex items-center gap-1 font-bold whitespace-nowrap"
            >
              <X size={14} /> Clear All
            </button>
          )}
        </div>
        
        <div className="space-y-4">
          <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
            {plans.map(p => (
              <Tooltip key={p} text={`Filter by ${p} Plan`}>
                <button
                  onClick={() => { triggerHaptic('light'); setFilterPlan(p); }}
                  className={`shrink-0 px-4 h-8 rounded-full text-[13px] font-semibold transition-all filter-chip ${
                    filterPlan === p ? 'bg-[#FF9500] !text-white shadow-sm' : ''
                  }`}
                >
                  {p}
                </button>
              </Tooltip>
            ))}
          </div>
          <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
            {industries.map(i => (
              <Tooltip key={i} text={`Industry: ${i}`}>
                <button
                  onClick={() => { triggerHaptic('light'); setFilterIndustry(i); }}
                  className={`shrink-0 px-4 h-8 rounded-full text-[13px] font-semibold transition-all filter-chip ${
                    filterIndustry === i ? 'bg-[#007AFF] !text-white shadow-sm' : ''
                  }`}
                >
                  {i}
                </button>
              </Tooltip>
            ))}
          </div>
        </div>
      </section>

      <div className="glass rounded-[20px] overflow-hidden shadow-none border-none mb-8">
        {processedAccounts.length > 0 ? (
          processedAccounts.map((account, idx) => (
            <div key={account.id} className={`flex flex-col ${idx !== 0 ? 'border-t-[0.5px] border-[rgba(0,0,0,0.05)]' : ''}`}>
              <div 
                onClick={() => { triggerHaptic('light'); setExpandedAccountId(expandedAccountId === account.id ? null : account.id); }}
                className="flex items-center gap-4 p-4 tap-feedback cursor-pointer group"
              >
                <div className={`w-3 h-3 rounded-full shrink-0 ${
                  account.healthScore > 80 ? 'bg-[#34C759]' : account.healthScore > 50 ? 'bg-[#FFCC00]' : 'bg-[#FF3B30]'
                } shadow-sm ring-4 ring-[rgba(0,0,0,0.02)]`}></div>
                
                <div className="flex-1 text-left min-w-0">
                  <div className="flex justify-between items-baseline gap-2">
                    <h4 className="headline company-name !font-medium text-[17px] truncate">{account.name}</h4>
                    <span className="headline company-mrr text-[17px] whitespace-nowrap">${account.mrr.toLocaleString()}</span>
                  </div>
                  <p className="caption-2 company-meta lowercase mt-1 truncate">{account.industry} • {account.healthScore}% health</p>
                </div>
                <ChevronRight size={20} className={`text-[rgba(60,60,67,0.2)] shrink-0 transition-all ${expandedAccountId === account.id ? 'rotate-90' : ''}`} />
              </div>
              
              {expandedAccountId === account.id && (
                <div className="px-11 pb-5 animate-in slide-in-from-top-2 duration-300 text-left">
                  <div className="bg-[rgba(120,120,128,0.05)] rounded-[12px] p-4">
                    <div className="flex flex-wrap gap-2">
                      {account.drivers.map((driver, dIdx) => (
                        <span 
                          key={dIdx} 
                          className="px-3 py-1.5 rounded-lg text-[11px] font-black uppercase tracking-widest shadow-sm border border-[rgba(0,0,0,0.05)] dark:border-[rgba(255,255,255,0.1)] transition-colors whitespace-nowrap"
                          style={{ 
                            backgroundColor: isDarkMode ? '#1F2937' : '#F3F4F6', 
                            color: isDarkMode ? '#F9FAFB' : '#111827' 
                          }}
                        >
                          {driver}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))
        ) : (
          <div className="py-20 text-center opacity-40">
            <Search size={40} className="mx-auto mb-2" />
            <p className="headline">No accounts found</p>
          </div>
        )}
      </div>

      <section className="glass rounded-[20px] p-6 text-left flex gap-4 items-center border-none">
        <div className="w-12 h-12 rounded-[12px] bg-[#34C759]/10 flex items-center justify-center text-[#34C759]">
          <ShieldCheck size={28} />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="headline section-header leading-tight truncate">System Sentinel</h3>
          <p className="caption-2 timestamp normal-case mt-1 truncate">Monitoring {processedAccounts.length} matching account segments.</p>
        </div>
        <ChevronRight size={20} className="opacity-20 shrink-0" />
      </section>
    </div>
  );
};

export default CustomerHealth;
