import React, { useState } from 'react';
import { User, Layers, Palette, Sparkles, RefreshCw } from 'lucide-react';
import PersonalInfoEditor from './PersonalInfoEditor';
import SectionsManager from './SectionsManager';
import StyleCustomizer from './StyleCustomizer';
import { BANGLADESHI_DEMO, INTERNATIONAL_DEMO } from '../../data/defaultTemplates';

export default function EditorPanel({ cvData, setCvData }) {
  const [activeTab, setActiveTab] = useState('sections'); // 'personal', 'sections', 'style'

  const tabs = [
    { id: 'personal', label: '1. Basic Info', icon: User, color: 'text-blue-600' },
    { id: 'sections', label: '2. CV Sections', icon: Layers, color: 'text-emerald-600' },
    { id: 'style', label: '3. Look & Style', icon: Palette, color: 'text-purple-600' },
  ];

  const handleLoadBangladeshiDemo = () => {
    if (window.confirm('Load Bangladeshi Sample CV? (Matches the uploaded picture)')) {
      setCvData(JSON.parse(JSON.stringify(BANGLADESHI_DEMO)));
    }
  };

  const handleLoadInternationalDemo = () => {
    if (window.confirm('Load International Sample Resume?')) {
      setCvData(JSON.parse(JSON.stringify(INTERNATIONAL_DEMO)));
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
                className={`flex-1 py-2 px-2.5 rounded-lg text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer ${
                  isActive
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? tab.color : 'text-slate-400'}`} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Quick Sample Demo Fillers */}
        <div className="flex items-center justify-between gap-2 mt-2 pt-1 text-[11px] text-slate-500">
          <span className="flex items-center gap-1 font-semibold text-slate-600">
            <Sparkles className="w-3 h-3 text-amber-500" />
            <span>Class 5 Helper:</span>
          </span>
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={handleLoadBangladeshiDemo}
              className="px-2 py-0.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 rounded-md font-semibold transition"
              title="Loads exact data from the uploaded CV image"
            >
              🇧🇩 Load BD Demo
            </button>
            <button
              type="button"
              onClick={handleLoadInternationalDemo}
              className="px-2 py-0.5 bg-blue-50 hover:bg-blue-100 text-blue-800 border border-blue-200 rounded-md font-semibold transition"
              title="Loads international software resume sample"
            >
              🌍 Load Intl Demo
            </button>
          </div>
        </div>
      </div>

      {/* Editor Content Body */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-5">
        {activeTab === 'personal' && (
          <PersonalInfoEditor cvData={cvData} setCvData={setCvData} />
        )}
        {activeTab === 'sections' && (
          <SectionsManager cvData={cvData} setCvData={setCvData} />
        )}
        {activeTab === 'style' && (
          <StyleCustomizer cvData={cvData} setCvData={setCvData} />
        )}
      </div>
    </div>
  );
}
