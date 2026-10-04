import React from 'react';
import { Clock, AlertTriangle, User, Hash, CheckCircle2 } from 'lucide-react';
import { CprLogo } from './CprLogo';

interface HeaderProps {
  examStarted: boolean;
  examSubmitted: boolean;
  timeLeftSeconds: number;
  totalTimeSeconds: number;
  studentName: string;
  studentRoll: string;
  answeredCount: number;
  totalQuestions: number;
  onOpenOmr?: () => void;
  onSubmitClick?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  examStarted,
  examSubmitted,
  timeLeftSeconds,
  studentName,
  studentRoll,
  answeredCount,
  totalQuestions,
  onOpenOmr,
  onSubmitClick,
}) => {
  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const s = secs % 60;
    return `${mins.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const isLowTime = timeLeftSeconds <= 300 && examStarted && !examSubmitted; // 5 mins left

  return (
    <header className="bg-slate-900 text-white shadow-lg border-b border-slate-800 sticky top-0 z-40">
      <div className="max-w-6xl mx-auto px-4 py-3 flex flex-col md:flex-row items-center justify-between gap-3">
        {/* Academy Branding */}
        <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-start">
          <div className="flex items-center gap-3">
            <CprLogo className="w-12 h-12 bg-white rounded-full p-0.5 shadow-md shrink-0 border border-slate-700" />
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-base sm:text-lg font-bold tracking-wide uppercase font-serif text-white">
                  CPR Medical Academy
                </h1>
                <span className="text-[11px] font-semibold text-indigo-300 bg-indigo-950/80 border border-indigo-800 px-2 py-0.5 rounded">
                  Crystal Batch
                </span>
              </div>
              <p className="text-xs text-slate-300">
                Centre for Post-gRaduation · <span className="text-amber-300 font-medium">গাণিতিক যুক্তি</span>
              </p>
            </div>
          </div>

          {/* Mobile OMR toggle button if in exam */}
          {examStarted && !examSubmitted && onOpenOmr && (
            <button
              onClick={onOpenOmr}
              className="md:hidden flex items-center gap-1.5 text-xs bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 px-2.5 py-1.5 rounded-lg"
              title="প্রশ্ন তালিকা দেখুন"
            >
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>{answeredCount}/{totalQuestions}</span>
            </button>
          )}
        </div>

        {/* Live Exam Stats and Timer */}
        {examStarted && !examSubmitted && (
          <div className="flex items-center gap-3 sm:gap-4 w-full md:w-auto justify-between md:justify-end border-t border-slate-800 md:border-t-0 pt-2.5 md:pt-0">
            {/* Student Info preview */}
            <div className="hidden lg:flex items-center gap-3 text-xs text-slate-300 bg-slate-800/80 px-3 py-1.5 rounded-lg border border-slate-700">
              <div className="flex items-center gap-1">
                <User className="w-3.5 h-3.5 text-slate-400" />
                <span className="font-medium text-white max-w-[120px] truncate">{studentName || 'Candidate'}</span>
              </div>
              <span className="text-slate-600">|</span>
              <div className="flex items-center gap-1">
                <Hash className="w-3.5 h-3.5 text-slate-400" />
                <span className="font-mono text-slate-200">
                  {studentRoll ? `Reg: ${studentRoll}` : 'Reg: —'}
                </span>
              </div>
            </div>

            {/* Answered Progress Counter */}
            <div className="hidden sm:flex items-center gap-2 text-xs bg-slate-800/90 text-slate-200 px-3 py-1.5 rounded-lg border border-slate-700">
              <span>উত্তর দেওয়া হয়েছে:</span>
              <span className="font-bold text-emerald-400 font-mono text-sm">{answeredCount}</span>
              <span className="text-slate-400">/ {totalQuestions}</span>
            </div>

            {/* Timer Box */}
            <div
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg font-mono text-sm font-bold border transition-colors shadow-sm ${
                isLowTime
                  ? 'bg-rose-950/90 border-rose-500 text-rose-200 animate-pulse'
                  : 'bg-indigo-950/90 border-indigo-500/50 text-amber-300'
              }`}
            >
              {isLowTime ? (
                <AlertTriangle className="w-4 h-4 text-rose-400" />
              ) : (
                <Clock className="w-4 h-4 text-indigo-400" />
              )}
              <span className="text-xs text-slate-300 font-sans hidden sm:inline">সময় বাকি:</span>
              <span className="text-base tracking-wider">{formatTime(timeLeftSeconds)}</span>
            </div>

            {/* Submit shortcut */}
            {onSubmitClick && (
              <button
                onClick={onSubmitClick}
                className="bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs sm:text-sm px-3.5 py-2 rounded-lg transition-colors shadow-sm"
              >
                জমা দিন
              </button>
            )}
          </div>
        )}
      </div>
    </header>
  );
};
