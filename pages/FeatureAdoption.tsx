
import React from 'react';
import { MOCK_FEATURE_USAGE } from '../constants';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar
} from 'recharts';
import { useToast } from '../components/Layout';

const FeatureAdoption: React.FC = () => {
  const { showToast } = useToast();

  const handleFeatureClick = (feature: string) => {
    showToast(`Deep dive: ${feature} adoption metrics`);
  };

  return (
    <div className="space-y-6 pb-6">
      <div className="flex justify-between items-center">
        <h2 className="text-[28px] font-extrabold tracking-tight text-black">Adoption</h2>
        <div className="flex gap-2">
          <button 
            onClick={() => showToast("Filtering by Plan")}
            className="px-3 py-1 bg-white border border-slate-200 rounded-lg text-[12px] font-bold text-slate-600 active:bg-slate-50 transition-colors"
          >
            All Plans
          </button>
          <button 
            onClick={() => showToast("Filtering by Industry")}
            className="px-3 py-1 bg-white border border-slate-200 rounded-lg text-[12px] font-bold text-slate-600 active:bg-slate-50 transition-colors"
          >
            Industry
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6">
        <div className="bg-white p-6 rounded-[22px] shadow-sm border border-slate-100">
          <h3 className="font-bold text-black text-[15px] mb-6 flex items-center gap-2">
            Usage Engagement Index
          </h3>
          <div className="h-[280px]">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="80%" data={MOCK_FEATURE_USAGE}>
                <PolarGrid stroke="#f1f5f9" />
                <PolarAngleAxis dataKey="feature" tick={{fill: '#8e8e93', fontSize: 10, fontWeight: 700}} />
                <PolarRadiusAxis angle={30} domain={[0, 100]} hide />
                <Radar
                  name="Engagement"
                  dataKey="engagement"
                  stroke="#f26522"
                  fill="#f26522"
                  fillOpacity={0.6}
                />
                <Radar
                  name="Adoption"
                  dataKey="adoption"
                  stroke="#007aff"
                  fill="#007aff"
                  fillOpacity={0.3}
                />
                <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-6 rounded-[22px] shadow-sm border border-slate-100">
          <h3 className="font-bold text-black text-[15px] mb-2">Retention Correlation</h3>
          <p className="text-[12px] text-slate-500 mb-6 font-medium">Correlation score to customer stickiness.</p>
          <div className="space-y-5">
            {[...MOCK_FEATURE_USAGE]
              .sort((a, b) => b.correlationToRetention - a.correlationToRetention)
              .map((f) => (
                <div 
                  key={f.feature} 
                  className="flex items-center gap-4 cursor-pointer active:opacity-60 transition-opacity"
                  onClick={() => handleFeatureClick(f.feature)}
                >
                  <div className="w-24 shrink-0 text-[12px] font-bold text-slate-700 leading-tight">{f.feature}</div>
                  <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-[#007aff] rounded-full" 
                      style={{ width: `${f.correlationToRetention * 100}%` }}
                    ></div>
                  </div>
                  <div className="w-10 text-right text-[12px] font-black text-[#007aff]">{(f.correlationToRetention * 10).toFixed(1)}</div>
                </div>
              ))}
          </div>
          
          <div className="mt-8 p-4 bg-indigo-50 rounded-xl border border-indigo-100 flex gap-3">
             <div className="shrink-0 w-6 h-6 bg-[#007aff] rounded-full flex items-center justify-center text-white text-[10px] font-black italic">i</div>
             <p className="text-[12px] text-indigo-900 leading-snug font-medium">
               <span className="font-black text-black">Discovery AI</span> has the highest retention correlation (9.5/10). Targeted onboarding recommended.
             </p>
          </div>
        </div>
      </div>

      <div className="ios-card overflow-hidden">
        <div className="p-4 border-b border-slate-100">
          <h3 className="font-bold text-black text-[14px]">Adoption by Traffic Band</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50 text-slate-400 text-[10px] font-black uppercase tracking-widest border-b border-slate-100">
                <th className="px-4 py-3">Band</th>
                <th className="px-4 py-3">Recordings</th>
                <th className="px-4 py-3">Heatmaps</th>
                <th className="px-4 py-3 text-right">AI</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {[
                { band: 'Enterprise', r: '98%', h: '94%', a: '45%' },
                { band: 'Mid-Market', r: '92%', h: '88%', a: '22%' },
                { band: 'SMB', r: '85%', h: '62%', a: '8%' },
                { band: 'Micro', r: '62%', h: '45%', a: '3%' },
              ].map((row, i) => (
                <tr key={i} className="active:bg-slate-50 cursor-pointer transition-colors" onClick={() => showToast(`Segment: ${row.band}`)}>
                  <td className="px-4 py-4 text-[13px] font-bold text-black">{row.band}</td>
                  <td className="px-4 py-4 text-[13px] text-[#34c759] font-black">{row.r}</td>
                  <td className="px-4 py-4 text-[13px] text-[#34c759] font-black">{row.h}</td>
                  <td className="px-4 py-4 text-[13px] text-[#007aff] font-black text-right">{row.a}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default FeatureAdoption;
