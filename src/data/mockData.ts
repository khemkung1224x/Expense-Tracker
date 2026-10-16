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

// สร้าง Mock Transactions ตัวอย่างครอบคลุม 12 เดือน
export const INITIAL_TRANSACTIONS: Transaction[] = [
  // เดือน 10 (ตุลาคม - เดือนปัจจุบัน)
  {
    id: 'tx-1001',
    date: `${currentYear}-10-01`,
    type: 'income',
    title: 'เงินเดือนประจำเดือน ต.ค.',
    amount: 38000,
    category: 'เงินเดือน',
    wallet: 'SCB',
  },
  {
    id: 'tx-1002',
    date: `${currentYear}-10-02`,
    type: 'expense',
    title: 'ค่าเช่าคอนโด + ค่าส่วนกลาง',
    amount: 8500,
    category: 'บ้าน, สาธารณูปโภค',
    wallet: 'K+',
  },
  {
    id: 'tx-1003',
    date: `${currentYear}-10-03`,
    type: 'expense',
    title: 'เติมน้ำมันรถยนต์ ปตท.',
    amount: 1200,
    category: 'เดินทาง, รถ',
    wallet: 'SCB',
  },
  {
    id: 'tx-1004',
    date: `${currentYear}-10-05`,
    type: 'expense',
    title: 'ซื้อของสด ซูเปอร์มาร์เก็ต Big C',
    amount: 1450,
    category: 'อาหาร',
    wallet: 'K+',
  },
  {
    id: 'tx-1005',
    date: `${currentYear}-10-07`,
    type: 'income',
    title: 'รับงานออกแบบฟรีแลนซ์เสริม',
    amount: 6500,
    category: 'ค่าจ้าง',
    wallet: 'K+',
  },
  {
    id: 'tx-1006',
    date: `${currentYear}-10-08`,
    type: 'expense',
    title: 'อาหารมื้อค่ำกับครอบครัว',
    amount: 1850,
    category: 'อาหาร',
    wallet: 'SCB',
  },
  {
    id: 'tx-1007',
    date: `${currentYear}-10-10`,
    type: 'expense',
    title: 'ช้อปปิ้งของใช้ Shopee 10.10',
    amount: 980,
    category: 'ช้อปปิ้ง',
    wallet: 'K+',
  },
  {
    id: 'tx-1008',
    date: `${currentYear}-10-11`,
    type: 'expense',
    title: 'กาแฟสด & อาหารเช้า',
    amount: 120,
    category: 'อาหาร',
    wallet: 'เงินสด',
  },
  {
    id: 'tx-1009',
    date: `${currentYear}-10-12`,
    type: 'income',
    title: 'ปันผลหุ้นสหกรณ์การเกษตร',
    amount: 3200,
    category: 'อื่นๆ',
    wallet: 'BAAC',
  },
  {
    id: 'tx-1010',
    date: `${currentYear}-10-13`,
    type: 'expense',
    title: 'ซื้อยาบำรุงและวิตามิน',
    amount: 650,
    category: 'สุขภาพ, ดูแลตัวเอง',
    wallet: 'เงินสด',
  },
  {
    id: 'tx-1011',
    date: `${currentYear}-10-14`,
    type: 'expense',
    title: 'ค่าตั๋วรถไฟฟ้า BTS / MRT',
    amount: 180,
    category: 'เดินทาง, รถ',
    wallet: 'เงินสด',
  },

  // เดือน 9 (กันยายน)
  {
    id: 'tx-0901',
    date: `${currentYear}-09-01`,
    type: 'income',
    title: 'เงินเดือนประจำเดือน ก.ย.',
    amount: 38000,
    category: 'เงินเดือน',
    wallet: 'SCB',
  },
  {
    id: 'tx-0902',
    date: `${currentYear}-09-02`,
    type: 'expense',
    title: 'ค่าเช่าห้องและอินเทอร์เน็ต',
    amount: 9200,
    category: 'บ้าน, สาธารณูปโภค',
    wallet: 'K+',
  },
  {
    id: 'tx-0903',
    date: `${currentYear}-09-08`,
    type: 'expense',
    title: 'ค่าอาหารทั้งสัปดาห์',
    amount: 3200,
    category: 'อาหาร',
    wallet: 'เงินสด',
  },
  {
    id: 'tx-0904',
    date: `${currentYear}-09-15`,
    type: 'income',
    title: 'โบนัสพิเศษและงานเสริม',
    amount: 8000,
    category: 'ค่าจ้าง',
    wallet: 'K+',
  },
  {
    id: 'tx-0905',
    date: `${currentYear}-09-18`,
    type: 'expense',
    title: 'ตรวจสุขภาพประจำปี',
    amount: 2500,
    category: 'สุขภาพ, ดูแลตัวเอง',
    wallet: 'SCB',
  },
  {
    id: 'tx-0906',
    date: `${currentYear}-09-25`,
    type: 'expense',
    title: 'ซื้อเสื้อผ้าใหม่ Uniqlo',
    amount: 2190,
    category: 'ช้อปปิ้ง',
    wallet: 'SCB',
  },
  {
    id: 'tx-0907',
    date: `${currentYear}-09-28`,
    type: 'expense',
    title: 'ฝากสลากออมทรัพย์ ธ.ก.ส.',
    amount: 5000,
    category: 'ออมเงิน, ลงทุน',
    wallet: 'BAAC',
  },

  // เดือน 8 (สิงหาคม)
  {
    id: 'tx-0801',
    date: `${currentYear}-08-01`,
    type: 'income',
    title: 'เงินเดือนประจำเดือน ส.ค.',
    amount: 38000,
    category: 'เงินเดือน',
    wallet: 'SCB',
  },
  {
    id: 'tx-0802',
    date: `${currentYear}-08-05`,
    type: 'expense',
    title: 'ค่าใช้จ่ายวันแม่ พาครอบครัวทานอาหาร',
    amount: 4500,
    category: 'ครอบครัว',
    wallet: 'SCB',
  },
  {
    id: 'tx-0803',
    date: `${currentYear}-08-12`,
    type: 'expense',
    title: 'เที่ยวต่างจังหวัด พักผ่อนหัวหิน',
    amount: 6800,
    category: 'ท่องเที่ยว',
    wallet: 'K+',
  },
  {
    id: 'tx-0804',
    date: `${currentYear}-08-18`,
    type: 'income',
    title: 'ผู้ปกครองให้เงินช่วยงานบ้าน',
    amount: 2000,
    category: 'มีคนให้',
    wallet: 'BAAC',
  },
  {
    id: 'tx-0805',
    date: `${currentYear}-08-20`,
    type: 'expense',
    title: 'ค่าอาหารและกาแฟประจำวัน',
    amount: 3800,
    category: 'อาหาร',
    wallet: 'เงินสด',
  },

  // เดือน 7 (กรกฎาคม)
  {
    id: 'tx-0701',
    date: `${currentYear}-07-01`,
    type: 'income',
    title: 'เงินเดือน ก.ค.',
    amount: 38000,
    category: 'เงินเดือน',
    wallet: 'SCB',
  },
  {
    id: 'tx-0702',
    date: `${currentYear}-07-06`,
    type: 'expense',
    title: 'คอร์สเรียนออนไลน์เสริมทักษะ',
    amount: 3500,
    category: 'การศึกษา',
    wallet: 'K+',
  },
  {
    id: 'tx-0703',
    date: `${currentYear}-07-15`,
    type: 'expense',
    title: 'ค่าเช่าและสาธารณูปโภค',
    amount: 8700,
    category: 'บ้าน, สาธารณูปโภค',
    wallet: 'K+',
  },
  {
    id: 'tx-0704',
    date: `${currentYear}-07-22`,
    type: 'expense',
    title: 'ค่าอาหารและของใช้',
    amount: 4100,
    category: 'อาหาร',
    wallet: 'เงินสด',
  },

  // เดือน 6 (มิถุนายน)
  {
    id: 'tx-0601',
    date: `${currentYear}-06-01`,
    type: 'income',
    title: 'เงินเดือน มิ.ย.',
    amount: 38000,
    category: 'เงินเดือน',
    wallet: 'SCB',
  },
  {
    id: 'tx-0602',
    date: `${currentYear}-06-10`,
    type: 'expense',
    title: 'ซ่อมบำรุงรถยนต์และเปลี่ยนยาง',
    amount: 5400,
    category: 'เดินทาง, รถ',
    wallet: 'SCB',
  },
  {
    id: 'tx-0603',
    date: `${currentYear}-06-15`,
    type: 'income',
    title: 'ค่าจ้างที่ปรึกษาโครงการ',
    amount: 10000,
    category: 'ค่าจ้าง',
    wallet: 'K+',
  },
  {
    id: 'tx-0604',
    date: `${currentYear}-06-20`,
    type: 'expense',
    title: 'ค่าอาหารและของสด',
    amount: 3900,
    category: 'อาหาร',
    wallet: 'เงินสด',
  },

  // เดือน 5 (พฤษภาคม)
  {
    id: 'tx-0501',
    date: `${currentYear}-05-01`,
    type: 'income',
    title: 'เงินเดือน พ.ค.',
    amount: 38000,
    category: 'เงินเดือน',
    wallet: 'SCB',
  },
  {
    id: 'tx-0502',
    date: `${currentYear}-05-12`,
    type: 'expense',
    title: 'ช้อปปิ้งเครื่องใช้ไฟฟ้า',
    amount: 4200,
    category: 'ช้อปปิ้ง',
    wallet: 'K+',
  },
  {
    id: 'tx-0503',
    date: `${currentYear}-05-18`,
    type: 'expense',
    title: 'ค่าอาหารและเครื่องดื่ม',
    amount: 3600,
    category: 'อาหาร',
    wallet: 'เงินสด',
  },

  // เดือน 4 (เมษายน - สงกรานต์)
  {
    id: 'tx-0401',
    date: `${currentYear}-04-01`,
    type: 'income',
    title: 'เงินเดือน เม.ย.',
    amount: 38000,
    category: 'เงินเดือน',
    wallet: 'SCB',
  },
  {
    id: 'tx-0402',
    date: `${currentYear}-04-13`,
    type: 'expense',
    title: 'ค่าใช้จ่ายช่วงสงกรานต์กลับบ้าน',
    amount: 7500,
    category: 'ท่องเที่ยว',
    wallet: 'SCB',
  },
  {
    id: 'tx-0403',
    date: `${currentYear}-04-14`,
    type: 'expense',
    title: 'ทำบุญและให้ญาติผู้ใหญ่',
    amount: 3000,
    category: 'ให้คนอื่น',
    wallet: 'เงินสด',
  },
  {
    id: 'tx-0404',
    date: `${currentYear}-04-20`,
    type: 'income',
    title: 'เงินช่วยเหลือเกษตรกร/ครอบครัว',
    amount: 5000,
    category: 'มีคนให้',
    wallet: 'BAAC',
  },

  // เดือน 3 (มีนาคม)
  {
    id: 'tx-0301',
    date: `${currentYear}-03-01`,
    type: 'income',
    title: 'เงินเดือน มี.ค.',
    amount: 38000,
    category: 'เงินเดือน',
    wallet: 'SCB',
  },
  {
    id: 'tx-0302',
    date: `${currentYear}-03-10`,
    type: 'expense',
    title: 'ค่าอาหารและซูเปอร์มาร์เก็ต',
    amount: 3700,
    category: 'อาหาร',
    wallet: 'K+',
  },
  {
    id: 'tx-0303',
    date: `${currentYear}-03-22`,
    type: 'expense',
    title: 'ดูภาพยนตร์และทานข้าวนอกบ้าน',
    amount: 1450,
    category: 'บันเทิง',
    wallet: 'SCB',
  },

  // เดือน 2 (กุมภาพันธ์)
  {
    id: 'tx-0201',
    date: `${currentYear}-02-01`,
    type: 'income',
    title: 'เงินเดือน ก.พ.',
    amount: 38000,
    category: 'เงินเดือน',
    wallet: 'SCB',
  },
  {
    id: 'tx-0202',
    date: `${currentYear}-02-14`,
    type: 'expense',
    title: 'ของขวัญวาเลนไทน์และดินเนอร์',
    amount: 2800,
    category: 'ครอบครัว',
    wallet: 'K+',
  },
  {
    id: 'tx-0203',
    date: `${currentYear}-02-20`,
    type: 'expense',
    title: 'ค่าอาหารและเดินทาง',
    amount: 3500,
    category: 'อาหาร',
    wallet: 'เงินสด',
  },

  // เดือน 1 (มกราคม - ปีใหม่)
  {
    id: 'tx-0101',
    date: `${currentYear}-01-01`,
    type: 'income',
    title: 'เงินเดือน ม.ค. + โบนัสปีใหม่',
    amount: 45000,
    category: 'เงินเดือน',
    wallet: 'SCB',
  },
  {
    id: 'tx-0102',
    date: `${currentYear}-01-02`,
    type: 'expense',
    title: 'ท่องเที่ยวเฉลิมฉลองปีใหม่',
    amount: 8200,
    category: 'ท่องเที่ยว',
    wallet: 'SCB',
  },
  {
    id: 'tx-0103',
    date: `${currentYear}-01-15`,
    type: 'expense',
    title: 'ชำระค่าสาธารณูปโภคและอินเทอร์เน็ต',
    amount: 3100,
    category: 'บ้าน, สาธารณูปโภค',
    wallet: 'K+',
  },
  {
    id: 'tx-0104',
    date: `${currentYear}-01-25`,
    type: 'expense',
    title: 'ค่าอาหารและของใช้ในบ้าน',
    amount: 3900,
    category: 'อาหาร',
    wallet: 'เงินสด',
  },

  // เดือน 11 & 12 (สำหรับแสดงข้อมูลภาพรวมปีล่วงหน้าแบบสมบูรณ์)
  {
    id: 'tx-1101',
    date: `${currentYear}-11-01`,
    type: 'income',
    title: 'เงินเดือน พ.ย. (คาดการณ์)',
    amount: 38000,
    category: 'เงินเดือน',
    wallet: 'SCB',
  },
  {
    id: 'tx-1102',
    date: `${currentYear}-11-15`,
    type: 'expense',
    title: 'ค่าใช้จ่ายทั่วไป พ.ย.',
    amount: 14500,
    category: 'ของใช้จำเป็น',
    wallet: 'K+',
  },
  {
    id: 'tx-1201',
    date: `${currentYear}-12-01`,
    type: 'income',
    title: 'เงินเดือน ธ.ค. + โบนัสประจำปี',
    amount: 52000,
    category: 'เงินเดือน',
    wallet: 'SCB',
  },
  {
    id: 'tx-1202',
    date: `${currentYear}-12-25`,
    type: 'expense',
    title: 'ของขวัญและปาร์ตี้ส่งท้ายปีเก่า',
    amount: 11000,
    category: 'บันเทิง',
    wallet: 'SCB',
  },
];

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
 * Storage helpers
 */
const STORAGE_KEY = 'EXPENSE_TRACKER_TRANSACTIONS_V1';
const WEBAPP_URL_KEY = 'EXPENSE_TRACKER_APPS_SCRIPT_URL';

export function loadStoredTransactions(): Transaction[] {
  try {
    const item = localStorage.getItem(STORAGE_KEY);
    if (!item) {
      saveStoredTransactions(INITIAL_TRANSACTIONS);
      return INITIAL_TRANSACTIONS;
    }
    const parsed = JSON.parse(item);
    if (Array.isArray(parsed) && parsed.length > 0) {
      return parsed;
    }
    return INITIAL_TRANSACTIONS;
  } catch (e) {
    console.error('Failed to load transactions from localStorage', e);
    return INITIAL_TRANSACTIONS;
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
    return localStorage.getItem(WEBAPP_URL_KEY) || '';
  } catch {
    return '';
  }
}

export function saveStoredWebAppUrl(url: string): void {
  try {
    localStorage.setItem(WEBAPP_URL_KEY, url.trim());
  } catch (e) {
    console.error('Failed to save Web App URL', e);
  }
}
