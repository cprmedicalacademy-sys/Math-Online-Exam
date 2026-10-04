import React, { useState, useEffect } from 'react';
import {
  Bookmark,
  BookmarkCheck,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  RotateCcw,
  Send,
  HelpCircle,
  Eye,
  List,
  Sparkles,
  AlertTriangle
} from 'lucide-react';
import { QuestionItem } from '../data/questions';
import { MathText } from './MathText';

interface ExamViewProps {
  questions: QuestionItem[];
  userAnswers: Record<number, number>;
  markedQuestions: Record<number, boolean>;
  onSelectAnswer: (questionId: number, optionIndex: number) => void;
  onClearAnswer: (questionId: number) => void;
  onToggleMark: (questionId: number) => void;
  onSubmitExam: () => void;
  candidateName: string;
  candidateRoll: string;
  isOmrDrawerOpen: boolean;
  setIsOmrDrawerOpen: (open: boolean) => void;
}

export const ExamView: React.FC<ExamViewProps> = ({
  questions,
  userAnswers,
  markedQuestions,
  onSelectAnswer,
  onClearAnswer,
  onToggleMark,
  onSubmitExam,
  candidateName,
  candidateRoll,
  isOmrDrawerOpen,
  setIsOmrDrawerOpen,
}) => {
  const [viewMode, setViewMode] = useState<'all' | 'single'>('all');
  const [currentIdx, setCurrentIdx] = useState(0);
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [paletteFilter, setPaletteFilter] = useState<'all' | 'answered' | 'unanswered' | 'marked'>('all');

  const answeredCount = Object.keys(userAnswers).length;
  const markedCount = Object.values(markedQuestions).filter(Boolean).length;
  const unansweredCount = questions.length - answeredCount;

  // Jump to specific question
  const jumpToQuestion = (index: number) => {
    setCurrentIdx(index);
    if (viewMode === 'all') {
      const el = document.getElementById(`q-card-${questions[index].id}`);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }
  };

  // Option letters mapping
  const optionLetters = ['ক / K', 'খ / L', 'গ / M', 'ঘ / N'];

  const filteredPaletteQuestions = questions.filter((q) => {
    const isAnswered = userAnswers[q.id] !== undefined;
    const isMarked = !!markedQuestions[q.id];

    if (paletteFilter === 'answered') return isAnswered;
    if (paletteFilter === 'unanswered') return !isAnswered;
    if (paletteFilter === 'marked') return isMarked;
    return true;
  });

  return (
    <div className="max-w-6xl mx-auto px-4 py-6 space-y-6">
      {/* Top Banner / Candidate Bar */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-4 text-xs sm:text-sm">
          <div>
            <span className="text-slate-500">পরীক্ষার্থী: </span>
            <span className="font-bold text-slate-900">{candidateName}</span>
          </div>
          {candidateRoll ? (
            <>
              <span className="text-slate-300">·</span>
              <div>
                <span className="text-slate-500">রেজিস্ট্রেশন: </span>
                <span className="font-mono font-bold text-indigo-700">{candidateRoll}</span>
              </div>
            </>
          ) : null}
        </div>

        {/* View mode toggle */}
        <div className="flex items-center gap-2">
          <div className="flex items-center bg-slate-100 p-1 rounded-lg text-xs font-medium">
            <button
              onClick={() => setViewMode('all')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md transition ${
                viewMode === 'all'
                  ? 'bg-white text-slate-900 shadow-sm font-semibold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <List className="w-3.5 h-3.5" />
              <span>একসাথে সকল প্রশ্ন ({questions.length})</span>
            </button>
            <button
              onClick={() => setViewMode('single')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md transition ${
                viewMode === 'single'
                  ? 'bg-white text-slate-900 shadow-sm font-semibold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Eye className="w-3.5 h-3.5" />
              <span>একক প্রশ্ন মোড</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Grid: Question Content & OMR Navigator */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Questions */}
        <div className="lg:col-span-8 space-y-5">
          {viewMode === 'all' ? (
            /* ALL QUESTIONS VIEW */
            questions.map((item, idx) => {
              const selectedOpt = userAnswers[item.id];
              const isMarked = !!markedQuestions[item.id];

              return (
                <div
                  key={item.id}
                  id={`q-card-${item.id}`}
                  className={`bg-white rounded-2xl p-5 sm:p-6 shadow-sm border transition-all ${
                    isMarked
                      ? 'border-amber-400 bg-amber-50/20'
                      : selectedOpt !== undefined
                      ? 'border-indigo-300'
                      : 'border-slate-200'
                  }`}
                >
                  {/* Card Header */}
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div className="flex items-center gap-2">
                      <span className="w-7 h-7 rounded-lg bg-indigo-50 border border-indigo-200 text-indigo-900 flex items-center justify-center font-bold text-xs font-mono">
                        {item.id}
                      </span>
                      <span className="text-xs text-slate-500 font-medium">
                        {item.topic}
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => onToggleMark(item.id)}
                        className={`text-xs px-2.5 py-1 rounded-md border flex items-center gap-1 transition ${
                          isMarked
                            ? 'bg-amber-100 border-amber-300 text-amber-900 font-semibold'
                            : 'border-slate-200 text-slate-500 hover:bg-slate-50'
                        }`}
                        title="রিভিউয়ের জন্য মার্ক করুন"
                      >
                        {isMarked ? (
                          <BookmarkCheck className="w-3.5 h-3.5 text-amber-700" />
                        ) : (
                          <Bookmark className="w-3.5 h-3.5" />
                        )}
                        <span>{isMarked ? 'রিভিউ মার্কড' : 'মার্ক করুন'}</span>
                      </button>

                      {selectedOpt !== undefined && (
                        <button
                          onClick={() => onClearAnswer(item.id)}
                          className="text-xs text-slate-500 hover:text-rose-600 px-2 py-1 rounded border border-slate-200 hover:border-rose-200 hover:bg-rose-50 transition"
                          title="উত্তর বাতিল করুন"
                        >
                          মুছুন
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Question Body */}
                  <div className="text-slate-900 font-medium text-base sm:text-lg mb-5 leading-relaxed">
                    <MathText text={item.question} />
                  </div>

                  {/* 4 Options Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {item.options.map((opt, optIdx) => {
                      const isSelected = selectedOpt === optIdx;
                      return (
                        <label
                          key={optIdx}
                          onClick={() => onSelectAnswer(item.id, optIdx)}
                          className={`flex items-start gap-3 p-3.5 rounded-xl border cursor-pointer transition select-none ${
                            isSelected
                              ? 'bg-indigo-50/70 border-indigo-600 ring-1 ring-indigo-600'
                              : 'bg-slate-50/60 border-slate-200 hover:bg-slate-100/70 hover:border-slate-300'
                          }`}
                        >
                          <input
                            type="radio"
                            name={`q_${item.id}`}
                            checked={isSelected}
                            onChange={() => {}}
                            className="mt-1 w-4 h-4 text-indigo-600 focus:ring-indigo-500 cursor-pointer"
                          />
                          <div className="flex-1 text-sm text-slate-800">
                            <MathText text={opt} />
                          </div>
                        </label>
                      );
                    })}
                  </div>
                </div>
              );
            })
          ) : (
            /* SINGLE QUESTION FOCUS MODE */
            (() => {
              const item = questions[currentIdx];
              const selectedOpt = userAnswers[item.id];
              const isMarked = !!markedQuestions[item.id];

              return (
                <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-sm border border-slate-200 space-y-6">
                  {/* Single Question Header */}
                  <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                    <div className="flex items-center gap-3">
                      <span className="w-9 h-9 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-bold text-sm font-mono shadow-sm">
                        {item.id}
                      </span>
                      <div>
                        <div className="text-xs text-slate-400">প্রশ্ন {currentIdx + 1} / {questions.length}</div>
                        <div className="text-xs font-semibold text-indigo-800">{item.topic}</div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => onToggleMark(item.id)}
                        className={`text-xs px-3 py-1.5 rounded-lg border flex items-center gap-1.5 transition ${
                          isMarked
                            ? 'bg-amber-100 border-amber-300 text-amber-900 font-semibold'
                            : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                        }`}
                      >
                        {isMarked ? (
                          <BookmarkCheck className="w-4 h-4 text-amber-700" />
                        ) : (
                          <Bookmark className="w-4 h-4" />
                        )}
                        <span>{isMarked ? 'রিভিউ মার্কড' : 'রিভিউ রাখুন'}</span>
                      </button>

                      {selectedOpt !== undefined && (
                        <button
                          onClick={() => onClearAnswer(item.id)}
                          className="text-xs text-rose-600 px-2.5 py-1.5 rounded-lg border border-rose-200 hover:bg-rose-50 transition"
                        >
                          উত্তর বাতিল
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Question Text */}
                  <div className="text-slate-900 font-medium text-lg sm:text-xl py-2 leading-relaxed">
                    <MathText text={item.question} />
                  </div>

                  {/* Options */}
                  <div className="space-y-3">
                    {item.options.map((opt, optIdx) => {
                      const isSelected = selectedOpt === optIdx;
                      return (
                        <label
                          key={optIdx}
                          onClick={() => onSelectAnswer(item.id, optIdx)}
                          className={`flex items-start gap-3.5 p-4 rounded-xl border cursor-pointer transition select-none ${
                            isSelected
                              ? 'bg-indigo-50/80 border-indigo-600 ring-2 ring-indigo-600/30'
                              : 'bg-slate-50/50 border-slate-200 hover:bg-slate-100/70 hover:border-slate-300'
                          }`}
                        >
                          <input
                            type="radio"
                            name={`single_q_${item.id}`}
                            checked={isSelected}
                            onChange={() => {}}
                            className="mt-1 w-4 h-4 text-indigo-600 focus:ring-indigo-500 cursor-pointer"
                          />
                          <div className="flex-1 text-sm sm:text-base text-slate-800">
                            <MathText text={opt} />
                          </div>
                        </label>
                      );
                    })}
                  </div>

                  {/* Prev / Next Navigation Controls */}
                  <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                    <button
                      disabled={currentIdx === 0}
                      onClick={() => setCurrentIdx((prev) => Math.max(0, prev - 1))}
                      className="flex items-center gap-1.5 px-4 py-2 text-sm rounded-lg border border-slate-300 text-slate-700 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition"
                    >
                      <ChevronLeft className="w-4 h-4" />
                      <span>পূর্ববর্তী প্রশ্ন</span>
                    </button>

                    <span className="text-xs text-slate-500 font-mono">
                      {currentIdx + 1} of {questions.length}
                    </span>

                    <button
                      disabled={currentIdx === questions.length - 1}
                      onClick={() => setCurrentIdx((prev) => Math.min(questions.length - 1, prev + 1))}
                      className="flex items-center gap-1.5 px-4 py-2 text-sm rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 disabled:opacity-40 disabled:cursor-not-allowed transition shadow-sm"
                    >
                      <span>পরবর্তী প্রশ্ন</span>
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })()
          )}

          {/* Bottom Submit Action Trigger */}
          <div className="pt-4 pb-12 flex flex-col sm:flex-row items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
            <div className="text-xs text-slate-600">
              মোট উত্তর: <strong className="text-emerald-700">{answeredCount}</strong> / {questions.length} ·{' '}
              বাকি: <strong className="text-slate-700">{unansweredCount}</strong> ·{' '}
              রিভিউ: <strong className="text-amber-700">{markedCount}</strong>
            </div>

            <button
              onClick={() => setShowSubmitModal(true)}
              className="w-full sm:w-auto bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-8 py-3 rounded-xl shadow-md transition flex items-center justify-center gap-2 text-sm sm:text-base"
            >
              <Send className="w-4 h-4" />
              <span>পরীক্ষা জমা দিন (Submit Exam)</span>
            </button>
          </div>
        </div>

        {/* Right Column: Sticky OMR Palette Navigator */}
        <div className="lg:col-span-4 sticky top-20 space-y-4">
          <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-200 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <span>প্রশ্ন নেভিগেটর (OMR Palette)</span>
              </h3>
              <span className="text-xs font-mono font-semibold text-slate-500">
                {answeredCount}/{questions.length}
              </span>
            </div>

            {/* Quick Status Pill Bar */}
            <div className="grid grid-cols-3 gap-2 text-center text-xs">
              <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 p-2 rounded-lg">
                <div className="font-bold text-sm font-mono">{answeredCount}</div>
                <div className="text-[10px]">উত্তর দেওয়া</div>
              </div>
              <div className="bg-amber-50 border border-amber-200 text-amber-800 p-2 rounded-lg">
                <div className="font-bold text-sm font-mono">{markedCount}</div>
                <div className="text-[10px]">রিভিউ মার্ক</div>
              </div>
              <div className="bg-slate-50 border border-slate-200 text-slate-700 p-2 rounded-lg">
                <div className="font-bold text-sm font-mono">{unansweredCount}</div>
                <div className="text-[10px]">বাকি আছে</div>
              </div>
            </div>

            {/* Filter buttons */}
            <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg text-[11px] font-medium">
              <button
                onClick={() => setPaletteFilter('all')}
                className={`flex-1 py-1 rounded text-center transition ${
                  paletteFilter === 'all' ? 'bg-white text-slate-900 shadow-xs font-semibold' : 'text-slate-600'
                }`}
              >
                সকল
              </button>
              <button
                onClick={() => setPaletteFilter('answered')}
                className={`flex-1 py-1 rounded text-center transition ${
                  paletteFilter === 'answered' ? 'bg-white text-slate-900 shadow-xs font-semibold' : 'text-slate-600'
                }`}
              >
                উত্তরকৃত
              </button>
              <button
                onClick={() => setPaletteFilter('marked')}
                className={`flex-1 py-1 rounded text-center transition ${
                  paletteFilter === 'marked' ? 'bg-white text-slate-900 shadow-xs font-semibold' : 'text-slate-600'
                }`}
              >
                রিভিউ
              </button>
              <button
                onClick={() => setPaletteFilter('unanswered')}
                className={`flex-1 py-1 rounded text-center transition ${
                  paletteFilter === 'unanswered' ? 'bg-white text-slate-900 shadow-xs font-semibold' : 'text-slate-600'
                }`}
              >
                বাকি
              </button>
            </div>

            {/* 40 Grid Matrix */}
            <div className="grid grid-cols-5 sm:grid-cols-8 lg:grid-cols-5 gap-2 max-h-[360px] overflow-y-auto pr-1">
              {filteredPaletteQuestions.map((q) => {
                const idx = questions.findIndex((x) => x.id === q.id);
                const isAnswered = userAnswers[q.id] !== undefined;
                const isMarked = !!markedQuestions[q.id];
                const isActive = currentIdx === idx && viewMode === 'single';

                let btnStyle = 'bg-slate-50 border-slate-200 text-slate-700 hover:border-slate-400';
                if (isMarked) {
                  btnStyle = 'bg-amber-500 border-amber-600 text-white font-bold';
                } else if (isAnswered) {
                  btnStyle = 'bg-emerald-600 border-emerald-700 text-white font-bold';
                }

                return (
                  <button
                    key={q.id}
                    onClick={() => jumpToQuestion(idx)}
                    className={`h-9 rounded-lg border text-xs font-mono font-semibold flex items-center justify-center transition relative ${btnStyle} ${
                      isActive ? 'ring-2 ring-indigo-600 ring-offset-1' : ''
                    }`}
                    title={`প্রশ্ন ${q.id} - ${isAnswered ? 'উত্তর দেওয়া হয়েছে' : 'বাকি আছে'}`}
                  >
                    <span>{q.id}</span>
                    {isMarked && (
                      <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-rose-500" />
                    )}
                  </button>
                );
              })}
            </div>

            {/* Submit Exam Button */}
            <button
              onClick={() => setShowSubmitModal(true)}
              className="w-full bg-indigo-700 hover:bg-indigo-800 text-white font-bold py-2.5 rounded-xl shadow-xs transition text-xs sm:text-sm flex items-center justify-center gap-2"
            >
              <Send className="w-3.5 h-3.5" />
              <span>উত্তরপত্র জমা দিন</span>
            </button>
          </div>
        </div>
      </div>

      {/* Confirmation Submit Modal */}
      {showSubmitModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-5 animate-in fade-in zoom-in-95 duration-200">
            <div className="text-center space-y-2">
              <div className="w-12 h-12 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center mx-auto">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-slate-900">পরীক্ষা জমা দিতে চান?</h3>
              <p className="text-xs text-slate-500">
                একবার সাবমিট করার পর উত্তর পরিবর্তন করা যাবে না। আপনার সামগ্রিক ফলাফল ও বিস্তারিত সমাধান প্রদর্শিত হবে।
              </p>
            </div>

            <div className="bg-slate-50 rounded-xl p-4 border border-slate-200 grid grid-cols-3 gap-2 text-center text-xs">
              <div className="p-2">
                <div className="text-slate-500">উত্তরকৃত</div>
                <div className="text-lg font-bold text-emerald-700 font-mono">{answeredCount}</div>
              </div>
              <div className="p-2">
                <div className="text-slate-500">উত্তরহীন</div>
                <div className="text-lg font-bold text-rose-600 font-mono">{unansweredCount}</div>
              </div>
              <div className="p-2">
                <div className="text-slate-500">রিভিউ মার্ক</div>
                <div className="text-lg font-bold text-amber-700 font-mono">{markedCount}</div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setShowSubmitModal(false)}
                className="flex-1 py-2.5 px-4 rounded-xl border border-slate-300 text-slate-700 font-medium hover:bg-slate-50 text-sm transition"
              >
                পরীক্ষায় ফিরে যান
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowSubmitModal(false);
                  onSubmitExam();
                }}
                className="flex-1 py-2.5 px-4 rounded-xl bg-emerald-600 text-white font-bold hover:bg-emerald-700 text-sm shadow-md transition"
              >
                হ্যাঁ, জমা দিন
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
