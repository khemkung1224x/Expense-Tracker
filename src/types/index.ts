export type WalletType = 'SCB' | 'BAAC' | 'K+' | 'เงินสด';

export type TransactionType = 'income' | 'expense';

export const WALLET_CONFIG: Record<
  WalletType,
  {
    name: string;
    label: string;
    color: string;
    bgLight: string;
    border: string;
    badgeBg: string;
    badgeText: string;
    icon: string;
  }
> = {
  SCB: {
    name: 'SCB',
    label: 'ธนาคารไทยพาณิชย์ (SCB)',
    color: '#7C3AED',
    bgLight: 'bg-purple-50/60',
    border: 'border-purple-200',
    badgeBg: 'bg-purple-100 text-purple-800 border border-purple-200',
    badgeText: 'text-purple-800',
    icon: '🟣',
  },
  'K+': {
    name: 'K+',
    label: 'ธนาคารกสิกรไทย (K+)',
    color: '#059669',
    bgLight: 'bg-emerald-50/60',
    border: 'border-emerald-200',
    badgeBg: 'bg-emerald-100 text-emerald-800 border border-emerald-200',
    badgeText: 'text-emerald-800',
    icon: '🟢',
  },
  BAAC: {
    name: 'BAAC',
    label: 'ธ.ก.ส. (BAAC)',
    color: '#0284C7',
    bgLight: 'bg-sky-50/60',
    border: 'border-sky-200',
    badgeBg: 'bg-sky-100 text-sky-800 border border-sky-200',
    badgeText: 'text-sky-800',
    icon: '🔵',
  },
  เงินสด: {
    name: 'เงินสด',
    label: 'เงินสด (Cash)',
    color: '#D97706',
    bgLight: 'bg-amber-50/60',
    border: 'border-amber-200',
    badgeBg: 'bg-amber-100 text-amber-900 border border-amber-200',
    badgeText: 'text-amber-900',
    icon: '🟡',
  },
};

export const INCOME_CATEGORIES = [
  'เงินเดือน',
  'มีคนให้',
  'ค่าจ้าง',
  'อื่นๆ',
] as const;

export type IncomeCategory = (typeof INCOME_CATEGORIES)[number];

export const EXPENSE_CATEGORIES = [
  'อาหาร',
  'เดินทาง, รถ',
  'ของใช้จำเป็น',
  'ช้อปปิ้ง',
  'บันเทิง',
  'บ้าน, สาธารณูปโภค',
  'สุขภาพ, ดูแลตัวเอง',
  'ครอบครัว',
  'ให้คนอื่น',
  'ท่องเที่ยว',
  'การศึกษา',
  'งาน, ธุรกิจ',
  'ออมเงิน, ลงทุน',
  'บัตรเครดิต',
  'อื่นๆ',
] as const;

export type ExpenseCategory = (typeof EXPENSE_CATEGORIES)[number];

export type CategoryType = IncomeCategory | ExpenseCategory;

export interface Transaction {
  id: string;
  date: string; // YYYY-MM-DD
  type: TransactionType;
  title: string;
  amount: number;
  category: string;
  wallet: WalletType;
  createdAt?: string;
  synced?: boolean;
}

export interface MonthlySummary {
  month: number; // 1-12
  year: number;
  totalIncome: number;
  totalExpense: number;
  netBalance: number;
  incomeByCategory: Record<string, number>;
  expenseByCategory: Record<string, number>;
  walletSummary: Record<
    WalletType,
    { income: number; expense: number; balance: number }
  >;
}

export interface AnnualMonthSummary {
  month: number;
  monthNameTh: string;
  monthShortTh: string;
  income: number;
  expense: number;
  net: number;
}

export interface AnnualSummary {
  year: number;
  totalIncome: number;
  totalExpense: number;
  netBalance: number;
  months: AnnualMonthSummary[];
  byWallet: Record<
    WalletType,
    {
      totalIncome: number;
      totalExpense: number;
      netBalance: number;
      months: AnnualMonthSummary[];
    }
  >;
}
