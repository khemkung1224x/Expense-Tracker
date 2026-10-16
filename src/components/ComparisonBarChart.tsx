import React, { useState } from 'react';
import { AnnualMonthSummary } from '../types';

interface ComparisonBarChartProps {
  months: AnnualMonthSummary[];
  filterLabel: string;
}

export const ComparisonBarChart: React.FC<ComparisonBarChartProps> = ({
  months,
  filterLabel,
}) => {
  const [hoveredMonth, setHoveredMonth] = useState<AnnualMonthSummary | null>(null);

  // คำนวณค่าสูงสุดเพื่อ scale กราฟ
  const maxVal = Math.max(
    ...months.map((m) => Math.max(m.income, m.expense)),
    10000
  );
  // ปัดยอด max ให้สวยงาม
  const ceilMax = Math.ceil(maxVal / 10000) * 10000;

  const height = 240;
  const paddingBottom = 28;
  const paddingTop = 20;
  const availableHeight = height - paddingBottom - paddingTop;

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 p-5 sm:p-6 shadow-sm">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-6">
        <div>
          <h4 className="font-bold text-slate-900 text-sm sm:text-base">
            เปรียบเทียบรายรับ - รายจ่าย ตลอด 12 เดือน
          </h4>
          <p className="text-xs text-slate-500 mt-0.5">
            มุมมอง:{' '}
            <span className="font-semibold text-slate-800">
              {filterLabel}
            </span>
          </p>
        </div>

        {/* Legend */}
        <div className="flex items-center gap-4 text-xs font-semibold">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-sm bg-emerald-500" />
            <span className="text-slate-600">รายรับ (Income)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-sm bg-rose-500" />
            <span className="text-slate-600">รายจ่าย (Expense)</span>
          </div>
        </div>
      </div>

      {/* Bar Chart Area */}
      <div className="relative pt-2 overflow-x-auto">
        <div className="min-w-[580px]">
          {/* Subtle Grid Lines (#E2E8F0) */}
          <div className="absolute inset-0 top-3 bottom-8 flex flex-col justify-between pointer-events-none">
            {[1, 0.75, 0.5, 0.25, 0].map((ratio) => (
              <div
                key={ratio}
                className="w-full flex items-center border-b border-slate-200/60 text-[10px] text-slate-400"
              >
                <span className="w-12 text-right pr-2 select-none font-medium">
                  ฿{((ceilMax * ratio) / 1000).toFixed(0)}k
                </span>
              </div>
            ))}
          </div>

          {/* Bars Container */}
          <div className="relative pl-14 pr-2 flex items-end justify-between h-[190px] pb-6">
            {months.map((m) => {
              const incomeHeight = (m.income / ceilMax) * availableHeight;
              const expenseHeight = (m.expense / ceilMax) * availableHeight;
              const isHovered = hoveredMonth?.month === m.month;

              return (
                <div
                  key={m.month}
                  className="flex-1 flex flex-col items-center justify-end h-full group cursor-pointer px-1 relative"
                  onMouseEnter={() => setHoveredMonth(m)}
                  onMouseLeave={() => setHoveredMonth(null)}
                >
                  {/* Bars Pair */}
                  <div className="w-full flex items-end justify-center gap-1 max-w-[32px]">
                    {/* Income Bar (Emerald) */}
                    <div
                      style={{ height: `${Math.max(incomeHeight, 2)}px` }}
                      className={`w-1/2 rounded-t-sm transition-all duration-200 ${
                        isHovered
                          ? 'bg-emerald-600 shadow-sm'
                          : 'bg-emerald-500 hover:bg-emerald-600'
                      }`}
                    />

                    {/* Expense Bar (Rose) */}
                    <div
                      style={{ height: `${Math.max(expenseHeight, 2)}px` }}
                      className={`w-1/2 rounded-t-sm transition-all duration-200 ${
                        isHovered
                          ? 'bg-rose-600 shadow-sm'
                          : 'bg-rose-500 hover:bg-rose-600'
                      }`}
                    />
                  </div>

                  {/* Month Label */}
                  <div
                    className={`text-[11px] mt-2 font-medium transition-colors ${
                      isHovered
                        ? 'text-slate-900 font-bold'
                        : 'text-slate-500'
                    }`}
                  >
                    {m.monthShortTh}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Hovered Month Tooltip Card (Minimal Light Design) */}
      <div className="mt-3 pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between text-xs min-h-[38px] bg-slate-50 rounded-xl px-4 py-2 border border-slate-100">
        {hoveredMonth ? (
          <>
            <span className="font-bold text-slate-800">
              เดือน {hoveredMonth.monthNameTh}:
            </span>
            <div className="flex items-center gap-4">
              <span className="text-emerald-700">
                รายรับ: <b className="font-bold">฿{hoveredMonth.income.toLocaleString('th-TH')}</b>
              </span>
              <span className="text-rose-700">
                รายจ่าย: <b className="font-bold">฿{hoveredMonth.expense.toLocaleString('th-TH')}</b>
              </span>
              <span
                className={`font-bold ${
                  hoveredMonth.net >= 0 ? 'text-emerald-800' : 'text-rose-800'
                }`}
              >
                สุทธิ: {hoveredMonth.net >= 0 ? '+' : ''}
                ฿{hoveredMonth.net.toLocaleString('th-TH')}
              </span>
            </div>
          </>
        ) : (
          <span className="text-slate-400 text-xs font-normal">
            * ชี้หรือแตะที่แท่งกราฟของแต่ละเดือนเพื่อดูยอดรายรับ-รายจ่ายอย่างละเอียด
          </span>
        )}
      </div>
    </div>
  );
};
