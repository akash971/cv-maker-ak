import React from 'react';
import { X, Sparkles } from 'lucide-react';

export default function Class5GuideModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full max-h-[88dvh] flex flex-col overflow-hidden border border-slate-200 animate-in fade-in zoom-in-95 duration-150">
        {/* Modal Header */}
        <div className="bg-linear-to-r from-blue-600 to-indigo-600 text-white p-4 sm:p-5 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5 sm:gap-3">
            <span className="text-2xl sm:text-3xl">🎉</span>
            <div>
              <h3 className="text-base sm:text-lg font-black tracking-wide">How to Make Your CV</h3>
              <p className="text-[11px] sm:text-xs text-blue-100">Super easy guide - even a 5th grader can do it!</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-white/80 hover:text-white p-1.5 rounded-lg hover:bg-white/10 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Steps (Scrollable on small mobile heights) */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-3 sm:space-y-4">
          {/* Step 1 */}
          <div className="flex items-start gap-3 p-3 rounded-xl bg-blue-50/60 border border-blue-100">
            <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-blue-600 text-white font-black text-xs sm:text-sm flex items-center justify-center shrink-0">
              1
            </div>
            <div>
              <h4 className="text-xs font-bold text-slate-800">Fill In Your Boxes on the Left</h4>
              <p className="text-[11px] text-slate-600 mt-0.5 leading-relaxed">
                Type your name, phone number, school/college, and skills. Every time you type a letter, the paper on the right updates instantly like magic!
              </p>
            </div>
          </div>

          {/* Step 2 */}
          <div className="flex items-start gap-3 p-3 rounded-xl bg-emerald-50/60 border border-emerald-100">
            <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-emerald-600 text-white font-black text-xs sm:text-sm flex items-center justify-center shrink-0">
              2
            </div>
            <div>
              <h4 className="text-xs font-bold text-slate-800">Pick Your Style: Bangladeshi or International!</h4>
              <p className="text-[11px] text-slate-600 mt-0.5 leading-relaxed">
                Click <strong>🇧🇩 Bangladeshi Style</strong> to get the authentic shaded-header CV format, or click <strong>🌍 International Style</strong> for a modern tech/corporate resume!
              </p>
            </div>
          </div>

          {/* Step 3 */}
          <div className="flex items-start gap-3 p-3 rounded-xl bg-purple-50/60 border border-purple-100">
            <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-purple-600 text-white font-black text-xs sm:text-sm flex items-center justify-center shrink-0">
              3
            </div>
            <div>
              <h4 className="text-xs font-bold text-slate-800">Customize Everything Without Restriction</h4>
              <p className="text-[11px] text-slate-600 mt-0.5 leading-relaxed">
                Want to add more hobbies? Click <strong>➕ Add Any New Section</strong>! Want to change fonts or colors? Go to the <strong>Look & Style</strong> tab!
              </p>
            </div>
          </div>

          {/* Step 4 */}
          <div className="flex items-start gap-3 p-3 rounded-xl bg-amber-50/60 border border-amber-100">
            <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-amber-600 text-white font-black text-xs sm:text-sm flex items-center justify-center shrink-0">
              4
            </div>
            <div>
              <h4 className="text-xs font-bold text-slate-800">Print or Save as PDF!</h4>
              <p className="text-[11px] text-slate-600 mt-0.5 leading-relaxed">
                Click the blue <strong>🖨️ Print / Save PDF</strong> button on the top right. In the print dialog, choose &quot;Save as PDF&quot; to download your document!
              </p>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-3 sm:p-4 bg-slate-50 border-t border-slate-200 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5 shrink-0">
          <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
            <Sparkles className="w-3.5 h-3.5 text-amber-500 shrink-0" />
            <span className="text-[11px] sm:text-xs">Switch between Edit and Preview anytime!</span>
          </div>
          <button
            onClick={onClose}
            className="w-full sm:w-auto px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl transition cursor-pointer text-center shadow-xs"
          >
            Got it, Let&apos;s Start! 🚀
          </button>
        </div>
      </div>
    </div>
  );
}
