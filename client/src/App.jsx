import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import EditorPanel from './components/Editor/EditorPanel';
import PreviewPanel from './components/Preview/PreviewPanel';
import Class5GuideModal from './components/Class5GuideModal';
import SavedCvsModal from './components/SavedCvsModal';
import { BANGLADESHI_DEMO, INTERNATIONAL_DEMO } from './data/defaultTemplates';

export default function App() {
  const [cvData, setCvData] = useState(() => {
    try {
      const saved = localStorage.getItem('active_cv_draft');
      if (saved) {
        const parsed = JSON.parse(saved);
        const savedProfile = JSON.parse(localStorage.getItem('cv_user_personal_profile') || 'null');
        if (
          savedProfile && 
          savedProfile.fullName && 
          (parsed.personal?.fullName === 'MD. EMRAN HOSSEN BIPLOB' || parsed.personal?.fullName === 'Alex Morgan')
        ) {
          parsed.personal = {
            ...parsed.personal,
            ...savedProfile
          };
        }
        return parsed;
      }
    } catch (e) {
      console.warn('LocalStorage error', e);
    }
    return JSON.parse(JSON.stringify(BANGLADESHI_DEMO));
  });

  const [mobileView, setMobileView] = useState('edit'); // 'edit' | 'preview'
  const [activeSidebarTab, setActiveSidebarTab] = useState('personal'); // 'personal' | 'sections' | 'style'
  const [activeSectionId, setActiveSectionId] = useState(null);
  const [isGuideOpen, setIsGuideOpen] = useState(false);
  const [isSavedModalOpen, setIsSavedModalOpen] = useState(false);
  const [hasBackup, setHasBackup] = useState(false);

  // Check if backup history exists
  useEffect(() => {
    try {
      const history = JSON.parse(localStorage.getItem('cv_backup_history') || '[]');
      setHasBackup(history.length > 0);
    } catch (e) {
      setHasBackup(false);
    }
  }, [cvData]);

  // Auto-save draft to local storage on change
  useEffect(() => {
    try {
      localStorage.setItem('active_cv_draft', JSON.stringify(cvData));
      // Save permanent copy of personal profile whenever user types real info
      if (
        cvData.personal?.fullName &&
        cvData.personal.fullName !== 'MD. EMRAN HOSSEN BIPLOB' &&
        cvData.personal.fullName !== 'Alex Morgan'
      ) {
        localStorage.setItem('cv_user_personal_profile', JSON.stringify(cvData.personal));
      }
    } catch (e) {
      console.warn('Auto-save hit storage limit, clearing old undo backups', e);
      try {
        localStorage.removeItem('cv_backup_history');
        localStorage.setItem('active_cv_draft', JSON.stringify(cvData));
      } catch (retryErr) {
        console.warn('Auto-save fallback failed', retryErr);
      }
    }
  }, [cvData]);

  // Safe style mode switcher: NEVER deletes previous data or sections
  const switchStyleMode = (targetMode) => {
    if (!targetMode || targetMode === cvData.styleMode) return;
    const currentMode = cvData.styleMode || 'bangladeshi';

    try {
      // Save backup snapshot before switching so user can easily undo (capped to 6 snapshots)
      const history = JSON.parse(localStorage.getItem('cv_backup_history') || '[]');
      history.unshift({
        timestamp: Date.now(),
        mode: currentMode,
        data: JSON.parse(JSON.stringify(cvData)),
        description: `Snapshot before switching from ${currentMode} to ${targetMode}`
      });
      localStorage.setItem('cv_backup_history', JSON.stringify(history.slice(0, 6)));
      setHasBackup(true);
    } catch (e) {
      console.warn('Failed to save draft backup', e);
    }

    // Switch styleMode directly, keeping 100% of all sections, personal data, and custom content
    setCvData(prev => {
      const nextDesign = { ...prev.design };
      if (targetMode === 'international') {
        if (!nextDesign.accentColor || nextDesign.accentColor === '#4b5563') {
          nextDesign.accentColor = '#2563eb';
        }
        if (!nextDesign.fontFamily || nextDesign.fontFamily === 'Calibri') {
          nextDesign.fontFamily = 'Inter';
        }
        nextDesign.headingStyle = nextDesign.headingStyle || 'modern-left-border';
      } else {
        // Bangladeshi mode
        if (!nextDesign.fontFamily || nextDesign.fontFamily === 'Inter') {
          nextDesign.fontFamily = 'Calibri';
        }
        if (!nextDesign.headerAlignment) {
          nextDesign.headerAlignment = 'center';
        }
      }

      return {
        ...prev,
        styleMode: targetMode,
        design: nextDesign
      };
    });
  };

  // Restore previous draft from backup history
  const restorePreviousBackup = () => {
    try {
      const history = JSON.parse(localStorage.getItem('cv_backup_history') || '[]');
      if (history.length > 0) {
        const last = history.shift();
        localStorage.setItem('cv_backup_history', JSON.stringify(history));
        setHasBackup(history.length > 0);
        if (last && last.data) {
          setCvData(last.data);
          return true;
        }
      }
    } catch (e) {
      console.warn('Restore error', e);
    }
    return false;
  };

  // One-click restore for Akash if user data was accidentally wiped by demo loaders
  const restoreAkashData = () => {
    // Check if user had a saved custom personal profile first
    let customProfile = null;
    try {
      customProfile = JSON.parse(localStorage.getItem('cv_user_personal_profile') || 'null');
    } catch (e) {}

    setCvData(prev => ({
      ...prev,
      personal: {
        ...prev.personal,
        fullName: customProfile?.fullName || 'MOLLA KHAIRUJJAMAN AKASH',
        mobile: customProfile?.mobile || '01303948891',
        email: customProfile?.email || 'khairujjaman.999@gmail.com',
        address: customProfile?.address || 'h-50, seroil, shantibag, rajshahi, bangladesh',
        whatsapp: customProfile?.whatsapp || prev.personal?.whatsapp || '',
        linkedin: customProfile?.linkedin || prev.personal?.linkedin || '',
        github: customProfile?.github || prev.personal?.github || '',
        website: customProfile?.website || prev.personal?.website || ''
      }
    }));
  };

  const isDemoName = cvData.personal?.fullName === 'MD. EMRAN HOSSEN BIPLOB' || cvData.personal?.fullName === 'Alex Morgan';

  // Auto-scroll and focus corresponding editor input when clicked from preview
  const focusSidebarInput = (sectionId, fieldKey = null) => {
    // If mobile view is on preview, switch to edit panel so the user sees the input
    if (mobileView === 'preview') {
      setMobileView('edit');
    }

    // Allow time for React state update to expand tab/accordion in DOM
    setTimeout(() => {
      let targetEl = null;

      // 1. If a specific field key was clicked (e.g. mobile, email, fullName)
      if (fieldKey) {
        targetEl = document.querySelector(`[data-field-key="${fieldKey}"]`) ||
                   document.getElementById(`field-${fieldKey}`) ||
                   document.querySelector(`input[name="${fieldKey}"]`);
      }

      // 2. If personal section clicked without specific field key
      if (!targetEl && (sectionId === 'personal' || sectionId === 'personal_info')) {
        targetEl = document.getElementById('field-fullName') || 
                   document.querySelector('[data-field-key="fullName"]');
      }

      // 3. If a CV section clicked, find the section card container
      if (!targetEl && sectionId) {
        const sectionCard = document.getElementById(`editor-section-${sectionId}`) ||
                            document.querySelector(`[data-editor-section-id="${sectionId}"]`);
        if (sectionCard) {
          // Try to find the first editable input/textarea inside the expanded section
          const innerInput = sectionCard.querySelector('input:not([type="checkbox"]):not([type="radio"]), textarea');
          targetEl = innerInput || sectionCard;
        }
      }

      // 4. Scroll smoothly and focus with visual pulse feedback
      if (targetEl) {
        targetEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
        if (typeof targetEl.focus === 'function') {
          targetEl.focus();
        }
        targetEl.classList.remove('ring-pulse-highlight');
        // Trigger reflow to restart CSS animation
        void targetEl.offsetWidth;
        targetEl.classList.add('ring-pulse-highlight');
        setTimeout(() => {
          targetEl.classList.remove('ring-pulse-highlight');
        }, 1800);
      }
    }, 120);
  };

  // Click-to-edit preview event handler
  const handleSectionClick = (sectionId, fieldKey = null) => {
    if (sectionId === 'personal' || sectionId === 'personal_info') {
      setActiveSidebarTab('personal');
      setActiveSectionId(null);
    } else {
      setActiveSidebarTab('sections');
      setActiveSectionId(sectionId);
    }
    focusSidebarInput(sectionId, fieldKey);
  };

  return (
    <div className="flex flex-col h-screen w-screen overflow-hidden bg-slate-100 font-sans print:h-auto print:w-auto print:overflow-visible print:bg-white">
      {/* Top Navigation */}
      <Navbar
        cvData={cvData}
        setCvData={setCvData}
        onSwitchStyle={switchStyleMode}
        onRestoreBackup={restorePreviousBackup}
        hasBackup={hasBackup}
        onOpenGuide={() => setIsGuideOpen(true)}
        onOpenSaved={() => setIsSavedModalOpen(true)}
        mobileView={mobileView}
        setMobileView={setMobileView}
      />

      {/* Quick Recovery Banner if user lost entered details */}
      {isDemoName && (
        <div className="bg-amber-100 border-b border-amber-300 px-4 py-2 flex items-center justify-between gap-3 text-xs text-amber-900 no-print">
          <div className="flex items-center gap-2">
            <span className="text-base">💡</span>
            <span className="font-medium">
              Did your entered details get replaced when switching styles? Click restore to bring your data back!
            </span>
          </div>
          <button
            type="button"
            onClick={restoreAkashData}
            className="px-3 py-1 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded-lg transition shrink-0 cursor-pointer shadow-2xs"
          >
            ↩️ Restore Molla Khairujjaman Akash's Data
          </button>
        </div>
      )}

      {/* Main Split-Screen Workspace */}
      <main className="flex-1 flex overflow-hidden print:overflow-visible print:block print:h-auto">
        {/* Left Side: Editor Panel (Hidden on print) */}
        <section 
          className={`w-full lg:w-[480px] xl:w-[540px] shrink-0 h-full overflow-hidden border-r border-slate-300 no-print print:hidden ${
            mobileView === 'edit' ? 'block' : 'hidden lg:block'
          }`}
        >
          <EditorPanel 
            cvData={cvData} 
            setCvData={setCvData} 
            onSwitchStyle={switchStyleMode}
            onRestoreBackup={restorePreviousBackup}
            hasBackup={hasBackup}
            activeTab={activeSidebarTab}
            setActiveTab={setActiveSidebarTab}
            activeSectionId={activeSectionId}
            setActiveSectionId={setActiveSectionId}
          />
        </section>

        {/* Right Side: Live A4 Preview (Always shown on print) */}
        <section 
          className={`flex-1 h-full overflow-hidden print:block print:w-full print:h-auto print:overflow-visible ${
            mobileView === 'preview' ? 'block' : 'hidden lg:block'
          }`}
        >
          <PreviewPanel 
            cvData={cvData} 
            setCvData={setCvData} 
            onSwitchStyle={switchStyleMode}
            onSectionClick={handleSectionClick}
            activeSectionId={activeSectionId || (activeSidebarTab === 'personal' ? 'personal' : null)}
          />
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
