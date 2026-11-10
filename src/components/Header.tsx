import React from 'react';
import { QrCode, MonitorPlay, FileCode, Smartphone, BarChart3, Columns } from 'lucide-react';

interface HeaderProps {
  currentView: 'survey' | 'dashboard' | 'dual' | 'guide';
  onViewChange: (view: 'survey' | 'dashboard' | 'dual' | 'guide') => void;
  onOpenQr: () => void;
  onToggleFullscreen: () => void;
  totalResponses: number;
}

export const Header: React.FC<HeaderProps> = ({
  currentView,
  onViewChange,
  onOpenQr,
  totalResponses,
}) => {
  return (
    <header className="bg-slate-900 border-b border-slate-800 px-4 lg:px-8 py-3.5 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4 md:gap-8">
        
        {/* Zone 1: Single text wordmark */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="w-9 h-9 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold shadow-md shadow-blue-500/20 text-sm">
            TS
          </div>
          <div className="text-base md:text-lg font-bold tracking-tight text-white whitespace-nowrap shrink-0">
            Live Training Survey
          </div>
        </div>

        {/* Zone 2: Navigation Links / View Switchers (Single line, whitespace-nowrap) */}
        <nav className="flex items-center gap-1 sm:gap-2 overflow-x-auto py-1 scrollbar-none">
          <button
            onClick={() => onViewChange('survey')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs md:text-sm font-medium transition-all whitespace-nowrap shrink-0 ${
              currentView === 'survey'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
            }`}
          >
            <Smartphone className="w-4 h-4" />
            <span>หน้าตอบมือถือ</span>
          </button>

          <button
            onClick={() => onViewChange('dashboard')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs md:text-sm font-medium transition-all whitespace-nowrap shrink-0 ${
              currentView === 'dashboard'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
            }`}
          >
            <BarChart3 className="w-4 h-4" />
            <span>จอแดชบอร์ด</span>
            {totalResponses > 0 && (
              <span className="ml-1 px-1.5 py-0.2 rounded-full text-[10px] bg-blue-500/30 text-blue-200 font-mono">
                {totalResponses}
              </span>
            )}
          </button>

          <button
            onClick={() => onViewChange('dual')}
            className={`hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs md:text-sm font-medium transition-all whitespace-nowrap shrink-0 ${
              currentView === 'dual'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
            }`}
          >
            <Columns className="w-4 h-4" />
            <span>จำลองสองจอพร้อมกัน</span>
          </button>

          <button
            onClick={() => onViewChange('guide')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs md:text-sm font-medium transition-all whitespace-nowrap shrink-0 ${
              currentView === 'guide'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
            }`}
          >
            <FileCode className="w-4 h-4" />
            <span>โค้ด 2 ไฟล์ & Firebase</span>
          </button>
        </nav>

        {/* Zone 3: 1 Primary Action */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={onOpenQr}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs md:text-sm font-semibold shadow-md shadow-blue-600/25 transition-all whitespace-nowrap shrink-0"
          >
            <QrCode className="w-4 h-4" />
            <span className="hidden sm:inline">ฉาย QR Code</span>
            <span className="sm:hidden">QR</span>
          </button>
        </div>

      </div>
    </header>
  );
};
