import React, { useState } from 'react';
import {
  Transaction,
  TransactionType,
  WalletType,
  WALLET_CONFIG,
  INCOME_CATEGORIES,
  EXPENSE_CATEGORIES,
} from '../types';
import {
  PlusCircle,
  MinusCircle,
  Calendar,
  Wallet,
  Tag,
  FileText,
  Trash2,
  CheckCircle,
  Clock,
  Sparkles,
} from 'lucide-react';

interface EntryFormTabProps {
  transactions: Transaction[];
  onAddTransaction: (tx: Omit<Transaction, 'id'>) => Promise<void>;
  onDeleteTransaction: (id: string) => void;
  isSaving: boolean;
  onOpenSheetsModal: () => void;
}

export const EntryFormTab: React.FC<EntryFormTabProps> = ({
  transactions,
  onAddTransaction,
  onDeleteTransaction,
  isSaving,
  onOpenSheetsModal,
}) => {
  // Form State
  const todayStr = new Date().toISOString().split('T')[0];
  const [date, setDate] = useState<string>(todayStr);
  const [type, setType] = useState<TransactionType>('expense');
  const [title, setTitle] = useState<string>('');
  const [amount, setAmount] = useState<string>('');
  const [category, setCategory] = useState<string>(EXPENSE_CATEGORIES[0]);
  const [wallet, setWallet] = useState<WalletType>('เงินสด');
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  // Quick Amount adders
  const quickAmounts = [50, 100, 500, 1000];

  // Quick Titles based on type
  const quickExpenseTitles = ['อาหารมื้อเที่ยง', 'กาแฟสด', 'ค่าน้ำมัน', 'ของใช้จำเป็น', 'ค่ารถไฟฟ้า', 'ช้อปปิ้ง'];
  const quickIncomeTitles = ['เงินเดือน', 'รับจ้างฟรีแลนซ์', 'มีคนโอนให้', 'ขายของออนไลน์'];

  // Handle Switch Type
  const handleTypeChange = (newType: TransactionType) => {
    setType(newType);
    if (newType === 'income') {
      setCategory(INCOME_CATEGORIES[0]);
    } else {
      setCategory(EXPENSE_CATEGORIES[0]);
    }
  };

  // Handle Submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const numAmount = parseFloat(amount);
    if (!numAmount || numAmount <= 0) {
      alert('กรุณาระบุจำนวนเงินที่ถูกต้อง (มากกว่า 0)');
      return;
    }
    if (!title.trim()) {
      alert('กรุณาระบุชื่อรายการ');
      return;
    }

    await onAddTransaction({
      date,
      type,
      title: title.trim(),
      amount: numAmount,
      category,
      wallet,
    });

    setTitle('');
    setAmount('');
  };

  // Recent 10 transactions
  const recentTransactions = [...transactions]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 10);

  // Quick calculations for today
  const todayTransactions = transactions.filter((t) => t.date === todayStr);
  const todayExpense = todayTransactions
    .filter((t) => t.type === 'expense')
    .reduce((s, t) => s + t.amount, 0);
  const todayIncome = todayTransactions
    .filter((t) => t.type === 'income')
    .reduce((s, t) => s + t.amount, 0);

  return (
    <div className="space-y-5 max-w-3xl mx-auto">
      {/* Quick Today Overview Pills */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        <div className="bg-white border border-slate-200/80 p-3.5 rounded-2xl shadow-sm">
          <div className="flex items-center gap-1.5 text-xs text-slate-500 mb-1">
            <Clock className="w-3.5 h-3.5 text-slate-400" />
            <span>รายจ่ายวันนี้</span>
          </div>
          <div className="text-base sm:text-lg font-bold text-rose-600">
            ฿{todayExpense.toLocaleString('th-TH', { minimumFractionDigits: 2 })}
          </div>
        </div>

        <div className="bg-white border border-slate-200/80 p-3.5 rounded-2xl shadow-sm">
          <div className="flex items-center gap-1.5 text-xs text-slate-500 mb-1">
            <CheckCircle className="w-3.5 h-3.5 text-emerald-500" />
            <span>รายรับวันนี้</span>
          </div>
          <div className="text-base sm:text-lg font-bold text-emerald-600">
            ฿{todayIncome.toLocaleString('th-TH', { minimumFractionDigits: 2 })}
          </div>
        </div>

        <div className="col-span-2 sm:col-span-1 bg-white border border-slate-200/80 p-3.5 rounded-2xl shadow-sm flex items-center justify-between">
          <div>
            <div className="text-xs font-semibold text-slate-800">
              Google Sheets
            </div>
            <div className="text-[11px] text-slate-500 mt-0.5">
              ซิงก์ข้อมูลลงสเปรดชีต
            </div>
          </div>
          <button
            onClick={onOpenSheetsModal}
            className="text-xs font-semibold px-2.5 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg transition-colors cursor-pointer"
          >
            ตั้งค่าชีต
          </button>
        </div>
      </div>

      {/* Main Form Card */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-5 sm:p-7 shadow-sm">
        <div className="flex items-center justify-between pb-4 mb-5 border-b border-slate-100">
          <div>
            <h2 className="text-base sm:text-lg font-bold text-slate-900 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-500" />
              บันทึกรายการ
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              เลือกประเภท ระบุจำนวนเงิน และเลือกกระเป๋าตัง
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* 1. Toggle Switch: รายรับ vs รายจ่าย */}
          <div className="grid grid-cols-2 gap-2 p-1 bg-slate-100 rounded-xl">
            <button
              type="button"
              onClick={() => handleTypeChange('income')}
              className={`py-2.5 px-3 rounded-lg font-semibold text-xs sm:text-sm flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                type === 'income'
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <PlusCircle className="w-4 h-4" />
              <span>รายรับ (Income)</span>
            </button>

            <button
              type="button"
              onClick={() => handleTypeChange('expense')}
              className={`py-2.5 px-3 rounded-lg font-semibold text-xs sm:text-sm flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                type === 'expense'
                  ? 'bg-rose-600 text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <MinusCircle className="w-4 h-4" />
              <span>รายจ่าย (Expense)</span>
            </button>
          </div>

          {/* 2. Amount Input */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              จำนวนเงิน (บาท) *
            </label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-2xl font-bold text-slate-400">
                ฿
              </span>
              <input
                type="number"
                step="any"
                min="0"
                placeholder="0.00"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                required
                className={`w-full pl-11 pr-4 py-3 text-2xl sm:text-3xl font-bold rounded-xl border transition-all focus:outline-none focus:ring-2 ${
                  type === 'income'
                    ? 'border-emerald-200 text-emerald-600 focus:border-emerald-500 focus:ring-emerald-100 bg-emerald-50/20'
                    : 'border-rose-200 text-rose-600 focus:border-rose-500 focus:ring-rose-100 bg-rose-50/20'
                }`}
              />
            </div>

            {/* Quick Amount Chips */}
            <div className="flex flex-wrap items-center gap-1.5 mt-2">
              <span className="text-[11px] text-slate-400">
                เพิ่มด่วน:
              </span>
              {quickAmounts.map((q) => (
                <button
                  key={q}
                  type="button"
                  onClick={() => {
                    const current = parseFloat(amount) || 0;
                    setAmount((current + q).toString());
                  }}
                  className="text-xs px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium transition-colors cursor-pointer"
                >
                  +{q.toLocaleString()} ฿
                </button>
              ))}
              {amount && (
                <button
                  type="button"
                  onClick={() => setAmount('')}
                  className="text-xs px-2 py-1 text-slate-400 hover:text-rose-500 transition-colors ml-auto cursor-pointer"
                >
                  ล้างค่า
                </button>
              )}
            </div>
          </div>

          {/* 3. Title with Quick Suggestions */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5 flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5 text-slate-400" />
              ชื่อรายการ *
            </label>
            <input
              type="text"
              placeholder={type === 'income' ? 'เช่น เงินเดือน, ค่าจ้างงานเสริม' : 'เช่น ข้าวเที่ยง, ค่าน้ำมัน, ช้อปปิ้ง'}
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-200 bg-white text-slate-900 focus:outline-none focus:border-slate-400 focus:ring-2 focus:ring-slate-100"
            />
            {/* Quick Title Chips */}
            <div className="flex flex-wrap items-center gap-1.5 mt-2">
              {(type === 'income' ? quickIncomeTitles : quickExpenseTitles).map((item) => (
                <button
                  key={item}
                  type="button"
                  onClick={() => setTitle(item)}
                  className="text-[11px] px-2 py-0.5 rounded-md bg-slate-100 hover:bg-slate-200 text-slate-600 cursor-pointer transition-colors"
                >
                  {item}
                </button>
              ))}
            </div>
          </div>

          {/* 4. Dropdowns: Date, Category, Wallet */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
            {/* Date */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5 flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-slate-400" />
                วันที่
              </label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                required
                className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl border border-slate-200 bg-white text-slate-900 focus:outline-none focus:border-slate-400 focus:ring-2 focus:ring-slate-100 font-medium"
              />
            </div>

            {/* Category Dropdown */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5 flex items-center gap-1.5">
                <Tag className="w-3.5 h-3.5 text-slate-400" />
                กลุ่ม ({type === 'income' ? 'รายรับ' : 'รายจ่าย'}) *
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl border border-slate-200 bg-white text-slate-900 focus:outline-none focus:border-slate-400 focus:ring-2 focus:ring-slate-100 font-medium"
              >
                {type === 'income'
                  ? INCOME_CATEGORIES.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))
                  : EXPENSE_CATEGORIES.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
              </select>
            </div>

            {/* Wallet Dropdown with Bank Badges */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5 flex items-center gap-1.5">
                <Wallet className="w-3.5 h-3.5 text-slate-400" />
                กระเป๋าตัง *
              </label>
              <select
                value={wallet}
                onChange={(e) => setWallet(e.target.value as WalletType)}
                className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl border border-slate-200 bg-white text-slate-900 focus:outline-none focus:border-slate-400 focus:ring-2 focus:ring-slate-100 font-medium"
              >
                <option value="SCB">🟣 SCB (ไทยพาณิชย์)</option>
                <option value="K+">🟢 K+ (กสิกรไทย)</option>
                <option value="BAAC">🔵 BAAC (ธ.ก.ส.)</option>
                <option value="เงินสด">🟡 เงินสด (Cash)</option>
              </select>
            </div>
          </div>

          {/* Wallet Preview Badge */}
          <div className="flex items-center gap-2 p-2 rounded-xl bg-slate-50 border border-slate-200/60 text-xs">
            <span className="text-slate-500">กระเป๋าที่เลือก:</span>
            <span
              className={`px-2.5 py-0.5 rounded-lg font-semibold flex items-center gap-1.5 ${
                WALLET_CONFIG[wallet].badgeBg
              }`}
            >
              <span>{WALLET_CONFIG[wallet].icon}</span>
              <span>{WALLET_CONFIG[wallet].label}</span>
            </span>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSaving}
            className={`w-full py-3.5 px-6 rounded-xl font-bold text-sm text-white shadow-sm transition-all flex items-center justify-center gap-2 cursor-pointer ${
              type === 'income'
                ? 'bg-emerald-600 hover:bg-emerald-700'
                : 'bg-rose-600 hover:bg-rose-700'
            } ${isSaving ? 'opacity-70 cursor-not-allowed' : 'active:scale-[0.99]'}`}
          >
            {isSaving ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>กำลังบันทึกข้อมูล...</span>
              </>
            ) : (
              <>
                <CheckCircle className="w-4 h-4" />
                <span>
                  บันทึก{type === 'income' ? 'รายรับ' : 'รายจ่าย'}
                  {amount ? ` ฿${parseFloat(amount).toLocaleString('th-TH')}` : ''}
                </span>
              </>
            )}
          </button>
        </form>
      </div>

      {/* Recent Transactions List */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-5 sm:p-6 shadow-sm">
        <div className="flex items-center justify-between mb-3 pb-3 border-b border-slate-100">
          <div>
            <h3 className="font-bold text-slate-900 text-sm sm:text-base">
              ประวัติรายการล่าสุด
            </h3>
            <p className="text-xs text-slate-400">
              แสดง 10 รายการล่าสุด
            </p>
          </div>
          <span className="text-xs bg-slate-100 px-2.5 py-1 rounded-lg text-slate-600 font-medium">
            รวม {transactions.length} รายการ
          </span>
        </div>

        {recentTransactions.length === 0 ? (
          <div className="text-center py-10 text-slate-400 text-xs">
            <p>ยังไม่มีรายการบันทึก</p>
            <p className="text-[11px] mt-1 text-slate-300">
              กรอกฟอร์มด้านบนเพื่อเริ่มต้นบันทึก
            </p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {recentTransactions.map((tx) => {
              const wConfig = WALLET_CONFIG[tx.wallet] || WALLET_CONFIG['เงินสด'];
              const isIncome = tx.type === 'income';

              return (
                <div
                  key={tx.id}
                  className="py-3 flex items-center justify-between gap-3 group hover:bg-slate-50/70 px-2 rounded-xl transition-colors"
                >
                  {/* Left: Icon & Details */}
                  <div className="flex items-center gap-3 min-w-0">
                    <div
                      className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-sm flex-shrink-0 ${
                        isIncome
                          ? 'bg-emerald-50 text-emerald-600 border border-emerald-200'
                          : 'bg-rose-50 text-rose-600 border border-rose-200'
                      }`}
                    >
                      {isIncome ? '+' : '-'}
                    </div>

                    <div className="min-w-0">
                      <div className="font-semibold text-xs sm:text-sm text-slate-900 truncate">
                        {tx.title}
                      </div>
                      <div className="flex flex-wrap items-center gap-2 mt-0.5">
                        <span className="text-[11px] text-slate-400">
                          {tx.date}
                        </span>
                        <span className="text-[11px] px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 font-medium">
                          {tx.category}
                        </span>
                        <span
                          className={`text-[10px] px-2 py-0.5 rounded-md font-semibold flex items-center gap-1 ${wConfig.badgeBg}`}
                        >
                          <span>{wConfig.icon}</span>
                          <span>{wConfig.name}</span>
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Right: Amount & Delete */}
                  <div className="flex items-center gap-2.5 flex-shrink-0">
                    <span
                      className={`text-xs sm:text-sm font-bold ${
                        isIncome
                          ? 'text-emerald-600'
                          : 'text-rose-600'
                      }`}
                    >
                      {isIncome ? '+' : '-'}฿
                      {tx.amount.toLocaleString('th-TH', {
                        minimumFractionDigits: 2,
                      })}
                    </span>

                    {deleteConfirmId === tx.id ? (
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => {
                            onDeleteTransaction(tx.id);
                            setDeleteConfirmId(null);
                          }}
                          className="px-2 py-0.5 text-xs bg-rose-600 hover:bg-rose-700 text-white rounded font-medium cursor-pointer"
                        >
                          ยืนยัน
                        </button>
                        <button
                          onClick={() => setDeleteConfirmId(null)}
                          className="px-2 py-0.5 text-xs bg-slate-200 hover:bg-slate-300 text-slate-700 rounded cursor-pointer"
                        >
                          ยกเลิก
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => setDeleteConfirmId(tx.id)}
                        title="ลบรายการ"
                        className="text-slate-400 hover:text-rose-600 p-1.5 rounded-lg hover:bg-rose-50 transition-colors cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
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
