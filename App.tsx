
import React, { useState } from 'react';
import { CalculatorType, CurrencyCode, CURRENCIES } from './types.ts';
import NormalCalculator from './components/NormalCalculator.tsx';
import ScientificCalculator from './components/ScientificCalculator.tsx';
import SIPCalculator from './components/SIPCalculator.tsx';
import GSTCalculator from './components/GSTCalculator.tsx';
import InterestCalculator from './components/InterestCalculator.tsx';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<CalculatorType>(CalculatorType.SIP);
  const [currency, setCurrency] = useState<CurrencyCode>('INR');

  const renderCalculator = () => {
    const commonProps = { currency: CURRENCIES[currency] };
    switch (activeTab) {
      case CalculatorType.NORMAL: return <NormalCalculator />;
      case CalculatorType.SCIENTIFIC: return <ScientificCalculator />;
      case CalculatorType.SIP: return <SIPCalculator {...commonProps} />;
      case CalculatorType.GST: return <GSTCalculator {...commonProps} />;
      case CalculatorType.INTEREST: return <InterestCalculator {...commonProps} />;
      default: return <SIPCalculator {...commonProps} />;
    }
  };

  const tabs = [
    { id: CalculatorType.SIP, icon: 'fa-chart-line', label: 'SIP' },
    { id: CalculatorType.NORMAL, icon: 'fa-calculator', label: 'Basic' },
    { id: CalculatorType.SCIENTIFIC, icon: 'fa-microscope', label: 'Sci' },
    { id: CalculatorType.GST, icon: 'fa-receipt', label: 'GST' },
    { id: CalculatorType.INTEREST, icon: 'fa-percent', label: 'Interest' },
  ];

  return (
    <div className="min-h-screen bg-[#FDF8F5] relative">
      {/* Premium Curved Header */}
      <div className="curve-bg absolute top-0 left-0 right-0 h-64 z-0"></div>

      <header className="relative z-10 max-w-4xl mx-auto px-6 pt-8 pb-4">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
             <button className="text-white/80 hover:text-white transition-opacity">
                <i className="fas fa-bars text-xl"></i>
             </button>
             {/* Currency Selector */}
             <div className="relative group">
               <select 
                 value={currency}
                 onChange={(e) => setCurrency(e.target.value as CurrencyCode)}
                 className="bg-white/10 hover:bg-white/20 backdrop-blur-md text-white text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-lg border border-white/10 outline-none cursor-pointer appearance-none pr-8 transition-all"
               >
                 {Object.values(CURRENCIES).map(curr => (
                   <option key={curr.code} value={curr.code} className="text-slate-900">{curr.code} ({curr.symbol})</option>
                 ))}
               </select>
               <div className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none text-white/50 text-[8px]">
                  <i className="fas fa-chevron-down"></i>
               </div>
             </div>
          </div>
          
          <h1 className="text-white font-bold text-lg tracking-tight uppercase opacity-90 hidden sm:block">
            {activeTab} Pro
          </h1>

          <div className="w-10 sm:w-0"></div> {/* Spacer to maintain centering alignment */}
        </div>

        {/* Tab Switcher */}
        <div className="flex bg-white/10 backdrop-blur-md p-1.5 rounded-2xl overflow-x-auto no-scrollbar shadow-2xl">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 flex items-center justify-center space-x-2 px-4 py-3 rounded-xl whitespace-nowrap transition-all duration-300 ${
                activeTab === tab.id
                  ? 'bg-white text-slate-900 shadow-xl'
                  : 'text-white/60 hover:text-white hover:bg-white/5'
              }`}
            >
              <i className={`fas ${tab.icon} text-sm`}></i>
              <span className="text-xs font-bold uppercase tracking-wider">{tab.label}</span>
            </button>
          ))}
        </div>
      </header>

      {/* Main Content Area */}
      <main className="relative z-10 max-w-lg mx-auto px-6 pt-4 pb-24">
        <div className="animate-in fade-in slide-in-from-bottom-8 duration-700 ease-out">
          {renderCalculator()}
        </div>
      </main>

      {/* Subtle Footer branding */}
      <footer className="fixed bottom-6 left-0 right-0 text-center pointer-events-none opacity-20 z-0">
        <span className="text-xs font-black uppercase tracking-[0.3em]">OmniCalc Premium</span>
      </footer>
    </div>
  );
};

export default App;
