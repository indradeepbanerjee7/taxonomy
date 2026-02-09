
import React, { useState, useEffect, useMemo } from 'react';
import { ProductData, AnalysisResult, CompanyTheme } from '../types';
import { analyzeSku } from '../services/gemini';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface Step3Props {
  skuId: string;
  csvData: ProductData[];
  guidelineImages: { inlineData: { data: string; mimeType: string } }[];
  guidelineText?: string;
  companyTheme: CompanyTheme;
  logoUrl: string | null;
  onReset: () => void;
}

const Step3Analysis: React.FC<Step3Props> = ({ skuId, csvData, guidelineImages, guidelineText, companyTheme, logoUrl, onReset }) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);
  const [approved, setApproved] = useState(false);
  const [viewMode, setViewMode] = useState<'table' | 'box'>('box');

  const targetSku = useMemo(() => csvData.find(d => d.sku_id === skuId), [csvData, skuId]);
  
  const topCompetitors = useMemo(() => {
    if (!targetSku) return [];
    return csvData
      .filter(d => d.universe === targetSku.universe && d.sku_id !== skuId)
      .sort((a, b) => (parseFloat(a.avg_rank_category) || 999) - (parseFloat(b.avg_rank_category) || 999))
      .slice(0, 3);
  }, [csvData, targetSku, skuId]);

  const optimizedSku = useMemo(() => {
    if (!targetSku || !analysis) return null;
    return {
      ...targetSku,
      title: analysis.topEdits.title,
      bullets: analysis.topEdits.bullets,
      description_filled: analysis.topEdits.description,
    };
  }, [targetSku, analysis]);

  const imageUrls = useMemo(() => {
    if (!targetSku?.image_url) return [];
    try {
      const parsed = JSON.parse(targetSku.image_url.replace(/'/g, '"'));
      return Array.isArray(parsed) ? parsed : [targetSku.image_url];
    } catch {
      return [targetSku.image_url];
    }
  }, [targetSku]);

  useEffect(() => {
    const performAnalysis = async () => {
      if (!targetSku) return;
      setLoading(true);
      try {
        const result = await analyzeSku(targetSku, topCompetitors, guidelineImages, companyTheme.name, guidelineText);
        setAnalysis(result);
      } catch (err) {
        setError("Telemetry uplink interrupted. Aborting mission.");
      } finally {
        setLoading(false);
      }
    };
    performAnalysis();
  }, [targetSku, topCompetitors, guidelineImages, guidelineText, companyTheme.name]);

  const downloadCsvRow = () => {
    if (!optimizedSku) return;
    const headers = Object.keys(optimizedSku);
    const values = Object.values(optimizedSku).map(val => `"${String(val).replace(/"/g, '""')}"`);
    const csvContent = `${headers.join(',')}\n${values.join(',')}`;
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", `optimized_sku_${skuId}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (loading) return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-12 text-center animate-pulse">
      <div className="relative">
        <div className="w-32 h-32 border-8 border-white/5 border-t-cyan-400 rounded-full animate-spin"></div>
        <div className="absolute inset-0 flex items-center justify-center text-cyan-400 font-black text-2xl italic">AI</div>
      </div>
      <div className="space-y-4">
        <h3 className="text-5xl font-black text-white uppercase italic tracking-tighter high-contrast-text leading-none">Scanning Marketplace Universe</h3>
        <p className="text-slate-500 font-black uppercase text-[10px] tracking-[0.5em]">Benchmarking Competitor Telemetry</p>
      </div>
    </div>
  );

  if (error || !analysis || !targetSku) return (
    <div className="max-w-xl mx-auto glass-card p-16 rounded-[4rem] text-center border-red-500/20 shadow-2xl space-y-8">
      <div className="text-red-500 text-6xl">⚠</div>
      <h3 className="text-3xl font-black text-white uppercase italic tracking-tight">Critical Malfunction</h3>
      <p className="text-slate-400 font-bold">{error || "Signal lost in deep space."}</p>
      <button onClick={onReset} className="px-12 py-4 bg-white text-slate-950 rounded-2xl font-black uppercase text-xs tracking-[0.2em] hover:scale-105 transition-all">Re-Ignite Engine</button>
    </div>
  );

  return (
    <div className="space-y-16 animate-fadeIn pb-32">
      {/* Dynamic Report Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8 border-b border-white/5 pb-12">
        <div className="flex items-center space-x-8">
          {logoUrl && (
            <div className="bg-white p-3 rounded-2xl shadow-[0_0_30px_rgba(255,255,255,0.2)]">
               <img src={logoUrl} alt="Retailer" className="h-14 w-auto object-contain" />
            </div>
          )}
          <div className="space-y-1">
            <h2 className="text-6xl font-black text-white tracking-tighter uppercase italic high-contrast-text leading-none">Intelligence Report</h2>
            <p className="text-cyan-400 font-black uppercase text-[10px] tracking-[0.5em]">Protocol ID: {skuId} // Sector: {targetSku.universe}</p>
          </div>
        </div>
        <button 
          onClick={() => window.print()}
          className="bg-white text-slate-950 px-10 py-5 rounded-[1.5rem] font-black uppercase text-[10px] tracking-[0.3em] shadow-2xl hover:scale-105 transition-all flex items-center space-x-3 group print:hidden"
        >
          <svg className="w-5 h-5 group-hover:animate-bounce" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a2 2 0 002 2h12a2 2 0 002-2v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
          <span>Extract Data PDF</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
        {/* Readiness Core */}
        <div className="glass-card p-12 rounded-[3.5rem] flex flex-col items-center justify-center text-center relative overflow-hidden group">
          <div className="absolute inset-0 bg-cyan-500/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
          <div className="relative w-48 h-48 mb-8">
            <svg className="w-full h-full transform -rotate-90">
              <circle cx="96" cy="96" r="88" stroke="currentColor" strokeWidth="16" fill="transparent" className="text-white/5" />
              <circle 
                cx="96" cy="96" r="88" stroke="currentColor" strokeWidth="16" fill="transparent" 
                className="text-cyan-400"
                strokeDasharray={553} strokeDashoffset={553 - (553 * analysis.score) / 100}
                strokeLinecap="round"
                style={{ filter: 'drop-shadow(0 0 10px rgba(0, 242, 255, 0.5))' }}
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-6xl font-black text-white tracking-tighter leading-none">{analysis.score}</span>
              <span className="text-[10px] text-slate-500 font-black uppercase tracking-widest mt-1">Efficiency</span>
            </div>
          </div>
          <div className="space-y-1">
            <p className={`text-2xl font-black uppercase italic tracking-tight ${analysis.score > 70 ? 'text-cyan-400' : 'text-orange-400'}`}>
              {analysis.score > 85 ? 'Market Titan' : analysis.score > 70 ? 'Strong Contender' : 'Signal Drift'}
            </p>
            <p className="text-[10px] text-slate-600 font-black uppercase tracking-[0.3em]">Optimization Readiness</p>
          </div>
        </div>

        {/* Benchmarking Visualization */}
        <div className="lg:col-span-3 glass-card p-12 rounded-[3.5rem] relative">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-4">
            <h3 className="text-2xl font-black text-white uppercase italic tracking-tighter leading-none">Market Matrix Benchmark</h3>
            <div className="flex gap-8">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 rounded-full bg-cyan-400"></div>
                <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Target SKU</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 rounded-full bg-white/10"></div>
                <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Category Leaders</span>
              </div>
            </div>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={analysis.comparison} barGap={12}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="metric" tick={{fontSize: 9, fontWeight: 900, fill: '#475569'}} axisLine={false} tickLine={false} />
                <YAxis hide />
                <Tooltip 
                   cursor={{fill: 'rgba(255,255,255,0.03)'}}
                   contentStyle={{ background: '#020617', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '16px', fontSize: '10px', color: 'white' }}
                />
                <Bar dataKey="skuValue" fill="var(--neon-cyan)" radius={[8, 8, 0, 0]} name="Internal" />
                <Bar dataKey="competitorAvg" fill="rgba(255,255,255,0.1)" radius={[8, 8, 0, 0]} name="Market" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Recommended Adjustments */}
      <div className="space-y-10">
        <h3 className="text-4xl font-black text-white uppercase italic tracking-tighter text-center high-contrast-text">Neural Content recommendations</h3>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          <EditCard title="Prime Title SEO" content={analysis.topEdits.title} tag="Asset // Title" companyTheme={companyTheme} />
          <EditCard title="Conversion Bullets" content={analysis.topEdits.bullets} tag="Asset // Feature" companyTheme={companyTheme} />
          <EditCard title="Deep Description" content={analysis.topEdits.description} tag="Asset // Detail" companyTheme={companyTheme} />
        </div>
      </div>

      {/* Compliance Protocol */}
      <div className="glass-card p-16 rounded-[4rem] relative overflow-hidden bg-slate-950/80">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-cyan-500/5 rounded-full blur-[100px] -mr-64 -mt-64 -z-10"></div>
        
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-16 gap-8">
          <div className="space-y-2">
            <h3 className="text-4xl font-black text-white uppercase italic tracking-tighter leading-none">Compliance Integrity Audit</h3>
            <p className="text-slate-500 font-black uppercase text-[10px] tracking-[0.5em]">Validating against Marketplace Protocol</p>
          </div>
          <div className="px-6 py-3 rounded-2xl bg-white/5 border border-white/10 flex items-center space-x-3">
            <div className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse"></div>
            <span className="text-[10px] font-black uppercase tracking-widest text-cyan-400">Neural Sync Active</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          {analysis.complianceCheck.map((check, i) => (
            <div key={i} className="bg-white/5 p-8 rounded-3xl border border-white/5 hover:border-white/20 transition-all space-y-4">
               <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-xl ${check.status === 'pass' ? 'bg-green-500/20 text-green-400 shadow-[0_0_20px_rgba(34,197,94,0.2)]' : 'bg-red-500/20 text-red-400 shadow-[0_0_20px_rgba(239,68,68,0.2)]'}`}>
                 {check.status === 'pass' ? '✓' : '⚠'}
               </div>
               <p className="text-sm font-bold text-white leading-tight">{check.issue}</p>
               <div className={`text-[9px] font-black uppercase tracking-widest ${check.status === 'pass' ? 'text-green-500' : 'text-red-500'}`}>
                 {check.status === 'pass' ? 'Requirement Satisfied' : 'Action Mandatory'}
               </div>
            </div>
          ))}
        </div>

        {!approved ? (
          <button 
            onClick={() => setApproved(true)}
            className="w-full py-6 rounded-[2rem] bg-cyan-400 text-slate-950 font-black uppercase text-sm tracking-[0.5em] shadow-[0_0_40px_rgba(0,242,255,0.3)] transition-all hover:scale-[1.01] active:scale-95"
          >
            Authorize Asset Generation
          </button>
        ) : (
          <div className="space-y-12 animate-scaleIn">
             {/* Final Optimized Record Controls */}
             <div className="flex flex-col md:flex-row justify-between items-end gap-6">
               <div className="space-y-2">
                 <h4 className="text-2xl font-black text-cyan-400 uppercase italic tracking-tighter leading-none">Optimized Taxonomy Record</h4>
                 <p className="text-slate-600 font-black uppercase text-[10px] tracking-widest">Unit Status: Ready for Production</p>
               </div>
               <div className="flex space-x-4">
                 <div className="flex bg-white/5 rounded-2xl p-1 border border-white/10">
                   <button 
                     onClick={() => setViewMode('box')}
                     className={`px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${viewMode === 'box' ? 'bg-white text-slate-950' : 'text-slate-500 hover:text-white'}`}
                   >
                     Box View
                   </button>
                   <button 
                     onClick={() => setViewMode('table')}
                     className={`px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${viewMode === 'table' ? 'bg-white text-slate-950' : 'text-slate-500 hover:text-white'}`}
                   >
                     Table View
                   </button>
                 </div>
                 <button 
                    onClick={downloadCsvRow}
                    className="flex items-center space-x-2 px-6 py-3 bg-cyan-400 text-slate-950 rounded-2xl font-black uppercase text-[10px] tracking-[0.2em] shadow-lg hover:scale-105 transition-all"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a2 2 0 002 2h12a2 2 0 002-2v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
                    <span>Download CSV</span>
                  </button>
               </div>
             </div>

             {/* Optimized Taxonomy Record - View Switching */}
             {viewMode === 'box' ? (
                <div className="glass-card p-12 rounded-[3rem] border border-cyan-500/20 bg-cyan-500/5 grid grid-cols-1 md:grid-cols-3 gap-12">
                   <div className="space-y-6">
                      <div className="aspect-square bg-white rounded-3xl p-4 shadow-2xl relative overflow-hidden flex items-center justify-center">
                         {imageUrls.length > 0 ? (
                            <img src={imageUrls[0]} alt="Optimized Asset" className="max-h-full object-contain" />
                         ) : (
                            <div className="text-slate-300 font-black text-xs">NO ASSET IMAGE</div>
                         )}
                         <div className="absolute top-4 right-4 bg-cyan-400 text-slate-950 px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest">Optimized</div>
                      </div>
                      <div className="flex gap-2 overflow-x-auto pb-2">
                        {imageUrls.slice(1).map((url, i) => (
                           <div key={i} className="w-16 h-16 bg-white rounded-xl p-1 flex-shrink-0 border border-white/10 overflow-hidden">
                              <img src={url} className="w-full h-full object-contain" />
                           </div>
                        ))}
                      </div>
                   </div>
                   <div className="md:col-span-2 space-y-8">
                      <div className="space-y-2">
                         <span className="text-[10px] font-black text-cyan-400 uppercase tracking-[0.3em]">Telemetry ID: {skuId}</span>
                         <h5 className="text-2xl font-black text-white leading-tight uppercase tracking-tight">{analysis.topEdits.title}</h5>
                      </div>
                      <div className="space-y-4">
                         <h6 className="text-[10px] font-black text-slate-500 uppercase tracking-widest border-b border-white/10 pb-2">Enhanced Features</h6>
                         <p className="text-xs font-medium text-slate-300 leading-relaxed whitespace-pre-wrap">{analysis.topEdits.bullets}</p>
                      </div>
                      <div className="space-y-4">
                         <h6 className="text-[10px] font-black text-slate-500 uppercase tracking-widest border-b border-white/10 pb-2">Optimized Narratives</h6>
                         <p className="text-xs font-medium text-slate-300 leading-relaxed whitespace-pre-wrap">{analysis.topEdits.description}</p>
                      </div>
                      <div className="grid grid-cols-2 gap-4 pt-4 border-t border-white/10">
                        <div>
                           <p className="text-[9px] font-black text-slate-600 uppercase tracking-widest">Category Node</p>
                           <p className="text-xs font-bold text-white uppercase">{targetSku.retailer_category_node}</p>
                        </div>
                        <div>
                           <p className="text-[9px] font-black text-slate-600 uppercase tracking-widest">Brand Protocol</p>
                           <p className="text-xs font-bold text-white uppercase">{targetSku.retailer_brand_name}</p>
                        </div>
                      </div>
                   </div>
                </div>
             ) : (
                <div className="glass-card rounded-[2rem] overflow-hidden border border-white/10">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left">
                      <thead className="bg-white/5 border-b border-white/10">
                        <tr>
                          {Object.keys(targetSku).map((key) => (
                            <th key={key} className="px-6 py-4 text-[9px] font-black text-slate-500 uppercase tracking-widest border-r border-white/5">{key}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        <tr className="bg-cyan-500/5">
                          {optimizedSku && Object.entries(optimizedSku).map(([key, value], idx) => {
                            const isChanged = ['title', 'bullets', 'description_filled'].includes(key);
                            return (
                              <td key={idx} className={`px-6 py-4 text-[10px] border-r border-white/5 max-w-[200px] truncate ${isChanged ? 'text-cyan-400 font-black' : 'text-slate-400 font-medium'}`}>
                                {String(value)}
                              </td>
                            );
                          })}
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
             )}
             <p className="text-[9px] text-slate-600 font-black uppercase tracking-[0.2em] italic">* All optimized fields are merged into original telemetry row. Unchanged fields are preserved.</p>

             {/* Final Markdown Summary */}
             <div className="bg-white/5 p-12 rounded-[3rem] border border-white/10 space-y-8">
                <div className="flex justify-between items-center">
                    <h4 className="text-2xl font-black text-cyan-400 uppercase italic tracking-tighter">Verified Content Stream</h4>
                    <button 
                      onClick={() => {
                        const txt = document.getElementById('final-md')?.innerText;
                        if(txt) navigator.clipboard.writeText(txt);
                        alert('Copied to neuro-buffer');
                      }}
                      className="text-[10px] font-black text-slate-500 uppercase tracking-widest hover:text-white"
                    >
                      Copy All
                    </button>
                </div>
                <pre id="final-md" className="bg-slate-950 p-10 rounded-3xl border border-white/5 text-sm font-mono text-slate-300 whitespace-pre-wrap leading-relaxed max-h-[500px] overflow-auto">
{`# POWER TAXONOMY REPORT // ID: ${skuId}
# RETAILER PROTOCOL: ${companyTheme.name.toUpperCase()}

---

### [OPTIMIZED_TITLE]
${analysis.topEdits.title}

---

### [ENHANCED_VALUE_PROPOSITIONS]
${analysis.topEdits.bullets}

---

### [CONVERSION_NARRATIVE]
${analysis.topEdits.description}

---

// COMPLIANCE SIGNATURE: AI_CORE_VERIFIED
// END OF STREAM.`}
                </pre>
             </div>
          </div>
        )}
      </div>
    </div>
  );
};

const LegendItem = ({ color, label }: any) => (
  <div className="flex items-center space-x-2">
    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: color }}></div>
    <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{label}</span>
  </div>
);

const EditCard = ({ title, content, tag, companyTheme }: any) => (
  <div className="glass-card p-10 rounded-[3rem] flex flex-col h-full group hover:-translate-y-4 transition-all hover:shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
    <div className="flex justify-between items-start mb-8">
      <h4 className="text-xl font-black text-white uppercase italic tracking-tighter leading-none">{title}</h4>
      <span className="text-[9px] font-black bg-white/5 px-3 py-1 rounded-full text-slate-500 uppercase tracking-widest">{tag}</span>
    </div>
    <div className="flex-grow bg-slate-950/50 p-8 rounded-3xl border border-white/5 relative mb-8">
      <div className="absolute top-4 right-6 text-white/5 font-black text-7xl select-none leading-none">"</div>
      <p className="text-xs font-bold text-slate-400 leading-relaxed italic relative z-10 group-hover:text-white transition-colors">
        {content}
      </p>
    </div>
    <button className="w-full py-4 border border-white/10 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 hover:bg-white hover:text-slate-950 transition-all">
      Extract Asset
    </button>
  </div>
);

export default Step3Analysis;
