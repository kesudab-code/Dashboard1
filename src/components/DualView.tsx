import React from 'react';
import { SurveyView } from './SurveyView';
import { DashboardView } from './DashboardView';
import { DashboardStats, SurveyResponse, SurveyScores } from '../types';
import { Smartphone, Monitor } from 'lucide-react';

interface DualViewProps {
  responses: SurveyResponse[];
  stats: DashboardStats;
  onSubmitResponse: (scores: SurveyScores, feedback: string) => Promise<boolean>;
  onOpenQr: () => void;
  onDownloadCsv: () => void;
  onSeedData: () => void;
  onClearData: () => void;
  isConnectedLive?: boolean;
}

export const DualView: React.FC<DualViewProps> = ({
  responses,
  stats,
  onSubmitResponse,
  onOpenQr,
  onDownloadCsv,
  onSeedData,
  onClearData,
  isConnectedLive = true,
}) => {
  return (
    <div className="min-h-full bg-slate-950 p-3 sm:p-6 text-slate-100">
      
      {/* Information Header */}
      <div className="max-w-7xl mx-auto mb-6 bg-slate-900/90 border border-slate-800 rounded-2xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-lg">
        <div>
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
            <span>โหมดจำลองสองจอพร้อมกัน (Interactive Dual-Screen Simulation)</span>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            ลองกดให้คะแนนบนมือถือจำลองด้านซ้าย แล้วสังเกตผลคะแนนบนจอแดชบอร์ดด้านขวาที่จะอัปเดตแบบเรียลไทม์ทันที!
          </p>
        </div>
        <div className="flex items-center gap-2 text-xs text-blue-400 font-medium">
          <Smartphone className="w-4 h-4" />
          <span>Mobile Survey</span>
          <span className="text-slate-600">⇄</span>
          <Monitor className="w-4 h-4 text-emerald-400" />
          <span className="text-emerald-400">Projector Dashboard</span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left Column: Interactive Mobile Mockup (5 Cols) */}
        <div className="lg:col-span-5 flex flex-col items-center">
          <div className="w-full max-w-[420px] bg-slate-900 border-4 border-slate-800 rounded-[2.5rem] shadow-2xl p-3 relative overflow-hidden">
            {/* Phone Speaker Notch */}
            <div className="w-24 h-4 bg-slate-800 rounded-full mx-auto mb-2 flex items-center justify-center">
              <div className="w-3 h-1 bg-slate-700 rounded-full" />
            </div>

            {/* Inner Phone Screen */}
            <div className="bg-slate-50 text-slate-900 rounded-[2rem] overflow-y-auto max-h-[750px] shadow-inner">
              <SurveyView onSubmitResponse={onSubmitResponse} isInsideMockup={true} />
            </div>

            {/* Phone Bottom Home Bar */}
            <div className="w-28 h-1 bg-slate-700 rounded-full mx-auto mt-2" />
          </div>
          <p className="text-xs text-slate-400 mt-2 text-center">
            จำลองหน้าจอมือถือของผู้เข้าอบรม
          </p>
        </div>

        {/* Right Column: Live Projector Dashboard (7 Cols) */}
        <div className="lg:col-span-7 bg-slate-900/90 border border-slate-800 rounded-3xl p-4 sm:p-6 shadow-2xl overflow-hidden">
          <div className="border-b border-slate-800 pb-3 mb-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Monitor className="w-5 h-5 text-emerald-400" />
              <h3 className="font-bold text-white text-base">จอโปรเจกเตอร์ในห้องอบรม</h3>
            </div>
            <span className="text-[11px] px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-400 border border-emerald-800 font-semibold">
              Live Feed
            </span>
          </div>

          <DashboardView
            responses={responses}
            stats={stats}
            onOpenQr={onOpenQr}
            onDownloadCsv={onDownloadCsv}
            onSeedData={onSeedData}
            onClearData={onClearData}
            isConnectedLive={isConnectedLive}
          />
        </div>

      </div>

    </div>
  );
};
