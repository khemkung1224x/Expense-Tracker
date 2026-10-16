import React, { useEffect } from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export interface ToastMessage {
  id: string;
  type: 'success' | 'error' | 'info';
  text: string;
}

interface ToastProps {
  toasts: ToastMessage[];
  onDismiss: (id: string) => void;
}

export const Toast: React.FC<ToastProps> = ({ toasts, onDismiss }) => {
  return (
    <div className="fixed top-4 right-4 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none">
      {toasts.map((toast) => (
        <ToastItem key={toast.id} toast={toast} onDismiss={onDismiss} />
      ))}
    </div>
  );
};

const ToastItem: React.FC<{
  toast: ToastMessage;
  onDismiss: (id: string) => void;
}> = ({ toast, onDismiss }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onDismiss(toast.id);
    }, 4000);
    return () => clearTimeout(timer);
  }, [toast.id, onDismiss]);

  return (
    <div
      className={`pointer-events-auto p-4 rounded-2xl shadow-xl border flex items-center justify-between gap-3 transform transition-all duration-300 animate-slide-in ${
        toast.type === 'success'
          ? 'bg-emerald-600 text-white border-emerald-500 shadow-emerald-500/20'
          : toast.type === 'error'
          ? 'bg-rose-600 text-white border-rose-500 shadow-rose-500/20'
          : 'bg-indigo-600 text-white border-indigo-500 shadow-indigo-500/20'
      }`}
    >
      <div className="flex items-center gap-2.5 text-xs sm:text-sm font-semibold">
        {toast.type === 'success' && <CheckCircle2 className="w-5 h-5 flex-shrink-0" />}
        {toast.type === 'error' && <AlertCircle className="w-5 h-5 flex-shrink-0" />}
        {toast.type === 'info' && <Info className="w-5 h-5 flex-shrink-0" />}
        <span>{toast.text}</span>
      </div>
      <button
        onClick={() => onDismiss(toast.id)}
        className="p-1 hover:bg-white/20 rounded-lg transition-colors cursor-pointer"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
};
