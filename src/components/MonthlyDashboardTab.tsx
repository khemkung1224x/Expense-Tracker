import React, { useState } from 'react';
import {
  Transaction,
  WalletType,
  WALLET_CONFIG,
} from '../types';
import { calculateMonthlySummary, THAI_MONTHS } from '../data/mockData';
import { DonutChart } from './DonutChart';
import {
  TrendingUp,
  TrendingDown,
  Wallet,
  ChevronLeft,
  ChevronRight,
  Calendar,
  Layers,
  ArrowUpRight,
  ArrowDownRight,
  PieChart,
} from 'lucide-react';

interface MonthlyDashboardTabProps {
  transactions: Transaction[];
  onDeleteTransaction: (id: string) => void;
}

export const MonthlyDashboardTab: React.FC<MonthlyDashboardTabProps> = ({
  transactions,
}) => {
  const currentDate = new Date();
  const [selectedMonth, setSelectedMonth] = useState<number>(
    currentDate.getMonth() + 1
  );
  const [selectedYear, setSelectedYear] = useState<number>(
    currentDate.getFullYear()
  );
  const [filterCategory, setFilterCategory] = useState<string>('all');

  // Month navigation
  const handlePrevMonth = () => {
    if (selectedMonth === 1) {
      setSelectedMonth(12);
      setSelectedYear((y) => y - 1);
    } else {
      setSelectedMonth((m) => m - 1);
    }
  };

  const handleNextMonth = () => {
    if (selectedMonth === 12) {
      setSelectedMonth(1);
      setSelectedYear((y) => y + 1);
    } else {
      setSelectedMonth((m) => m + 1);
    }
  };

  // Calculate monthly summary
  const summary = calculateMonthlySummary(
    transactions,
    selectedMonth,
    selectedYear
  );

  // Month transactions
  const monthTransactions = transactions
    .filter((tx) => {
      const [y, m] = tx.date.split('-').map(Number);
      return y === selectedYear && m === selectedMonth;
    })
    .filter((tx) => {
      if (filterCategory === 'all') return true;
      return tx.category === filterCategory;
    })
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const monthObj = THAI_MONTHS.find((m) => m.value === selectedMonth);
  const monthName = monthObj ? monthObj.name : `เดือนที่ ${selectedMonth}`;

  // Savings rate
  const savingsRate =
    summary.totalIncome > 0
      ? Math.max(0, (summary.netBalance / summary.totalIncome) * 100)
      : 0;

  const walletsList: WalletType[] = ['SCB', 'K+', 'BAAC', 'เงินสด'];

  return (
    <div className="space-y-5 max-w-5xl mx-auto">
      {/* Month & Year Controller Bar */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-4 sm:p-5 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center">
            <Calendar className="w-4 h-4 text-slate-700" />
          </div>
          <div>
            <h2 className="text-sm sm:text-base font-bold text-slate-900 flex items-center gap-2">
              <span>แดชบอร์ดสรุปรายเดือน</span>
              <span className="text-[11px] px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 font-semibold border border-slate-200">
                {monthName} {selectedYear + 543}
              </span>
            </h2>
            <p className="text-xs text-slate-500">
              วิเคราะห์รายรับ-รายจ่ายและสัดส่วนกลุ่ม
            </p>
          </div>
        </div>

        {/* Month Selector Controls */}
        <div className="flex items-center gap-1.5 self-end sm:self-auto">
          <button
            onClick={handlePrevMonth}
            className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors cursor-pointer"
            title="เดือนก่อนหน้า"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          <select
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(Number(e.target.value))}
            className="px-2.5 py-1.5 text-xs sm:text-sm font-semibold rounded-lg border border-slate-200 bg-white text-slate-800 cursor-pointer focus:outline-none focus:border-slate-400"
          >
            {THAI_MONTHS.map((m) => (
              <option key={m.value} value={m.value}>
                {m.name}
              </option>
            ))}
          </select>

          <select
            value={selectedYear}
            onChange={(e) => setSelectedYear(Number(e.target.value))}
            className="px-2.5 py-1.5 text-xs sm:text-sm font-semibold rounded-lg border border-slate-200 bg-white text-slate-800 cursor-pointer focus:outline-none focus:border-slate-400"
          >
            {[selectedYear - 1, selectedYear, selectedYear + 1].map((yr) => (
              <option key={yr} value={yr}>
                พ.ศ. {yr + 543}
              </option>
            ))}
          </select>

          <button
            onClick={handleNextMonth}
            className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors cursor-pointer"
            title="เดือนถัดไป"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* 3 Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
        {/* Total Income */}
        <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-sm">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-xs font-semibold text-slate-500">
              รายรับรวม (Total Income)
            </span>
            <div className="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <ArrowDownRight className="w-4 h-4" />
            </div>
          </div>
          <div className="text-xl sm:text-2xl font-bold text-emerald-600">
            ฿{summary.totalIncome.toLocaleString('th-TH', { minimumFractionDigits: 2 })}
          </div>
          <div className="mt-2 text-[11px] text-slate-400 flex items-center gap-1 font-medium">
            <TrendingUp className="w-3 h-3 text-emerald-500" />
            <span>{Object.keys(summary.incomeByCategory).length} กลุ่มรายรับ</span>
          </div>
        </div>

        {/* Total Expense */}
        <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-sm">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-xs font-semibold text-slate-500">
              รายจ่ายรวม (Total Expense)
            </span>
            <div className="w-7 h-7 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center">
              <ArrowUpRight className="w-4 h-4" />
            </div>
          </div>
          <div className="text-xl sm:text-2xl font-bold text-rose-600">
            ฿{summary.totalExpense.toLocaleString('th-TH', { minimumFractionDigits: 2 })}
          </div>
          <div className="mt-2 text-[11px] text-slate-400 flex items-center gap-1 font-medium">
            <TrendingDown className="w-3 h-3 text-rose-500" />
            <span>{Object.keys(summary.expenseByCategory).length} กลุ่มรายจ่าย</span>
          </div>
        </div>

        {/* Net Balance */}
        <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-sm">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-xs font-semibold text-slate-500">
              คงเหลือสุทธิ (Net Savings)
            </span>
            <div className="w-7 h-7 rounded-lg bg-slate-100 text-slate-700 flex items-center justify-center">
              <Wallet className="w-4 h-4" />
            </div>
          </div>
          <div
            className={`text-xl sm:text-2xl font-bold ${
              summary.netBalance >= 0 ? 'text-slate-900' : 'text-rose-600'
            }`}
          >
            {summary.netBalance >= 0 ? '+' : ''}฿
            {summary.netBalance.toLocaleString('th-TH', { minimumFractionDigits: 2 })}
          </div>
          <div className="mt-2 text-[11px] text-slate-500">
            อัตราการออม:{' '}
            <span className="font-semibold text-slate-800">
              {savingsRate.toFixed(1)}%
            </span>
          </div>
        </div>
      </div>

      {/* Two Donut Charts: Expense vs Income */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <DonutChart
          title="สัดส่วนรายจ่ายแยกตามกลุ่ม"
          data={summary.expenseByCategory}
          type="expense"
          emptyMessage="ไม่มีรายจ่ายในเดือนนี้"
        />

        <DonutChart
          title="สัดส่วนรายรับแยกตามกลุ่ม"
          data={summary.incomeByCategory}
          type="income"
          emptyMessage="ไม่มีรายรับในเดือนนี้"
        />
      </div>

      {/* Wallet Breakdown Card */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
            <Layers className="w-4 h-4 text-slate-600" />
            สรุปยอดแยกตามกระเป๋าตังประจำเดือน {monthName}
          </h3>
          <span className="text-xs text-slate-400">4 กระเป๋า</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {walletsList.map((wKey) => {
            const wData = summary.walletSummary[wKey] || {
              income: 0,
              expense: 0,
              balance: 0,
            };
            const cfg = WALLET_CONFIG[wKey];

            return (
              <div
                key={wKey}
                className={`p-3.5 rounded-xl border ${cfg.bgLight} ${cfg.border}`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span className="font-bold text-xs flex items-center gap-1.5 text-slate-800">
                    <span>{cfg.icon}</span>
                    <span>{cfg.name}</span>
                  </span>
                  <span
                    className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                      wData.balance >= 0
                        ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                        : 'bg-rose-100 text-rose-800 border border-rose-200'
                    }`}
                  >
                    {wData.balance >= 0 ? 'คงเหลือ' : 'ติดลบ'}
                  </span>
                </div>

                <div className="text-base font-bold text-slate-900 mb-2">
                  {wData.balance >= 0 ? '+' : ''}฿
                  {wData.balance.toLocaleString('th-TH')}
                </div>

                <div className="text-[11px] space-y-1 pt-2 border-t border-slate-200/70 text-slate-600">
                  <div className="flex justify-between">
                    <span>รับ:</span>
                    <span className="font-medium text-emerald-700">
                      +฿{wData.income.toLocaleString('th-TH')}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>จ่าย:</span>
                    <span className="font-medium text-rose-700">
                      -฿{wData.expense.toLocaleString('th-TH')}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Transactions in Selected Month */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
          <div>
            <h3 className="font-bold text-slate-900 text-sm sm:text-base flex items-center gap-2">
              <PieChart className="w-4 h-4 text-slate-600" />
              รายการทั้งหมดในเดือน {monthName} ({monthTransactions.length} รายการ)
            </h3>
            <p className="text-xs text-slate-400">
              รายละเอียดรายการรับ-จ่ายทั้งหมดของเดือน
            </p>
          </div>

          {/* Category Filter */}
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="px-3 py-1.5 text-xs font-semibold rounded-lg border border-slate-200 bg-white text-slate-800 focus:outline-none focus:border-slate-400"
          >
            <option value="all">ทุกหมวดหมู่ (All)</option>
            {Object.keys({
              ...summary.incomeByCategory,
              ...summary.expenseByCategory,
            }).map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        {monthTransactions.length === 0 ? (
          <div className="text-center py-8 text-slate-400 text-xs">
            ไม่มีรายการบันทึกในเดือนนี้
          </div>
        ) : (
          <div className="divide-y divide-slate-100 max-h-80 overflow-y-auto pr-1">
            {monthTransactions.map((tx) => {
              const wCfg = WALLET_CONFIG[tx.wallet] || WALLET_CONFIG['เงินสด'];
              const isIncome = tx.type === 'income';

              return (
                <div
                  key={tx.id}
                  className="py-2.5 flex items-center justify-between gap-3 px-2 hover:bg-slate-50 rounded-lg transition-colors"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <span
                      className={`w-2 h-2 rounded-full flex-shrink-0 ${
                        isIncome ? 'bg-emerald-500' : 'bg-rose-500'
                      }`}
                    />
                    <div className="min-w-0">
                      <div className="text-xs sm:text-sm font-semibold text-slate-900 truncate">
                        {tx.title}
                      </div>
                      <div className="flex items-center gap-1.5 text-[11px] text-slate-400">
                        <span>{tx.date}</span>
                        <span>•</span>
                        <span className="text-slate-600">
                          {tx.category}
                        </span>
                        <span>•</span>
                        <span className={`px-1.5 py-0.2 rounded font-semibold text-[10px] ${wCfg.badgeBg}`}>
                          {wCfg.name}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="text-right flex-shrink-0">
                    <span
                      className={`text-xs sm:text-sm font-bold ${
                        isIncome ? 'text-emerald-600' : 'text-rose-600'
                      }`}
                    >
                      {isIncome ? '+' : '-'}฿
                      {tx.amount.toLocaleString('th-TH', {
                        minimumFractionDigits: 2,
                      })}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
