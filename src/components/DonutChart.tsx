import React, { useState } from 'react';

interface DataPoint {
  label: string;
  value: number;
  color: string;
}

interface DonutChartProps {
  title: string;
  data: Record<string, number>;
  emptyMessage?: string;
  type: 'income' | 'expense';
}

const PALETTES = {
  expense: [
    '#F43F5E', // Rose
    '#FB923C', // Orange
    '#FBBF24', // Amber
    '#10B981', // Emerald
    '#06B6D4', // Cyan
    '#3B82F6', // Blue
    '#6366F1', // Indigo
    '#8B5CF6', // Purple
    '#EC4899', // Pink
    '#14B8A6', // Teal
    '#84CC16', // Lime
    '#64748B', // Slate
  ],
  income: [
    '#10B981', // Emerald
    '#059669', // Deep Emerald
    '#34D399', // Mint
    '#0D9488', // Teal
    '#0284C7', // Sky
    '#6366F1', // Indigo
    '#8B5CF6', // Purple
    '#F59E0B', // Amber
  ],
};

export const DonutChart: React.FC<DonutChartProps> = ({
  title,
  data,
  emptyMessage = 'ไม่มีข้อมูลในกลุ่มนี้',
  type,
}) => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const entries = Object.entries(data).filter(([_, val]) => val > 0);
  const total = entries.reduce((acc, [_, val]) => acc + val, 0);

  const colors = PALETTES[type];
  const chartData: DataPoint[] = entries.map(([label, value], idx) => ({
    label,
    value,
    color: colors[idx % colors.length],
  }));

  // SVG parameters
  const size = 200;
  const strokeWidth = 28;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const center = size / 2;

  let accumulatedPercent = 0;

  if (total === 0 || chartData.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-sm">
        <h4 className="font-bold text-slate-800 mb-4 text-sm flex items-center justify-between">
          <span>{title}</span>
          <span className="text-xs text-slate-400 font-normal">฿0.00</span>
        </h4>
        <div className="flex flex-col items-center justify-center h-44 text-slate-400 text-xs">
          <div className="w-12 h-12 rounded-full border-2 border-dashed border-slate-200 flex items-center justify-center mb-2 text-slate-300">
            —
          </div>
          <p>{emptyMessage}</p>
        </div>
      </div>
    );
  }

  const activeItem = hoveredIndex !== null ? chartData[hoveredIndex] : null;

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <h4 className="font-bold text-slate-900 text-sm flex items-center gap-2">
          <span
            className={`w-2.5 h-2.5 rounded-full ${
              type === 'income' ? 'bg-emerald-500' : 'bg-rose-500'
            }`}
          />
          {title}
        </h4>
        <span
          className={`text-sm font-bold ${
            type === 'income' ? 'text-emerald-600' : 'text-rose-600'
          }`}
        >
          ฿{total.toLocaleString('th-TH', { minimumFractionDigits: 2 })}
        </span>
      </div>

      <div className="flex flex-col sm:flex-row items-center gap-6">
        {/* SVG Donut */}
        <div className="relative flex-shrink-0" style={{ width: size, height: size }}>
          <svg width={size} height={size} className="transform -rotate-90">
            {/* Background track */}
            <circle
              cx={center}
              cy={center}
              r={radius}
              fill="transparent"
              stroke="#F1F5F9"
              strokeWidth={strokeWidth}
            />
            {/* Slices */}
            {chartData.map((item, idx) => {
              const percent = item.value / total;
              const strokeDasharray = `${percent * circumference} ${circumference}`;
              const strokeDashoffset = -accumulatedPercent * circumference;
              accumulatedPercent += percent;
              const isHovered = hoveredIndex === idx;

              return (
                <circle
                  key={item.label}
                  cx={center}
                  cy={center}
                  r={radius}
                  fill="transparent"
                  stroke={item.color}
                  strokeWidth={isHovered ? strokeWidth + 4 : strokeWidth}
                  strokeDasharray={strokeDasharray}
                  strokeDashoffset={strokeDashoffset}
                  className="transition-all duration-200 cursor-pointer"
                  onMouseEnter={() => setHoveredIndex(idx)}
                  onMouseLeave={() => setHoveredIndex(null)}
                />
              );
            })}
          </svg>

          {/* Center Info */}
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-3 pointer-events-none">
            <span className="text-[11px] text-slate-500 font-medium">
              {activeItem ? activeItem.label : 'สัดส่วนรวม'}
            </span>
            <span className="text-sm font-bold text-slate-900 mt-0.5 truncate max-w-[110px]">
              {activeItem
                ? `฿${activeItem.value.toLocaleString('th-TH')}`
                : `${chartData.length} กลุ่ม`}
            </span>
            <span className="text-[11px] font-semibold text-slate-600 mt-0.5">
              {activeItem
                ? `${((activeItem.value / total) * 100).toFixed(1)}%`
                : '100%'}
            </span>
          </div>
        </div>

        {/* Legend List */}
        <div className="flex-1 w-full space-y-1.5 max-h-52 overflow-y-auto pr-1">
          {chartData.map((item, idx) => {
            const percent = ((item.value / total) * 100).toFixed(1);
            const isHovered = hoveredIndex === idx;

            return (
              <div
                key={item.label}
                onMouseEnter={() => setHoveredIndex(idx)}
                onMouseLeave={() => setHoveredIndex(null)}
                className={`flex items-center justify-between text-xs p-1.5 rounded-lg transition-colors cursor-pointer ${
                  isHovered
                    ? 'bg-slate-100 font-semibold'
                    : 'hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center gap-2 truncate pr-2">
                  <span
                    className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                    style={{ backgroundColor: item.color }}
                  />
                  <span className="truncate text-slate-700">
                    {item.label}
                  </span>
                </div>
                <div className="text-right flex-shrink-0 flex items-center gap-2">
                  <span className="text-slate-400 text-[11px]">{percent}%</span>
                  <span className="font-semibold text-slate-800">
                    ฿{item.value.toLocaleString('th-TH')}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
