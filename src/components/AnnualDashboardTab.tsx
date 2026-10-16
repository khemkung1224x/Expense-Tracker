import React, { useState } from 'react';
import {
  Transaction,
  WalletType,
  WALLET_CONFIG,
} from '../types';
import { calculateAnnualSummary } from '../data/mockData';
import { ComparisonBarChart } from './ComparisonBarChart';
import {
  CalendarDays,
  TrendingUp,
  TrendingDown,
  Wallet,
  Filter,
  Table as TableIcon,
  Percent,
} from 'lucide-react';

interface AnnualDashboardTabProps {
  transactions: Transaction[];
}

export const AnnualDashboardTab: React.FC<AnnualDashboardTabProps> = ({
  transactions,
}) => {
  const currentYear = new Date().getFullYear();
  const [selectedYear, setSelectedYear] = useState<number>(currentYear);
  const [walletFilter, setWalletFilter] = useState<'all' | WalletType>('all');

  const annualData = calculateAnnualSummary(transactions, selectedYear);

  // Filter months data based on walletFilter
  const displayedMonths =
    walletFilter === 'all'
      ? annualData.months
      : annualData.byWallet[walletFilter].months;

  const totalIncome =
    walletFilter === 'all'
      ? annualData.totalIncome
      : annualData.byWallet[walletFilter].totalIncome;

  const totalExpense =
    walletFilter === 'all'
      ? annualData.totalExpense
      : annualData.byWallet[walletFilter].totalExpense;

  const netBalance =
    walletFilter === 'all'
      ? annualData.netBalance
      : annualData.byWallet[walletFilter].netBalance;

  const savingsRate =
    totalIncome > 0 ? Math.max(0, (netBalance / totalIncome) * 100) : 0;

  const filterLabel =
    walletFilter === 'all'
      ? 'ภาพรวมทั้งหมด (ทุกกระเป๋า)'
      : WALLET_CONFIG[walletFilter].label;

  return (
    <div className="space-y-5 max-w-5xl mx-auto">
      {/* Top Controller Bar */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-4 sm:p-5 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center">
            <CalendarDays className="w-4 h-4 text-slate-700" />
          </div>
          <div>
            <h2 className="text-sm sm:text-base font-bold text-slate-900 flex items-center gap-2">
              <span>แดชบอร์ดสรุปรายปี</span>
              <span className="text-[11px] px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 font-semibold border border-slate-200">
                พ.ศ. {selectedYear + 543} ({selectedYear})
              </span>
            </h2>
            <p className="text-xs text-slate-500">
              วิเคราะห์รายรับ-รายจ่ายสะสมตลอด 12 เดือน และแยกตามกระเป๋าตัง
            </p>
          </div>
        </div>

        {/* Year Selector */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-400">เลือกปี:</span>
          <select
            value={selectedYear}
            onChange={(e) => setSelectedYear(Number(e.target.value))}
            className="px-3 py-1.5 text-xs sm:text-sm font-semibold rounded-lg border border-slate-200 bg-white text-slate-800 cursor-pointer focus:outline-none focus:border-slate-400"
          >
            {[selectedYear - 2, selectedYear - 1, selectedYear, selectedYear + 1].map((yr) => (
              <option key={yr} value={yr}>
                พ.ศ. {yr + 543} ({yr})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Wallet Filter Buttons / Pills */}
      <div className="flex flex-wrap items-center gap-1.5 bg-slate-100 p-1.5 rounded-xl border border-slate-200/60">
        <span className="text-xs text-slate-500 font-semibold px-2 flex items-center gap-1.5">
          <Filter className="w-3.5 h-3.5 text-slate-400" />
          มุมมอง:
        </span>

        {/* All View */}
        <button
          onClick={() => setWalletFilter('all')}
          className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
            walletFilter === 'all'
              ? 'bg-white text-slate-900 shadow-sm border border-slate-200/60'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          ภาพรวมทั้งหมด (Total)
        </button>

        {/* SCB */}
        <button
          onClick={() => setWalletFilter('SCB')}
          className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all flex items-center gap-1 cursor-pointer ${
            walletFilter === 'SCB'
              ? 'bg-purple-100 text-purple-900 border border-purple-200 shadow-sm'
              : 'text-purple-700 hover:bg-purple-50'
          }`}
        >
          <span>🟣</span>
          <span>SCB</span>
        </button>

        {/* K+ */}
        <button
          onClick={() => setWalletFilter('K+')}
          className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all flex items-center gap-1 cursor-pointer ${
            walletFilter === 'K+'
              ? 'bg-emerald-100 text-emerald-900 border border-emerald-200 shadow-sm'
              : 'text-emerald-700 hover:bg-emerald-50'
          }`}
        >
          <span>🟢</span>
          <span>K+</span>
        </button>

        {/* BAAC */}
        <button
          onClick={() => setWalletFilter('BAAC')}
          className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all flex items-center gap-1 cursor-pointer ${
            walletFilter === 'BAAC'
              ? 'bg-sky-100 text-sky-900 border border-sky-200 shadow-sm'
              : 'text-sky-700 hover:bg-sky-50'
          }`}
        >
          <span>🔵</span>
          <span>BAAC</span>
        </button>

        {/* Cash */}
        <button
          onClick={() => setWalletFilter('เงินสด')}
          className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all flex items-center gap-1 cursor-pointer ${
            walletFilter === 'เงินสด'
              ? 'bg-amber-100 text-amber-900 border border-amber-200 shadow-sm'
              : 'text-amber-800 hover:bg-amber-50'
          }`}
        >
          <span>🟡</span>
          <span>เงินสด</span>
        </button>
      </div>

      {/* 4 Annual Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {/* Total Income */}
        <div className="bg-white border border-slate-200/80 rounded-2xl p-4 sm:p-5 shadow-sm">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-xs font-semibold text-slate-500">
              รายรับทั้งปี
            </span>
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
          </div>
          <div className="text-xl sm:text-2xl font-bold text-emerald-600">
            ฿{totalIncome.toLocaleString('th-TH', { minimumFractionDigits: 2 })}
          </div>
          <div className="text-[11px] text-slate-400 mt-1 flex items-center gap-1">
            <TrendingUp className="w-3 h-3 text-emerald-500" />
            <span>ตลอด 12 เดือน</span>
          </div>
        </div>

        {/* Total Expense */}
        <div className="bg-white border border-slate-200/80 rounded-2xl p-4 sm:p-5 shadow-sm">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-xs font-semibold text-slate-500">
              รายจ่ายทั้งปี
            </span>
            <span className="w-2 h-2 rounded-full bg-rose-500" />
          </div>
          <div className="text-xl sm:text-2xl font-bold text-rose-600">
            ฿{totalExpense.toLocaleString('th-TH', { minimumFractionDigits: 2 })}
          </div>
          <div className="text-[11px] text-slate-400 mt-1 flex items-center gap-1">
            <TrendingDown className="w-3 h-3 text-rose-500" />
            <span>ตลอด 12 เดือน</span>
          </div>
        </div>

        {/* Accumulated Net Balance */}
        <div className="bg-white border border-slate-200/80 rounded-2xl p-4 sm:p-5 shadow-sm">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-xs font-semibold text-slate-500">
              คงเหลือสะสม
            </span>
            <Wallet className="w-3.5 h-3.5 text-slate-600" />
          </div>
          <div
            className={`text-xl sm:text-2xl font-bold ${
              netBalance >= 0 ? 'text-slate-900' : 'text-rose-600'
            }`}
          >
            {netBalance >= 0 ? '+' : ''}฿
            {netBalance.toLocaleString('th-TH', { minimumFractionDigits: 2 })}
          </div>
          <div className="text-[11px] text-slate-400 mt-1">
            {netBalance >= 0 ? 'เงินออมคงเหลือสุทธิ' : 'ใช้จ่ายเกินรายรับสะสม'}
          </div>
        </div>

        {/* Savings Rate */}
        <div className="bg-white border border-slate-200/80 rounded-2xl p-4 sm:p-5 shadow-sm">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-xs font-semibold text-slate-500">
              อัตราการออม
            </span>
            <Percent className="w-3.5 h-3.5 text-slate-600" />
          </div>
          <div className="text-xl sm:text-2xl font-bold text-slate-800">
            {savingsRate.toFixed(1)}%
          </div>
          <div className="text-[11px] text-slate-400 mt-1">
            สัดส่วนเงินเก็บเทียบรายได้
          </div>
        </div>
      </div>

      {/* Comparison Double Bar Chart */}
      <ComparisonBarChart
        months={displayedMonths}
        filterLabel={filterLabel}
      />

      {/* 12-Month Detailed Data Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-5 sm:p-6 shadow-sm overflow-hidden">
        <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
          <div>
            <h3 className="font-bold text-slate-900 text-sm sm:text-base flex items-center gap-2">
              <TableIcon className="w-4 h-4 text-slate-600" />
              ตารางสรุปข้อมูล 12 เดือน ({selectedYear})
            </h3>
            <p className="text-xs text-slate-400">
              มุมมอง: <span className="font-semibold text-slate-700">{filterLabel}</span>
            </p>
          </div>
        </div>

        <div className="overflow-x-auto -mx-5 sm:mx-0">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50 text-slate-600">
                <th className="py-2.5 px-4 font-semibold">เดือน</th>
                <th className="py-2.5 px-4 font-semibold text-right text-emerald-700">
                  รายรับ
                </th>
                <th className="py-2.5 px-4 font-semibold text-right text-rose-700">
                  รายจ่าย
                </th>
                <th className="py-2.5 px-4 font-semibold text-right text-slate-900">
                  คงเหลือ
                </th>
                <th className="py-2.5 px-4 font-semibold text-center">สถานะ</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {displayedMonths.map((m) => {
                const isPositive = m.net >= 0;
                return (
                  <tr
                    key={m.month}
                    className="hover:bg-slate-50/70 transition-colors"
                  >
                    <td className="py-2.5 px-4 font-medium text-slate-800">
                      {m.monthNameTh}
                    </td>
                    <td className="py-2.5 px-4 text-right font-medium text-emerald-600">
                      ฿{m.income.toLocaleString('th-TH', { minimumFractionDigits: 2 })}
                    </td>
                    <td className="py-2.5 px-4 text-right font-medium text-rose-600">
                      ฿{m.expense.toLocaleString('th-TH', { minimumFractionDigits: 2 })}
                    </td>
                    <td
                      className={`py-2.5 px-4 text-right font-bold ${
                        isPositive ? 'text-slate-900' : 'text-rose-600'
                      }`}
                    >
                      {isPositive ? '+' : ''}฿
                      {m.net.toLocaleString('th-TH', { minimumFractionDigits: 2 })}
                    </td>
                    <td className="py-2.5 px-4 text-center">
                      <span
                        className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                          isPositive
                            ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                            : 'bg-rose-50 text-rose-800 border border-rose-200'
                        }`}
                      >
                        {isPositive ? 'เงินเหลือ' : 'ใช้เกิน'}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
            {/* Total Row */}
            <tfoot>
              <tr className="bg-slate-50 font-bold text-slate-900 border-t-2 border-slate-200">
                <td className="py-3 px-4">
                  ผลรวมทั้งปี
                </td>
                <td className="py-3 px-4 text-right text-emerald-700">
                  ฿{totalIncome.toLocaleString('th-TH', { minimumFractionDigits: 2 })}
                </td>
                <td className="py-3 px-4 text-right text-rose-700">
                  ฿{totalExpense.toLocaleString('th-TH', { minimumFractionDigits: 2 })}
                </td>
                <td
                  className={`py-3 px-4 text-right ${
                    netBalance >= 0 ? 'text-slate-900' : 'text-rose-700'
                  }`}
                >
                  {netBalance >= 0 ? '+' : ''}฿
                  {netBalance.toLocaleString('th-TH', { minimumFractionDigits: 2 })}
                </td>
                <td className="py-3 px-4 text-center">
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-200 text-slate-800">
                    ออม {savingsRate.toFixed(1)}%
                  </span>
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
    </div>
  );
};
