import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCcw } from 'lucide-react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error in component:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center p-6 bg-slate-50 text-slate-900">
          <div className="max-w-md w-full bg-white p-7 rounded-2xl shadow-sm border border-slate-200 text-center">
            <div className="w-12 h-12 rounded-xl bg-rose-50 text-rose-600 mx-auto flex items-center justify-center mb-4 border border-rose-100">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <h2 className="text-base font-bold mb-1.5 text-slate-900">
              เกิดข้อผิดพลาดในการแสดงผล
            </h2>
            <p className="text-xs text-slate-500 mb-5 leading-relaxed">
              {this.state.error?.message || 'ระบบพบปัญหาบางประการ สามารถกดปุ่มด้านล่างเพื่อโหลดใหม่'}
            </p>
            <button
              onClick={() => {
                localStorage.clear();
                window.location.reload();
              }}
              className="w-full py-2.5 px-4 rounded-xl font-semibold text-xs bg-slate-900 hover:bg-slate-800 text-white flex items-center justify-center gap-2 cursor-pointer transition-colors"
            >
              <RefreshCcw className="w-4 h-4" />
              <span>รีเซ็ตข้อมูลและโหลดใหม่</span>
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
