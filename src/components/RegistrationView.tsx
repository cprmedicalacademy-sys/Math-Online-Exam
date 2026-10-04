import React, { useState } from 'react';
import {
  FileText,
  Clock,
  Award,
  AlertCircle,
  CheckCircle2,
  ShieldAlert,
  Play
} from 'lucide-react';
import { EXAM_TOPICS } from '../data/questions';
import { CprLogo } from './CprLogo';

interface RegistrationViewProps {
  onStartExam: (data: {
    name: string;
    roll: string;
    batch: string;
    isPractice: boolean;
  }) => void;
  defaultName?: string;
  defaultRoll?: string;
}

export const RegistrationView: React.FC<RegistrationViewProps> = ({
  onStartExam,
  defaultName = '',
  defaultRoll = '',
}) => {
  const [name, setName] = useState(defaultName);
  const [roll, setRoll] = useState(defaultRoll);
  const [batch, setBatch] = useState('Special BCS Crystal Batch (Doctor)');
  const [isPractice, setIsPractice] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('অনুগ্রহ করে আপনার নাম লিখুন (Please enter your name)');
      return;
    }
    setError('');
    onStartExam({
      name: name.trim(),
      roll: roll.trim() ? roll.trim() : '',
      batch,
      isPractice,
    });
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-8">
      {/* Academy Crest & Welcome Hero */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 px-6 sm:px-10 py-8 text-white">
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 text-center sm:text-left">
            <div className="p-1 bg-white rounded-full shadow-xl shrink-0 border-2 border-indigo-400">
              <CprLogo className="w-20 h-20 sm:w-24 sm:h-24 rounded-full" />
            </div>
            <div className="space-y-1.5 flex-1">
              <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-amber-300 bg-amber-400/10 border border-amber-400/30 px-2.5 py-0.5 rounded-full mb-1">
                <span>BCS Preliminary Mathematical Reasoning Examination</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white font-serif">
                CPR MEDICAL ACADEMY
              </h2>
              <p className="text-xs sm:text-sm text-indigo-200">
                Centre for Post-gRaduation · <span className="text-white font-medium">SPECIAL BCS CRYSTAL BATCH</span>
              </p>
              <p className="text-xs text-amber-300 font-medium pt-0.5">
                বিষয়: গাণিতিক যুক্তি (Mathematical Reasoning)
              </p>
            </div>
          </div>
        </div>

        {/* Quick Exam Specifications Banner */}
        <div className="grid grid-cols-2 sm:grid-cols-4 divide-y sm:divide-y-0 sm:divide-x divide-slate-100 bg-slate-50/80 border-b border-slate-200 text-center">
          <div className="p-3.5">
            <div className="text-xs text-slate-500 font-medium">মোট প্রশ্ন</div>
            <div className="text-xl font-bold text-slate-900 font-mono">৪০ টি</div>
          </div>
          <div className="p-3.5">
            <div className="text-xs text-slate-500 font-medium">মোট নম্বর</div>
            <div className="text-xl font-bold text-indigo-700 font-mono">৪০.০</div>
          </div>
          <div className="p-3.5">
            <div className="text-xs text-slate-500 font-medium">নির্ধারিত সময়</div>
            <div className="text-xl font-bold text-slate-900 font-mono">৪৫ মিনিট</div>
          </div>
          <div className="p-3.5">
            <div className="text-xs text-slate-500 font-medium">নেগেটিভ মার্কিং</div>
            <div className="text-xl font-bold text-rose-600 font-mono">-০.৫ / ভুল</div>
          </div>
        </div>

        <div className="p-6 sm:p-10 grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left: Registration Form */}
          <div className="lg:col-span-7 space-y-6">
            <div>
              <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <FileText className="w-5 h-5 text-indigo-600" />
                <span>পরীক্ষার্থী নিবন্ধন (Candidate Entry)</span>
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                পরীক্ষা শুরু করতে আপনার নাম লিখুন। রেজিস্ট্রেশন নম্বর থাকলে দিন, না থাকলে ফাঁকা রাখতে পারেন।
              </p>
            </div>

            {error && (
              <div className="flex items-center gap-2 text-xs bg-rose-50 text-rose-700 border border-rose-200 p-3 rounded-lg">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                  শিক্ষার্থীর নাম (Student Name) <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="যেমন: Dr. Tanvir Ahmed"
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 placeholder:text-slate-400 focus:bg-white focus:ring-2 focus:ring-indigo-600 focus:border-indigo-600 transition outline-none text-sm"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-sm font-semibold text-slate-700">
                    রেজিস্ট্রেশন নম্বর (Registration No)
                  </label>
                  <span className="text-[11px] text-slate-400 font-medium">ঐচ্ছিক / Optional</span>
                </div>
                <input
                  type="text"
                  value={roll}
                  onChange={(e) => setRoll(e.target.value)}
                  placeholder="রেজিস্ট্রেশন নম্বর দিন (না থাকলে ফাঁকা রাখুন)"
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 placeholder:text-slate-400 focus:bg-white focus:ring-2 focus:ring-indigo-600 focus:border-indigo-600 transition outline-none text-sm font-mono"
                />
                <p className="text-[11px] text-slate-500 mt-1">
                  রেজিস্ট্রেশন নম্বর না থাকলে খালি রেখেও পরীক্ষা শুরু করতে পারবেন।
                </p>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                  ব্যাচ / বিভাগ (Batch / Division)
                </label>
                <select
                  value={batch}
                  onChange={(e) => setBatch(e.target.value)}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 focus:bg-white focus:ring-2 focus:ring-indigo-600 focus:border-indigo-600 transition outline-none text-sm"
                >
                  <option value="Special BCS Crystal Batch (Doctor)">Special BCS Crystal Batch (Doctor)</option>
                  <option value="Special BCS Crystal Batch (Regular)">Special BCS Crystal Batch (Regular)</option>
                  <option value="BCS Preliminary Exclusive Math Batch">BCS Preliminary Exclusive Math Batch</option>
                </select>
              </div>

              {/* Mode Select */}
              <div className="pt-2">
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">
                  পরীক্ষার মোড নির্বাচন করুন
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setIsPractice(false)}
                    className={`flex flex-col text-left p-3 rounded-xl border text-xs transition ${
                      !isPractice
                        ? 'border-indigo-600 bg-indigo-50/50 text-indigo-900 ring-1 ring-indigo-600'
                        : 'border-slate-200 hover:bg-slate-50 text-slate-600'
                    }`}
                  >
                    <span className="font-bold text-sm text-slate-900 flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-indigo-600" />
                      লাইভ এক্সাম
                    </span>
                    <span className="text-[11px] text-slate-500 mt-1">৪৫ মিনিট টাইমার সহ রিয়েল টেস্ট</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setIsPractice(true)}
                    className={`flex flex-col text-left p-3 rounded-xl border text-xs transition ${
                      isPractice
                        ? 'border-indigo-600 bg-indigo-50/50 text-indigo-900 ring-1 ring-indigo-600'
                        : 'border-slate-200 hover:bg-slate-50 text-slate-600'
                    }`}
                  >
                    <span className="font-bold text-sm text-slate-900 flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      অনুশীলন মোড
                    </span>
                    <span className="text-[11px] text-slate-500 mt-1">কোনো সময়ের বাধ্যবাধকতা নেই</span>
                  </button>
                </div>
              </div>

              <button
                type="submit"
                className="w-full mt-4 bg-indigo-700 hover:bg-indigo-800 text-white font-bold py-3.5 px-6 rounded-xl shadow-md transition duration-200 flex items-center justify-center gap-2 text-base tracking-wide"
              >
                <Play className="w-5 h-5 fill-current" />
                <span>পরীক্ষা শুরু করুন (Start Exam)</span>
              </button>
            </form>
          </div>

          {/* Right: Marking Guidelines & Syllabus Topics */}
          <div className="lg:col-span-5 space-y-6 lg:border-l lg:border-slate-200 lg:pl-8">
            {/* Marking Formula */}
            <div className="bg-slate-50 rounded-xl p-4 border border-slate-200 space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                <ShieldAlert className="w-4 h-4 text-amber-600" />
                <span>মূল্যায়ন ও নেগেটিভ মার্কিং বিধিমালা</span>
              </h4>
              <ul className="text-xs text-slate-600 space-y-2 leading-relaxed">
                <li className="flex items-start gap-2">
                  <span className="text-emerald-600 font-bold">✓</span>
                  <span>প্রতিটি সঠিক উত্তরের জন্য <strong>+১.০</strong> নম্বর যোগ হবে।</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-rose-600 font-bold">✕</span>
                  <span>প্রতিটি ভুল উত্তরের জন্য <strong>-০.৫</strong> নম্বর কাটা যাবে।</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-slate-400 font-bold">○</span>
                  <span>উত্তর না দিলে কোনো নম্বর কাটা যাবে না।</span>
                </li>
              </ul>
              <div className="bg-white p-3 rounded-lg border border-slate-200 text-xs text-center font-mono font-medium text-slate-800">
                প্রাপ্ত স্কোর = সঠিক উত্তর − (ভুল উত্তর × ০.৫)
              </div>
            </div>

            {/* Topics Included */}
            <div className="space-y-2.5">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                <Award className="w-4 h-4 text-indigo-600" />
                <span>প্রশ্নপত্রের আওতাভুক্ত বিষয়সমূহ</span>
              </h4>
              <div className="grid grid-cols-1 gap-1.5 text-xs">
                {EXAM_TOPICS.map((topic, idx) => (
                  <div
                    key={idx}
                    className="flex items-center gap-2 p-2 bg-slate-50 rounded-lg text-slate-700 border border-slate-100"
                  >
                    <span className="w-5 h-5 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center font-mono text-[10px] font-bold">
                      {idx + 1}
                    </span>
                    <span>{topic}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
