import {
  Transaction,
  MonthlySummary,
  AnnualSummary,
  AnnualMonthSummary,
  WalletType,
} from '../types';

export const THAI_MONTHS = [
  { value: 1, name: 'มกราคม', short: 'ม.ค.' },
  { value: 2, name: 'กุมภาพันธ์', short: 'ก.พ.' },
  { value: 3, name: 'มีนาคม', short: 'มี.ค.' },
  { value: 4, name: 'เมษายน', short: 'เม.ย.' },
  { value: 5, name: 'พฤษภาคม', short: 'พ.ค.' },
  { value: 6, name: 'มิถุนายน', short: 'มิ.ย.' },
  { value: 7, name: 'กรกฎาคม', short: 'ก.ค.' },
  { value: 8, name: 'สิงหาคม', short: 'ส.ค.' },
  { value: 9, name: 'กันยายน', short: 'ก.ย.' },
  { value: 10, name: 'ตุลาคม', short: 'ต.ค.' },
  { value: 11, name: 'พฤศจิกายน', short: 'พ.ย.' },
  { value: 12, name: 'ธันวาคม', short: 'ธ.ค.' },
];

const currentYear = new Date().getFullYear();

// รายการเริ่มต้นเป็น Array ว่างเปล่า (ไม่มี Mock Data จำลอง)
export const INITIAL_TRANSACTIONS: Transaction[] = [];

/**
 * คำนวณสรุปผลรายเดือน
 */
export function calculateMonthlySummary(
  transactions: Transaction[],
  month: number,
  year: number
): MonthlySummary {
  const filtered = transactions.filter((tx) => {
    const [y, m] = tx.date.split('-').map(Number);
    return y === year && m === month;
  });

  let totalIncome = 0;
  let totalExpense = 0;
  const incomeByCategory: Record<string, number> = {};
  const expenseByCategory: Record<string, number> = {};

  const walletSummary: Record<
    WalletType,
    { income: number; expense: number; balance: number }
  > = {
    SCB: { income: 0, expense: 0, balance: 0 },
    BAAC: { income: 0, expense: 0, balance: 0 },
    'K+': { income: 0, expense: 0, balance: 0 },
    เงินสด: { income: 0, expense: 0, balance: 0 },
  };

  filtered.forEach((tx) => {
    const amt = Number(tx.amount) || 0;
    const w = tx.wallet as WalletType;

    if (tx.type === 'income') {
      totalIncome += amt;
      incomeByCategory[tx.category] =
        (incomeByCategory[tx.category] || 0) + amt;
      if (walletSummary[w]) {
        walletSummary[w].income += amt;
        walletSummary[w].balance += amt;
      }
    } else {
      totalExpense += amt;
      expenseByCategory[tx.category] =
        (expenseByCategory[tx.category] || 0) + amt;
      if (walletSummary[w]) {
        walletSummary[w].expense += amt;
        walletSummary[w].balance -= amt;
      }
    }
  });

  return {
    month,
    year,
    totalIncome,
    totalExpense,
    netBalance: totalIncome - totalExpense,
    incomeByCategory,
    expenseByCategory,
    walletSummary,
  };
}

/**
 * คำนวณสรุปผลรายปี 12 เดือน ทั้งหมดและแยกตามกระเป๋าตัง
 */
export function calculateAnnualSummary(
  transactions: Transaction[],
  year: number
): AnnualSummary {
  const wallets: WalletType[] = ['SCB', 'BAAC', 'K+', 'เงินสด'];

  const initMonths = (): AnnualMonthSummary[] =>
    THAI_MONTHS.map((m) => ({
      month: m.value,
      monthNameTh: m.name,
      monthShortTh: m.short,
      income: 0,
      expense: 0,
      net: 0,
    }));

  const monthsTotal = initMonths();

  const byWallet: Record<
    WalletType,
    {
      totalIncome: number;
      totalExpense: number;
      netBalance: number;
      months: AnnualMonthSummary[];
    }
  > = {
    SCB: { totalIncome: 0, totalExpense: 0, netBalance: 0, months: initMonths() },
    BAAC: { totalIncome: 0, totalExpense: 0, netBalance: 0, months: initMonths() },
    'K+': { totalIncome: 0, totalExpense: 0, netBalance: 0, months: initMonths() },
    เงินสด: { totalIncome: 0, totalExpense: 0, netBalance: 0, months: initMonths() },
  };

  let totalIncome = 0;
  let totalExpense = 0;

  transactions.forEach((tx) => {
    const [y, m] = tx.date.split('-').map(Number);
    if (y !== year) return;
    if (m < 1 || m > 12) return;

    const amt = Number(tx.amount) || 0;
    const w = tx.wallet as WalletType;
    const monthIndex = m - 1;

    if (tx.type === 'income') {
      totalIncome += amt;
      monthsTotal[monthIndex].income += amt;
      monthsTotal[monthIndex].net += amt;

      if (byWallet[w]) {
        byWallet[w].totalIncome += amt;
        byWallet[w].netBalance += amt;
        byWallet[w].months[monthIndex].income += amt;
        byWallet[w].months[monthIndex].net += amt;
      }
    } else {
      totalExpense += amt;
      monthsTotal[monthIndex].expense += amt;
      monthsTotal[monthIndex].net -= amt;

      if (byWallet[w]) {
        byWallet[w].totalExpense += amt;
        byWallet[w].netBalance -= amt;
        byWallet[w].months[monthIndex].expense += amt;
        byWallet[w].months[monthIndex].net -= amt;
      }
    }
  });

  return {
    year,
    totalIncome,
    totalExpense,
    netBalance: totalIncome - totalExpense,
    months: monthsTotal,
    byWallet,
  };
}

/**
 * Storage helpers - ข้อมูลจริงเท่านั้น
 */
const STORAGE_KEY = 'EXPENSE_TRACKER_REAL_DATA_V1';
const WEBAPP_URL_KEY = 'EXPENSE_TRACKER_APPS_SCRIPT_URL';

export function loadStoredTransactions(): Transaction[] {
  try {
    // ล้าง cache ข้อมูล mock เก่าออกจากอุปกรณ์อัตโนมัติ
    localStorage.removeItem('EXPENSE_TRACKER_TRANSACTIONS_V1');
    localStorage.removeItem('STANDALONE_EXPENSE_DATA');

    const item = localStorage.getItem(STORAGE_KEY);
    if (!item) {
      return [];
    }
    const parsed = JSON.parse(item);
    if (Array.isArray(parsed) && parsed.length > 0) {
      // กรองรายการ mock เก่าที่ขึ้นต้นด้วย tx-0 หรือ tx-1 ออก (ถ้ามีค้างอยู่)
      const cleanData = parsed.filter(
        (tx) => tx && tx.id && !/^tx-(0|1)\d{3}$/.test(tx.id) && tx.id !== '1' && tx.id !== '2'
      );
      return cleanData;
    }
    return [];
  } catch (e) {
    console.error('Failed to load transactions from localStorage', e);
    return [];
  }
}

export function saveStoredTransactions(transactions: Transaction[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(transactions));
  } catch (e) {
    console.error('Failed to save transactions to localStorage', e);
  }
}

export function getStoredWebAppUrl(): string {
  try {
    const envUrl = (import.meta.env.VITE_GOOGLE_APPS_SCRIPT_URL || '').trim();
    if (envUrl) {
      return envUrl;
    }
    return localStorage.getItem(WEBAPP_URL_KEY) || '';
  } catch {
    return '';
  }
}

export function isEnvWebAppUrl(): boolean {
  try {
    return Boolean((import.meta.env.VITE_GOOGLE_APPS_SCRIPT_URL || '').trim());
  } catch {
    return false;
  }
}

export function saveStoredWebAppUrl(url: string): void {
  try {
    localStorage.setItem(WEBAPP_URL_KEY, url.trim());
  } catch (e) {
    console.error('Failed to save Web App URL', e);
  }
}
