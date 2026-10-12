import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import EditorPanel from './components/Editor/EditorPanel';
import PreviewPanel from './components/Preview/PreviewPanel';
import Class5GuideModal from './components/Class5GuideModal';
import SavedCvsModal from './components/SavedCvsModal';
import { BANGLADESHI_DEMO } from './data/defaultTemplates';

export default function App() {
  const [cvData, setCvData] = useState(() => {
    try {
      const saved = localStorage.getItem('active_cv_draft');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.warn('LocalStorage error', e);
    }
    return JSON.parse(JSON.stringify(BANGLADESHI_DEMO));
  });

  const [mobileView, setMobileView] = useState('edit'); // 'edit' | 'preview'
  const [isGuideOpen, setIsGuideOpen] = useState(false);
  const [isSavedModalOpen, setIsSavedModalOpen] = useState(false);

  // Auto-save draft to local storage on change
  useEffect(() => {
    try {
      localStorage.setItem('active_cv_draft', JSON.stringify(cvData));
    } catch (e) {
      console.warn('Auto-save failed', e);
    }
  }, [cvData]);

  return (
    <div className="flex flex-col h-screen w-screen overflow-hidden bg-slate-100 font-sans print:h-auto print:w-auto print:overflow-visible print:bg-white">
      {/* Top Navigation */}
      <Navbar
        cvData={cvData}
        setCvData={setCvData}
        onOpenGuide={() => setIsGuideOpen(true)}
        onOpenSaved={() => setIsSavedModalOpen(true)}
        mobileView={mobileView}
        setMobileView={setMobileView}
      />

      {/* Main Split-Screen Workspace */}
      <main className="flex-1 flex overflow-hidden print:overflow-visible print:block print:h-auto">
        {/* Left Side: Editor Panel (Hidden on print) */}
        <section 
          className={`w-full lg:w-[480px] xl:w-[540px] shrink-0 h-full overflow-hidden border-r border-slate-300 no-print print:hidden ${
            mobileView === 'edit' ? 'block' : 'hidden lg:block'
          }`}
        >
          <EditorPanel cvData={cvData} setCvData={setCvData} />
        </section>

        {/* Right Side: Live A4 Preview (Always shown on print) */}
        <section 
          className={`flex-1 h-full overflow-hidden print:block print:w-full print:h-auto print:overflow-visible ${
            mobileView === 'preview' ? 'block' : 'hidden lg:block'
          }`}
        >
          <PreviewPanel cvData={cvData} setCvData={setCvData} />
        </section>
      </main>

      {/* Class 5 Easy Walkthrough Modal */}
      <Class5GuideModal
        isOpen={isGuideOpen}
        onClose={() => setIsGuideOpen(false)}
      />

      {/* Backend Saved CVs Modal */}
      <SavedCvsModal
        isOpen={isSavedModalOpen}
        onClose={() => setIsSavedModalOpen(false)}
        cvData={cvData}
        onSelectCv={(loadedCv) => setCvData(loadedCv)}
      />
    </div>
  );
}
