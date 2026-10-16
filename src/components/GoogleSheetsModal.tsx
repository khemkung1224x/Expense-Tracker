import React, { useState } from 'react';
import {
  GOOGLE_APPS_SCRIPT_CODE,
  DEPLOY_GUIDE_STEPS,
} from '../data/appsScriptCode';
import { STANDALONE_HTML_CONTENT } from '../lib/standaloneHtml';
import {
  X,
  Copy,
  Check,
  Download,
  Code2,
  BookOpen,
  Link2,
  RefreshCw,
  CheckCircle2,
  AlertCircle,
  FileSpreadsheet,
  FileCode,
} from 'lucide-react';

interface GoogleSheetsModalProps {
  isOpen: boolean;
  onClose: () => void;
  webAppUrl: string;
  onSaveWebAppUrl: (url: string) => void;
  onSyncWithSheets: () => Promise<void>;
  isSyncing: boolean;
  onResetMockData: () => void;
}

export const GoogleSheetsModal: React.FC<GoogleSheetsModalProps> = ({
  isOpen,
  onClose,
  webAppUrl,
  onSaveWebAppUrl,
  onSyncWithSheets,
  isSyncing,
  onResetMockData,
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'url' | 'code' | 'html' | 'guide'>('url');
  const [inputUrl, setInputUrl] = useState<string>(webAppUrl);
  const [copiedCode, setCopiedCode] = useState<boolean>(false);
  const [copiedHtml, setCopiedHtml] = useState<boolean>(false);
  const [testStatus, setTestStatus] = useState<{
    status: 'idle' | 'testing' | 'success' | 'error';
    message: string;
  }>({ status: 'idle', message: '' });

  if (!isOpen) return null;

  // Copy Code.gs
  const handleCopyCode = async () => {
    try {
      await navigator.clipboard.writeText(GOOGLE_APPS_SCRIPT_CODE);
      setCopiedCode(true);
      setTimeout(() => setCopiedCode(false), 2500);
    } catch {
      alert('กรุณาคัดลอกจากกล่องข้อความ');
    }
  };

  // Copy HTML
  const handleCopyHtml = async () => {
    try {
      await navigator.clipboard.writeText(STANDALONE_HTML_CONTENT);
      setCopiedHtml(true);
      setTimeout(() => setCopiedHtml(false), 2500);
    } catch {
      alert('กรุณาคัดลอกจากกล่องข้อความ');
    }
  };

  // Download Code.gs
  const handleDownloadCode = () => {
    const blob = new Blob([GOOGLE_APPS_SCRIPT_CODE], {
      type: 'text/javascript;charset=utf-8',
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'Code.gs';
    a.click();
    URL.revokeObjectURL(url);
  };

  // Download index.html
  const handleDownloadHtml = () => {
    const blob = new Blob([STANDALONE_HTML_CONTENT], {
      type: 'text/html;charset=utf-8',
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'Index.html';
    a.click();
    URL.revokeObjectURL(url);
  };

  // Save URL
  const handleSaveUrl = () => {
    onSaveWebAppUrl(inputUrl);
    setTestStatus({
      status: 'idle',
      message: 'บันทึก URL เรียบร้อยแล้ว',
    });
  };

  // Test Connection
  const handleTestConnection = async () => {
    if (!inputUrl.trim()) {
      setTestStatus({
        status: 'error',
        message: 'กรุณากรอก Web App URL ก่อนทดสอบ',
      });
      return;
    }

    setTestStatus({
      status: 'testing',
      message: 'กำลังตรวจสอบการเชื่อมต่อกับ Apps Script...',
    });

    try {
      const pingUrl = inputUrl.includes('?')
        ? `${inputUrl}&action=ping`
        : `${inputUrl}?action=ping`;

      const res = await fetch(pingUrl, {
        method: 'GET',
        mode: 'cors',
      });

      if (!res.ok) {
        throw new Error(`HTTP ${res.status}: ไม่สามารถเชื่อมต่อได้`);
      }

      const data = await res.json();
      if (data.success) {
        setTestStatus({
          status: 'success',
          message: 'เชื่อมต่อสำเร็จ! Google Sheets พร้อมทำงานร่วมกับแอป',
        });
        onSaveWebAppUrl(inputUrl);
      } else {
        throw new Error(data.message || 'การตอบกลับไม่สมบูรณ์');
      }
    } catch (err: any) {
      setTestStatus({
        status: 'error',
        message: `เชื่อมต่อไม่สำเร็จ: ${err.message || 'โปรดตรวจสอบการตั้งค่า Deploy เป็น Anyone และ URL ให้ถูกต้อง'}`,
      });
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xl max-w-2xl w-full max-h-[90vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="p-5 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-100">
              <FileSpreadsheet className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-base">
                Google Sheets & Apps Script Hub
              </h3>
              <p className="text-xs text-slate-500">
                จัดการบันทึก ซิงก์ และดาวน์โหลดโค้ดสำหรับนำไปโฮสต์
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Sub Tabs */}
        <div className="flex border-b border-slate-100 px-5 pt-2 gap-2 bg-slate-50/50 overflow-x-auto">
          <button
            onClick={() => setActiveSubTab('url')}
            className={`pb-2.5 px-3 text-xs sm:text-sm font-semibold flex items-center gap-1.5 border-b-2 transition-all cursor-pointer whitespace-nowrap ${
              activeSubTab === 'url'
                ? 'border-slate-900 text-slate-900'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Link2 className="w-4 h-4" />
            <span>Web App URL</span>
          </button>

          <button
            onClick={() => setActiveSubTab('html')}
            className={`pb-2.5 px-3 text-xs sm:text-sm font-semibold flex items-center gap-1.5 border-b-2 transition-all cursor-pointer whitespace-nowrap ${
              activeSubTab === 'html'
                ? 'border-slate-900 text-slate-900'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <FileCode className="w-4 h-4 text-amber-600" />
            <span>ไฟล์ HTML หน้าเว็บ (ก้อนเดียวจบ)</span>
          </button>

          <button
            onClick={() => setActiveSubTab('code')}
            className={`pb-2.5 px-3 text-xs sm:text-sm font-semibold flex items-center gap-1.5 border-b-2 transition-all cursor-pointer whitespace-nowrap ${
              activeSubTab === 'code'
                ? 'border-slate-900 text-slate-900'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Code2 className="w-4 h-4" />
            <span>โค้ด Code.gs</span>
          </button>

          <button
            onClick={() => setActiveSubTab('guide')}
            className={`pb-2.5 px-3 text-xs sm:text-sm font-semibold flex items-center gap-1.5 border-b-2 transition-all cursor-pointer whitespace-nowrap ${
              activeSubTab === 'guide'
                ? 'border-slate-900 text-slate-900'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>วิธีติดตั้ง 4 ขั้นตอน</span>
          </button>
        </div>

        {/* Content Area */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-4 flex-1">
          {/* TAB 1: Web App URL */}
          {activeSubTab === 'url' && (
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Google Apps Script Web App URL
                </label>
                <div className="flex gap-2">
                  <input
                    type="url"
                    placeholder="https://script.google.com/macros/s/.../exec"
                    value={inputUrl}
                    onChange={(e) => setInputUrl(e.target.value)}
                    className="flex-1 px-3.5 py-2 text-xs sm:text-sm rounded-xl border border-slate-200 bg-white text-slate-900 focus:outline-none focus:border-slate-400 font-mono"
                  />
                  <button
                    onClick={handleSaveUrl}
                    className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs sm:text-sm font-semibold transition-colors cursor-pointer"
                  >
                    บันทึก
                  </button>
                </div>
                <p className="text-[11px] text-slate-400 mt-1">
                  URL ที่ได้จากการ Deploy as Web app (ตั้งค่า Who has access เป็น Anyone)
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-2.5 pt-1">
                <button
                  onClick={handleTestConnection}
                  disabled={testStatus.status === 'testing'}
                  className="px-3.5 py-2 rounded-xl text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-800 transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  {testStatus.status === 'testing' ? (
                    <RefreshCw className="w-3.5 h-3.5 animate-spin text-slate-600" />
                  ) : (
                    <RefreshCw className="w-3.5 h-3.5" />
                  )}
                  <span>ทดสอบการเชื่อมต่อ (Ping)</span>
                </button>

                <button
                  onClick={onSyncWithSheets}
                  disabled={isSyncing || !inputUrl}
                  className="px-3.5 py-2 rounded-xl text-xs font-semibold bg-emerald-600 hover:bg-emerald-700 text-white transition-colors flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                >
                  <RefreshCw
                    className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin' : ''}`}
                  />
                  <span>ดึงข้อมูลล่าสุดจาก Sheets</span>
                </button>
              </div>

              {/* Status Box */}
              {testStatus.status !== 'idle' && (
                <div
                  className={`p-3 rounded-xl text-xs flex items-start gap-2.5 ${
                    testStatus.status === 'success'
                      ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                      : testStatus.status === 'error'
                      ? 'bg-rose-50 text-rose-800 border border-rose-200'
                      : 'bg-slate-50 text-slate-800 border border-slate-200'
                  }`}
                >
                  {testStatus.status === 'success' && (
                    <CheckCircle2 className="w-4 h-4 flex-shrink-0 text-emerald-600" />
                  )}
                  {testStatus.status === 'error' && (
                    <AlertCircle className="w-4 h-4 flex-shrink-0 text-rose-600" />
                  )}
                  {testStatus.status === 'testing' && (
                    <RefreshCw className="w-4 h-4 flex-shrink-0 animate-spin text-slate-600" />
                  )}
                  <span>{testStatus.message}</span>
                </div>
              )}

              {/* Reset to Mock Data */}
              <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs">
                <div>
                  <span className="font-semibold text-slate-800">
                    ข้อมูลตัวอย่าง (Mock Data)
                  </span>
                  <p className="text-slate-400 text-[11px]">
                    รีเซ็ตรายการให้เป็นข้อมูลตัวอย่าง 12 เดือนเริ่มต้น
                  </p>
                </div>
                <button
                  onClick={() => {
                    if (confirm('คุณต้องการรีเซ็ตข้อมูลเป็นชุดตัวอย่างเริ่มต้นใช่หรือไม่?')) {
                      onResetMockData();
                    }
                  }}
                  className="px-3 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-700 font-medium transition-colors cursor-pointer"
                >
                  รีเซ็ต Mock Data
                </button>
              </div>
            </div>
          )}

          {/* TAB 2: Standalone HTML (All-in-one file) */}
          {activeSubTab === 'html' && (
            <div className="space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <span className="text-xs font-semibold text-slate-800">
                    ไฟล์ Index.html ก้อนเดียวจบ (HTML + CSS + JS ครบครัน):
                  </span>
                  <p className="text-[11px] text-slate-500">
                    นำไปใส่ใน Apps Script &rarr; สร้างไฟล์ HTML ชื่อ <b>Index</b> แล้ววางโค้ดนี้ได้ทันที
                  </p>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <button
                    onClick={handleCopyHtml}
                    className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    {copiedHtml ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-white" />
                        <span>คัดลอก HTML แล้ว</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>คัดลอก HTML</span>
                      </>
                    )}
                  </button>

                  <button
                    onClick={handleDownloadHtml}
                    className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>ดาวน์โหลด Index.html</span>
                  </button>
                </div>
              </div>

              <div className="relative">
                <pre className="p-4 rounded-xl bg-slate-900 text-slate-100 font-mono text-[11px] leading-relaxed overflow-x-auto max-h-72 border border-slate-800">
                  <code>{STANDALONE_HTML_CONTENT}</code>
                </pre>
              </div>
            </div>
          )}

          {/* TAB 3: Code.gs */}
          {activeSubTab === 'code' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-700">
                  สคริปต์ Code.gs สำหรับ Google Apps Script (doPost / doGet):
                </span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleCopyCode}
                    className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-slate-900 hover:bg-slate-800 text-white flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    {copiedCode ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                        <span>คัดลอกแล้ว</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>คัดลอกโค้ด</span>
                      </>
                    )}
                  </button>

                  <button
                    onClick={handleDownloadCode}
                    className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>ดาวน์โหลด .gs</span>
                  </button>
                </div>
              </div>

              <div className="relative">
                <pre className="p-4 rounded-xl bg-slate-900 text-slate-100 font-mono text-[11px] leading-relaxed overflow-x-auto max-h-72 border border-slate-800">
                  <code>{GOOGLE_APPS_SCRIPT_CODE}</code>
                </pre>
              </div>
            </div>
          )}

          {/* TAB 4: Guide */}
          {activeSubTab === 'guide' && (
            <div className="space-y-3">
              {DEPLOY_GUIDE_STEPS.map((step) => (
                <div
                  key={step.step}
                  className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/60 flex items-start gap-3"
                >
                  <div className="w-6 h-6 rounded-lg bg-slate-900 text-white font-bold text-xs flex items-center justify-center flex-shrink-0 mt-0.5">
                    {step.step}
                  </div>
                  <div>
                    <h4 className="font-bold text-xs sm:text-sm text-slate-900">
                      {step.title}
                    </h4>
                    <p className="text-xs text-slate-600 mt-0.5 leading-relaxed">
                      {step.desc}
                    </p>
                  </div>
                </div>
              ))}

              <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-900 leading-relaxed">
                <span className="font-bold">💡 เคล็ดลับ:</span> เมื่อสร้างไฟล์ <b>Code.gs</b> และไฟล์ <b>Index.html</b> ใน Apps Script ครบแล้ว ตอน Deploy ให้เลือก <b>Who has access</b> เป็น <b>"Anyone"</b> คุณจะได้ URL หน้าเว็บที่เข้าใช้งานได้จากทุกที่ทันที
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-3.5 bg-slate-50 border-t border-slate-100 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl text-xs font-semibold bg-slate-200 hover:bg-slate-300 text-slate-700 transition-colors cursor-pointer"
          >
            ปิด
          </button>
        </div>
      </div>
    </div>
  );
};
