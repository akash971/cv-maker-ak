import React, { useRef, useState, useEffect } from 'react';
import { 
  FileText, 
  Printer, 
  HelpCircle, 
  FolderOpen, 
  Upload, 
  Download, 
  RotateCcw,
  MoreVertical,
  X
} from 'lucide-react';

import { preProcessCvData } from '../utils/cvPreProcessor';

export default function Navbar({ 
  cvData, 
  setCvData, 
  onSwitchStyle,
  onRestoreBackup,
  hasBackup,
  onOpenGuide, 
  onOpenSaved
}) {
  const jsonInputRef = useRef(null);
  const menuRef = useRef(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const isBangladeshi = cvData.styleMode === 'bangladeshi';

  // Close mobile dropdown menu on click outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMobileMenuOpen(false);
      }
    };
    if (mobileMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [mobileMenuOpen]);

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
    downloadAnchor.setAttribute("download", `${(cleanData.personal?.fullName || 'My_CV').replace(/\s+/g, '_')}_CV.json`);
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
      } catch {
        alert('Failed to read JSON file.');
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  return (
    <header className="bg-slate-900 text-white border-b border-slate-800 px-3 sm:px-4 py-2 sm:py-2.5 flex items-center justify-between gap-2 shadow-md no-print select-none">
      {/* Brand & Title */}
      <div className="flex items-center gap-2 sm:gap-3 shrink-0">
        <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-linear-to-tr from-blue-600 to-indigo-500 flex items-center justify-center shadow-xs">
          <FileText className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
        </div>
        <div>
          <div className="flex items-center gap-1.5">
            <h1 className="text-sm sm:text-base font-extrabold tracking-tight">CV Maker</h1>
            <span className="text-[9px] sm:text-[10px] uppercase font-bold px-1.5 py-0.2 rounded bg-blue-500/20 text-blue-300 border border-blue-500/30">
              Pro
            </span>
          </div>
          <p className="text-[10px] text-slate-400 hidden lg:block">
            Bangladeshi Official & International ATS-Ready CV Builder
          </p>
        </div>
      </div>

      {/* Style Mode Switcher & Undo Button */}
      <div className="flex items-center gap-1 sm:gap-2">
        <div className="flex items-center bg-slate-800 p-0.5 sm:p-1 rounded-xl border border-slate-700">
          <button
            onClick={() => onSwitchStyle ? onSwitchStyle('bangladeshi') : setCvData(prev => ({ ...prev, styleMode: 'bangladeshi' }))}
            className={`px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1 cursor-pointer ${
              isBangladeshi 
                ? 'bg-emerald-600 text-white shadow-xs' 
                : 'text-slate-300 hover:text-white hover:bg-slate-700/60'
            }`}
          >
            <span>🇧🇩</span>
            <span className="hidden sm:inline">Bangladeshi Style</span>
            <span className="sm:hidden">BD</span>
          </button>
          <button
            onClick={() => onSwitchStyle ? onSwitchStyle('international') : setCvData(prev => ({ ...prev, styleMode: 'international' }))}
            className={`px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1 cursor-pointer ${
              !isBangladeshi 
                ? 'bg-blue-600 text-white shadow-xs' 
                : 'text-slate-300 hover:text-white hover:bg-slate-700/60'
            }`}
          >
            <span>🌍</span>
            <span className="hidden sm:inline">International Style</span>
            <span className="sm:hidden">Intl</span>
          </button>
        </div>

        {hasBackup && (
          <button
            onClick={onRestoreBackup}
            className="hidden sm:flex items-center gap-1 bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 px-2 py-1 rounded-lg text-xs font-bold transition cursor-pointer active:scale-95"
            title="Restore previous state / undo"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Undo</span>
          </button>
        )}
      </div>

      {/* Action Buttons */}
      <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
        {/* Hidden File Input for JSON import */}
        <input
          type="file"
          ref={jsonInputRef}
          onChange={handleImportJson}
          accept=".json"
          className="hidden"
        />

        {/* Desktop Buttons */}
        <button
          onClick={onOpenGuide}
          className="hidden lg:flex items-center gap-1 text-amber-300 hover:text-amber-200 bg-amber-500/10 hover:bg-amber-500/20 px-2.5 py-1.5 rounded-lg text-xs font-bold border border-amber-500/30 transition cursor-pointer"
          title="Easy guide for beginners"
        >
          <HelpCircle className="w-3.5 h-3.5" />
          <span>How To Use</span>
        </button>

        <button
          onClick={onOpenSaved}
          className="hidden lg:flex items-center gap-1 text-slate-300 hover:text-white hover:bg-slate-800 px-2.5 py-1.5 rounded-lg text-xs font-semibold border border-slate-700 transition cursor-pointer"
          title="Manage saved CVs"
        >
          <FolderOpen className="w-3.5 h-3.5 text-blue-400" />
          <span>Saved CVs</span>
        </button>

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

        {/* Primary Print / Save PDF Button */}
        <button
          onClick={handlePrint}
          className="flex items-center gap-1.5 bg-linear-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white px-2.5 sm:px-3.5 py-1.5 rounded-xl text-xs font-extrabold shadow-sm transition cursor-pointer active:scale-95"
        >
          <Printer className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          <span className="hidden sm:inline">🖨️ Print / Save PDF</span>
          <span className="sm:hidden">PDF</span>
        </button>

        {/* Mobile More Options Dropdown Toggle */}
        <div className="relative lg:hidden" ref={menuRef}>
          <button
            type="button"
            onClick={() => setMobileMenuOpen(prev => !prev)}
            className="p-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800 border border-slate-700 transition cursor-pointer"
            title="More Options"
          >
            {mobileMenuOpen ? <X className="w-4 h-4" /> : <MoreVertical className="w-4 h-4" />}
          </button>

          {mobileMenuOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-slate-900 border border-slate-700 rounded-xl shadow-2xl py-1 z-50 text-xs animate-in fade-in zoom-in-95 duration-100">
              <button
                type="button"
                onClick={() => { onOpenGuide(); setMobileMenuOpen(false); }}
                className="w-full text-left px-3 py-2 flex items-center gap-2 text-slate-200 hover:bg-slate-800 cursor-pointer"
              >
                <HelpCircle className="w-4 h-4 text-amber-400" />
                <span>Beginner Guide</span>
              </button>
              <button
                type="button"
                onClick={() => { onOpenSaved(); setMobileMenuOpen(false); }}
                className="w-full text-left px-3 py-2 flex items-center gap-2 text-slate-200 hover:bg-slate-800 cursor-pointer"
              >
                <FolderOpen className="w-4 h-4 text-blue-400" />
                <span>Saved Versions</span>
              </button>
              <button
                type="button"
                onClick={() => { jsonInputRef.current?.click(); setMobileMenuOpen(false); }}
                className="w-full text-left px-3 py-2 flex items-center gap-2 text-slate-200 hover:bg-slate-800 cursor-pointer"
              >
                <Upload className="w-4 h-4 text-emerald-400" />
                <span>Import JSON</span>
              </button>
              <button
                type="button"
                onClick={() => { handleExportJson(); setMobileMenuOpen(false); }}
                className="w-full text-left px-3 py-2 flex items-center gap-2 text-slate-200 hover:bg-slate-800 cursor-pointer"
              >
                <Download className="w-4 h-4 text-indigo-400" />
                <span>Export JSON</span>
              </button>
              {hasBackup && (
                <button
                  type="button"
                  onClick={() => { onRestoreBackup(); setMobileMenuOpen(false); }}
                  className="w-full text-left px-3 py-2 flex items-center gap-2 text-amber-300 hover:bg-slate-800 border-t border-slate-800 cursor-pointer"
                >
                  <RotateCcw className="w-4 h-4 text-amber-400" />
                  <span>Undo Last Action</span>
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
