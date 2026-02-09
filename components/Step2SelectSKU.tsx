
import React, { useState, useMemo } from 'react';
import { ProductData, CompanyTheme } from '../types';

interface Step2Props {
  csvData: ProductData[];
  onNext: (skuId: string) => void;
  theme: CompanyTheme;
}

const Step2SelectSKU: React.FC<Step2Props> = ({ csvData, onNext, theme }) => {
  const [skuSearch, setSkuSearch] = useState('');
  const [filterBrand, setFilterBrand] = useState('');
  const [filterUniverse, setFilterUniverse] = useState('');
  const [showFilters, setShowFilters] = useState(true);

  const brands = useMemo(() => Array.from(new Set(csvData.map(d => d.retailer_brand_name).filter(Boolean))), [csvData]);
  const universes = useMemo(() => Array.from(new Set(csvData.map(d => d.universe).filter(Boolean))), [csvData]);

  const filteredData = useMemo(() => {
    return csvData.filter(item => {
      const matchSearch = (item.sku_id || '').toLowerCase().includes(skuSearch.toLowerCase()) || 
                          (item.title || '').toLowerCase().includes(skuSearch.toLowerCase());
      const matchBrand = !filterBrand || item.retailer_brand_name === filterBrand;
      const matchUniverse = !filterUniverse || item.universe === filterUniverse;
      return matchSearch && matchBrand && matchUniverse;
    });
  }, [csvData, skuSearch, filterBrand, filterUniverse]);

  return (
    <div className="max-w-7xl mx-auto space-y-12 animate-fadeIn">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div className="space-y-2">
          <h2 className="text-6xl font-black text-white tracking-tighter uppercase italic high-contrast-text leading-none">Catalog Scan</h2>
          <p className="text-cyan-400 font-black uppercase text-[10px] tracking-[0.4em]">Index: {csvData.length} Units // Detected: {universes.length} Universes</p>
        </div>
        <button 
          onClick={() => setShowFilters(!showFilters)}
          className={`px-8 py-3 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] transition-all flex items-center space-x-3 border ${showFilters ? 'bg-white text-slate-950 border-white' : 'bg-transparent text-white border-white/20'}`}
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" /></svg>
          <span>{showFilters ? 'Hide Filters' : 'Toggle Filters'}</span>
        </button>
      </div>

      <div className={`grid grid-cols-1 md:grid-cols-3 gap-8 transition-all duration-500 overflow-hidden ${showFilters ? 'max-h-[600px] opacity-100 mb-8' : 'max-h-0 opacity-0'}`}>
        <div className="glass-card p-8 rounded-3xl border border-white/5 space-y-4 shadow-xl">
          <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em]">Neural Search</label>
          <input 
            type="text" value={skuSearch} onChange={e => setSkuSearch(e.target.value)} placeholder="ID, Title, or Keyword..."
            className="w-full p-4 bg-slate-950/50 border border-white/5 rounded-2xl outline-none font-bold text-xs text-white placeholder:text-slate-700 focus:border-cyan-500 transition-all"
          />
        </div>
        <div className="glass-card p-8 rounded-3xl border border-white/5 space-y-4 shadow-xl">
          <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em]">Brand Origin</label>
          <select 
            value={filterBrand} onChange={e => setFilterBrand(e.target.value)}
            className="w-full p-4 bg-slate-950/50 border border-white/5 rounded-2xl outline-none font-bold text-xs text-white focus:border-cyan-500 transition-all cursor-pointer"
          >
            <option value="" className="bg-slate-900">ALL SECTORS</option>
            {brands.map((opt: string) => <option key={opt} value={opt} className="bg-slate-900">{opt.toUpperCase()}</option>)}
          </select>
        </div>
        <div className="glass-card p-8 rounded-3xl border border-white/5 space-y-4 shadow-xl">
          <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em]">Target Universe</label>
          <select 
            value={filterUniverse} onChange={e => setFilterUniverse(e.target.value)}
            className="w-full p-4 bg-slate-950/50 border border-white/5 rounded-2xl outline-none font-bold text-xs text-white focus:border-cyan-500 transition-all cursor-pointer"
          >
            <option value="" className="bg-slate-900">ALL SECTORS</option>
            {universes.map((opt: string) => <option key={opt} value={opt} className="bg-slate-900">{opt.toUpperCase()}</option>)}
          </select>
        </div>
      </div>

      <div className="glass-card rounded-[3rem] overflow-hidden border border-white/10 shadow-[0_0_50px_rgba(0,0,0,0.5)]">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-white/5 border-b border-white/10">
              <tr>
                {['Telemetry ID', 'Product Asset Descriptor', 'Source Brand', 'Category Node', 'Avg Rank', 'Neural Check'].map((h, i) => (
                  <th key={i} className="px-8 py-6 text-[10px] font-black text-slate-500 uppercase tracking-widest">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filteredData.slice(0, 15).map((item, idx) => (
                <tr key={idx} className="hover:bg-cyan-500/5 transition-colors group">
                  <td className="px-8 py-6 font-mono text-xs font-black text-cyan-400">{item.sku_id}</td>
                  <td className="px-8 py-6">
                    <p className="text-sm font-bold text-white group-hover:text-cyan-300 transition-colors truncate max-w-sm">{item.title}</p>
                  </td>
                  <td className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">{item.retailer_brand_name || 'GENERIC PROTOCOL'}</td>
                  <td className="px-8 py-6">
                    <span className="px-3 py-1 rounded bg-white/5 text-[9px] font-black text-slate-500 uppercase tracking-widest border border-white/5">{item.universe}</span>
                  </td>
                  <td className="px-8 py-6 font-black text-xs text-white">#{item.avg_rank_category || '--'}</td>
                  <td className="px-8 py-6">
                    <button 
                      onClick={() => onNext(item.sku_id)}
                      className={`px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all hover:scale-110 active:scale-95 bg-white text-slate-950 shadow-xl`}
                    >
                      Process
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filteredData.length === 0 && (
          <div className="p-20 text-center space-y-4">
            <div className="text-5xl opacity-20">🛸</div>
            <p className="text-slate-600 font-black uppercase tracking-[0.3em] text-sm">No unit detected in current sector.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Step2SelectSKU;
