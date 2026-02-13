
import React, { useState, useEffect, useCallback } from 'react';

interface CalcButton {
  label: string;
  action: () => void;
  color: string;
  colSpan?: string;
}

const NormalCalculator: React.FC = () => {
  const [display, setDisplay] = useState('0');
  const [formula, setFormula] = useState('');
  const [prevValue, setPrevValue] = useState<number | null>(null);
  const [operator, setOperator] = useState<string | null>(null);
  const [shouldReset, setShouldReset] = useState(false);

  // High precision calculation helper
  const calculate = (a: number, b: number, op: string): number => {
    let res = 0;
    switch (op) {
      case '+': res = a + b; break;
      case '-': res = a - b; break;
      case '*': res = a * b; break;
      case '/': res = b !== 0 ? a / b : 0; break;
      default: res = b;
    }
    // Fix JS floating point issues (e.g., 0.1 + 0.2)
    return parseFloat(res.toPrecision(12));
  };

  const handleNumber = useCallback((num: string) => {
    if (shouldReset || display === '0') {
      setDisplay(num);
      setShouldReset(false);
    } else {
      setDisplay(display + num);
    }
  }, [display, shouldReset]);

  const handleOperator = useCallback((op: string) => {
    const current = parseFloat(display);
    if (prevValue === null) {
      setPrevValue(current);
    } else if (operator) {
      const result = calculate(prevValue, current, operator);
      setPrevValue(result);
      setDisplay(String(result));
    }
    setOperator(op);
    setFormula(`${prevValue !== null && operator ? prevValue + ' ' + operator : current} ${op}`);
    setShouldReset(true);
  }, [display, operator, prevValue]);

  const handleEqual = useCallback(() => {
    if (prevValue === null || !operator) return;
    const current = parseFloat(display);
    const result = calculate(prevValue, current, operator);
    setFormula('');
    setDisplay(String(result));
    setPrevValue(null);
    setOperator(null);
    setShouldReset(true);
  }, [display, operator, prevValue]);

  const handleClear = () => {
    setDisplay('0');
    setFormula('');
    setPrevValue(null);
    setOperator(null);
    setShouldReset(false);
  };

  const handleBackspace = () => {
    if (display.length === 1 || shouldReset) {
      setDisplay('0');
    } else {
      setDisplay(display.slice(0, -1));
    }
  };

  const handlePercentage = () => {
    const current = parseFloat(display);
    setDisplay(String(parseFloat((current / 100).toPrecision(12))));
  };

  const handleDot = () => {
    if (shouldReset) {
      setDisplay('0.');
      setShouldReset(false);
    } else if (!display.includes('.')) {
      setDisplay(display + '.');
    }
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (/[0-9]/.test(e.key)) handleNumber(e.key);
      if (['+', '-', '*', '/'].includes(e.key)) handleOperator(e.key === '*' ? '*' : e.key);
      if (e.key === 'Enter' || e.key === '=') handleEqual();
      if (e.key === 'Escape') handleClear();
      if (e.key === 'Backspace') handleBackspace();
      if (e.key === '.') handleDot();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleNumber, handleOperator, handleEqual, handleDot]);

  const buttons: CalcButton[] = [
    { label: 'AC', action: handleClear, color: 'text-slate-400 font-bold' },
    { label: 'DEL', action: handleBackspace, color: 'text-slate-400 font-bold' },
    { label: '%', action: handlePercentage, color: 'text-slate-400 font-bold' },
    { label: '÷', action: () => handleOperator('/'), color: 'text-[#FF8E7E] font-extrabold text-2xl' },
    { label: '7', action: () => handleNumber('7'), color: 'text-slate-700 font-bold' },
    { label: '8', action: () => handleNumber('8'), color: 'text-slate-700 font-bold' },
    { label: '9', action: () => handleNumber('9'), color: 'text-slate-700 font-bold' },
    { label: '×', action: () => handleOperator('*'), color: 'text-[#FF8E7E] font-extrabold text-2xl' },
    { label: '4', action: () => handleNumber('4'), color: 'text-slate-700 font-bold' },
    { label: '5', action: () => handleNumber('5'), color: 'text-slate-700 font-bold' },
    { label: '6', action: () => handleNumber('6'), color: 'text-slate-700 font-bold' },
    { label: '−', action: () => handleOperator('-'), color: 'text-[#FF8E7E] font-extrabold text-2xl' },
    { label: '1', action: () => handleNumber('1'), color: 'text-slate-700 font-bold' },
    { label: '2', action: () => handleNumber('2'), color: 'text-slate-700 font-bold' },
    { label: '3', action: () => handleNumber('3'), color: 'text-slate-700 font-bold' },
    { label: '+', action: () => handleOperator('+'), color: 'text-[#FF8E7E] font-extrabold text-2xl' },
    { label: '0', action: () => handleNumber('0'), color: 'text-slate-700 font-bold', colSpan: 'col-span-2' },
    { label: '.', action: handleDot, color: 'text-slate-700 font-bold' },
    { label: '=', action: handleEqual, color: 'bg-[#1A1C1E] text-white rounded-[1.5rem] shadow-xl' },
  ];

  return (
    <div className="premium-card p-8 bg-white border border-slate-50">
      <div className="mb-8 p-4 text-right min-h-[140px] flex flex-col justify-end">
        <div className="text-slate-300 text-xs font-medium tracking-widest uppercase mb-2">{formula || 'Accuracy Mode'}</div>
        <div className="text-5xl font-black text-slate-900 truncate tracking-tight">{display}</div>
      </div>
      
      <div className="grid grid-cols-4 gap-4">
        {buttons.map((btn, idx) => (
          <button
            key={idx}
            onClick={btn.action}
            className={`${btn.color} ${btn.colSpan || ''} h-16 flex items-center justify-center rounded-2xl text-lg btn-calc hover:bg-slate-50 transition-colors active:scale-95`}
          >
            {btn.label}
          </button>
        ))}
      </div>
    </div>
  );
};

export default NormalCalculator;
