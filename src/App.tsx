/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useCallback } from 'react';
import { Transaction } from './types';
import {
  loadStoredTransactions,
  saveStoredTransactions,
  getStoredWebAppUrl,
  saveStoredWebAppUrl,
  isEnvWebAppUrl,
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

  // Transactions State: เริ่มต้นเป็น Array ว่างเปล่า หรือดึงเฉพาะข้อมูลจริงที่เคยบันทึก
  const [transactions, setTransactions] = useState<Transaction[]>(() => {
    return loadStoredTransactions();
  });

  // Google Apps Script Web App URL (prioritizes VITE_GOOGLE_APPS_SCRIPT_URL from Vercel)
  const [webAppUrl, setWebAppUrl] = useState<string>(() => {
    return getStoredWebAppUrl();
  });

  // Sheets Modal & Loading states
  const [isSheetsModalOpen, setIsSheetsModalOpen] = useState<boolean>(false);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [isSyncing, setIsSyncing] = useState<boolean>(false);
  const [hasInitialSynced, setHasInitialSynced] = useState<boolean>(false);

  // Toasts
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const addToast = useCallback((type: 'success' | 'error' | 'info', text: string) => {
    const id = Date.now().toString() + Math.random().toString().slice(2, 6);
    setToasts((prev) => [...prev, { id, type, text }]);
  }, []);

  const dismissToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Ensure clean light theme and purge legacy mock storage keys
  useEffect(() => {
    if (typeof document !== 'undefined') {
      document.documentElement.classList.remove('dark');
      localStorage.removeItem('THEME_MODE');
      localStorage.removeItem('EXPENSE_TRACKER_TRANSACTIONS_V1');
      localStorage.removeItem('STANDALONE_EXPENSE_DATA');
    }
  }, []);

  // Sync latest transactions into LocalStorage as an offline/cold-start cache
  useEffect(() => {
    saveStoredTransactions(transactions);
  }, [transactions]);

  /**
   * Core function to fetch transactions from Google Sheets (Single Source of Truth)
   */
  const fetchTransactionsFromSheets = useCallback(
    async (targetUrl: string, showNotification = false): Promise<boolean> => {
      const url = targetUrl.trim();
      if (!url) return false;

      setIsSyncing(true);
      try {
        const getUrl = url.includes('?')
          ? `${url}&action=getTransactions`
          : `${url}?action=getTransactions`;

        const res = await fetch(getUrl, {
          method: 'GET',
          headers: {
            'Accept': 'application/json',
          },
        });

        if (!res.ok) {
          throw new Error(`HTTP ${res.status}: ไม่สามารถเชื่อมต่อกับ Sheets ได้`);
        }

        const data = await res.json();
        if (data.success && Array.isArray(data.transactions)) {
          // If sheets has records, replace transactions state with live sheet records
          if (data.transactions.length > 0) {
            setTransactions(data.transactions);
            saveStoredTransactions(data.transactions);
            if (showNotification) {
              addToast(
                'success',
                `ซิงก์สำเร็จ! พบ ${data.transactions.length} รายการจาก Google Sheets`
              );
            }
          } else {
            // Sheet is valid but empty
            if (showNotification) {
              addToast('info', 'เชื่อมต่อชีตสำเร็จ แต่ยังไม่มีข้อมูลรายการ');
            }
          }
          return true;
        } else {
          throw new Error(data.message || 'โครงสร้างข้อมูลตอบกลับไม่ถูกต้อง');
        }
      } catch (err: any) {
        console.warn('Google Sheets sync error:', err);
        if (showNotification) {
          addToast(
            'error',
            `ซิงก์ไม่สำเร็จ: ${err.message || 'โปรดตรวจสอบสิทธิ์ Web App เป็น Anyone'}`
          );
        }
        return false;
      } finally {
        setIsSyncing(false);
      }
    },
    [addToast]
  );

  /**
   * 1. Auto-fetch on initial load / mount
   * Guarantees that mobile and desktop immediately see the latest synced data from Google Sheets!
   */
  useEffect(() => {
    if (webAppUrl.trim() && !hasInitialSynced) {
      setHasInitialSynced(true);
      fetchTransactionsFromSheets(webAppUrl, false).then((success) => {
        if (success) {
          addToast('info', 'อัปเดตข้อมูลล่าสุดจาก Google Sheets เรียบร้อย');
        }
      });
    }
  }, [webAppUrl, hasInitialSynced, fetchTransactionsFromSheets, addToast]);

  /**
   * 2. Handle Add Transaction
   * Sends POST to Google Sheets, then triggers a fresh fetch so all data remains identical!
   */
  const handleAddTransaction = async (newTxData: Omit<Transaction, 'id'>) => {
    setIsSaving(true);
    const newId = 'tx-' + Date.now();
    const newTx: Transaction = {
      ...newTxData,
      id: newId,
      createdAt: new Date().toISOString(),
    };

    // Optimistically update UI immediately
    setTransactions((prev) => [newTx, ...prev]);

    if (webAppUrl.trim()) {
      try {
        await fetch(webAppUrl, {
          method: 'POST',
          mode: 'no-cors', // standard Google Apps Script Web App redirect pattern
          headers: {
            'Content-Type': 'text/plain;charset=utf-8',
          },
          body: JSON.stringify(newTx),
        });

        addToast(
          'success',
          `บันทึก "${newTx.title}" สำเร็จ (ซิงก์ลง Google Sheets แล้ว)`
        );

        // Re-sync with Sheets in background to ensure 100% data consistency
        setTimeout(() => {
          fetchTransactionsFromSheets(webAppUrl, false);
        }, 1200);
      } catch (err: any) {
        console.warn('Google Sheets POST error:', err);
        addToast(
          'info',
          `บันทึกในเครื่องแล้ว (กำลังรอส่งลงชีต: ${err.message || 'โปรดตรวจ Web App URL'})`
        );
      }
    } else {
      addToast(
        'success',
        `บันทึก "${newTx.title}" ฿${newTx.amount.toLocaleString('th-TH')} เรียบร้อยแล้ว`
      );
    }

    setIsSaving(false);
  };

  /**
   * 3. Handle Delete Transaction
   * Removes from state and sends deletion command to Google Sheets
   */
  const handleDeleteTransaction = async (id: string) => {
    const target = transactions.find((t) => t.id === id);
    setTransactions((prev) => prev.filter((t) => t.id !== id));
    addToast('info', `ลบรายการ "${target?.title || ''}" เรียบร้อยแล้ว`);

    if (webAppUrl.trim()) {
      try {
        await fetch(webAppUrl, {
          method: 'POST',
          mode: 'no-cors',
          headers: {
            'Content-Type': 'text/plain;charset=utf-8',
          },
          body: JSON.stringify({ action: 'delete', id }),
        });
        // Background re-sync
        setTimeout(() => {
          fetchTransactionsFromSheets(webAppUrl, false);
        }, 1200);
      } catch (e) {
        console.warn('Failed to delete on Google Sheets:', e);
      }
    }
  };

  /**
   * 4. Handle Save Web App URL
   */
  const handleSaveWebAppUrl = (url: string) => {
    setWebAppUrl(url);
    saveStoredWebAppUrl(url);
    addToast('success', 'บันทึกการตั้งค่า Web App URL เรียบร้อยแล้ว');
    // Fetch immediately with new URL
    if (url.trim()) {
      fetchTransactionsFromSheets(url, true);
    }
  };

  /**
   * 5. Manual Sync / Refresh
   */
  const handleManualRefresh = async () => {
    if (!webAppUrl.trim()) {
      addToast('error', 'กรุณาระบุ Web App URL หรือตั้งค่า VITE_GOOGLE_APPS_SCRIPT_URL ก่อนซิงก์');
      setIsSheetsModalOpen(true);
      return;
    }
    await fetchTransactionsFromSheets(webAppUrl, true);
  };

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col antialiased selection:bg-emerald-500 selection:text-white pb-20 md:pb-6">
        <Navbar
          activeTab={activeTab}
          onChangeTab={setActiveTab}
          onOpenSheetsModal={() => setIsSheetsModalOpen(true)}
          hasSheetsConfigured={Boolean(webAppUrl.trim())}
          onRefreshData={handleManualRefresh}
          isSyncing={isSyncing}
        />

        {/* Sync Status Banner if connected */}
        {webAppUrl.trim() && (
          <div className="bg-emerald-50 border-b border-emerald-100 px-4 py-1.5 text-xs text-emerald-800 flex items-center justify-between">
            <div className="max-w-6xl mx-auto w-full flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                <span>เชื่อมต่อ Google Sheets แล้ว (Single Source of Truth)</span>
              </span>
              <button
                onClick={handleManualRefresh}
                disabled={isSyncing}
                className="text-emerald-700 hover:text-emerald-900 font-medium underline cursor-pointer disabled:opacity-50"
              >
                {isSyncing ? 'กำลังดึงข้อมูล...' : 'ซิงก์ด่วน'}
              </button>
            </div>
          </div>
        )}

        {/* Main Content Area */}
        <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 py-6 sm:py-8">
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

        {/* Toast Notification Container */}
        <Toast toasts={toasts} onDismiss={dismissToast} />

        {/* Google Sheets Setup Modal */}
        <GoogleSheetsModal
          isOpen={isSheetsModalOpen}
          onClose={() => setIsSheetsModalOpen(false)}
          webAppUrl={webAppUrl}
          onSaveWebAppUrl={handleSaveWebAppUrl}
          onSyncWithSheets={async () => {
            await fetchTransactionsFromSheets(webAppUrl, true);
          }}
          isSyncing={isSyncing}
        />

        {/* Minimal Footer */}
        <footer className="hidden md:block py-6 border-t border-slate-200/60 text-center text-xs text-slate-400">
          <div className="max-w-6xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
            <span>
              Expense Tracker • ระบบบันทึกรายรับ-รายจ่าย Google Sheets (Single Source of Truth)
            </span>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setIsSheetsModalOpen(true)}
                className="hover:text-slate-800 underline cursor-pointer"
              >
                ตั้งค่า Google Sheets / Vercel
              </button>
              <span>•</span>
              <button
                onClick={handleManualRefresh}
                disabled={isSyncing}
                className="hover:text-slate-800 underline cursor-pointer disabled:opacity-50"
              >
                {isSyncing ? 'กำลังซิงค์...' : 'รีเฟรชข้อมูล'}
              </button>
            </div>
          </div>
        </footer>
      </div>
    </ErrorBoundary>
  );
}
