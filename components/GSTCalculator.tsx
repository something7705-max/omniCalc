
import React, { useState, useEffect } from 'react';
import { CurrencyConfig } from '../types';

interface GSTProps {
  currency: CurrencyConfig;
}

const GSTCalculator: React.FC<GSTProps> = ({ currency }) => {
  const [amount, setAmount] = useState<string>('10000');
  const [rate, setRate] = useState<number>(18);
  const [mode, setMode] = useState<'add' | 'remove'>('add');
  const [results, setResults] = useState({
    net: 0,
    tax: 0,
    total: 0
  });

  const rates = [5, 12, 18, 28];

  useEffect(() => {
    const val = parseFloat(amount) || 0;
    if (mode === 'add') {
      // Net Amount + GST
      const tax = (val * rate) / 100;
      setResults({ net: val, tax: tax, total: val + tax });
    } else {
      // Total Amount (GST Inclusive) -> Find Net
      // Formula: Base = Total / (1 + Rate/100)
      const net = val / (1 + rate / 100);
      const tax = val - net;
      setResults({ net: net, tax: tax, total: val });
    }
  }, [amount, rate, mode]);

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat(currency.locale, { style: 'currency', currency: currency.code }).format(val);
  };

  return (
    <div className="space-y-8">
      <div className="premium-card p-10 flex flex-col items-center">
        <div className="flex bg-slate-100 p-1.5 rounded-2xl mb-8 w-full shadow-inner">
            <button 
              onClick={() => setMode('add')}
              className={`flex-1 py-3 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all ${mode === 'add' ? 'bg-white shadow-lg text-slate-900' : 'text-slate-400'}`}
            >
              Add GST
            </button>
            <button 
              onClick={() => setMode('remove')}
              className={`flex-1 py-3 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all ${mode === 'remove' ? 'bg-white shadow-lg text-slate-900' : 'text-slate-400'}`}
            >
              Remove GST
            </button>
        </div>

        <div className="text-center space-y-2 mb-8">
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Total Valuation</p>
            <p className="text-4xl font-black text-slate-900 tracking-tighter">{formatCurrency(results.total)}</p>
        </div>

        <div className="grid grid-cols-2 gap-4 w-full">
          <div className="bg-slate-50 p-6 rounded-[2rem] border border-slate-100 flex flex-col items-center overflow-hidden">
            <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Base Price</span>
            <span className="text-sm font-black text-slate-800 truncate w-full text-center">{formatCurrency(results.net)}</span>
          </div>
          <div className="bg-[#FF8E7E]/10 p-6 rounded-[2rem] border border-[#FF8E7E]/20 flex flex-col items-center overflow-hidden">
            <span className="text-[9px] font-black text-[#FF8E7E] uppercase tracking-widest mb-1">Tax Component</span>
            <span className="text-sm font-black text-[#FF8E7E] truncate w-full text-center">{formatCurrency(results.tax)}</span>
          </div>
        </div>
      </div>

      <div className="space-y-6 px-2">
        <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-50 space-y-4">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Transaction Amount</label>
            <div className="relative">
              <span className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 font-black text-lg">{currency.symbol}</span>
              <input 
                type="number" 
                value={amount} 
                onChange={(e) => setAmount(e.target.value)}
                className="w-full pl-12 pr-6 py-6 bg-slate-50 rounded-[1.8rem] border-none font-black text-2xl outline-none focus:ring-2 focus:ring-[#FF8E7E]/20 transition-all text-right"
              />
            </div>
        </div>

        <div className="space-y-4">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-2">Tax Slab Percentage</label>
            <div className="grid grid-cols-4 gap-3">
              {rates.map((r) => (
                <button
                  key={r}
                  onClick={() => setRate(r)}
                  className={`py-5 rounded-[1.5rem] text-[11px] font-black uppercase tracking-widest transition-all ${
                    rate === r 
                      ? 'bg-[#1A1C1E] text-white shadow-2xl scale-105' 
                      : 'bg-white text-slate-400 hover:bg-slate-50 shadow-sm'
                  }`}
                >
                  {r}%
                </button>
              ))}
            </div>
        </div>
      </div>
    </div>
  );
};

export default GSTCalculator;
