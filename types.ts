
export enum CalculatorType {
  NORMAL = 'Normal',
  SCIENTIFIC = 'Scientific',
  SIP = 'SIP',
  GST = 'GST',
  INTEREST = 'Interest'
}

export type CurrencyCode = 'INR' | 'USD' | 'EUR' | 'GBP';

export interface CurrencyConfig {
  code: CurrencyCode;
  symbol: string;
  locale: string;
}

export const CURRENCIES: Record<CurrencyCode, CurrencyConfig> = {
  INR: { code: 'INR', symbol: '₹', locale: 'en-IN' },
  USD: { code: 'USD', symbol: '$', locale: 'en-US' },
  EUR: { code: 'EUR', symbol: '€', locale: 'de-DE' },
  GBP: { code: 'GBP', symbol: '£', locale: 'en-GB' },
};

export interface SIPResults {
  totalInvested: number;
  estimatedReturns: number;
  totalValue: number;
}

export interface InterestResults {
  principalAmount: number;
  interestEarned: number;
  totalValue: number;
}

export interface GSTResults {
  baseAmount: number;
  gstAmount: number;
  totalAmount: number;
}
