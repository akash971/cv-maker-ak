import React, { useState } from 'react';
import { User, Layers, Palette, Sparkles, RotateCcw } from 'lucide-react';
import PersonalInfoEditor from './PersonalInfoEditor';
import SectionsManager from './SectionsManager';
import StyleCustomizer from './StyleCustomizer';
import { BANGLADESHI_DEMO, INTERNATIONAL_DEMO } from '../../data/defaultTemplates';

export default function EditorPanel({ 
  cvData, 
  setCvData, 
  onSwitchStyle, 
  onRestoreBackup, 
  hasBackup,
  activeTab: externalActiveTab,
  setActiveTab: externalSetActiveTab,
  activeSectionId,
  setActiveSectionId
}) {
  const [internalActiveTab, setInternalActiveTab] = useState('personal'); // 'personal', 'sections', 'style'
  const activeTab = externalActiveTab !== undefined ? externalActiveTab : internalActiveTab;
  const setActiveTab = externalSetActiveTab || setInternalActiveTab;

  const tabs = [
    { id: 'personal', label: '1. Basic Info', shortLabel: '1. Info', icon: User, color: 'text-blue-600' },
    { id: 'sections', label: '2. CV Sections', shortLabel: '2. Sections', icon: Layers, color: 'text-emerald-600' },
    { id: 'style', label: '3. Look & Style', shortLabel: '3. Style', icon: Palette, color: 'text-purple-600' },
  ];

  const handleLoadSampleData = () => {
    const isCurrentBD = cvData.styleMode === 'bangladeshi';
    const sample = isCurrentBD ? BANGLADESHI_DEMO : INTERNATIONAL_DEMO;
    const styleName = isCurrentBD ? 'Bangladeshi' : 'International';

    const confirmed = window.confirm(
      `Load sample ${styleName} CV sections?\n\nDon't worry: your personal name and contact info will be kept safe, and a backup snapshot will be created so you can undo anytime!`
    );

    if (confirmed) {
      // 1. Save backup to cv_backup_history
      try {
        const history = JSON.parse(localStorage.getItem('cv_backup_history') || '[]');
        history.unshift({
          timestamp: Date.now(),
          mode: cvData.styleMode,
          data: JSON.parse(JSON.stringify(cvData)),
          description: `Backup before loading ${styleName} sample`
        });
        localStorage.setItem('cv_backup_history', JSON.stringify(history.slice(0, 6)));
      } catch (e) {
        console.warn('Backup error', e);
      }

      // 2. Load sample but PRESERVE user personal contact details if they've entered custom ones!
      const userHasCustomName = cvData.personal?.fullName &&
        cvData.personal.fullName !== 'MD. EMRAN HOSSEN BIPLOB' &&
        cvData.personal.fullName !== 'Alex Morgan';

      const preservedPersonal = userHasCustomName ? { ...cvData.personal } : { ...sample.personal };

      setCvData({
        ...sample,
        styleMode: cvData.styleMode || sample.styleMode,
        personal: preservedPersonal
      });
    }
  };

  return (
    <div className="flex flex-col h-full bg-white select-none">
      {/* Editor Header Navigation Tabs */}
      <div className="border-b border-slate-200 bg-slate-50/70 p-2 sm:px-4">
        {/* Tabs Bar */}
        <div className="flex items-center gap-1 bg-slate-200/60 p-1 rounded-xl">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 py-1.5 sm:py-2 px-1.5 sm:px-2.5 rounded-lg text-xs font-bold transition flex items-center justify-center gap-1 sm:gap-1.5 cursor-pointer ${
                  isActive
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? tab.color : 'text-slate-400'}`} />
                <span className="hidden xs:inline">{tab.label}</span>
                <span className="xs:hidden">{tab.shortLabel}</span>
              </button>
            );
          })}
        </div>

        {/* Style Switcher & Safe Helper Bar */}
        <div className="flex flex-wrap items-center justify-between gap-1.5 mt-2 pt-1.5 border-t border-slate-200/60">
          <div className="flex items-center gap-1 bg-slate-200/80 p-0.5 rounded-lg text-xs">
            <button
              type="button"
              onClick={() => onSwitchStyle ? onSwitchStyle('bangladeshi') : setCvData(prev => ({ ...prev, styleMode: 'bangladeshi' }))}
              className={`px-2 sm:px-2.5 py-1 rounded-md text-xs font-bold transition flex items-center gap-1 cursor-pointer ${
                cvData.styleMode === 'bangladeshi'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
              }`}
              title="Switch to Bangladeshi Style (Preserves all your data)"
            >
              <span>🇧🇩</span>
              <span className="hidden xs:inline">BD Style</span>
              <span className="xs:hidden">BD</span>
            </button>
            <button
              type="button"
              onClick={() => onSwitchStyle ? onSwitchStyle('international') : setCvData(prev => ({ ...prev, styleMode: 'international' }))}
              className={`px-2 sm:px-2.5 py-1 rounded-md text-xs font-bold transition flex items-center gap-1 cursor-pointer ${
                cvData.styleMode !== 'bangladeshi'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
              }`}
              title="Switch to International Style (Preserves all your data)"
            >
              <span>🌍</span>
              <span className="hidden xs:inline">Intl Style</span>
              <span className="xs:hidden">Intl</span>
            </button>
          </div>

          <div className="flex items-center gap-1 sm:gap-1.5">
            {hasBackup && (
              <button
                type="button"
                onClick={onRestoreBackup}
                className="px-2 py-1 bg-amber-100 hover:bg-amber-200 text-amber-900 border border-amber-300 rounded-md text-xs font-bold transition cursor-pointer flex items-center gap-1 shadow-2xs"
                title="Undo previous change or recover draft"
              >
                <RotateCcw className="w-3 h-3 text-amber-700" />
                <span>Undo</span>
              </button>
            )}

            <button
              type="button"
              onClick={handleLoadSampleData}
              className="px-2 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-300 rounded-md text-[11px] font-semibold transition cursor-pointer flex items-center gap-1"
              title="Fill sample text without deleting your personal details"
            >
              <Sparkles className="w-3 h-3 text-amber-500" />
              <span>Sample</span>
            </button>
          </div>
        </div>
      </div>

      {/* Editor Content Body */}
      <div className="flex-1 overflow-y-auto p-3 sm:p-5">
        {activeTab === 'personal' && (
          <PersonalInfoEditor cvData={cvData} setCvData={setCvData} />
        )}
        {activeTab === 'sections' && (
          <SectionsManager 
            cvData={cvData} 
            setCvData={setCvData} 
            openSectionId={activeSectionId}
            setOpenSectionId={setActiveSectionId}
          />
        )}
        {activeTab === 'style' && (
          <StyleCustomizer cvData={cvData} setCvData={setCvData} />
        )}
      </div>
    </div>
  );
}
