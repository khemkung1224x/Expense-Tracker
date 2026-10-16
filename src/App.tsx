/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Transaction } from './types';
import {
  loadStoredTransactions,
  saveStoredTransactions,
  getStoredWebAppUrl,
  saveStoredWebAppUrl,
  INITIAL_TRANSACTIONS,
} from './data/mockData';
import { Navbar, TabType } from './components/Navbar';
import { EntryFormTab } from './components/EntryFormTab';
import { MonthlyDashboardTab } from './components/MonthlyDashboardTab';
import { AnnualDashboardTab } from './components/AnnualDashboardTab';
import { GoogleSheetsModal } from './components/GoogleSheetsModal';
import { Toast, ToastMessage } from './components/Toast';
import { ErrorBoundary } from './components/ErrorBoundary';

export default function App() {
  // Navigation tab
  const [activeTab, setActiveTab] = useState<TabType>('entry');

  // Transactions State
  const [transactions, setTransactions] = useState<Transaction[]>(() => {
    return loadStoredTransactions();
  });

  // Google Apps Script Web App URL
  const [webAppUrl, setWebAppUrl] = useState<string>(() => {
    return getStoredWebAppUrl();
  });

  // Sheets Modal
  const [isSheetsModalOpen, setIsSheetsModalOpen] = useState<boolean>(false);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [isSyncing, setIsSyncing] = useState<boolean>(false);

  // Toasts
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const addToast = (type: 'success' | 'error' | 'info', text: string) => {
    const id = Date.now().toString() + Math.random().toString().slice(2, 6);
    setToasts((prev) => [...prev, { id, type, text }]);
  };

  const dismissToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Ensure clean light theme by removing any legacy dark class
  useEffect(() => {
    if (typeof document !== 'undefined') {
      document.documentElement.classList.remove('dark');
      localStorage.removeItem('THEME_MODE');
    }
  }, []);

  // Save transactions to LocalStorage whenever updated
  useEffect(() => {
    saveStoredTransactions(transactions);
  }, [transactions]);

  // Handle Add Transaction
  const handleAddTransaction = async (newTxData: Omit<Transaction, 'id'>) => {
    setIsSaving(true);
    const newId = 'tx-' + Date.now();
    const newTx: Transaction = {
      ...newTxData,
      id: newId,
      createdAt: new Date().toISOString(),
    };

    // If Google Apps Script Web App URL is configured, send to Sheets
    if (webAppUrl.trim()) {
      try {
        await fetch(webAppUrl, {
          method: 'POST',
          mode: 'no-cors',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(newTx),
        });
        addToast(
          'success',
          `บันทึก "${newTx.title}" สำเร็จ (ซิงก์ลง Google Sheets แล้ว)`
        );
      } catch (err: any) {
        console.warn('Google Sheets POST error, saved locally:', err);
        addToast(
          'info',
          `บันทึกในเครื่องแล้ว (ส่งลง Sheets ไม่สำเร็จ: ${err.message || 'โปรดตรวจ Web App URL'})`
        );
      }
    } else {
      addToast(
        'success',
        `บันทึก "${newTx.title}" ฿${newTx.amount.toLocaleString('th-TH')} เรียบร้อยแล้ว`
      );
    }

    setTransactions((prev) => [newTx, ...prev]);
    setIsSaving(false);
  };

  // Handle Delete Transaction
  const handleDeleteTransaction = (id: string) => {
    const target = transactions.find((t) => t.id === id);
    setTransactions((prev) => prev.filter((t) => t.id !== id));
    addToast('info', `ลบรายการ "${target?.title || ''}" เรียบร้อยแล้ว`);
  };

  // Handle Save Web App URL
  const handleSaveWebAppUrl = (url: string) => {
    setWebAppUrl(url);
    saveStoredWebAppUrl(url);
    addToast('success', 'บันทึกการตั้งค่า Google Apps Script เรียบร้อยแล้ว');
  };

  // Handle Sync with Sheets
  const handleSyncWithSheets = async () => {
    if (!webAppUrl.trim()) {
      addToast('error', 'กรุณาระบุ Web App URL ก่อนซิงก์');
      return;
    }

    setIsSyncing(true);
    try {
      const getUrl = webAppUrl.includes('?')
        ? `${webAppUrl}&action=getTransactions`
        : `${webAppUrl}?action=getTransactions`;

      const res = await fetch(getUrl);
      if (!res.ok) {
        throw new Error(`HTTP ${res.status}`);
      }
      const data = await res.json();
      if (data.success && Array.isArray(data.transactions)) {
        if (data.transactions.length > 0) {
          setTransactions(data.transactions);
          addToast(
            'success',
            `ดึงข้อมูลสำเร็จ ${data.transactions.length} รายการจาก Google Sheets`
          );
        } else {
          addToast('info', 'เชื่อมต่อสำเร็จ แต่ยังไม่มีข้อมูลในชีต');
        }
      } else {
        throw new Error(data.message || 'ไม่สามารถแปลงข้อมูลได้');
      }
    } catch (err: any) {
      addToast(
        'error',
        `ซิงก์ข้อมูลไม่สำเร็จ: ${err.message || 'ตรวจสอบสิทธิ์ Web App Anyone'}`
      );
    } finally {
      setIsSyncing(false);
    }
  };

  // Handle Reset to Mock Data
  const handleResetMockData = () => {
    setTransactions(INITIAL_TRANSACTIONS);
    saveStoredTransactions(INITIAL_TRANSACTIONS);
    addToast('success', 'รีเซ็ตข้อมูลตัวอย่าง 12 เดือนเรียบร้อยแล้ว');
  };

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-[#F8FAFC] text-slate-800 flex flex-col font-sans">
        {/* Toast Alerts */}
        <Toast toasts={toasts} onDismiss={dismissToast} />

        {/* Navigation Bar */}
        <Navbar
          activeTab={activeTab}
          onChangeTab={setActiveTab}
          onOpenSheetsModal={() => setIsSheetsModalOpen(true)}
          hasSheetsConfigured={Boolean(webAppUrl.trim())}
        />

        {/* Main Content Area */}
        <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 py-6 pb-24 md:pb-12">
          {activeTab === 'entry' && (
            <EntryFormTab
              transactions={transactions}
              onAddTransaction={handleAddTransaction}
              onDeleteTransaction={handleDeleteTransaction}
              isSaving={isSaving}
              onOpenSheetsModal={() => setIsSheetsModalOpen(true)}
            />
          )}

          {activeTab === 'monthly' && (
            <MonthlyDashboardTab
              transactions={transactions}
              onDeleteTransaction={handleDeleteTransaction}
            />
          )}

          {activeTab === 'annual' && (
            <AnnualDashboardTab transactions={transactions} />
          )}
        </main>

        {/* Google Sheets Setup Modal */}
        <GoogleSheetsModal
          isOpen={isSheetsModalOpen}
          onClose={() => setIsSheetsModalOpen(false)}
          webAppUrl={webAppUrl}
          onSaveWebAppUrl={handleSaveWebAppUrl}
          onSyncWithSheets={handleSyncWithSheets}
          isSyncing={isSyncing}
          onResetMockData={handleResetMockData}
        />

        {/* Minimal Footer */}
        <footer className="hidden md:block py-6 border-t border-slate-200/60 text-center text-xs text-slate-400">
          <div className="max-w-6xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
            <span>
              Expense Tracker • ระบบบันทึกรายรับ-รายจ่าย Google Sheets
            </span>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setIsSheetsModalOpen(true)}
                className="hover:text-slate-800 underline cursor-pointer"
              >
                ดูโค้ด Apps Script & HTML ก้อนเดียว
              </button>
              <span>•</span>
              <button
                onClick={handleResetMockData}
                className="hover:text-slate-800 underline cursor-pointer"
              >
                รีเซ็ตข้อมูลตัวอย่าง 12 เดือน
              </button>
            </div>
          </div>
        </footer>
      </div>
    </ErrorBoundary>
  );
}
