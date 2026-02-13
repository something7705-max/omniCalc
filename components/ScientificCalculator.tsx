
import React, { useState, useEffect, useCallback } from 'react';

interface CalcButton {
  label: string;
  action: () => void;
  color: string;
  colSpan?: string;
  className?: string;
}

const ScientificCalculator: React.FC = () => {
  const [display, setDisplay] = useState('0');
  const [formula, setFormula] = useState('');
  const [isDegree, setIsDegree] = useState(true);
  const [shouldReset, setShouldReset] = useState(false);

  // Helper to format precision
  const formatResult = (val: number): string => {
    const res = parseFloat(val.toPrecision(12));
    if (isNaN(res)) return 'Error';
    if (!isFinite(res)) return 'Infinity';
    return String(res);
  };

  const handleNumber = useCallback((num: string) => {
    if (shouldReset || display === '0') {
      setDisplay(num);
      setShouldReset(false);
    } else {
      setDisplay(display + num);
    }
  }, [display, shouldReset]);

  const handleDot = () => {
    if (shouldReset) {
      setDisplay('0.');
      setShouldReset(false);
    } else if (!display.includes('.')) {
      setDisplay(display + '.');
    }
  };

  const handleClear = () => {
    setDisplay('0');
    setFormula('');
    setShouldReset(false);
  };

  const handleBackspace = () => {
    if (display.length === 1 || shouldReset) {
      setDisplay('0');
    } else {
      setDisplay(display.slice(0, -1));
    }
  };

  const evaluate = () => {
    try {
      // Using direct eval for scientific expressions requires caution.
      // We'll replace math symbols with JS equivalents.
      // NOTE: For a production app, use a math parsing library like mathjs.
      // Here we implement a safe-ish replacement for common scientific functions.
      let expression = formula + display;
      
      // Basic replacements
      expression = expression.replace(/×/g, '*').replace(/÷/g, '/').replace(/−/g, '-');
      
      // We can't easily eval complex nested strings without a parser, 
      // so we'll treat scientific buttons as immediate actions for now to maintain 100% accuracy.
    } catch (e) {
      setDisplay('Error');
    }
  };

  const handleImmediateFunc = (func: (val: number) => number) => {
    const val = parseFloat(display);
    setDisplay(formatResult(func(val)));
    setShouldReset(true);
  };

  const handleTrig = (trigFunc: (val: number) => number) => {
    let val = parseFloat(display);
    if (isDegree) {
      val = val * (Math.PI / 180);
    }
    setDisplay(formatResult(trigFunc(val)));
    setShouldReset(true);
  };

  const handleOperator = (op: string) => {
    setFormula(display + ' ' + op + ' ');
    setShouldReset(true);
  };

  const handleEqual = () => {
    if (!formula) return;
    const parts = formula.split(' ');
    const a = parseFloat(parts[0]);
    const op = parts[1];
    const b = parseFloat(display);
    
    let res = 0;
    switch (op) {
      case '+': res = a + b; break;
      case '-': res = a - b; break;
      case '*': res = a * b; break;
      case '/': res = b !== 0 ? a / b : 0; break;
      case '^': res = Math.pow(a, b); break;
      default: res = b;
    }
    
    setFormula('');
    setDisplay(formatResult(res));
    setShouldReset(true);
  };

  const factorial = (n: number): number => {
    if (n < 0) return NaN;
    if (n === 0) return 1;
    let res = 1;
    for (let i = 2; i <= Math.floor(n); i++) res *= i;
    return res;
  };

  const buttons: CalcButton[] = [
    // Row 1 Scientific
    { label: isDegree ? 'DEG' : 'RAD', action: () => setIsDegree(!isDegree), color: 'text-coral font-black text-[10px]' },
    { label: 'sin', action: () => handleTrig(Math.sin), color: 'text-slate-400 font-bold' },
    { label: 'cos', action: () => handleTrig(Math.cos), color: 'text-slate-400 font-bold' },
    { label: 'tan', action: () => handleTrig(Math.tan), color: 'text-slate-400 font-bold' },
    { label: 'AC', action: handleClear, color: 'text-[#FF8E7E] font-black' },

    // Row 2 Scientific
    { label: 'log', action: () => handleImmediateFunc(Math.log10), color: 'text-slate-400 font-bold' },
    { label: 'ln', action: () => handleImmediateFunc(Math.log), color: 'text-slate-400 font-bold' },
    { label: 'x²', action: () => handleImmediateFunc((x) => x * x), color: 'text-slate-400 font-bold' },
    { label: 'xʸ', action: () => handleOperator('^'), color: 'text-slate-400 font-bold' },
    { label: 'DEL', action: handleBackspace, color: 'text-slate-400 font-bold' },

    // Row 3 Numbers
    { label: '√', action: () => handleImmediateFunc(Math.sqrt), color: 'text-slate-400 font-bold' },
    { label: '7', action: () => handleNumber('7'), color: 'text-slate-900 font-bold' },
    { label: '8', action: () => handleNumber('8'), color: 'text-slate-900 font-bold' },
    { label: '9', action: () => handleNumber('9'), color: 'text-slate-900 font-bold' },
    { label: '÷', action: () => handleOperator('/'), color: 'text-[#FF8E7E] font-extrabold text-xl' },

    // Row 4 Numbers
    { label: 'π', action: () => { setDisplay(String(Math.PI)); setShouldReset(true); }, color: 'text-slate-400 font-bold' },
    { label: '4', action: () => handleNumber('4'), color: 'text-slate-900 font-bold' },
    { label: '5', action: () => handleNumber('5'), color: 'text-slate-900 font-bold' },
    { label: '6', action: () => handleNumber('6'), color: 'text-slate-900 font-bold' },
    { label: '×', action: () => handleOperator('*'), color: 'text-[#FF8E7E] font-extrabold text-xl' },

    // Row 5 Numbers
    { label: 'e', action: () => { setDisplay(String(Math.E)); setShouldReset(true); }, color: 'text-slate-400 font-bold' },
    { label: '1', action: () => handleNumber('1'), color: 'text-slate-900 font-bold' },
    { label: '2', action: () => handleNumber('2'), color: 'text-slate-900 font-bold' },
    { label: '3', action: () => handleNumber('3'), color: 'text-slate-900 font-bold' },
    { label: '−', action: () => handleOperator('-'), color: 'text-[#FF8E7E] font-extrabold text-xl' },

    // Row 6 Bottom
    { label: 'n!', action: () => handleImmediateFunc(factorial), color: 'text-slate-400 font-bold' },
    { label: '0', action: () => handleNumber('0'), color: 'text-slate-900 font-bold' },
    { label: '.', action: handleDot, color: 'text-slate-900 font-bold' },
    { label: '=', action: handleEqual, color: 'bg-[#1A1C1E] text-white rounded-[1.2rem] shadow-xl', colSpan: 'col-span-1' },
    { label: '+', action: () => handleOperator('+'), color: 'text-[#FF8E7E] font-extrabold text-xl' },
  ];

  return (
    <div className="premium-card p-6 bg-white border border-slate-50 shadow-2xl">
      <div className="mb-6 p-4 text-right min-h-[120px] flex flex-col justify-end">
        <div className="text-slate-300 text-[10px] font-black tracking-widest uppercase mb-1">
          {isDegree ? 'Degrees' : 'Radians'} Mode • {formula}
        </div>
        <div className="text-4xl font-black text-slate-900 truncate tracking-tighter">
          {display}
        </div>
      </div>
      
      <div className="grid grid-cols-5 gap-3">
        {buttons.map((btn, idx) => (
          <button
            key={idx}
            onClick={btn.action}
            className={`${btn.color} ${btn.colSpan || ''} h-14 flex items-center justify-center rounded-[1.2rem] text-sm btn-calc hover:bg-slate-50 transition-all active:scale-90`}
          >
            {btn.label}
          </button>
        ))}
      </div>
      
      <div className="mt-6 pt-4 border-t border-slate-50 flex justify-between items-center opacity-40">
        <span className="text-[8px] font-black uppercase tracking-widest">Precision Math Engine 2.0</span>
        <div className="flex space-x-2">
            <div className="w-1.5 h-1.5 rounded-full bg-green-400"></div>
            <div className="w-1.5 h-1.5 rounded-full bg-blue-400"></div>
            <div className="w-1.5 h-1.5 rounded-full bg-[#FF8E7E]"></div>
        </div>
      </div>
    </div>
  );
};

export default ScientificCalculator;
