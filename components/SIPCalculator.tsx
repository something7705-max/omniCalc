
import React, { useState, useEffect } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import { SIPResults, CurrencyConfig } from '../types';

interface SIPProps {
  currency: CurrencyConfig;
}

const SIPCalculator: React.FC<SIPProps> = ({ currency }) => {
  const [amount, setAmount] = useState<number>(5000);
  const [rate, setRate] = useState<number>(12);
  const [years, setYears] = useState<number>(10);
  const [investType, setInvestType] = useState<'sip' | 'lumpsum'>('sip');
  const [showAnalysis, setShowAnalysis] = useState(false);
  
  const [results, setResults] = useState<SIPResults>({
    totalInvested: 0,
    estimatedReturns: 0,
    totalValue: 0
  });

  const [analysisData, setAnalysisData] = useState({
    inflationAdjusted: 0,
    wealthMultiplier: 0,
    stepUpPotential: 0,
    delayPenalty: 0
  });

  useEffect(() => {
    const P = amount;
    const annualRate = rate;
    const t = years;
    
    let maturityValue = 0;
    let totalInvested = 0;

    if (investType === 'sip') {
      const r = (annualRate / 100) / 12;
      const n = t * 12;
      if (r === 0) {
        maturityValue = P * n;
      } else {
        maturityValue = P * ((Math.pow(1 + r, n) - 1) / r) * (1 + r);
      }
      totalInvested = P * n;
    } else {
      const r = annualRate / 100;
      maturityValue = P * Math.pow(1 + r, t);
      totalInvested = P;
    }

    const estimatedReturns = maturityValue - totalInvested;

    setResults({
      totalInvested: Math.round(totalInvested),
      estimatedReturns: Math.round(estimatedReturns),
      totalValue: Math.round(maturityValue)
    });

    // Strategy Analysis Logic
    const inflationRate = 0.06; 
    const inflationAdjusted = maturityValue / Math.pow(1 + inflationRate, t);
    const wealthMultiplier = totalInvested > 0 ? maturityValue / totalInvested : 0;
    
    let stepUpValue = 0;
    if (investType === 'sip') {
      let currentP = P;
      let runningTotal = 0;
      for(let y = 1; y <= t; y++) {
        const monthlyRate = (annualRate / 100) / 12;
        const yearMaturity = currentP * ((Math.pow(1 + monthlyRate, 12) - 1) / monthlyRate) * (1 + monthlyRate);
        runningTotal = (runningTotal * (1 + annualRate/100)) + yearMaturity;
        currentP = currentP * 1.10; 
      }
      stepUpValue = runningTotal;
    }

    let delayValue = 0;
    const delayYears = 2;
    if (t > delayYears) {
      if (investType === 'sip') {
        const rDelay = (annualRate / 100) / 12;
        const nDelay = (t - delayYears) * 12;
        delayValue = P * ((Math.pow(1 + rDelay, nDelay) - 1) / rDelay) * (1 + rDelay);
      } else {
        const rDelay = annualRate / 100;
        delayValue = P * Math.pow(1 + rDelay, t - delayYears);
      }
    }

    setAnalysisData({
      inflationAdjusted: Math.round(inflationAdjusted),
      wealthMultiplier: parseFloat(wealthMultiplier.toFixed(2)),
      stepUpPotential: Math.round(stepUpValue),
      delayPenalty: Math.round(maturityValue - delayValue)
    });

  }, [amount, rate, years, investType]);

  const chartData = [
    { name: 'Invested', value: results.totalInvested },
    { name: 'Returns', value: results.estimatedReturns }
  ];

  const COLORS = ['#1A1C1E', '#FF8E7E'];

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat(currency.locale, { 
      style: 'currency', 
      currency: currency.code, 
      maximumFractionDigits: 0 
    }).format(val);
  };

  return (
    <div className="space-y-8">
      {/* Premium Result Card */}
      <div className="premium-card p-10 flex flex-col items-center relative overflow-hidden group">
        <div className="flex bg-slate-100 p-1 rounded-2xl mb-8 w-full max-w-[280px] shadow-inner">
            <button 
              onClick={() => setInvestType('sip')}
              className={`flex-1 py-2.5 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all ${investType === 'sip' ? 'bg-white shadow-lg text-slate-900' : 'text-slate-400'}`}
            >
              SIP (Monthly)
            </button>
            <button 
              onClick={() => setInvestType('lumpsum')}
              className={`flex-1 py-2.5 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all ${investType === 'lumpsum' ? 'bg-white shadow-lg text-slate-900' : 'text-slate-400'}`}
            >
              Lumpsum
            </button>
        </div>

        <div className="flex flex-col items-center mb-2">
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-1">Estimated Returns</p>
            <p className="text-4xl font-black text-slate-900 tracking-tighter">
              {formatCurrency(results.totalValue)}
            </p>
        </div>
        
        <div className="relative w-full aspect-square max-w-[180px] flex items-center justify-center my-4">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={chartData}
                innerRadius={65}
                outerRadius={85}
                paddingAngle={6}
                dataKey="value"
                stroke="none"
                animationDuration={1000}
              >
                {chartData.map((_, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <i className="fas fa-gem text-[#FF8E7E] text-xl opacity-20"></i>
          </div>
        </div>

        <div className="flex space-x-8 mt-4">
          <div className="flex flex-col items-center">
            <div className="flex items-center space-x-2 mb-1">
              <div className="w-2 h-2 rounded-full bg-[#1A1C1E]"></div>
              <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Invested</span>
            </div>
            <span className="text-xs font-black text-slate-900">{formatCurrency(results.totalInvested)}</span>
          </div>
          <div className="flex flex-col items-center">
            <div className="flex items-center space-x-2 mb-1">
              <div className="w-2 h-2 rounded-full bg-[#FF8E7E]"></div>
              <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Profit</span>
            </div>
            <span className="text-xs font-black text-[#FF8E7E]">{formatCurrency(results.estimatedReturns)}</span>
          </div>
        </div>
      </div>

      {/* Control Panel */}
      <div className="space-y-6 px-2">
        <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-slate-50 space-y-4">
          <div className="flex justify-between items-center">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
              {investType === 'sip' ? 'Monthly Amount' : 'Total Investment'}
            </label>
            <div className="relative w-36">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-300 font-bold text-xs">{currency.symbol}</span>
              <input 
                type="number" 
                value={amount} 
                onChange={(e) => setAmount(Number(e.target.value))}
                className="w-full pl-7 pr-3 py-2 bg-slate-50 rounded-xl border-none font-black text-sm text-right outline-none focus:ring-2 focus:ring-[#FF8E7E]/20 transition-all"
              />
            </div>
          </div>
          <input type="range" min="500" max="500000" step="500" value={amount} onChange={(e) => setAmount(Number(e.target.value))} />
        </div>

        <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-slate-50 space-y-4">
          <div className="flex justify-between items-center">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Expected Return (%)</label>
            <div className="w-24">
              <input 
                type="number" 
                value={rate} 
                onChange={(e) => setRate(Number(e.target.value))}
                className="w-full px-3 py-2 bg-slate-50 rounded-xl border-none font-black text-sm text-right outline-none focus:ring-2 focus:ring-[#FF8E7E]/20 transition-all"
              />
            </div>
          </div>
          <input type="range" min="1" max="30" step="0.1" value={rate} onChange={(e) => setRate(Number(e.target.value))} />
        </div>

        <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-slate-50 space-y-4">
          <div className="flex justify-between items-center">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Time Period (Years)</label>
            <div className="w-20">
              <input 
                type="number" 
                value={years} 
                onChange={(e) => setYears(Number(e.target.value))}
                className="w-full px-3 py-2 bg-slate-50 rounded-xl border-none font-black text-sm text-right outline-none focus:ring-2 focus:ring-[#FF8E7E]/20 transition-all"
              />
            </div>
          </div>
          <input type="range" min="1" max="40" step="1" value={years} onChange={(e) => setYears(Number(e.target.value))} />
        </div>
      </div>

      <button 
        onClick={() => setShowAnalysis(!showAnalysis)}
        className="w-full bg-[#1A1C1E] text-white py-6 rounded-[2.2rem] font-black uppercase tracking-[0.2em] text-[10px] shadow-2xl shadow-slate-300 btn-calc hover:shadow-primary/20 hover:scale-[1.02]"
      >
        {showAnalysis ? "Hide Strategy Insights" : "Analyze Investment Strategy"}
      </button>

      {/* Analysis Section */}
      {showAnalysis && (
        <div className="animate-in fade-in slide-in-from-top-4 duration-500 space-y-4 px-2">
          <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] px-4">Strategic Wealth Analysis</h3>
          
          <div className="grid grid-cols-1 gap-4">
            {/* Wealth Multiplier */}
            <div className="premium-card p-6 bg-white border border-slate-50 flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="w-10 h-10 rounded-full bg-slate-900 flex items-center justify-center text-white">
                  <i className="fas fa-arrow-up-right-dots text-xs"></i>
                </div>
                <div>
                  <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Wealth Multiplier</p>
                  <p className="text-lg font-black text-slate-900">{analysisData.wealthMultiplier}x Growth</p>
                </div>
              </div>
              <div className="text-right">
                <span className="text-[8px] font-bold text-green-500 bg-green-50 px-2 py-1 rounded-full uppercase">High Potential</span>
              </div>
            </div>

            {/* Inflation Impact */}
            <div className="premium-card p-6 bg-white border border-slate-50 flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="w-10 h-10 rounded-full bg-[#FF8E7E] flex items-center justify-center text-white">
                  <i className="fas fa-gas-pump text-xs"></i>
                </div>
                <div>
                  <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Inflation Adjusted Value (6%)</p>
                  <p className="text-lg font-black text-slate-900">{formatCurrency(analysisData.inflationAdjusted)}</p>
                </div>
              </div>
              <i className="fas fa-circle-info text-slate-200 text-xs"></i>
            </div>

            {/* Delay Penalty - FIXED AND CLARIFIED */}
            <div className="premium-card p-6 bg-white border border-slate-50">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 rounded-full bg-red-50 flex items-center justify-center text-red-500">
                    <i className="fas fa-clock-rotate-left text-xs"></i>
                  </div>
                  <div>
                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Wealth Lost by 2yr Delay</p>
                    <p className="text-lg font-black text-red-500">{formatCurrency(analysisData.delayPenalty)}</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-[8px] font-bold text-red-500 bg-red-50 px-2 py-1 rounded-full uppercase">Opportunity Cost</span>
                </div>
              </div>
              <p className="text-[9px] text-slate-400 font-medium pl-14">
                If you wait 2 years to start, you lose the compounding effect on your first 24 months of investment. Start early to maximize wealth.
              </p>
            </div>

            {/* Pro Suggestion: Step-Up SIP */}
            {investType === 'sip' && (
              <div className="premium-card p-6 bg-slate-900 text-white relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4 opacity-10">
                  <i className="fas fa-rocket text-5xl"></i>
                </div>
                <div className="relative z-10">
                  <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Pro Strategy: 10% Annual Step-up</p>
                  <p className="text-xl font-black mb-1">{formatCurrency(analysisData.stepUpPotential)}</p>
                  <p className="text-[8px] font-medium text-slate-400 max-w-[220px]">Increasing your SIP by just 10% every year can lead to significantly higher wealth creation.</p>
                </div>
              </div>
            )}
          </div>

          <div className="text-center p-4">
            <p className="text-[8px] font-bold text-slate-300 uppercase tracking-[0.2em]">Data based on standard financial compounding models</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default SIPCalculator;
