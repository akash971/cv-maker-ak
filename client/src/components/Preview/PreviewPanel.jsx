import React, { useState } from 'react';
import { ZoomIn, ZoomOut, RotateCcw, Printer, Download } from 'lucide-react';
import BangladeshiTemplate from './BangladeshiTemplate';
import InternationalTemplate from './InternationalTemplate';
import { preProcessCvData } from '../../utils/cvPreProcessor';

export default function PreviewPanel({ 
  cvData, 
  setCvData, 
  onSwitchStyle,
  onSectionClick,
  activeSectionId
}) {
  const [zoom, setZoom] = useState(100);

  const sanitizedCvData = preProcessCvData(cvData);

  const handlePrint = () => {
    const originalTitle = document.title;
    const safeName = (sanitizedCvData.personal?.fullName || 'Curriculum_Vitae').trim().replace(/[^a-zA-Z0-9_\-\s]/g, '').replace(/\s+/g, '_');
    document.title = `${safeName}_CV`;

    window.print();

    setTimeout(() => {
      document.title = originalTitle;
    }, 1500);
  };

  const handleDownloadJson = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(sanitizedCvData, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `${(sanitizedCvData.personal?.fullName || 'My_CV').replace(/\s+/g, '_')}_CV.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const handlePreviewContainerClick = (e) => {
    const targetSection = e.target.closest('[data-section-id]');
    if (targetSection && onSectionClick) {
      const sectionId = targetSection.getAttribute('data-section-id');
      const targetField = e.target.closest('[data-field-key]');
      const fieldKey = targetField ? targetField.getAttribute('data-field-key') : null;
      onSectionClick(sectionId, fieldKey);
    }
  };

  const isBangladeshi = cvData.styleMode === 'bangladeshi';

  return (
    <div className="flex flex-col h-full bg-slate-200/80 border-l border-slate-300">
      {/* Preview Top Action Bar */}
      <div className="bg-white px-4 py-2.5 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3 shadow-xs select-none no-print">
        {/* Style Mode Switcher */}
        <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl border border-slate-200">
          <button
            onClick={() => onSwitchStyle ? onSwitchStyle('bangladeshi') : setCvData(prev => ({ ...prev, styleMode: 'bangladeshi' }))}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
              isBangladeshi 
                ? 'bg-emerald-600 text-white shadow-xs' 
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
            }`}
          >
            <span>🇧🇩</span>
            <span>Bangladeshi Style</span>
          </button>
          <button
            onClick={() => onSwitchStyle ? onSwitchStyle('international') : setCvData(prev => ({ ...prev, styleMode: 'international' }))}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
              !isBangladeshi 
                ? 'bg-blue-600 text-white shadow-xs' 
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
            }`}
          >
            <span>🌍</span>
            <span>International Style</span>
          </button>
        </div>

        {/* Zoom & Print Controls */}
        <div className="flex items-center gap-2">
          {/* Zoom controls */}
          <div className="hidden sm:flex items-center bg-slate-100 rounded-lg p-0.5 border border-slate-200 text-xs text-slate-700">
            <button
              onClick={() => setZoom(z => Math.max(50, z - 10))}
              className="p-1 hover:bg-white rounded transition text-slate-600 cursor-pointer"
              title="Zoom Out"
            >
              <ZoomOut className="w-3.5 h-3.5" />
            </button>
            <span className="px-2 font-semibold text-[11px] w-12 text-center">{zoom}%</span>
            <button
              onClick={() => setZoom(z => Math.min(150, z + 10))}
              className="p-1 hover:bg-white rounded transition text-slate-600 cursor-pointer"
              title="Zoom In"
            >
              <ZoomIn className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setZoom(100)}
              className="p-1 hover:bg-white rounded transition text-slate-400 hover:text-slate-700 cursor-pointer"
              title="Reset Zoom"
            >
              <RotateCcw className="w-3 h-3" />
            </button>
          </div>

          {/* Quick Print Button */}
          <button
            onClick={handlePrint}
            className="flex items-center gap-1.5 bg-indigo-600 hover:bg-indigo-700 text-white px-3.5 py-1.5 rounded-lg text-xs font-bold shadow-xs transition cursor-pointer active:scale-95"
            title="Print or Save as PDF"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>🖨️ Print / Save PDF</span>
          </button>

          {/* Download JSON backup */}
          <button
            onClick={handleDownloadJson}
            className="hidden md:flex items-center gap-1 text-slate-600 hover:text-slate-900 hover:bg-slate-100 px-2.5 py-1.5 rounded-lg text-xs font-semibold border border-slate-200 transition cursor-pointer"
            title="Download CV data file"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Save File</span>
          </button>
        </div>
      </div>

      {/* A4 Sheet Container */}
      <div className="flex-1 overflow-auto p-4 sm:p-8 flex justify-center items-start print:p-0 print:m-0 print:overflow-visible print:block">
        <div 
          className="transition-transform duration-150 origin-top flex flex-col items-center print:transform-none print:w-full print:block"
          style={{ transform: `scale(${zoom / 100})` }}
        >
          {/* Simulated A4 Paper with click-to-edit listener */}
          <div 
            id="printable-cv-sheet"
            onClick={handlePreviewContainerClick}
            className="cv-sheet-preview relative bg-white text-slate-900 a4-page-shadow rounded-sm transition-all duration-200 min-h-[297mm] w-[210mm] max-w-full print:shadow-none print:w-full print:m-0 print:border-none"
            style={{
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 20px 25px -5px rgba(0, 0, 0, 0.15), 0 0 0 1px rgba(0, 0, 0, 0.05)'
            }}
          >
            {/* Quick Click-to-Edit guide indicator */}
            <div className="absolute top-2 right-2 flex items-center gap-1.5 text-[10px] bg-blue-50/90 text-blue-700 border border-blue-200/80 px-2.5 py-0.5 rounded-full font-semibold shadow-2xs no-print select-none opacity-80 hover:opacity-100 transition-opacity">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse"></span>
              <span>Click any section to edit</span>
            </div>

            {isBangladeshi ? (
              <BangladeshiTemplate 
                cvData={sanitizedCvData} 
                onSectionClick={onSectionClick}
                activeSectionId={activeSectionId}
              />
            ) : (
              <InternationalTemplate 
                cvData={sanitizedCvData} 
                onSectionClick={onSectionClick}
                activeSectionId={activeSectionId}
              />
            )}
          </div>

          {/* Subtle footer note outside paper */}
          <div className="text-[11px] text-slate-400 mt-4 mb-8 text-center no-print">
            📄 Standard A4 Paper Preview (210mm × 297mm) • Vector crisp output when printed to PDF
          </div>
        </div>
      </div>
    </div>
  );
}
