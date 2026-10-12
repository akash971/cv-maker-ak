import React, { useRef } from 'react';
import { 
  FileText, 
  Printer, 
  HelpCircle, 
  FolderOpen, 
  Upload, 
  Download, 
  Sparkles,
  Smartphone
} from 'lucide-react';

import { preProcessCvData } from '../utils/cvPreProcessor';

export default function Navbar({ 
  cvData, 
  setCvData, 
  onSwitchStyle,
  onRestoreBackup,
  hasBackup,
  onOpenGuide, 
  onOpenSaved,
  mobileView,
  setMobileView
}) {
  const jsonInputRef = useRef(null);
  const isBangladeshi = cvData.styleMode === 'bangladeshi';

  const handlePrint = () => {
    const originalTitle = document.title;
    const cleanData = preProcessCvData(cvData);
    const safeName = (cleanData.personal?.fullName || 'Curriculum_Vitae').trim().replace(/[^a-zA-Z0-9_\-\s]/g, '').replace(/\s+/g, '_');
    document.title = `${safeName}_CV`;

    window.print();

    setTimeout(() => {
      document.title = originalTitle;
    }, 1500);
  };

  const handleExportJson = () => {
    const cleanData = preProcessCvData(cvData);
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(cleanData, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `${(cleanData.personal?.fullName || 'My_CV').replace(/\s+/g, '_')}_data.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const handleImportJson = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target.result);
        if (parsed.personal && parsed.sections) {
          setCvData(parsed);
          alert('CV imported successfully!');
        } else {
          alert('Invalid CV file format.');
        }
      } catch (err) {
        alert('Failed to read JSON file.');
      }
    };
    reader.readAsText(file);
  };

  return (
    <header className="bg-slate-900 text-white border-b border-slate-800 px-4 py-2.5 flex items-center justify-between gap-3 shadow-md no-print select-none">
      {/* Brand & Title */}
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-xl bg-linear-to-tr from-blue-600 to-indigo-500 flex items-center justify-center shadow-xs">
          <FileText className="w-5 h-5 text-white" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-sm sm:text-base font-extrabold tracking-tight">CV Maker</h1>
            <span className="text-[10px] uppercase font-bold px-1.5 py-0.5 rounded bg-blue-500/20 text-blue-300 border border-blue-500/30">
              Dual Style
            </span>
          </div>
          <p className="text-[10px] text-slate-400 hidden sm:block">
            Bangladeshi Official & International ATS-Ready CV Builder
          </p>
        </div>
      </div>

      {/* Style Mode Switcher & Undo Button (Centered) */}
      <div className="flex items-center gap-2">
        <div className="flex items-center bg-slate-800 p-1 rounded-xl border border-slate-700">
          <button
            onClick={() => onSwitchStyle ? onSwitchStyle('bangladeshi') : setCvData(prev => ({ ...prev, styleMode: 'bangladeshi' }))}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
              isBangladeshi 
                ? 'bg-emerald-600 text-white shadow-xs' 
                : 'text-slate-300 hover:text-white hover:bg-slate-700/60'
            }`}
          >
            <span>🇧🇩</span>
            <span className="hidden sm:inline">Bangladeshi Style</span>
            <span className="sm:hidden">BD Style</span>
          </button>
          <button
            onClick={() => onSwitchStyle ? onSwitchStyle('international') : setCvData(prev => ({ ...prev, styleMode: 'international' }))}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
              !isBangladeshi 
                ? 'bg-blue-600 text-white shadow-xs' 
                : 'text-slate-300 hover:text-white hover:bg-slate-700/60'
            }`}
          >
            <span>🌍</span>
            <span className="hidden sm:inline">International Style</span>
            <span className="sm:hidden">Intl Style</span>
          </button>
        </div>

        {hasBackup && (
          <button
            onClick={onRestoreBackup}
            className="hidden md:flex items-center gap-1 bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 px-2.5 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer active:scale-95"
            title="Restore previous state / undo"
          >
            <span>↩️ Undo</span>
          </button>
        )}
      </div>

      {/* Action Buttons */}
      <div className="flex items-center gap-1.5 sm:gap-2">
        {/* Mobile View Toggle */}
        <div className="flex lg:hidden bg-slate-800 p-0.5 rounded-lg border border-slate-700 text-xs">
          <button
            onClick={() => setMobileView('edit')}
            className={`px-2 py-1 rounded font-bold ${mobileView === 'edit' ? 'bg-blue-600 text-white' : 'text-slate-400'}`}
          >
            Edit
          </button>
          <button
            onClick={() => setMobileView('preview')}
            className={`px-2 py-1 rounded font-bold ${mobileView === 'preview' ? 'bg-blue-600 text-white' : 'text-slate-400'}`}
          >
            Preview
          </button>
        </div>

        {/* Class 5 Guide Modal Button */}
        <button
          onClick={onOpenGuide}
          className="flex items-center gap-1 text-amber-300 hover:text-amber-200 bg-amber-500/10 hover:bg-amber-500/20 px-2.5 py-1.5 rounded-lg text-xs font-bold border border-amber-500/30 transition cursor-pointer"
          title="Easy guide for beginners"
        >
          <HelpCircle className="w-3.5 h-3.5" />
          <span className="hidden md:inline">How To Use</span>
        </button>

        {/* Saved CVs */}
        <button
          onClick={onOpenSaved}
          className="flex items-center gap-1 text-slate-300 hover:text-white hover:bg-slate-800 px-2.5 py-1.5 rounded-lg text-xs font-semibold border border-slate-700 transition cursor-pointer"
          title="Manage saved CVs"
        >
          <FolderOpen className="w-3.5 h-3.5 text-blue-400" />
          <span className="hidden sm:inline">Saved CVs</span>
        </button>

        {/* JSON Import/Export */}
        <input
          type="file"
          ref={jsonInputRef}
          onChange={handleImportJson}
          accept=".json"
          className="hidden"
        />
        <button
          onClick={() => jsonInputRef.current?.click()}
          className="hidden xl:flex items-center gap-1 text-slate-300 hover:text-white hover:bg-slate-800 px-2 py-1.5 rounded-lg text-xs font-medium border border-slate-700 transition"
          title="Load from JSON file"
        >
          <Upload className="w-3 h-3" />
          <span>Import</span>
        </button>

        <button
          onClick={handleExportJson}
          className="hidden xl:flex items-center gap-1 text-slate-300 hover:text-white hover:bg-slate-800 px-2 py-1.5 rounded-lg text-xs font-medium border border-slate-700 transition"
          title="Download as JSON file"
        >
          <Download className="w-3 h-3" />
          <span>Export</span>
        </button>

        {/* Print / Save PDF Primary Button */}
        <button
          onClick={handlePrint}
          className="flex items-center gap-1.5 bg-linear-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white px-3.5 py-1.5 rounded-xl text-xs font-extrabold shadow-sm transition cursor-pointer active:scale-95"
        >
          <Printer className="w-4 h-4" />
          <span>🖨️ Print / Save PDF</span>
        </button>
      </div>
    </header>
  );
}
