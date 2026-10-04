import React, { useState, useEffect, useRef } from 'react';
import { Header } from './components/Header';
import { RegistrationView } from './components/RegistrationView';
import { ExamView } from './components/ExamView';
import { ResultView } from './components/ResultView';
import { questionsData } from './data/questions';

type ExamState = 'registration' | 'exam' | 'result';

export default function App() {
  const [examState, setExamState] = useState<ExamState>('registration');
  const [candidateName, setCandidateName] = useState('');
  const [candidateRoll, setCandidateRoll] = useState('');
  const [candidateBatch, setCandidateBatch] = useState('Special BCS Crystal Batch (Doctor)');
  const [isPractice, setIsPractice] = useState(false);

  // Exam answers & review marks
  const [userAnswers, setUserAnswers] = useState<Record<number, number>>({});
  const [markedQuestions, setMarkedQuestions] = useState<Record<number, boolean>>({});

  // Timer states
  const INITIAL_EXAM_SECONDS = 45 * 60; // 45 minutes
  const [timeLeftSeconds, setTimeLeftSeconds] = useState(INITIAL_EXAM_SECONDS);
  const [timeTakenSeconds, setTimeTakenSeconds] = useState(0);
  const [isOmrDrawerOpen, setIsOmrDrawerOpen] = useState(false);

  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Timer effect
  useEffect(() => {
    if (examState === 'exam' && !isPractice) {
      timerRef.current = setInterval(() => {
        setTimeLeftSeconds((prev) => {
          if (prev <= 1) {
            clearInterval(timerRef.current!);
            handleFinalSubmit();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [examState, isPractice]);

  const handleStartExam = (data: {
    name: string;
    roll: string;
    batch: string;
    isPractice: boolean;
  }) => {
    setCandidateName(data.name);
    setCandidateRoll(data.roll);
    setCandidateBatch(data.batch);
    setIsPractice(data.isPractice);
    setUserAnswers({});
    setMarkedQuestions({});
    setTimeLeftSeconds(INITIAL_EXAM_SECONDS);
    setTimeTakenSeconds(0);
    setExamState('exam');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectAnswer = (questionId: number, optionIndex: number) => {
    setUserAnswers((prev) => ({
      ...prev,
      [questionId]: optionIndex,
    }));
  };

  const handleClearAnswer = (questionId: number) => {
    setUserAnswers((prev) => {
      const next = { ...prev };
      delete next[questionId];
      return next;
    });
  };

  const handleToggleMark = (questionId: number) => {
    setMarkedQuestions((prev) => ({
      ...prev,
      [questionId]: !prev[questionId],
    }));
  };

  const handleFinalSubmit = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    const spent = INITIAL_EXAM_SECONDS - timeLeftSeconds;
    setTimeTakenSeconds(spent > 0 ? spent : 45 * 60);
    setExamState('result');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleRetakeExam = () => {
    setUserAnswers({});
    setMarkedQuestions({});
    setTimeLeftSeconds(INITIAL_EXAM_SECONDS);
    setTimeTakenSeconds(0);
    setExamState('registration');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const answeredCount = Object.keys(userAnswers).length;

  return (
    <div className="min-h-screen flex flex-col bg-slate-100 text-slate-800">
      {/* Top Sticky Header */}
      <Header
        examStarted={examState === 'exam'}
        examSubmitted={examState === 'result'}
        timeLeftSeconds={timeLeftSeconds}
        totalTimeSeconds={INITIAL_EXAM_SECONDS}
        studentName={candidateName}
        studentRoll={candidateRoll}
        answeredCount={answeredCount}
        totalQuestions={questionsData.length}
        onOpenOmr={() => setIsOmrDrawerOpen(!isOmrDrawerOpen)}
        onSubmitClick={() => handleFinalSubmit()}
      />

      {/* Main Content Area */}
      <main className="flex-1">
        {examState === 'registration' && (
          <RegistrationView
            onStartExam={handleStartExam}
            defaultName={candidateName}
            defaultRoll={candidateRoll}
          />
        )}

        {examState === 'exam' && (
          <ExamView
            questions={questionsData}
            userAnswers={userAnswers}
            markedQuestions={markedQuestions}
            onSelectAnswer={handleSelectAnswer}
            onClearAnswer={handleClearAnswer}
            onToggleMark={handleToggleMark}
            onSubmitExam={handleFinalSubmit}
            candidateName={candidateName}
            candidateRoll={candidateRoll}
            isOmrDrawerOpen={isOmrDrawerOpen}
            setIsOmrDrawerOpen={setIsOmrDrawerOpen}
          />
        )}

        {examState === 'result' && (
          <ResultView
            questions={questionsData}
            userAnswers={userAnswers}
            candidateName={candidateName}
            candidateRoll={candidateRoll}
            candidateBatch={candidateBatch}
            timeTakenSeconds={timeTakenSeconds}
            onRetakeExam={handleRetakeExam}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="no-print bg-slate-900 border-t border-slate-800 text-slate-400 py-6 text-xs text-center mt-auto">
        <div className="max-w-5xl mx-auto px-4 space-y-1">
          <p className="font-semibold text-slate-200">
            CPR MEDICAL ACADEMY · SPECIAL BCS CRYSTAL BATCH
          </p>
          <p>
            Official Online Examination System · Subject: Mathematical Reasoning (গাণিতিক যুক্তি)
          </p>
          <p className="text-slate-400 text-[11px] pt-1">
            Marking Policy: +1.0 per correct answer, -0.50 negative marking per incorrect answer.
          </p>
        </div>
      </footer>
    </div>
  );
}
