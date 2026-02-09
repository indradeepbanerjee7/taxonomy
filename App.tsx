
import React, { useState, useEffect } from 'react';
import { ProductData, CompanyTheme, AppStep, AnalysisResult } from './types';
import { COMPANIES } from './constants';
import Step1Setup from './components/Step1Setup';
import Step2SelectSKU from './components/Step2SelectSKU';
import Step3Analysis from './components/Step3Analysis';

const App: React.FC = () => {
  const [step, setStep] = useState<AppStep>(AppStep.SETUP);
  const [theme, setTheme] = useState<CompanyTheme>(COMPANIES[0]);
  const [logoUrl, setLogoUrl] = useState<string>('');
  const [csvData, setCsvData] = useState<ProductData[]>([]);
  const [guidelineImages, setGuidelineImages] = useState<{ inlineData: { data: string; mimeType: string } }[]>([]);
  const [guidelineText, setGuidelineText] = useState<string>('');
  const [selectedSkuId, setSelectedSkuId] = useState<string>('');
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);

  // Auto-source logo based on retailer selection
  useEffect(() => {
    const selectedCompany = COMPANIES.find(c => c.name === theme.name);
    if (selectedCompany) {
      setLogoUrl(`https://logo.clearbit.com/${selectedCompany.domain}?size=128`);
    }
  }, [theme]);

  const handleCompanyChange = (companyName: string) => {
    const selected = COMPANIES.find(c => c.name === companyName) || COMPANIES[0];
    setTheme(selected);
  };

  const handleCsvUpload = (data: ProductData[]) => {
    setCsvData(data);
  };

  const handleGuidelineUpload = (data: { data: string; mimeType: string }[] | string) => {
    if (typeof data === 'string') {
      setGuidelineText(data);
      setGuidelineImages([]);
    } else {
      setGuidelineImages(data.map(img => ({ inlineData: img })));
      setGuidelineText('');
    }
  };

  const goToNextStep = () => {
    if (step === AppStep.SETUP) setStep(AppStep.SELECTION);
    else if (step === AppStep.SELECTION) setStep(AppStep.ANALYSIS);
  };

  const reset = () => {
    setStep(AppStep.SETUP);
    setAnalysisResult(null);
    setSelectedSkuId('');
    setGuidelineImages([]);
    setGuidelineText('');
  };

  return (
    <div className={`min-h-screen flex flex-col font-['Roboto'] transition-all duration-300`}>
      {/* Futuristic Header */}
      <header className="glass-card sticky top-0 z-50 p-6 print:hidden border-b border-white/5">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-6">
            <div className="flex items-center space-x-4">
              <div className={`w-12 h-12 rounded-xl ${theme.primary} flex items-center justify-center shadow-[0_0_20px_rgba(255,255,255,0.1)]`}>
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
              </div>
              <div className="border-l border-white/10 pl-4">
                <h1 className="text-2xl font-black tracking-tighter text-white uppercase italic">PowerTaxonomy</h1>
                <p className="text-[9px] text-cyan-400 font-black uppercase tracking-[0.3em] animate-pulse">Neural SKU Optimization Core</p>
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-6">
             <div className="flex items-center space-x-3 bg-white/5 px-4 py-2 rounded-full border border-white/5">
               <img src={logoUrl} alt={theme.name} className="h-6 w-auto grayscale brightness-200" onError={(e) => (e.currentTarget.style.display = 'none')} />
               <span className="text-xs font-black uppercase tracking-widest text-slate-300">{theme.name} Protocol</span>
             </div>
            {step !== AppStep.SETUP && (
              <button 
                onClick={reset}
                className="text-[10px] font-black text-slate-500 hover:text-white transition-colors uppercase tracking-[0.2em]"
              >
                Abort Mission
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Futuristic Progress Bar */}
      <div className="bg-white/5 h-1.5 print:hidden overflow-hidden">
        <div 
          className={`h-full transition-all duration-1000 ease-in-out shadow-[0_0_15px_rgba(0,242,255,0.5)] ${theme.primary.replace('bg-', 'bg-')}`}
          style={{ 
            width: step === AppStep.SETUP ? '33%' : step === AppStep.SELECTION ? '66%' : '100%',
            backgroundColor: 'var(--neon-cyan)'
          }}
        ></div>
      </div>

      {/* Main Content */}
      <main className="flex-grow container mx-auto px-6 py-16 max-w-7xl relative">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-[120px] -z-10 pointer-events-none"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-[120px] -z-10 pointer-events-none"></div>

        {step === AppStep.SETUP && (
          <Step1Setup 
            onCompanyChange={handleCompanyChange}
            onCsvUpload={handleCsvUpload}
            onGuidelineUpload={handleGuidelineUpload}
            onNext={goToNextStep}
            theme={theme}
          />
        )}

        {step === AppStep.SELECTION && (
          <Step2SelectSKU 
            csvData={csvData}
            onNext={(skuId) => {
              setSelectedSkuId(skuId);
              goToNextStep();
            }}
            theme={theme}
          />
        )}

        {step === AppStep.ANALYSIS && (
          <Step3Analysis 
            skuId={selectedSkuId}
            csvData={csvData}
            guidelineImages={guidelineImages}
            guidelineText={guidelineText}
            companyTheme={theme}
            logoUrl={logoUrl}
            onReset={reset}
          />
        )}
      </main>

      <footer className="glass-card border-t border-white/5 p-10 text-center text-slate-500 text-[10px] font-black uppercase tracking-[0.5em] print:hidden">
        PowerTaxonomy v4.0.0 // © {new Date().getFullYear()} Global Marketplace Intelligence
      </footer>
    </div>
  );
};

export default App;
