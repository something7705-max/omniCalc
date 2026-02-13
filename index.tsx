
// OmniCalc Pro - Core Engine (Vanilla JS)

export {};

declare global {
  interface Window {
    switchTab: (tabId: string) => void;
    calculateSIP: () => void;
    calculateGST: () => void;
    calculateInterest: () => void;
    setGSTMode: (mode: string) => void;
    setGSTRate: (rate: number) => void;
    setInterestType: (type: string) => void;
    // Basic Calculator Handlers
    handleBasicNumber: (num: string) => void;
    handleBasicOperator: (op: string) => void;
    handleBasicEqual: () => void;
    handleBasicClear: () => void;
    handleBasicBackspace: () => void;
    handleBasicPercentage: () => void;
    handleBasicDot: () => void;
    // Sci Calculator Handlers
    handleSciNumber: (num: string) => void;
    handleSciOperator: (op: string) => void;
    handleSciFunction: (func: string) => void;
    handleSciConstant: (constName: string) => void;
    handleSciEqual: () => void;
    handleSciClear: () => void;
    handleSciBackspace: () => void;
    handleSciDot: () => void;
    toggleSciMode: () => void;
  }
}

// --- Global State ---
let currentGSTMode = 'exclusive';
let currentGSTRate = 18;
let currentInterestType = 'compound';

// --- Basic Calculator State ---
let basicDisplay = '0';
let basicFormula = '';
let basicPrevValue: number | null = null;
let basicOperator: string | null = null;
let basicShouldReset = false;

// --- Scientific Calculator State ---
let sciDisplay = '0';
let sciFormula = '';
let sciPrevValue: number | null = null;
let sciOperator: string | null = null;
let sciShouldReset = false;
let isDegreeMode = true;

// --- Utility Functions ---
const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
        maximumFractionDigits: 0
    }).format(Math.round(val));
};

const updateLabel = (id: string, value: string | number) => {
    const el = document.getElementById(id);
    if (el) el.innerText = String(value);
};

const factorial = (n: number): number => {
    if (n < 0) return NaN;
    if (n === 0) return 1;
    let res = 1;
    for (let i = 2; i <= Math.floor(n); i++) res *= i;
    return res;
};

// --- Tab Switching Logic ---
function switchTab(tabId: string) {
    document.querySelectorAll('.calc-container').forEach(el => el.classList.remove('active'));
    document.getElementById(`${tabId}-calc`)?.classList.add('active');

    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.remove('tab-active');
        btn.classList.add('text-slate-400');
    });
    const activeBtn = document.getElementById(`btn-${tabId}`);
    if (activeBtn) {
        activeBtn.classList.remove('text-slate-400');
        activeBtn.classList.add('tab-active');
    }

    if (tabId === 'sip') calculateSIP();
    if (tabId === 'gst') calculateGST();
    if (tabId === 'interest') calculateInterest();
    if (tabId === 'basic') updateBasicUI();
    if (tabId === 'sci') updateSciUI();
}
window.switchTab = switchTab;

// --- Basic Calculator Logic ---
const runCalculation = (a: number, b: number, op: string): number => {
    let res = 0;
    switch (op) {
        case '+': res = a + b; break;
        case '-': res = a - b; break;
        case '*': res = a * b; break;
        case '/': res = b !== 0 ? a / b : 0; break;
        case 'pow': res = Math.pow(a, b); break;
        default: res = b;
    }
    return parseFloat(res.toPrecision(12));
};

const updateBasicUI = () => {
    const displayEl = document.getElementById('basic-display');
    const formulaEl = document.getElementById('basic-formula');
    if (displayEl) displayEl.innerText = basicDisplay;
    if (formulaEl) formulaEl.innerText = basicFormula;
};

window.handleBasicNumber = (num: string) => {
    if (basicShouldReset || basicDisplay === '0') {
        basicDisplay = num;
        basicShouldReset = false;
    } else {
        basicDisplay += num;
    }
    updateBasicUI();
};

window.handleBasicOperator = (op: string) => {
    const current = parseFloat(basicDisplay);
    if (basicPrevValue === null) {
        basicPrevValue = current;
    } else if (basicOperator) {
        const result = runCalculation(basicPrevValue, current, basicOperator);
        basicPrevValue = result;
        basicDisplay = String(result);
    }
    basicOperator = op;
    const opChar = op === '*' ? '×' : op === '/' ? '÷' : op === '-' ? '−' : op;
    basicFormula = `${basicPrevValue} ${opChar}`;
    basicShouldReset = true;
    updateBasicUI();
};

window.handleBasicEqual = () => {
    if (basicPrevValue === null || !basicOperator) return;
    const current = parseFloat(basicDisplay);
    const result = runCalculation(basicPrevValue, current, basicOperator);
    basicFormula = '';
    basicDisplay = String(result);
    basicPrevValue = null;
    basicOperator = null;
    basicShouldReset = true;
    updateBasicUI();
};

window.handleBasicClear = () => {
    basicDisplay = '0';
    basicFormula = '';
    basicPrevValue = null;
    basicOperator = null;
    basicShouldReset = false;
    updateBasicUI();
};

window.handleBasicBackspace = () => {
    if (basicDisplay.length === 1 || basicShouldReset) {
        basicDisplay = '0';
    } else {
        basicDisplay = basicDisplay.slice(0, -1);
    }
    updateBasicUI();
};

window.handleBasicPercentage = () => {
    const current = parseFloat(basicDisplay);
    basicDisplay = String(parseFloat((current / 100).toPrecision(12)));
    updateBasicUI();
};

window.handleBasicDot = () => {
    if (basicShouldReset) {
        basicDisplay = '0.';
        basicShouldReset = false;
    } else if (!basicDisplay.includes('.')) {
        basicDisplay += '.';
    }
    updateBasicUI();
};

// --- Scientific Calculator Logic ---
const updateSciUI = () => {
    const displayEl = document.getElementById('sci-display');
    const formulaEl = document.getElementById('sci-formula');
    const modeIndicator = document.getElementById('sci-mode-indicator');
    if (displayEl) displayEl.innerText = sciDisplay;
    if (formulaEl) formulaEl.innerText = sciFormula;
    if (modeIndicator) modeIndicator.innerText = isDegreeMode ? 'DEG MODE' : 'RAD MODE';
};

window.handleSciNumber = (num: string) => {
    if (sciShouldReset || sciDisplay === '0') {
        sciDisplay = num;
        sciShouldReset = false;
    } else {
        sciDisplay += num;
    }
    updateSciUI();
};

window.handleSciOperator = (op: string) => {
    const current = parseFloat(sciDisplay);
    if (sciPrevValue === null) {
        sciPrevValue = current;
    } else if (sciOperator) {
        const result = runCalculation(sciPrevValue, current, sciOperator);
        sciPrevValue = result;
        sciDisplay = String(result);
    }
    sciOperator = op;
    const opChar = op === 'pow' ? '^' : op === '*' ? '×' : op === '/' ? '÷' : op === '-' ? '−' : op;
    sciFormula = `${sciPrevValue} ${opChar}`;
    sciShouldReset = true;
    updateSciUI();
};

window.handleSciFunction = (func: string) => {
    let val = parseFloat(sciDisplay);
    let result = 0;

    switch(func) {
        case 'sin': 
            result = isDegreeMode ? Math.sin(val * Math.PI / 180) : Math.sin(val);
            break;
        case 'cos':
            result = isDegreeMode ? Math.cos(val * Math.PI / 180) : Math.cos(val);
            break;
        case 'tan':
            result = isDegreeMode ? Math.tan(val * Math.PI / 180) : Math.tan(val);
            break;
        case 'log':
            result = Math.log10(val);
            break;
        case 'ln':
            result = Math.log(val);
            break;
        case 'sq':
            result = val * val;
            break;
        case 'sqrt':
            result = Math.sqrt(val);
            break;
        case 'fact':
            result = factorial(val);
            break;
    }

    sciDisplay = String(parseFloat(result.toPrecision(12)));
    sciShouldReset = true;
    updateSciUI();
};

window.handleSciConstant = (constName: string) => {
    if (constName === 'pi') sciDisplay = String(Math.PI);
    if (constName === 'e') sciDisplay = String(Math.E);
    sciShouldReset = true;
    updateSciUI();
};

window.handleSciEqual = () => {
    if (sciPrevValue === null || !sciOperator) return;
    const current = parseFloat(sciDisplay);
    const result = runCalculation(sciPrevValue, current, sciOperator);
    sciFormula = '';
    sciDisplay = String(result);
    sciPrevValue = null;
    sciOperator = null;
    sciShouldReset = true;
    updateSciUI();
};

window.handleSciClear = () => {
    sciDisplay = '0';
    sciFormula = '';
    sciPrevValue = null;
    sciOperator = null;
    sciShouldReset = false;
    updateSciUI();
};

window.handleSciBackspace = () => {
    if (sciDisplay.length === 1 || sciShouldReset) {
        sciDisplay = '0';
    } else {
        sciDisplay = sciDisplay.slice(0, -1);
    }
    updateSciUI();
};

window.handleSciDot = () => {
    if (sciShouldReset) {
        sciDisplay = '0.';
        sciShouldReset = false;
    } else if (!sciDisplay.includes('.')) {
        sciDisplay += '.';
    }
    updateSciUI();
};

window.toggleSciMode = () => {
    isDegreeMode = !isDegreeMode;
    updateSciUI();
};

// --- SIP Calculation ---
function calculateSIP() {
    const amountEl = document.getElementById('input-sip-amount') as HTMLInputElement;
    const rateEl = document.getElementById('input-sip-rate') as HTMLInputElement;
    const yearsEl = document.getElementById('input-sip-years') as HTMLInputElement;
    
    if (!amountEl || !rateEl || !yearsEl) return;

    const P = Number(amountEl.value);
    const rate = Number(rateEl.value);
    const years = Number(yearsEl.value);

    updateLabel('label-sip-amount', P.toLocaleString('en-IN'));
    updateLabel('label-sip-rate', rate);
    updateLabel('label-sip-years', years);

    const i = rate / 1200;
    const n = years * 12;

    const maturityValue = P * ((Math.pow(1 + i, n) - 1) / i) * (1 + i);
    const totalInvested = P * n;
    const estimatedReturns = maturityValue - totalInvested;

    const totalValEl = document.getElementById('sip-total-value');
    if (totalValEl) totalValEl.innerText = formatCurrency(maturityValue);
    const investedEl = document.getElementById('sip-invested');
    if (investedEl) investedEl.innerText = formatCurrency(totalInvested);
    const returnsEl = document.getElementById('sip-returns');
    if (returnsEl) returnsEl.innerText = formatCurrency(estimatedReturns);
}
window.calculateSIP = calculateSIP;

// --- GST Calculation ---
function setGSTMode(mode: string) {
    currentGSTMode = mode;
    const exclBtn = document.getElementById('gst-excl');
    const inclBtn = document.getElementById('gst-incl');

    if (mode === 'exclusive') {
        if (exclBtn) exclBtn.className = "px-4 py-2 rounded-lg text-[9px] font-black uppercase tracking-widest bg-primary text-dark transition-all";
        if (inclBtn) inclBtn.className = "px-4 py-2 rounded-lg text-[9px] font-black uppercase tracking-widest text-slate-400 transition-all";
    } else {
        if (inclBtn) inclBtn.className = "px-4 py-2 rounded-lg text-[9px] font-black uppercase tracking-widest bg-primary text-dark transition-all";
        if (exclBtn) exclBtn.className = "px-4 py-2 rounded-lg text-[9px] font-black uppercase tracking-widest text-slate-400 transition-all";
    }
    calculateGST();
}
window.setGSTMode = setGSTMode;

function setGSTRate(rate: number) {
    currentGSTRate = rate;
    document.querySelectorAll('.gst-rate-btn').forEach(btn => {
        btn.classList.remove('bg-primary', 'text-dark', 'border-none');
        btn.classList.add('glass', 'text-slate-400');
        if (btn.textContent === `${rate}%`) {
            btn.classList.add('bg-primary', 'text-dark', 'border-none');
            btn.classList.remove('glass', 'text-slate-400');
        }
    });
    calculateGST();
}
window.setGSTRate = setGSTRate;

function calculateGST() {
    const amountEl = document.getElementById('input-gst-amount') as HTMLInputElement;
    if (!amountEl) return;
    const amount = Number(amountEl.value);
    let tax = 0;
    let base = 0;
    let total = 0;

    if (currentGSTMode === 'exclusive') {
        tax = (amount * currentGSTRate) / 100;
        base = amount;
        total = base + tax;
    } else {
        base = amount / (1 + currentGSTRate / 100);
        tax = amount - base;
        total = amount;
    }

    const totalEl = document.getElementById('gst-total-amount');
    if (totalEl) totalEl.innerText = formatCurrency(total);
    const baseEl = document.getElementById('gst-base');
    if (baseEl) baseEl.innerText = formatCurrency(base);
    const taxEl = document.getElementById('gst-tax');
    if (taxEl) taxEl.innerText = formatCurrency(tax);
}
window.calculateGST = calculateGST;

// --- Interest Calculation ---
function setInterestType(type: string) {
    currentInterestType = type;
    const simpleBtn = document.getElementById('int-simple');
    const compoundBtn = document.getElementById('int-compound');

    if (type === 'simple') {
        if (simpleBtn) simpleBtn.className = "px-4 py-2 rounded-lg text-[9px] font-black uppercase tracking-widest bg-primary text-dark transition-all";
        if (compoundBtn) compoundBtn.className = "px-4 py-2 rounded-lg text-[9px] font-black uppercase tracking-widest text-slate-400 transition-all";
    } else {
        if (compoundBtn) compoundBtn.className = "px-4 py-2 rounded-lg text-[9px] font-black uppercase tracking-widest bg-primary text-dark transition-all";
        if (simpleBtn) simpleBtn.className = "px-4 py-2 rounded-lg text-[9px] font-black uppercase tracking-widest text-slate-400 transition-all";
    }
    calculateInterest();
}
window.setInterestType = setInterestType;

function calculateInterest() {
    const amountEl = document.getElementById('input-int-amount') as HTMLInputElement;
    const rateEl = document.getElementById('input-int-rate') as HTMLInputElement;
    const yearsEl = document.getElementById('input-int-years') as HTMLInputElement;
    
    if (!amountEl || !rateEl || !yearsEl) return;

    const P = Number(amountEl.value);
    const R = Number(rateEl.value);
    const T = Number(yearsEl.value);

    updateLabel('label-int-amount', P.toLocaleString('en-IN'));
    updateLabel('label-int-rate', R);
    updateLabel('label-int-years', T);

    let total = 0;
    let interest = 0;

    if (currentInterestType === 'simple') {
        interest = (P * R * T) / 100;
        total = P + interest;
    } else {
        total = P * Math.pow((1 + (R / 100)), T);
        interest = total - P;
    }

    const totalEl = document.getElementById('int-total-value');
    if (totalEl) totalEl.innerText = formatCurrency(total);
    const principalEl = document.getElementById('int-principal-display');
    if (principalEl) principalEl.innerText = formatCurrency(P);
    const earnedEl = document.getElementById('int-earned');
    if (earnedEl) earnedEl.innerText = formatCurrency(interest);
}
window.calculateInterest = calculateInterest;

// --- Keyboard Support ---
document.addEventListener('keydown', (e) => {
    // Handle Basic Calculator
    if (document.getElementById('basic-calc')?.classList.contains('active')) {
        if (/[0-9]/.test(e.key)) window.handleBasicNumber(e.key);
        if (e.key === '.') window.handleBasicDot();
        if (['+', '-', '*', '/'].includes(e.key)) window.handleBasicOperator(e.key);
        if (e.key === 'Enter' || e.key === '=') window.handleBasicEqual();
        if (e.key === 'Backspace') window.handleBasicBackspace();
        if (e.key === 'Escape') window.handleBasicClear();
    }
    
    // Handle Scientific Calculator
    if (document.getElementById('sci-calc')?.classList.contains('active')) {
        if (/[0-9]/.test(e.key)) window.handleSciNumber(e.key);
        if (e.key === '.') window.handleSciDot();
        if (['+', '-', '*', '/'].includes(e.key)) window.handleSciOperator(e.key);
        if (e.key === 'Enter' || e.key === '=') window.handleSciEqual();
        if (e.key === 'Backspace') window.handleSciBackspace();
        if (e.key === 'Escape') window.handleSciClear();
    }
});

// --- Initialization ---
document.addEventListener('DOMContentLoaded', () => {
    calculateSIP();
});
