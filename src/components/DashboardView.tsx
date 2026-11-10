import React, { useState } from 'react';
import { DashboardStats, SurveyResponse } from '../types';
import { SURVEY_QUESTIONS } from '../constants';
import { CircularChart } from './CircularChart';
import {
  Download,
  QrCode,
  Maximize2,
  Minimize2,
  Users,
  Award,
  Sparkles,
  Search,
  MessageSquare,
  PlusCircle,
  Trash2,
  Radio,
  PieChart as PieIcon,
  BarChart2,
} from 'lucide-react';

interface DashboardViewProps {
  responses: SurveyResponse[];
  stats: DashboardStats;
  onOpenQr: () => void;
  onDownloadCsv: () => void;
  onSeedData: () => void;
  onClearData: () => void;
  isProjectorMode?: boolean;
  onToggleProjectorMode?: () => void;
  isConnectedLive?: boolean;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  responses,
  stats,
  onOpenQr,
  onDownloadCsv,
  onSeedData,
  onClearData,
  isProjectorMode = false,
  onToggleProjectorMode,
  isConnectedLive = true,
}) => {
  const [searchFeedback, setSearchFeedback] = useState('');
  const [chartStyle, setChartStyle] = useState<'circular' | 'bar'>('circular');

  const filteredFeedbacks = responses
    .filter(r => r.feedback && r.feedback.trim().length > 0)
    .filter(r =>
      searchFeedback
        ? r.feedback!.toLowerCase().includes(searchFeedback.toLowerCase())
        : true
    );

  return (
    <div
      className={`min-h-full transition-colors duration-300 ${
        isProjectorMode
          ? 'bg-slate-950 text-white p-4 sm:p-8'
          : 'bg-slate-900 text-slate-100 p-4 sm:p-6 lg:p-8'
      }`}
    >
      <div className="max-w-7xl mx-auto space-y-6">

        {/* Dashboard Top Command Bar */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-black tracking-tight text-white flex items-center gap-2">
                <span>แดชบอร์ดสรุปผลการอบรม</span>
              </h1>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-950/80 text-emerald-400 border border-emerald-800/80">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse-subtle" />
                <span>{isConnectedLive ? 'Live Real-time' : 'Local Synced'}</span>
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              ข้อมูลจะอัปเดตแบบเรียลไทม์ทันทีที่มีผู้ส่งแบบสอบถามผ่านมือถือ
            </p>
          </div>

          {/* Quick Action Toolbar */}
          <div className="flex items-center flex-wrap gap-2">
            <button
              onClick={onOpenQr}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs sm:text-sm font-semibold border border-slate-700 transition-all cursor-pointer"
            >
              <QrCode className="w-4 h-4 text-blue-400" />
              <span>ฉาย QR Code</span>
            </button>

            <button
              onClick={onDownloadCsv}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs sm:text-sm font-semibold shadow-md shadow-blue-600/20 transition-all cursor-pointer"
            >
              <Download className="w-4 h-4" />
              <span>ดาวน์โหลด CSV</span>
            </button>

            {onToggleProjectorMode && (
              <button
                onClick={onToggleProjectorMode}
                title="สลับโหมดจอโปรเจกเตอร์"
                className={`p-2 rounded-xl border transition-all cursor-pointer ${
                  isProjectorMode
                    ? 'bg-blue-600 text-white border-blue-500'
                    : 'bg-slate-800 hover:bg-slate-700 text-slate-300 border-slate-700'
                }`}
              >
                {isProjectorMode ? (
                  <Minimize2 className="w-4 h-4" />
                ) : (
                  <Maximize2 className="w-4 h-4" />
                )}
              </button>
            )}
          </div>
        </div>

        {/* High-Impact KPI Row */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          
          {/* Card 1: Total Respondents */}
          <div className="bg-slate-850 bg-slate-800/80 border border-slate-700/80 rounded-2xl p-5 shadow-lg flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                จำนวนผู้ตอบทั้งหมด
              </span>
              <Users className="w-4 h-4 text-slate-400" />
            </div>
            <div className="my-3 flex items-baseline gap-2">
              <span className="text-4xl sm:text-5xl font-black text-white font-mono-numbers">
                {stats.totalCount}
              </span>
              <span className="text-sm font-medium text-slate-400">คน</span>
            </div>
            <div className="text-[11px] text-slate-400 flex items-center gap-1.5">
              <Radio className="w-3 h-3 text-emerald-400 animate-pulse" />
              <span>อัปเดตอัตโนมัติแบบสด</span>
            </div>
          </div>

          {/* Card 2: Overall Score Average (Spans 2 cols) */}
          <div className="bg-slate-800/80 border border-slate-700/80 rounded-2xl p-5 shadow-lg flex flex-col justify-between md:col-span-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                คะแนนเฉลี่ยความพึงพอใจในภาพรวม (Overall Mean)
              </span>
              <span
                className={`text-xs font-bold px-3 py-1 rounded-full border ${stats.interpretation.bgClass} ${stats.interpretation.colorClass} ${stats.interpretation.borderClass}`}
              >
                {stats.totalCount > 0 ? stats.interpretation.label : 'รอข้อมูลการประเมิน'}
              </span>
            </div>

            <div className="my-2 flex items-baseline gap-3">
              <span className="text-4xl sm:text-5xl font-black text-blue-400 font-mono-numbers">
                {stats.overallMean.toFixed(2)}
              </span>
              <span className="text-base text-slate-400">/ 5.00 คะแนนเต็ม</span>
            </div>

            {/* 5-Level Visual Track */}
            <div className="mt-2">
              <div className="w-full bg-slate-700/80 rounded-full h-3 overflow-hidden">
                <div
                  className="bg-blue-500 h-3 rounded-full transition-all duration-700 shadow-sm shadow-blue-500/50"
                  style={{ width: `${(stats.overallMean / 5) * 100}%` }}
                />
              </div>
              <div className="flex justify-between text-[10px] text-slate-400 mt-1 font-mono-numbers">
                <span>1.00 (น้อยสุด)</span>
                <span>2.50 (ปานกลาง)</span>
                <span>3.50 (มาก)</span>
                <span>5.00 (มากที่สุด)</span>
              </div>
            </div>
          </div>

          {/* Card 3: Standard Statistics Criteria */}
          <div className="bg-slate-800/80 border border-slate-700/80 rounded-2xl p-4 shadow-lg text-xs flex flex-col justify-center space-y-1.5">
            <div className="font-bold text-slate-200 border-b border-slate-700 pb-1 flex items-center justify-between">
              <span>เกณฑ์แปลผล 5 ระดับ</span>
              <Award className="w-3.5 h-3.5 text-amber-400" />
            </div>
            <div className="flex justify-between text-emerald-400 font-medium">
              <span>4.51 - 5.00</span>
              <span className="font-semibold">มากที่สุด</span>
            </div>
            <div className="flex justify-between text-sky-400 font-medium">
              <span>3.51 - 4.50</span>
              <span className="font-semibold">มาก</span>
            </div>
            <div className="flex justify-between text-amber-400 font-medium">
              <span>2.51 - 3.50</span>
              <span className="font-semibold">ปานกลาง</span>
            </div>
            <div className="flex justify-between text-orange-400 font-medium">
              <span>1.51 - 2.50</span>
              <span className="font-semibold">น้อย</span>
            </div>
            <div className="flex justify-between text-rose-400 font-medium">
              <span>1.00 - 1.50</span>
              <span className="font-semibold">น้อยที่สุด</span>
            </div>
          </div>

        </div>

        {/* Main Charts Header with View Toggle */}
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-2">
            <h2 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
              <PieIcon className="w-5 h-5 text-blue-400" />
              <span>ผลการวิเคราะห์คะแนนความพึงพอใจ</span>
            </h2>
            <span className="text-xs text-slate-400 hidden sm:inline">คำนวณจากผู้ตอบ {stats.totalCount} คน</span>
          </div>

          {/* Toggle between Circular Chart & Bar Chart */}
          <div className="flex items-center gap-1 bg-slate-950/80 p-1 rounded-xl border border-slate-800">
            <button
              onClick={() => setChartStyle('circular')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                chartStyle === 'circular'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <PieIcon className="w-3.5 h-3.5" />
              <span>กราฟวงกลม</span>
            </button>
            <button
              onClick={() => setChartStyle('bar')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                chartStyle === 'bar'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <BarChart2 className="w-3.5 h-3.5" />
              <span>กราฟแท่ง</span>
            </button>
          </div>
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Section 1: Circular Donut Chart (Primary View) or Bars */}
          <div className="lg:col-span-6 bg-slate-800/80 border border-slate-700/80 rounded-2xl p-6 shadow-lg flex flex-col justify-between">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <span>{chartStyle === 'circular' ? '🍩 กราฟวงกลมสัดส่วนคะแนน (Donut Chart)' : '⭐ สัดส่วนการให้คะแนน (Distribution)'}</span>
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">สัดส่วนผู้ให้คะแนน 1 - 5 ดาวในทุกหมวดการประเมิน</p>
              </div>
              <span className="text-xs font-mono-numbers px-2 py-0.5 rounded-full bg-slate-700 text-blue-300">
                {stats.totalStarVotes} โหวต
              </span>
            </div>

            {chartStyle === 'circular' ? (
              <div className="py-2">
                <CircularChart stats={stats} chartType="doughnut" />
              </div>
            ) : (
              <div className="space-y-3.5 py-4">
                {[5, 4, 3, 2, 1].map(star => {
                  const starKey = star as 1 | 2 | 3 | 4 | 5;
                  const item = stats.starDistribution[starKey];
                  const barColor =
                    star === 5
                      ? 'bg-emerald-500'
                      : star === 4
                      ? 'bg-blue-500'
                      : star === 3
                      ? 'bg-amber-500'
                      : star === 2
                      ? 'bg-orange-500'
                      : 'bg-rose-500';

                  return (
                    <div key={star} className="flex items-center gap-3 text-xs">
                      <span className="w-12 text-slate-300 font-semibold font-mono-numbers">
                        {star} ดาว
                      </span>
                      <div className="flex-1 bg-slate-700/70 rounded-full h-3 overflow-hidden">
                        <div
                          className={`h-3 rounded-full transition-all duration-700 ${barColor}`}
                          style={{ width: `${item.percentage}%` }}
                        />
                      </div>
                      <span className="w-12 text-right font-mono-numbers text-slate-300 font-semibold">
                        {item.percentage}%
                      </span>
                      <span className="w-8 text-right font-mono-numbers text-[11px] text-slate-500">
                        ({item.count})
                      </span>
                    </div>
                  );
                })}
              </div>
            )}

            <div className="mt-4 pt-3 border-t border-slate-700/80 text-[11px] text-slate-400 flex items-center justify-between">
              <span>วางเมาส์เหนือส่วนวงกลมเพื่อดูสถิติย่อย</span>
              <span className="font-semibold text-emerald-400">อัปเดตแบบเรียลไทม์</span>
            </div>
          </div>

          {/* Section 2: Question Breakdown (6 Columns) */}
          <div className="lg:col-span-6 bg-slate-800/80 border border-slate-700/80 rounded-2xl p-6 shadow-lg flex flex-col justify-between">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <span>📈 คะแนนเฉลี่ยจำแนกตาม 5 หัวข้อประเมิน</span>
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">คะแนนเฉลี่ยรายข้อ (สเกลเต็ม 5.00 คะแนน)</p>
              </div>
            </div>

            <div className="space-y-4">
              {SURVEY_QUESTIONS.map((q, idx) => {
                const avg = stats.questionAverages[q.id];
                const pct = (avg / 5) * 100;

                let badgeColor = 'text-blue-400 border-blue-500/30 bg-blue-500/10';
                let barColor = 'bg-blue-500';
                if (avg >= 4.51) {
                  badgeColor = 'text-emerald-400 border-emerald-500/30 bg-emerald-500/10';
                  barColor = 'bg-emerald-500';
                } else if (avg >= 3.51) {
                  badgeColor = 'text-sky-400 border-sky-500/30 bg-sky-500/10';
                  barColor = 'bg-sky-500';
                } else if (avg >= 2.51) {
                  badgeColor = 'text-amber-400 border-amber-500/30 bg-amber-500/10';
                  barColor = 'bg-amber-500';
                } else if (avg >= 1.51) {
                  badgeColor = 'text-orange-400 border-orange-500/30 bg-orange-500/10';
                  barColor = 'bg-orange-500';
                } else if (avg > 0) {
                  badgeColor = 'text-rose-400 border-rose-500/30 bg-rose-500/10';
                  barColor = 'bg-rose-500';
                }

                return (
                  <div key={q.id} className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs sm:text-sm">
                      <span className="text-slate-200 font-medium truncate pr-2">
                        {q.title}
                      </span>
                      <div className="flex items-baseline gap-1.5 shrink-0">
                        <span className={`px-2 py-0.5 rounded-lg text-xs font-bold font-mono-numbers border ${badgeColor}`}>
                          {avg.toFixed(2)}
                        </span>
                        <span className="text-[10px] text-slate-400">/ 5.00</span>
                      </div>
                    </div>

                    <div className="w-full bg-slate-700/70 rounded-full h-3 overflow-hidden flex items-center">
                      <div
                        className={`h-3 rounded-full transition-all duration-700 ${barColor}`}
                        style={{ width: `${stats.totalCount > 0 ? pct : 0}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="mt-4 pt-3 border-t border-slate-700/80 flex items-center justify-between text-xs text-slate-400">
              <span>ค่าเฉลี่ยสูงสุด: {Math.max(stats.questionAverages.q1, stats.questionAverages.q2, stats.questionAverages.q3, stats.questionAverages.q4, stats.questionAverages.q5).toFixed(2)}</span>
              <span>เกณฑ์เฉลี่ยรวม: {stats.interpretation.label}</span>
            </div>
          </div>

        </div>

        {/* Live Feedback Feed Section */}
        <div className="bg-slate-800/80 border border-slate-700/80 rounded-2xl p-6 shadow-lg">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
            <div>
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-blue-400" />
                <span>ข้อเสนอแนะและเสียงสะท้อนจากผู้เข้าอบรม</span>
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-slate-700 text-blue-300 font-mono-numbers">
                  {filteredFeedbacks.length} ข้อความ
                </span>
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                ข้อเสนอแนะล่าสุดจะปรากฏขึ้นทันทีเมื่อผู้เข้าอบรมส่งคำตอบ
              </p>
            </div>

            {/* Search Filter */}
            <div className="relative">
              <Search className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
              <input
                type="text"
                value={searchFeedback}
                onChange={e => setSearchFeedback(e.target.value)}
                placeholder="ค้นหาข้อเสนอแนะ..."
                className="bg-slate-900 border border-slate-700 rounded-xl pl-9 pr-3 py-1.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-blue-500 w-48 sm:w-60"
              />
            </div>
          </div>

          {/* Feedback Stream List */}
          <div className="space-y-3 max-h-80 overflow-y-auto pr-1">
            {filteredFeedbacks.length === 0 ? (
              <div className="text-center py-10 text-slate-500 text-sm">
                {searchFeedback
                  ? 'ไม่พบข้อเสนอแนะที่ตรงกับคำค้นหา'
                  : 'ยังไม่มีข้อเสนอแนะเพิ่มเติมในขณะนี้'}
              </div>
            ) : (
              filteredFeedbacks.map(item => {
                const timeString = new Date(item.timestamp).toLocaleTimeString('th-TH', {
                  hour: '2-digit',
                  minute: '2-digit',
                });
                const meanScore =
                  (item.scores.q1 +
                    item.scores.q2 +
                    item.scores.q3 +
                    item.scores.q4 +
                    item.scores.q5) /
                  5;

                return (
                  <div
                    key={item.id}
                    className="bg-slate-900/90 border border-slate-700/60 rounded-xl p-3.5 text-xs space-y-1.5 transition-all hover:border-slate-600"
                  >
                    <div className="flex items-center justify-between text-slate-400">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-blue-400">ผู้เข้าอบรม</span>
                        <span className="text-[11px] font-mono-numbers px-2 py-0.5 rounded-md bg-slate-800 text-slate-300">
                          เฉลี่ย {meanScore.toFixed(1)} ⭐
                        </span>
                      </div>
                      <span className="text-[11px] font-mono-numbers text-slate-400">
                        {timeString}
                      </span>
                    </div>
                    <p className="text-slate-200 text-sm leading-relaxed whitespace-pre-wrap">
                      {item.feedback}
                    </p>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Organizer Quick Controls Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 text-xs text-slate-400 bg-slate-950/60 border border-slate-800/80 rounded-xl p-3.5">
          <div className="flex items-center gap-2">
            <span className="font-medium text-slate-300">เครื่องมือจำลองผลการทดสอบ:</span>
            <button
              onClick={onSeedData}
              className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-all cursor-pointer"
            >
              <PlusCircle className="w-3.5 h-3.5 text-blue-400" />
              <span>+ เพิ่มข้อมูลตัวอย่าง 5 รายการ</span>
            </button>
            <button
              onClick={onClearData}
              className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-rose-950/40 hover:bg-rose-900/60 text-rose-300 border border-rose-800/60 transition-all cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5 text-rose-400" />
              <span>ล้างข้อมูลทั้งหมด</span>
            </button>
          </div>

          <div className="flex items-center gap-2 text-[11px] text-slate-400">
            <span>ส่งออก UTF-8 BOM สำหรับ Excel ภาษาไทย</span>
          </div>
        </div>

      </div>
    </div>
  );
};
