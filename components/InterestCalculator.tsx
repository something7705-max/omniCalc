
import React, { useState, useEffect } from 'react';
import { AreaChart, Area, XAxis, YAxis, ResponsiveContainer, Tooltip } from 'recharts';
import { CurrencyConfig } from '../types';

interface InterestProps {
  currency: CurrencyConfig;
}

const InterestCalculator: React.FC<InterestProps> = ({ currency }) => {
  const [principal, setPrincipal] = useState<number>(50000);
  const [rate, setRate] = useState<number>(8.5);
  const [time, setTime] = useState<number>(5);
  const [type, setType] = useState<'simple' | 'compound'>('compound');
  const [frequency, setFrequency] = useState<number>(1); // 1 = yearly, 4 = quarterly, 12 = monthly
  
  const [results, setResults] = useState({ interest: 0, total: 0 });
  const [chartData, setChartData] = useState<any[]>([]);

  useEffect(() => {
    const P = principal;
    const r = rate / 100;
    const t = time;
    const data = [];

    if (type === 'simple') {
      const I = (P * r * t);
      setResults({ interest: I, total: P + I });
      for (let i = 0; i <= t; i++) {
        data.push({ year: i, value: Math.round(P + (P * r * i)) });
      }
    } else {
      const n = frequency;
      // CI Formula: A = P(1 + r/n)^(nt)
      const A = P * Math.pow(1 + (r / n), n * t);
      setResults({ interest: A - P, total: A });
      for (let i = 0; i <= t; i++) {
        data.push({ year: i, value: Math.round(P * Math.pow(1 + (r / n), n * i)) });
      }
    }
    setChartData(data);
  }, [principal, rate, time, type, frequency]);

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat(currency.locale, { 
      style: 'currency', 
      currency: currency.code, 
      maximumFractionDigits: 0 
    }).format(val);
  };

  return (
    <div className="space-y-8">
      <div className="premium-card p-10 flex flex-col items-center">
        <div className="flex bg-slate-100 p-1 rounded-2xl mb-8 w-full max-w-[300px]">
            <button 
              onClick={() => setType('simple')}
              className={`flex-1 py-2.5 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all ${type === 'simple' ? 'bg-white shadow-lg text-slate-900' : 'text-slate-400'}`}
            >
              Simple
            </button>
            <button 
              onClick={() => setType('compound')}
              className={`flex-1 py-2.5 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all ${type === 'compound' ? 'bg-white shadow-lg text-slate-900' : 'text-slate-400'}`}
            >
              Compound
            </button>
        </div>

        <div className="w-full h-32 mb-6">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="colorInt" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#FF8E7E" stopOpacity={0.4}/>
                  <stop offset="95%" stopColor="#FF8E7E" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <XAxis dataKey="year" hide />
              <YAxis hide domain={['dataMin', 'auto']} />
              <Tooltip 
                formatter={(val: number) => formatCurrency(val)}
                contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 8px 16px rgba(0,0,0,0.1)', fontSize: '10px', fontWeight: 'bold' }}
              />
              <Area type="monotone" dataKey="value" stroke="#FF8E7E" fillOpacity={1} fill="url(#colorInt)" strokeWidth={3} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="text-center space-y-1">
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Total Maturity Value</p>
            <p className="text-3xl font-black text-slate-900 tracking-tight">{formatCurrency(results.total)}</p>
        </div>
      </div>

      <div className="space-y-6 px-2">
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Principal Amount</label>
            <div className="w-32">
              <input 
                type="number" value={principal} onChange={(e) => setPrincipal(Number(e.target.value))}
                className="w-full px-2 py-1.5 bg-white rounded-lg border border-slate-100 font-bold text-xs text-right outline-none focus:border-slate-300"
              />
            </div>
          </div>
          <input type="range" min="1000" max="1000000" step="1000" value={principal} onChange={(e) => setPrincipal(Number(e.target.value))} />
        </div>

        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Rate of Interest (%)</label>
            <div className="w-20">
              <input 
                type="number" value={rate} onChange={(e) => setRate(Number(e.target.value))}
                className="w-full px-2 py-1.5 bg-white rounded-lg border border-slate-100 font-bold text-xs text-right outline-none focus:border-slate-300"
              />
            </div>
          </div>
          <input type="range" min="1" max="30" step="0.1" value={rate} onChange={(e) => setRate(Number(e.target.value))} />
        </div>

        {type === 'compound' && (
          <div className="space-y-3">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">Compounding Interval</label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { label: 'Monthly', val: 12 },
                { label: 'Quarterly', val: 4 },
                { label: 'Yearly', val: 1 }
              ].map((item) => (
                <button
                  key={item.val}
                  onClick={() => setFrequency(item.val)}
                  className={`py-2 rounded-xl text-[9px] font-black uppercase tracking-widest border transition-all ${
                    frequency === item.val ? 'bg-[#1A1C1E] text-white border-[#1A1C1E] shadow-lg' : 'bg-white text-slate-400 border-slate-100'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Time (Years)</label>
            <div className="w-16">
              <input 
                type="number" value={time} onChange={(e) => setTime(Number(e.target.value))}
                className="w-full px-2 py-1.5 bg-white rounded-lg border border-slate-100 font-bold text-xs text-right outline-none focus:border-slate-300"
              />
            </div>
          </div>
          <input type="range" min="1" max="40" step="1" value={time} onChange={(e) => setTime(Number(e.target.value))} />
        </div>
      </div>
    </div>
  );
};

export default InterestCalculator;
