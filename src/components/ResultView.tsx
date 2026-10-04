import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import {
  Award,
  CheckCircle2,
  XCircle,
  HelpCircle,
  RotateCcw,
  Printer,
  ChevronDown,
  ChevronUp,
  BarChart3,
  BookOpen,
  Filter,
  GraduationCap,
  Calendar,
  Clock
} from 'lucide-react';
import { QuestionItem, EXAM_TOPICS } from '../data/questions';
import { MathText } from './MathText';
import { CprLogo } from './CprLogo';

interface ResultViewProps {
  questions: QuestionItem[];
  userAnswers: Record<number, number>;
  candidateName: string;
  candidateRoll: string;
  candidateBatch: string;
  timeTakenSeconds: number;
  onRetakeExam: () => void;
}

export const ResultView: React.FC<ResultViewProps> = ({
  questions,
  userAnswers,
  candidateName,
  candidateRoll,
  candidateBatch,
  timeTakenSeconds,
  onRetakeExam,
}) => {
  const [filter, setFilter] = useState<'all' | 'correct' | 'incorrect' | 'skipped'>('all');
  const [selectedTopic, setSelectedTopic] = useState<string>('all');
  const [expandedSolutions, setExpandedSolutions] = useState<Record<number, boolean>>({});

  // Compute metrics
  let correctCount = 0;
  let incorrectCount = 0;
  let skippedCount = 0;

  questions.forEach((q) => {
    const userChoice = userAnswers[q.id];
    if (userChoice === undefined) {
      skippedCount++;
    } else if (userChoice === q.correctAnswer) {
      correctCount++;
    } else {
      incorrectCount++;
    }
  });

  const finalScore = Number((correctCount - incorrectCount * 0.5).toFixed(2));
  const maxScore = questions.length;
  const percentage = Math.max(0, Number(((finalScore / maxScore) * 100).toFixed(1)));
  const attemptedCount = correctCount + incorrectCount;
  const accuracy = attemptedCount > 0 ? Number(((correctCount / attemptedCount) * 100).toFixed(1)) : 0;

  // Fire confetti if score is high (>= 60%)
  useEffect(() => {
    if (percentage >= 50) {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 }
      });
    }
  }, [percentage]);

  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const s = secs % 60;
    return `${mins} মিনিট ${s} সেকেন্ড`;
  };

  // Topic-wise analytics calculation
  const topicStats = EXAM_TOPICS.map((topic) => {
    const topicQuestions = questions.filter((q) => q.topic === topic);
    let tCorrect = 0;
    let tIncorrect = 0;
    let tSkipped = 0;

    topicQuestions.forEach((q) => {
      const ans = userAnswers[q.id];
      if (ans === undefined) tSkipped++;
      else if (ans === q.correctAnswer) tCorrect++;
      else tIncorrect++;
    });

    const tScore = Number((tCorrect - tIncorrect * 0.5).toFixed(1));

    return {
      topic,
      total: topicQuestions.length,
      correct: tCorrect,
      incorrect: tIncorrect,
      skipped: tSkipped,
      score: tScore,
      percentage: topicQuestions.length > 0 ? Math.round((tCorrect / topicQuestions.length) * 100) : 0,
    };
  });

  // Filter questions for detailed answer review
  const filteredQuestions = questions.filter((q) => {
    const userChoice = userAnswers[q.id];
    const isCorrect = userChoice === q.correctAnswer;
    const isSkipped = userChoice === undefined;

    if (filter === 'correct' && !isCorrect) return false;
    if (filter === 'incorrect' && (isSkipped || isCorrect)) return false;
    if (filter === 'skipped' && !isSkipped) return false;

    if (selectedTopic !== 'all' && q.topic !== selectedTopic) return false;

    return true;
  });

  const toggleAllSolutions = (open: boolean) => {
    const next: Record<number, boolean> = {};
    questions.forEach((q) => {
      next[q.id] = open;
    });
    setExpandedSolutions(next);
  };

  const toggleSolution = (id: number) => {
    setExpandedSolutions((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-8">
      {/* Official Score Card Card */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        {/* Academic Header with Logo */}
        <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white p-6 sm:p-8 text-center space-y-3">
          <div className="flex justify-center">
            <div className="p-1 bg-white rounded-full shadow-lg border border-indigo-400">
              <CprLogo className="w-16 h-16 sm:w-20 sm:h-20 rounded-full" />
            </div>
          </div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-500/20 text-indigo-200 border border-indigo-500/30">
            <GraduationCap className="w-4 h-4 text-amber-300" />
            <span>SPECIAL BCS CRYSTAL BATCH · OFFICIAL EXAM RESULT</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight font-serif">
            CPR MEDICAL ACADEMY
          </h2>
          <p className="text-xs sm:text-sm text-slate-300">
            Centre for Post-gRaduation · Topic: গাণিতিক যুক্তি (Mathematical Reasoning) · পূর্ণমান: ৪০.০
          </p>
        </div>

        {/* Candidate Info Bar */}
        <div className="bg-slate-50 border-b border-slate-200 px-6 py-4 flex flex-wrap items-center justify-between gap-4 text-xs sm:text-sm">
          <div className="space-y-0.5">
            <span className="text-slate-500">শিক্ষার্থীর নাম: </span>
            <span className="font-bold text-slate-900">{candidateName}</span>
          </div>
          <div className="space-y-0.5">
            <span className="text-slate-500">রেজিস্ট্রেশন নম্বর: </span>
            <span className="font-mono font-bold text-indigo-700">
              {candidateRoll ? candidateRoll : '— (ফাঁকা)'}
            </span>
          </div>
          <div className="space-y-0.5">
            <span className="text-slate-500">ব্যাচ: </span>
            <span className="font-medium text-slate-800">{candidateBatch}</span>
          </div>
          <div className="space-y-0.5 flex items-center gap-1 text-slate-600">
            <Clock className="w-3.5 h-3.5 text-slate-400" />
            <span>ব্যয়িত সময়: {formatTime(timeTakenSeconds)}</span>
          </div>
        </div>

        <div className="p-6 sm:p-8 space-y-8">
          {/* Main Score & Metric Grid */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
            {/* Final Net Score Card */}
            <div className="md:col-span-5 bg-gradient-to-br from-indigo-900 to-slate-900 text-white rounded-2xl p-6 text-center space-y-2 shadow-sm border border-indigo-800">
              <span className="text-xs uppercase tracking-wider text-indigo-200 font-semibold">
                চূড়ান্ত প্রাপ্ত নম্বর (BCS Net Score)
              </span>
              <div className="text-5xl sm:text-6xl font-extrabold font-mono text-amber-300 tracking-tight">
                {finalScore.toFixed(2)}
              </div>
              <div className="text-xs text-indigo-200">
                মোট ৪০.০ নম্বরের মধ্যে ({percentage}%)
              </div>
              <div className="pt-2 text-[11px] text-slate-300 border-t border-indigo-800/80 font-mono">
                সূত্র: {correctCount} - ({incorrectCount} × ০.৫) = {finalScore.toFixed(2)}
              </div>
            </div>

            {/* Score Breakdown Counters */}
            <div className="md:col-span-7 grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
              <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-200">
                <div className="text-xs font-semibold text-emerald-800">সঠিক উত্তর</div>
                <div className="text-2xl font-bold font-mono text-emerald-700 mt-1">{correctCount}</div>
                <div className="text-[10px] text-emerald-600 mt-0.5">+{correctCount}.০ নম্বর</div>
              </div>

              <div className="p-4 bg-rose-50 rounded-xl border border-rose-200">
                <div className="text-xs font-semibold text-rose-800">ভুল উত্তর</div>
                <div className="text-2xl font-bold font-mono text-rose-700 mt-1">{incorrectCount}</div>
                <div className="text-[10px] text-rose-600 mt-0.5">-{(incorrectCount * 0.5).toFixed(1)} কাটা</div>
              </div>

              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                <div className="text-xs font-semibold text-slate-700">উত্তরহীন</div>
                <div className="text-2xl font-bold font-mono text-slate-700 mt-1">{skippedCount}</div>
                <div className="text-[10px] text-slate-500 mt-0.5">০ নম্বর কাটা</div>
              </div>

              <div className="p-4 bg-indigo-50 rounded-xl border border-indigo-200">
                <div className="text-xs font-semibold text-indigo-900">নির্ভুলতা (Acc.)</div>
                <div className="text-2xl font-bold font-mono text-indigo-800 mt-1">{accuracy}%</div>
                <div className="text-[10px] text-indigo-600 mt-0.5">অংশগ্রহণ: {attemptedCount}/৪০</div>
              </div>
            </div>
          </div>

          {/* Action Buttons: Print & Retake */}
          <div className="no-print flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-100">
            <div className="flex items-center gap-2">
              <button
                onClick={() => window.print()}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl border border-slate-300 text-slate-700 text-xs sm:text-sm font-semibold hover:bg-slate-50 transition"
              >
                <Printer className="w-4 h-4 text-slate-500" />
                <span>ফলাফল প্রিন্ট / PDF সংরক্ষণ</span>
              </button>
            </div>

            <button
              onClick={onRetakeExam}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 text-white text-xs sm:text-sm font-bold hover:bg-indigo-700 transition shadow-sm"
            >
              <RotateCcw className="w-4 h-4" />
              <span>পুনরায় পরীক্ষা দিন (Retake Test)</span>
            </button>
          </div>
        </div>
      </div>

      {/* Topic-wise Performance Analysis */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 sm:p-8 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-indigo-600" />
            <h3 className="text-base sm:text-lg font-bold text-slate-900">
              বিষয়ভিত্তিক পারফরম্যান্স বিশ্লেষণ (Topic-wise Mastery)
            </h3>
          </div>
          <span className="text-xs text-slate-500">৬টি অধ্যায় অন্তর্ভুক্ত</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {topicStats.map((item, idx) => (
            <div key={idx} className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
              <div className="flex items-center justify-between text-xs font-semibold">
                <span className="text-slate-800">{item.topic}</span>
                <span className="font-mono text-indigo-800">
                  {item.correct}/{item.total} সঠিক ({item.score} নম্বর)
                </span>
              </div>
              {/* Progress bar */}
              <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                <div
                  className={`h-full transition-all duration-500 ${
                    item.percentage >= 70
                      ? 'bg-emerald-500'
                      : item.percentage >= 40
                      ? 'bg-amber-500'
                      : 'bg-rose-500'
                  }`}
                  style={{ width: `${item.percentage}%` }}
                />
              </div>
              <div className="flex items-center justify-between text-[11px] text-slate-500">
                <span>সঠিক: {item.correct}</span>
                <span>ভুল: {item.incorrect}</span>
                <span>উত্তরহীন: {item.skipped}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Detailed Answer Key & Mathematical Step-by-Step Solutions */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <div>
            <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-indigo-600" />
              <span>বিস্তারিত প্রশ্ন সমাধান ও ব্যাখ্যা (Step-by-Step Review)</span>
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              সকল ৪০টি প্রশ্নের নির্ভুল ব্যাখ্যা, সূত্র ও বিকল্প সমাধান নিচে বিস্তারিত দেওয়া হলো।
            </p>
          </div>

          <div className="no-print flex items-center gap-2">
            <button
              onClick={() => toggleAllSolutions(true)}
              className="text-xs px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg transition"
            >
              সব সমাধান খুলুন
            </button>
            <button
              onClick={() => toggleAllSolutions(false)}
              className="text-xs px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg transition"
            >
              সব বন্ধ করুন
            </button>
          </div>
        </div>

        {/* Filter Toolbar */}
        <div className="no-print flex flex-wrap items-center justify-between gap-3 bg-white p-3 rounded-xl border border-slate-200 text-xs">
          <div className="flex items-center gap-1.5">
            <Filter className="w-4 h-4 text-slate-400" />
            <span className="font-semibold text-slate-700">ফিল্টার:</span>
            <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg">
              <button
                onClick={() => setFilter('all')}
                className={`px-2.5 py-1 rounded transition ${
                  filter === 'all' ? 'bg-white font-bold text-slate-900 shadow-xs' : 'text-slate-600'
                }`}
              >
                সকল ({questions.length})
              </button>
              <button
                onClick={() => setFilter('correct')}
                className={`px-2.5 py-1 rounded transition ${
                  filter === 'correct' ? 'bg-white font-bold text-emerald-800 shadow-xs' : 'text-slate-600'
                }`}
              >
                সঠিক ({correctCount})
              </button>
              <button
                onClick={() => setFilter('incorrect')}
                className={`px-2.5 py-1 rounded transition ${
                  filter === 'incorrect' ? 'bg-white font-bold text-rose-800 shadow-xs' : 'text-slate-600'
                }`}
              >
                ভুল ({incorrectCount})
              </button>
              <button
                onClick={() => setFilter('skipped')}
                className={`px-2.5 py-1 rounded transition ${
                  filter === 'skipped' ? 'bg-white font-bold text-slate-800 shadow-xs' : 'text-slate-600'
                }`}
              >
                উত্তরহীন ({skippedCount})
              </button>
            </div>
          </div>

          {/* Topic filter dropdown */}
          <select
            value={selectedTopic}
            onChange={(e) => setSelectedTopic(e.target.value)}
            className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-700 outline-none"
          >
            <option value="all">সকল অধ্যায় ({questions.length})</option>
            {EXAM_TOPICS.map((topic, i) => (
              <option key={i} value={topic}>{topic}</option>
            ))}
          </select>
        </div>

        {/* Questions Solution List */}
        <div className="space-y-4">
          {filteredQuestions.length === 0 ? (
            <div className="bg-white rounded-2xl p-8 text-center text-slate-500 border border-slate-200 text-sm">
              নির্বাচিত ফিল্টারে কোনো প্রশ্ন পাওয়া যায়নি।
            </div>
          ) : (
            filteredQuestions.map((item) => {
              const userChoice = userAnswers[item.id];
              const isCorrect = userChoice === item.correctAnswer;
              const isSkipped = userChoice === undefined;
              const isExpanded = expandedSolutions[item.id] ?? true;

              return (
                <div
                  key={item.id}
                  className={`bg-white rounded-2xl p-5 sm:p-6 shadow-sm border transition-all ${
                    isCorrect
                      ? 'border-emerald-200'
                      : isSkipped
                      ? 'border-slate-200'
                      : 'border-rose-200'
                  }`}
                >
                  {/* Question Header & Status Badge */}
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div className="flex items-center gap-2">
                      <span className="w-7 h-7 rounded-lg bg-slate-100 text-slate-800 font-mono font-bold text-xs flex items-center justify-center border border-slate-200">
                        {item.id}
                      </span>
                      <span className="text-xs text-slate-500 font-medium">
                        {item.topic}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      {isCorrect && (
                        <span className="text-xs font-semibold px-2.5 py-1 rounded-md bg-emerald-50 text-emerald-800 border border-emerald-200 flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                          <span>সঠিক (+১.০)</span>
                        </span>
                      )}
                      {!isCorrect && !isSkipped && (
                        <span className="text-xs font-semibold px-2.5 py-1 rounded-md bg-rose-50 text-rose-800 border border-rose-200 flex items-center gap-1">
                          <XCircle className="w-3.5 h-3.5 text-rose-600" />
                          <span>ভুল (-০.৫)</span>
                        </span>
                      )}
                      {isSkipped && (
                        <span className="text-xs font-semibold px-2.5 py-1 rounded-md bg-slate-100 text-slate-600 border border-slate-200 flex items-center gap-1">
                          <HelpCircle className="w-3.5 h-3.5 text-slate-400" />
                          <span>উত্তরহীন (০.০)</span>
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Question Statement */}
                  <div className="text-slate-900 font-medium text-base sm:text-lg mb-4 leading-relaxed">
                    <MathText text={item.question} />
                  </div>

                  {/* 4 Options Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 mb-4">
                    {item.options.map((opt, optIdx) => {
                      const isOptionCorrect = optIdx === item.correctAnswer;
                      const isUserOption = optIdx === userChoice;

                      let optClass = 'bg-slate-50 border-slate-200 text-slate-700';

                      if (isOptionCorrect) {
                        optClass = 'bg-emerald-50 border-emerald-500 text-emerald-950 font-semibold ring-1 ring-emerald-500';
                      } else if (isUserOption && !isOptionCorrect) {
                        optClass = 'bg-rose-50 border-rose-400 text-rose-950 line-through';
                      }

                      return (
                        <div
                          key={optIdx}
                          className={`p-3 rounded-xl border text-sm flex items-start gap-2.5 ${optClass}`}
                        >
                          <div className="mt-0.5">
                            {isOptionCorrect ? (
                              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                            ) : isUserOption ? (
                              <XCircle className="w-4 h-4 text-rose-600 shrink-0" />
                            ) : (
                              <span className="w-4 h-4 rounded-full border border-slate-300 inline-block shrink-0" />
                            )}
                          </div>
                          <div className="flex-1">
                            <MathText text={opt} />
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Toggle Explanation button */}
                  <div className="border-t border-slate-100 pt-3">
                    <button
                      onClick={() => toggleSolution(item.id)}
                      className="text-xs font-semibold text-indigo-700 hover:text-indigo-900 flex items-center gap-1 transition"
                    >
                      <span>গাণিতিক ব্যাখ্যা ও সমাধান</span>
                      {isExpanded ? (
                        <ChevronUp className="w-3.5 h-3.5" />
                      ) : (
                        <ChevronDown className="w-3.5 h-3.5" />
                      )}
                    </button>

                    {isExpanded && (
                      <div className="mt-3 p-4 bg-indigo-50/50 rounded-xl border border-indigo-100 text-xs sm:text-sm text-slate-800 space-y-1.5 animate-in fade-in duration-200">
                        <div className="font-semibold text-indigo-950 mb-1 flex items-center gap-1.5">
                          <span>সঠিক উত্তর:</span>
                          <span className="text-emerald-700 font-bold">
                            {item.options[item.correctAnswer]}
                          </span>
                        </div>
                        <div className="leading-relaxed text-slate-700">
                          <MathText text={item.explanation} />
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};
