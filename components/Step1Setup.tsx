
import React, { useState } from 'react';
import { ProductData, CompanyTheme } from '../types';
import { COMPANIES } from '../constants';

interface Step1Props {
  onCompanyChange: (name: string) => void;
  onCsvUpload: (data: ProductData[]) => void;
  onGuidelineUpload: (images: { data: string; mimeType: string }[] | string) => void;
  onNext: () => void;
  theme: CompanyTheme;
}

const Step1Setup: React.FC<Step1Props> = ({ onCompanyChange, onCsvUpload, onGuidelineUpload, onNext, theme }) => {
  const [csvFile, setCsvFile] = useState<File | null>(null);
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleCsvChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) setCsvFile(e.target.files[0]);
  };

  const handlePdfChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) setPdfFile(e.target.files[0]);
  };

  const splitCsvLine = (line: string) => {
    const result = [];
    let current = "";
    let inQuotes = false;
    for (let i = 0; i < line.length; i++) {
      const char = line[i];
      if (char === '"') inQuotes = !inQuotes;
      else if (char === ',' && !inQuotes) {
        result.push(current.trim());
        current = "";
      } else {
        current += char;
      }
    }
    result.push(current.trim());
    return result;
  };

  const normalizeHeader = (header: string) => {
    const h = header.toLowerCase().replace(/["']/g, '').trim().replace(/[\s\._]+/g, '');
    
    // Intelligent mapping to standard keys
    if (h.includes('skuid') || h.includes('productid') || h === 'id' || h === 'asin') return 'sku_id';
    if (h === 'name' || h === 'productname' || h === 'title') return 'title';
    if (h === 'category' || h === 'universe') return 'universe';
    if (h === 'images' || h === 'image' || h === 'imageurl') return 'image_url';
    if (h === 'positioning' || h === 'bullets' || h === 'bulletpoints' || h === 'features') return 'bullets';
    if (h === 'description' || h === 'productdescription' || h === 'desc' || h === 'descriptionfilled') return 'description_filled';
    if (h.includes('minranksearch')) return 'min_rank_search';
    if (h.includes('avgranksearch')) return 'avg_rank_search';
    if (h.includes('minrankcategory')) return 'min_rank_category';
    if (h.includes('avgrankcategory')) return 'avg_rank_category';
    if (h.includes('categorynode')) return 'retailer_category_node';
    if (h.includes('brandname') || h === 'brand') return 'retailer_brand_name';
    
    return header.toLowerCase().replace(/[\s\.]+/g, '_');
  };

  const processFiles = async () => {
    if (!csvFile || !pdfFile) return;
    setIsProcessing(true);

    try {
      const csvText = await csvFile.text();
      const rows = csvText.split(/\r?\n/).filter(r => r.trim());
      if (rows.length < 1) throw new Error("CSV structure invalid");
      
      const rawHeaders = splitCsvLine(rows[0]);
      const normalizedHeaders = rawHeaders.map(h => normalizeHeader(h));
      
      const expectedKeys: (keyof ProductData)[] = [
        'sku_id', 'title', 'universe', 'image_url', 'bullets', 
        'min_rank_search', 'avg_rank_search', 'min_rank_category', 
        'avg_rank_category', 'retailer_category_node', 
        'retailer_brand_name', 'description_filled'
      ];

      const data: ProductData[] = rows.slice(1).map(row => {
        const values = splitCsvLine(row);
        const entry: any = {};
        
        expectedKeys.forEach(key => entry[key] = '');

        normalizedHeaders.forEach((header, idx) => { 
          const value = values[idx] || '';
          const isUrl = value.toLowerCase().startsWith('http') || value.startsWith('["http');
          entry[header] = isUrl ? value : value.toLowerCase(); 
        });

        if (!entry.retailer_brand_name && entry.title) {
          const firstWord = entry.title.split(' ')[0];
          entry.retailer_brand_name = firstWord;
        }

        return entry as ProductData;
      });
      onCsvUpload(data);

      const isTxt = pdfFile.name.toLowerCase().endsWith('.txt');
      if (isTxt) {
        const text = await pdfFile.text();
        onGuidelineUpload(text);
        onNext();
      } else {
        const reader = new FileReader();
        reader.onloadend = () => {
          const base64 = reader.result as string;
          if (!base64) throw new Error("Could not read PDF data");
          onGuidelineUpload([{ data: base64.split(',')[1], mimeType: 'application/pdf' }]);
          onNext();
        };
        reader.onerror = async () => {
          const textFallback = await pdfFile.text();
          onGuidelineUpload(textFallback);
          onNext();
        };
        reader.readAsDataURL(pdfFile);
      }
    } catch (error: any) {
      alert(`System Error: ${error.message || "Telemetry sync failed"}`);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center animate-fadeIn">
      <div className="space-y-12">
        <div className="space-y-6">
          <span className="inline-block px-4 py-1.5 rounded-full border border-cyan-500/30 bg-cyan-500/10 text-cyan-400 text-[10px] font-black tracking-[0.3em] uppercase animate-pulse">
            System Initialization Active
          </span>
          <h2 className="text-7xl font-black text-white tracking-tighter leading-[0.95] high-contrast-text uppercase italic">
            Optimized <span className="text-cyan-400">SKU</span> Intelligence.
          </h2>
          <p className="text-slate-400 text-xl font-light leading-relaxed max-w-lg">
            Deploy the industry's most advanced **taxonomy intelligence engine**. PowerTaxonomy leverages multimodal AI to benchmark competitors and ensure **global content compliance** at scale.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-8">
          <div className="space-y-2 group">
            <div className="flex items-center space-x-3">
              <span className="text-2xl grayscale group-hover:grayscale-0 transition-all">⚡</span>
              <h4 className="text-sm font-black text-white uppercase tracking-widest">Rapid Benchmarking</h4>
            </div>
            <p className="text-xs text-slate-500 font-medium leading-relaxed">Real-time competitor SKU comparison.</p>
          </div>
          <div className="space-y-2 group">
            <div className="flex items-center space-x-3">
              <span className="text-2xl grayscale group-hover:grayscale-0 transition-all">👁️</span>
              <h4 className="text-sm font-black text-white uppercase tracking-widest">Multimodal Scan</h4>
            </div>
            <p className="text-xs text-slate-500 font-medium leading-relaxed">Analyzes visual & textual guidelines.</p>
          </div>
          <div className="space-y-2 group">
            <div className="flex items-center space-x-3">
              <span className="text-2xl grayscale group-hover:grayscale-0 transition-all">🧬</span>
              <h4 className="text-sm font-black text-white uppercase tracking-widest">Auto-Extraction</h4>
            </div>
            <p className="text-xs text-slate-500 font-medium leading-relaxed">Neural brand & attribute detection.</p>
          </div>
          <div className="space-y-2 group">
            <div className="flex items-center space-x-3">
              <span className="text-2xl grayscale group-hover:grayscale-0 transition-all">✅</span>
              <h4 className="text-sm font-black text-white uppercase tracking-widest">Compliant SEO</h4>
            </div>
            <p className="text-xs text-slate-500 font-medium leading-relaxed">Content ready for global marketplaces.</p>
          </div>
        </div>
      </div>

      <div className="glass-card p-12 rounded-[3rem] shadow-2xl space-y-10 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/5 rounded-full blur-2xl"></div>
        
        <div className="space-y-4">
          <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em]">Retail Protocol Selection</label>
          <div className="relative group">
            <select 
              onChange={(e) => onCompanyChange(e.target.value)}
              className="w-full p-5 bg-slate-950/50 border border-white/10 rounded-2xl text-white font-bold text-sm focus:border-cyan-500 outline-none transition-all appearance-none cursor-pointer"
            >
              {COMPANIES.map(c => (
                <option key={c.name} value={c.name} className="bg-slate-900">{c.name.toUpperCase()} SYSTEM</option>
              ))}
            </select>
            <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none text-slate-500">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg>
            </div>
          </div>
          <p className="text-[9px] text-slate-600 font-black uppercase tracking-wider">Note: Brand assets are sourced automatically based on system selection.</p>
        </div>

        <div className="space-y-6">
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em]">Data Stream Ingestion (CSV)</label>
            <div className={`relative border border-white/5 rounded-2xl p-6 flex items-center justify-between bg-white/5 transition-all group hover:border-cyan-500/30 ${csvFile ? 'border-cyan-500/50 bg-cyan-500/5' : ''}`}>
              <input type="file" accept=".csv" onChange={handleCsvChange} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
              <div className="flex items-center space-x-4">
                <div className={`p-3 rounded-xl ${csvFile ? 'bg-cyan-500 text-slate-950' : 'bg-white/5 text-slate-500'}`}>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" /></svg>
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-black uppercase tracking-widest">{csvFile ? "Catalog Loaded" : "Load Product Catalog"}</p>
                  <p className="text-[10px] text-slate-600 truncate max-w-[200px]">{csvFile ? csvFile.name : "Waiting for local stream..."}</p>
                </div>
              </div>
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em]">Compliance Scan (PDF or TXT)</label>
            <div className={`relative border border-white/5 rounded-2xl p-6 flex items-center justify-between bg-white/5 transition-all group hover:border-cyan-500/30 ${pdfFile ? 'border-cyan-500/50 bg-cyan-500/5' : ''}`}>
              <input type="file" accept=".pdf,.txt" onChange={handlePdfChange} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
              <div className="flex items-center space-x-4">
                <div className={`p-3 rounded-xl ${pdfFile ? 'bg-cyan-500 text-slate-950' : 'bg-white/5 text-slate-500'}`}>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-black uppercase tracking-widest">{pdfFile ? "Protocol Loaded" : "Load Guidelines"}</p>
                  <p className="text-[10px] text-slate-600 truncate max-w-[200px]">{pdfFile ? pdfFile.name : "Waiting for local stream..."}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <button
          onClick={processFiles}
          disabled={!csvFile || !pdfFile || isProcessing}
          className={`w-full group relative py-6 rounded-3xl text-slate-950 font-black text-sm uppercase tracking-[0.3em] shadow-2xl transition-all active:scale-95 disabled:opacity-20 bg-white overflow-hidden`}
        >
          <div className="absolute inset-0 bg-cyan-400 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
          <span className="relative z-10">{isProcessing ? "Ingesting Streams..." : "Execute Intelligence Scan"}</span>
        </button>
      </div>
    </div>
  );
};

export default Step1Setup;
