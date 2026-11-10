import React, { useState, useEffect } from 'react';
import { SURVEY_QUESTIONS, RATING_SCALE } from '../constants';
import { SurveyScores } from '../types';
import { CheckCircle2, Send, RotateCcw, AlertCircle, Sparkles, Smartphone } from 'lucide-react';

interface SurveyViewProps {
  onSubmitResponse: (scores: SurveyScores, feedback: string) => Promise<boolean>;
  isInsideMockup?: boolean;
}

const STORAGE_KEY = 'training_survey_submitted_state';

export const SurveyView: React.FC<SurveyViewProps> = ({
  onSubmitResponse,
  isInsideMockup = false,
}) => {
  const [scores, setScores] = useState<Partial<SurveyScores>>({});
  const [feedback, setFeedback] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    // Check if previously submitted on this device
    const submitted = localStorage.getItem(STORAGE_KEY);
    if (submitted) {
      setIsSubmitted(true);
    }
  }, []);

  const handleSelectScore = (questionId: keyof SurveyScores, score: number) => {
    setScores(prev => ({
      ...prev,
      [questionId]: score,
    }));
    setErrorMessage(null);
  };

  const answeredCount = Object.keys(scores).filter(
    k => scores[k as keyof SurveyScores] !== undefined
  ).length;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Verify all 5 questions answered
    for (const q of SURVEY_QUESTIONS) {
      if (!scores[q.id]) {
        setErrorMessage(`กรุณาตอบคำถาม ${q.title} ให้ครบถ้วน`);
        return;
      }
    }

    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      const success = await onSubmitResponse(scores as SurveyScores, feedback);
      if (success) {
        localStorage.setItem(STORAGE_KEY, Date.now().toString());
        setIsSubmitted(true);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else {
        setErrorMessage('ไม่สามารถส่งข้อมูลได้ กรุณาลองใหม่อีกครั้ง');
      }
    } catch (err) {
      setErrorMessage('เกิดข้อผิดพลาดในการเชื่อมต่อ');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResetForTesting = () => {
    localStorage.removeItem(STORAGE_KEY);
    setScores({});
    setFeedback('');
    setIsSubmitted(false);
    setErrorMessage(null);
  };

  if (isSubmitted) {
    return (
      <div className={`w-full max-w-lg mx-auto ${isInsideMockup ? 'p-4' : 'p-4 sm:p-6 my-6'}`}>
        <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-200 text-center">
          <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle2 className="w-10 h-10" />
          </div>
          <h2 className="text-2xl font-bold text-slate-900">บันทึกข้อมูลเรียบร้อยแล้ว</h2>
          <p className="text-slate-600 text-sm mt-2 leading-relaxed">
            ขอขอบพระคุณที่ท่านได้สละเวลาให้ความคิดเห็นอันมีค่ายิ่ง ข้อมูลของท่านถูกส่งต่อไปยังหน้าจอแดชบอร์ดของผู้จัดอบรมแล้ว
          </p>

          <div className="mt-6 p-3.5 bg-slate-50 rounded-2xl border border-slate-100 text-xs text-slate-500">
            ระบบจำกัดการตอบ 1 ครั้งต่อเครื่อง เพื่อความถูกต้องทางสถิติ
          </div>

          <div className="mt-8 pt-6 border-t border-slate-100">
            <button
              onClick={handleResetForTesting}
              className="inline-flex items-center justify-center gap-2 w-full py-3 px-4 rounded-xl border border-slate-300 hover:bg-slate-50 text-slate-700 font-semibold text-xs transition-all"
            >
              <RotateCcw className="w-4 h-4 text-slate-500" />
              <span>ส่งแบบประเมินอีกครั้ง (สำหรับการทดสอบระบบ)</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`w-full max-w-xl mx-auto ${isInsideMockup ? 'p-3' : 'p-4 sm:p-6 my-4'}`}>
      
      {/* Header Banner */}
      <div className="text-center mb-6">
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-blue-600 text-white mb-3 shadow-md shadow-blue-500/20">
          <Smartphone className="w-6 h-6" />
        </div>
        <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
          แบบประเมินความพึงพอใจการอบรม
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          ความคิดเห็นของท่านช่วยพัฒนาและปรับปรุงคุณภาพการจัดอบรมในครั้งต่อไป
        </p>

        {/* Progress Tracker */}
        <div className="mt-4 bg-white rounded-2xl p-3 border border-slate-200/80 shadow-sm flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-slate-700">ความคืบหน้า:</span>
            <span className="font-mono text-blue-600 font-bold">{answeredCount} / 5 ข้อ</span>
          </div>
          <div className="w-32 bg-slate-100 rounded-full h-2 overflow-hidden">
            <div
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${(answeredCount / 5) * 100}%` }}
            />
          </div>
        </div>
      </div>

      {/* Survey Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        
        {/* Rating Scale Legend */}
        <div className="bg-blue-50/80 border border-blue-100 rounded-2xl p-3 text-xs text-blue-900">
          <div className="font-semibold mb-1 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-blue-600" />
            <span>ระดับคะแนนการประเมิน:</span>
          </div>
          <div className="grid grid-cols-5 gap-1 text-center font-medium">
            <div><span className="font-bold text-blue-800">5</span> = มากที่สุด</div>
            <div><span className="font-bold text-blue-800">4</span> = มาก</div>
            <div><span className="font-bold text-blue-800">3</span> = ปานกลาง</div>
            <div><span className="font-bold text-blue-800">2</span> = น้อย</div>
            <div><span className="font-bold text-blue-800">1</span> = น้อยที่สุด</div>
          </div>
        </div>

        {/* 5 Questions */}
        {SURVEY_QUESTIONS.map((q, index) => {
          const selected = scores[q.id];
          return (
            <div
              key={q.id}
              className={`bg-white rounded-2xl p-4 sm:p-5 shadow-sm border transition-all ${
                selected ? 'border-blue-200 shadow-blue-50/50' : 'border-slate-200'
              }`}
            >
              <div className="mb-3">
                <div className="text-sm font-semibold text-slate-900 flex items-start justify-between gap-2">
                  <span>{q.title}</span>
                  <span className="text-rose-500 font-bold text-base leading-none">*</span>
                </div>
                <p className="text-xs text-slate-500 mt-0.5">{q.description}</p>
              </div>

              {/* 5 Thumb-Friendly Touch Buttons */}
              <div className="grid grid-cols-5 gap-1.5 sm:gap-2">
                {RATING_SCALE.map(item => {
                  const isActive = selected === item.score;
                  return (
                    <button
                      type="button"
                      key={item.score}
                      onClick={() => handleSelectScore(q.id, item.score)}
                      className={`py-3 sm:py-3.5 rounded-xl border text-center transition-all flex flex-col items-center justify-center cursor-pointer select-none ${
                        isActive
                          ? 'bg-blue-600 text-white border-blue-600 shadow-md shadow-blue-600/30 scale-[1.02]'
                          : 'bg-white hover:bg-slate-50 text-slate-700 border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      <span className="text-base sm:text-lg font-black font-mono leading-none">
                        {item.score}
                      </span>
                      <span
                        className={`text-[10px] mt-1 transition-colors leading-tight ${
                          isActive ? 'text-blue-100 font-medium' : 'text-slate-400'
                        }`}
                      >
                        {item.short}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}

        {/* Open Feedback Textarea */}
        <div className="bg-white rounded-2xl p-4 sm:p-5 shadow-sm border border-slate-200">
          <label htmlFor="feedbackInput" className="block text-sm font-semibold text-slate-900 mb-1">
            ข้อเสนอแนะเพิ่มเติม / สิ่งที่ประทับใจ
            <span className="text-xs font-normal text-slate-400 ml-1.5">(ไม่บังคับ)</span>
          </label>
          <textarea
            id="feedbackInput"
            value={feedback}
            onChange={e => setFeedback(e.target.value)}
            rows={3}
            placeholder="สิ่งที่ประทับใจ สิ่งที่ต้องการให้มีเพิ่มเติม หรือหัวข้อที่สนใจในการอบรมครั้งหน้า..."
            className="w-full text-xs sm:text-sm rounded-xl border border-slate-200 p-3 text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all resize-none"
          />
          <div className="text-right text-[11px] text-slate-400 mt-1">
            {feedback.length} ตัวอักษร
          </div>
        </div>

        {/* Error Alert */}
        {errorMessage && (
          <div className="bg-rose-50 border border-rose-200 text-rose-700 text-xs sm:text-sm rounded-2xl p-3.5 flex items-center gap-2">
            <AlertCircle className="w-5 h-5 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-blue-600 hover:bg-blue-700 active:scale-[0.99] text-white font-bold py-3.5 sm:py-4 px-6 rounded-2xl shadow-lg shadow-blue-600/25 transition-all text-sm sm:text-base flex items-center justify-center gap-2 cursor-pointer disabled:opacity-75 disabled:cursor-not-allowed"
        >
          {isSubmitting ? (
            <>
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              <span>กำลังบันทึกข้อมูล...</span>
            </>
          ) : (
            <>
              <span>ส่งแบบประเมิน</span>
              <Send className="w-4 h-4" />
            </>
          )}
        </button>

        <p className="text-center text-xs text-slate-400 pb-4">
          ผลการประเมินจะถูกนำไปสรุปผลบนจอแดชบอร์ดทันทีแบบไม่ระบุตัวตน
        </p>

      </form>

    </div>
  );
};
