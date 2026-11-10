import React, { useState } from 'react';
import { DashboardStats } from '../types';

interface CircularChartProps {
  stats: DashboardStats;
  chartType?: 'doughnut' | 'pie';
}

export const CircularChart: React.FC<CircularChartProps> = ({
  stats,
  chartType = 'doughnut',
}) => {
  const [hoveredStar, setHoveredStar] = useState<number | null>(null);

  const starConfig = [
    { star: 5, label: '5 ดาว (มากที่สุด)', color: '#10b981', hoverColor: '#059669', bgClass: 'bg-emerald-500' },
    { star: 4, label: '4 ดาว (มาก)', color: '#3b82f6', hoverColor: '#2563eb', bgClass: 'bg-blue-500' },
    { star: 3, label: '3 ดาว (ปานกลาง)', color: '#f59e0b', hoverColor: '#d97706', bgClass: 'bg-amber-500' },
    { star: 2, label: '2 ดาว (น้อย)', color: '#f97316', hoverColor: '#ea580c', bgClass: 'bg-orange-500' },
    { star: 1, label: '1 ดาว (น้อยที่สุด)', color: '#f43f5e', hoverColor: '#e11d48', bgClass: 'bg-rose-500' },
  ];

  const totalVotes = stats.totalStarVotes;
  const radius = chartType === 'pie' ? 40 : 70;
  const strokeWidth = chartType === 'pie' ? 80 : 30;
  const circumference = 2 * Math.PI * radius;

  // Calculate slice geometry
  let accumulatedPercent = 0;
  const slices = starConfig.map(cfg => {
    const starKey = cfg.star as 1 | 2 | 3 | 4 | 5;
    const item = stats.starDistribution[starKey];
    const count = item ? item.count : 0;
    const fraction = totalVotes > 0 ? count / totalVotes : 0;
    const percent = totalVotes > 0 ? (count / totalVotes) * 100 : 0;
    const strokeDasharray = `${fraction * circumference} ${circumference}`;
    const strokeDashoffset = -accumulatedPercent * circumference;

    accumulatedPercent += fraction;

    return {
      ...cfg,
      count,
      percent,
      fraction,
      strokeDasharray,
      strokeDashoffset,
    };
  });

  return (
    <div className="flex flex-col md:flex-row items-center justify-center gap-6 sm:gap-8">
      
      {/* SVG Circular Graph */}
      <div className="relative w-56 h-56 sm:w-64 sm:h-64 shrink-0 flex items-center justify-center">
        <svg
          viewBox="0 0 200 200"
          className="w-full h-full transform -rotate-90 filter drop-shadow-md"
        >
          {/* Background Empty Ring */}
          <circle
            cx="100"
            cy="100"
            r={radius}
            fill="transparent"
            stroke="#334155"
            strokeWidth={strokeWidth}
            className="opacity-40"
          />

          {/* Slices */}
          {totalVotes > 0 &&
            slices.map(slice => {
              if (slice.fraction <= 0) return null;
              const isHovered = hoveredStar === slice.star;

              return (
                <circle
                  key={slice.star}
                  cx="100"
                  cy="100"
                  r={radius}
                  fill="transparent"
                  stroke={isHovered ? slice.hoverColor : slice.color}
                  strokeWidth={isHovered ? strokeWidth + 4 : strokeWidth}
                  strokeDasharray={slice.strokeDasharray}
                  strokeDashoffset={slice.strokeDashoffset}
                  className="transition-all duration-500 cursor-pointer"
                  onMouseEnter={() => setHoveredStar(slice.star)}
                  onMouseLeave={() => setHoveredStar(null)}
                />
              );
            })}
        </svg>

        {/* Center Label for Doughnut */}
        {chartType === 'doughnut' && (
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none text-center p-4">
            {hoveredStar ? (
              <>
                <span className="text-xs text-slate-400 font-medium">ระดับคะแนน</span>
                <span className="text-2xl sm:text-3xl font-black text-white font-mono-numbers leading-none my-1">
                  {hoveredStar} ดาว
                </span>
                <span className="text-xs font-semibold text-blue-400">
                  {stats.starDistribution[hoveredStar as 1 | 2 | 3 | 4 | 5].percentage}% ({stats.starDistribution[hoveredStar as 1 | 2 | 3 | 4 | 5].count} โหวต)
                </span>
              </>
            ) : (
              <>
                <span className="text-[11px] text-slate-400 font-medium uppercase tracking-wider">
                  คะแนนเฉลี่ยรวม
                </span>
                <span className="text-2xl sm:text-3xl font-black text-white font-mono-numbers leading-none my-1">
                  {stats.overallMean.toFixed(2)}
                </span>
                <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${stats.interpretation.bgClass} ${stats.interpretation.colorClass}`}>
                  {stats.totalCount > 0 ? stats.interpretation.label : 'รอข้อมูล'}
                </span>
              </>
            )}
          </div>
        )}
      </div>

      {/* Interactive Legend List */}
      <div className="flex-1 w-full space-y-2">
        <div className="text-xs text-slate-400 font-medium mb-2 border-b border-slate-700/80 pb-1.5 flex justify-between">
          <span>สัดส่วนดาว</span>
          <span>ร้อยละ (จำนวนโหวต)</span>
        </div>

        {slices.map(item => {
          const isHovered = hoveredStar === item.star;
          return (
            <div
              key={item.star}
              onMouseEnter={() => setHoveredStar(item.star)}
              onMouseLeave={() => setHoveredStar(null)}
              className={`flex items-center justify-between text-xs p-2 rounded-xl transition-all cursor-pointer ${
                isHovered ? 'bg-slate-700/60 shadow-sm' : 'hover:bg-slate-800/40'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <span
                  className="w-3 h-3 rounded-full shrink-0 shadow-sm"
                  style={{ backgroundColor: item.color }}
                />
                <span className={`font-semibold ${isHovered ? 'text-white' : 'text-slate-300'}`}>
                  {item.label}
                </span>
              </div>

              <div className="flex items-baseline gap-2 font-mono-numbers">
                <span className="font-bold text-slate-200">
                  {item.percent.toFixed(0)}%
                </span>
                <span className="text-[11px] text-slate-400">
                  ({item.count})
                </span>
              </div>
            </div>
          );
        })}

        <div className="pt-2 text-right text-[11px] text-slate-400 border-t border-slate-700/80">
          รวมทั้งหมด: <span className="font-mono-numbers font-semibold text-slate-200">{totalVotes}</span> คำตอบ
        </div>
      </div>

    </div>
  );
};
