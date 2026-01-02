
import React, { useState, useMemo, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { MOCK_HEALTH_ACCOUNTS } from '../constants';
// Added CircleX to the lucide-react imports
import { Filter, ChevronRight, ChevronDown, ArrowUpDown, ShieldCheck, AlertCircle, Info, Search, Download, X, RefreshCw, Layers, CircleX } from 'lucide-react';
import { useToast } from '../components/Layout';
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Cell, Tooltip } from 'recharts';

type SortKey = 'mrr' | 'healthScore' | 'lastActive';
type SortOrder = 'asc' | 'desc';

const CustomerHealth: React.FC = () => {
  const { showToast } = useToast();
  const location = useLocation();
  
  // State for filtering and sorting
  const [searchTerm, setSearchTerm] = useState('');
  const [filterPlan, setFilterPlan] = useState<string>('All');
  const [filterIndustry, setFilterIndustry] = useState<string>('All');
  const [sortKey, setSortKey] = useState<SortKey>('healthScore');
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc');
  const [expandedAccountId, setExpandedAccountId] = useState<string | null>(null);
  const [isExporting, setIsExporting] = useState(false);

  // Handle cross-page filtering from Insight navigation
  useEffect(() => {
    const navState = location.state as any;
    if (navState?.filters) {
      if (navState.filters.plan) setFilterPlan(navState.filters.plan);
      if (navState.filters.risk) showToast(`✓ Auto-filtered for ${navState.filters.risk} risk accounts`);
      if (navState.filters.health === 'Low') {
        setSortKey('healthScore');
        setSortOrder('asc');
      }
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

  // Filter and Sort Logic
  const processedAccounts = useMemo(() => {
    let result = MOCK_HEALTH_ACCOUNTS.filter(acc => {
      const planMatch = filterPlan === 'All' || acc.plan === filterPlan;
      const industryMatch = filterIndustry === 'All' || acc.industry === filterIndustry;
      const searchMatch = acc.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          acc.drivers.some(d => d.toLowerCase().includes(searchTerm.toLowerCase()));
      return planMatch && industryMatch && searchMatch;
    });

    const sorted = [...result].sort((a, b) => {
      let valA = a[sortKey];
      let valB = b[sortKey];
      if (valA < valB) return sortOrder === 'asc' ? -1 : 1;
      if (valA > valB) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    });

    return sorted;
  }, [filterPlan, filterIndustry, searchTerm, sortKey, sortOrder]);

  const handleExport = () => {
    setIsExporting(true);
    showToast("Preparing detailed CSV export...");
    setTimeout(() => {
      setIsExporting(false);
      showToast("✓ Health_Accounts_Report.csv ready!");
    }, 2000);
  };

  const clearFilters = () => {
    setFilterPlan('All');
    setFilterIndustry('All');
    setSearchTerm('');
    showToast("✓ All filters reset to default");
  };

  const toggleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortKey(key);
      setSortOrder('desc');
    }
  };

  return (
    <div className="space-y-6 pb-6 animate-in fade-in duration-500">
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
           <div className="flex items-center gap-4">
             <h2 className="text-[28px] font-black tracking-tight text-slate-900">Health</h2>
             <button 
               onClick={handleExport}
               disabled={isExporting}
               className={`flex items-center gap-2 px-4 py-2 bg-[#f26522]/10 text-[#f26522] rounded-xl text-xs font-black transition-all hover:bg-[#f26522]/20 active:scale-95 shadow-sm ${isExporting ? 'opacity-50 cursor-not-allowed' : ''}`}
             >
               {isExporting ? <RefreshCw className="animate-spin" size={14} /> : <Download size={14} />}
               Export Detailed CSV
             </button>
           </div>
           <div className="flex gap-2">
             <button 
               onClick={() => showToast("Advanced filters opening...")} 
               className="p-3.5 bg-white border border-slate-200 shadow-sm rounded-2xl text-slate-600 active:bg-slate-50 transition-all relative group hover:border-[#f26522]"
             >
               <Filter size={22} className="group-hover:text-[#f26522] transition-colors" />
               {activeFilterCount > 0 && (
                 <span className="absolute -top-2 -right-2 w-7 h-7 bg-[#f26522] text-white text-[12px] font-black rounded-full flex items-center justify-center border-4 border-[#f9fafb] shadow-md animate-in zoom-in">
                   {activeFilterCount}
                 </span>
               )}
             </button>
           </div>
        </div>

        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-slate-400" />
          </div>
          <input
            type="text"
            className="block w-full pl-12 pr-12 py-4 bg-white border border-slate-200 rounded-[22px] leading-5 text-[16px] placeholder-slate-400 focus:outline-none focus:ring-4 focus:ring-[#f26522]/5 focus:border-[#f26522] transition-all shadow-sm"
            placeholder="Search accounts or health drivers..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          {searchTerm && (
            <button onClick={() => setSearchTerm('')} className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 active:text-slate-600 transition-colors">
              <CircleX size={20} />
            </button>
          )}
        </div>
      </div>

      <section className="space-y-4">
        <div className="flex justify-between items-center px-1">
          <label className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em]">Segmentation & Filtering</label>
          {activeFilterCount > 0 && (
            <button 
              onClick={clearFilters} 
              className="text-[12px] font-black text-white flex items-center gap-2 px-4 py-2 bg-slate-900 rounded-full animate-in slide-in-from-right-4 shadow-lg active:scale-95 transition-all"
            >
              <X size={14} strokeWidth={3} /> Clear All Filters
            </button>
          )}
        </div>
        
        <div className="flex flex-col gap-3">
          <div className="flex gap-2.5 overflow-x-auto pb-1 no-scrollbar px-1">
            {plans.map(p => (
              <button
                key={p}
                onClick={() => setFilterPlan(p)}
                className={`shrink-0 px-5 py-2.5 rounded-2xl text-[14px] font-bold transition-all border ${
                  filterPlan === p ? 'bg-[#f26522] text-white border-[#f26522] shadow-md' : 'bg-white text-slate-500 border-slate-200 hover:border-[#f26522]/40 active:bg-orange-50'
                }`}
              >
                {p}
              </button>
            ))}
          </div>
          <div className="flex gap-2.5 overflow-x-auto pb-1 no-scrollbar px-1">
            {industries.map(i => (
              <button
                key={i}
                onClick={() => setFilterIndustry(i)}
                className={`shrink-0 px-5 py-2.5 rounded-2xl text-[14px] font-bold transition-all border ${
                  filterIndustry === i ? 'bg-slate-900 text-white border-slate-900 shadow-md' : 'bg-white text-slate-500 border-slate-200 hover:border-slate-400 active:bg-slate-50'
                }`}
              >
                {i}
              </button>
            ))}
          </div>
        </div>
      </section>

      <div className="flex items-center justify-between px-5 text-[11px] font-black text-slate-400 uppercase tracking-widest">
        <button onClick={() => toggleSort('healthScore')} className={`flex items-center gap-1.5 transition-colors ${sortKey === 'healthScore' ? 'text-[#f26522]' : 'hover:text-slate-600'}`}>
          <Layers size={14} /> Health Index {sortKey === 'healthScore' && (sortOrder === 'asc' ? '↑' : '↓')}
        </button>
        <button onClick={() => toggleSort('mrr')} className={`flex items-center gap-1.5 transition-colors ${sortKey === 'mrr' ? 'text-[#f26522]' : 'hover:text-slate-600'}`}>
          <RefreshCw size={14} className={isExporting ? 'animate-spin' : ''} /> MRR Value {sortKey === 'mrr' && (sortOrder === 'asc' ? '↑' : '↓')}
        </button>
      </div>

      <div className="ios-card overflow-hidden border border-slate-100 shadow-sm">
        {processedAccounts.length > 0 ? (
          processedAccounts.map((account) => (
            <div key={account.id} className={`flex flex-col border-b border-slate-50 last:border-b-0 ${expandedAccountId === account.id ? 'bg-slate-50/50' : ''}`}>
              <div 
                onClick={() => setExpandedAccountId(expandedAccountId === account.id ? null : account.id)}
                className="flex items-center gap-5 p-6 active:bg-slate-50 transition-all cursor-pointer group"
              >
                <div className={`w-4 h-4 rounded-full shrink-0 ${
                  account.healthScore > 80 ? 'bg-emerald-500' : account.healthScore > 50 ? 'bg-orange-400' : 'bg-rose-500'
                } shadow-sm border-2 border-white ring-2 ring-slate-100 group-hover:scale-110 transition-transform`}></div>
                
                <div className="flex-1">
                  <div className="flex justify-between items-baseline">
                    <h4 className="text-[17px] font-bold text-slate-900 group-hover:text-[#f26522] transition-colors">{account.name}</h4>
                    <span className="text-[16px] font-black text-slate-800">${account.mrr.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between items-center mt-1.5">
                    <p className="text-[12px] text-slate-500 font-medium tracking-tight">{account.industry} • {account.plan}</p>
                    <div className="flex items-center gap-2">
                      <span className="text-[15px] font-black text-slate-900">{account.healthScore}%</span>
                      <ChevronRight size={16} className={`text-slate-300 transition-all ${expandedAccountId === account.id ? 'rotate-90 text-[#f26522]' : 'group-hover:text-[#f26522]'}`} />
                    </div>
                  </div>
                </div>
              </div>
              
              {expandedAccountId === account.id && (
                <div className="px-14 pb-6 animate-in slide-in-from-top-3 duration-300">
                  <div className="bg-white rounded-[24px] p-5 border border-slate-200 shadow-md">
                    <h5 className="text-[11px] font-black text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                      <AlertCircle size={14} className="text-[#f26522]" /> Vital Health Indicators
                    </h5>
                    <div className="flex flex-wrap gap-2.5">
                      {account.drivers.map((driver, dIdx) => (
                        <span key={dIdx} className="px-4 py-1.5 bg-slate-50 text-slate-800 text-[13px] font-bold rounded-xl border border-slate-100 hover:bg-orange-50 hover:border-orange-200 transition-all cursor-default">{driver}</span>
                      ))}
                    </div>
                    <div className="mt-5 pt-4 border-t border-slate-50 flex justify-between items-center text-[10px] text-slate-400 font-bold uppercase tracking-widest">
                      <span className="flex items-center gap-1.5"><RefreshCw size={10} /> Last Active Pulse</span>
                      <span className="text-slate-900 font-black">{account.lastActive}</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))
        ) : (
          <div className="p-20 text-center space-y-6">
            <div className="w-20 h-20 bg-slate-50 rounded-[32px] flex items-center justify-center mx-auto ring-8 ring-slate-50/50">
              <Search size={32} className="text-slate-300" />
            </div>
            <div>
              <p className="text-slate-900 font-black text-[20px] tracking-tight">Zero matching accounts</p>
              <p className="text-slate-500 text-sm mt-1 max-w-[240px] mx-auto">Try a different segment, industry, or reset your search query.</p>
            </div>
            <button 
              onClick={clearFilters}
              className="px-8 py-4 bg-slate-900 text-white rounded-[20px] font-black text-sm shadow-xl active:scale-95 transition-all uppercase tracking-widest"
            >
              Reset All Intelligence Filters
            </button>
          </div>
        )}
      </div>

      <div className="bg-slate-900 p-8 rounded-[32px] text-white flex gap-6 items-center shadow-2xl relative overflow-hidden group">
        <div className="absolute top-0 left-0 w-32 h-32 bg-orange-500/10 rounded-full blur-3xl -ml-16 -mt-16 group-hover:bg-orange-500/20 transition-all"></div>
        <div className="shrink-0 w-16 h-16 rounded-2xl bg-white/10 flex items-center justify-center text-orange-400 shadow-inner">
          <ShieldCheck size={36} />
        </div>
        <div className="flex-1 relative z-10">
          <h3 className="font-black text-[18px] tracking-tight">Active Pulse Sentinel</h3>
          <p className="text-[13px] text-slate-300 leading-relaxed mt-1">
            Monitoring {processedAccounts.length} accounts in real-time. System is searching for anomalies and churn signals based on your view.
          </p>
          <button 
            onClick={() => showToast("✓ Retention playbook dispatched")}
            className="mt-4 text-[12px] font-black uppercase tracking-widest bg-orange-500 text-white px-6 py-2.5 rounded-xl active:scale-95 transition-all shadow-lg shadow-orange-500/30"
          >
            Dispatch Recovery Plays
          </button>
        </div>
      </div>
    </div>
  );
};

export default CustomerHealth;
