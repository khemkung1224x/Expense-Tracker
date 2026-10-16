import React from 'react';
import {
  FileSpreadsheet,
  PlusCircle,
  BarChart3,
  CalendarRange,
  Wallet,
  RotateCw,
} from 'lucide-react';

export type TabType = 'entry' | 'monthly' | 'annual';

interface NavbarProps {
  activeTab: TabType;
  onChangeTab: (tab: TabType) => void;
  onOpenSheetsModal: () => void;
  hasSheetsConfigured: boolean;
  onRefreshData: () => Promise<void>;
  isSyncing: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  onChangeTab,
  onOpenSheetsModal,
  hasSheetsConfigured,
  onRefreshData,
  isSyncing,
}) => {
  const navItems = [
    {
      id: 'entry' as TabType,
      label: 'บันทึกรายการ',
      icon: PlusCircle,
    },
    {
      id: 'monthly' as TabType,
      label: 'สรุปรายเดือน',
      icon: BarChart3,
    },
    {
      id: 'annual' as TabType,
      label: 'สรุปรายปี',
      icon: CalendarRange,
    },
  ];

  return (
    <>
      {/* Desktop & Tablet Top Bar */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/80">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-3 sm:gap-4">
          {/* Logo / Brand */}
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-slate-900 text-white flex items-center justify-center shadow-sm flex-shrink-0">
              <Wallet className="w-4 h-4 text-emerald-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-bold text-base sm:text-lg text-slate-900 tracking-tight leading-tight">
                  Expense Tracker
                </h1>
                {hasSheetsConfigured && (
                  <span className="hidden sm:inline-block text-[10px] px-2 py-0.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 font-semibold">
                    Sheets Live
                  </span>
                )}
              </div>
              <p className="text-[11px] text-slate-500 hidden sm:block font-normal">
                บันทึกรายรับ-รายจ่าย Google Sheets
              </p>
            </div>
          </div>

          {/* Center Navigation Tabs (Desktop) */}
          <nav className="hidden md:flex items-center gap-1 bg-slate-100 p-1 rounded-xl border border-slate-200">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => onChangeTab(item.id)}
                  className={`px-3.5 py-1.5 rounded-lg text-xs sm:text-sm font-semibold flex items-center gap-2 transition-all cursor-pointer ${
                    isActive
                      ? 'bg-white text-slate-900 shadow-sm border border-slate-200/60'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-slate-900' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Right Action Icons */}
          <div className="flex items-center gap-2">
            {/* Manual Sync / Refresh Button */}
            <button
              onClick={onRefreshData}
              disabled={isSyncing}
              className="px-2.5 sm:px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer border bg-white border-slate-200 text-slate-700 hover:bg-slate-50 shadow-sm disabled:opacity-60 active:scale-95"
              title="รีเฟรชข้อมูลล่าสุดจาก Google Sheets"
            >
              <RotateCw className={`w-3.5 h-3.5 text-slate-600 ${isSyncing ? 'animate-spin text-emerald-600' : ''}`} />
              <span className="text-xs">
                {isSyncing ? 'กำลังซิงค์...' : 'รีเฟรช'}
              </span>
            </button>

            {/* Google Sheets Modal Button */}
            <button
              onClick={onOpenSheetsModal}
              className={`px-2.5 sm:px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer border ${
                hasSheetsConfigured
                  ? 'bg-emerald-50 border-emerald-200 text-emerald-700 hover:bg-emerald-100'
                  : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50 shadow-sm'
              }`}
              title="ตั้งค่า Google Sheets"
            >
              <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
              <span className="hidden sm:inline">
                {hasSheetsConfigured ? 'Google Sheets' : 'ตั้งค่าชีต'}
              </span>
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Bottom Navigation Bar */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-lg border-t border-slate-200 px-3 py-2 flex items-center justify-around shadow-lg">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onChangeTab(item.id)}
              className={`flex flex-col items-center justify-center py-1 px-3 rounded-xl transition-all cursor-pointer ${
                isActive
                  ? 'text-slate-900 font-bold'
                  : 'text-slate-500 font-medium'
              }`}
            >
              <Icon className={`w-5 h-5 mb-0.5 ${isActive ? 'text-slate-900' : 'text-slate-400'}`} />
              <span className="text-[11px]">{item.label}</span>
            </button>
          );
        })}
      </div>
    </>
  );
};
