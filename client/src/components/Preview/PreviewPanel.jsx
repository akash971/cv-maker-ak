import React, { useState, useEffect, useRef } from 'react';
import { ZoomIn, ZoomOut, RotateCcw, Printer, Download, Maximize2, FileText } from 'lucide-react';
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
  const containerRef = useRef(null);
  const [fitScale, setFitScale] = useState(1);
  const [isAutoFit, setIsAutoFit] = useState(true);
  const [customZoom, setCustomZoom] = useState(100);

  const sanitizedCvData = preProcessCvData(cvData);

  // Auto-calculate scale to fit A4 paper (210mm ≈ 794px) perfectly within container
  useEffect(() => {
    const calculateFit = () => {
      if (!containerRef.current) return;
      const containerWidth = containerRef.current.clientWidth;
      // Leave padding: 16px on mobile, 32px on desktop
      const padding = containerWidth < 640 ? 16 : 32;
      const availableWidth = containerWidth - padding;
      const paperWidthPx = 794; // 210mm in standard CSS pixels

      if (availableWidth < paperWidthPx) {
        const scale = Math.max(0.35, Math.min(1, availableWidth / paperWidthPx));
        setFitScale(scale);
      } else {
        setFitScale(1);
      }
    };

    calculateFit();
    const resizeObserver = new ResizeObserver(() => calculateFit());
    if (containerRef.current) resizeObserver.observe(containerRef.current);
    window.addEventListener('resize', calculateFit);

    return () => {
      resizeObserver.disconnect();
      window.removeEventListener('resize', calculateFit);
    };
  }, []);

  const currentScale = isAutoFit ? fitScale : (customZoom / 100);
  const currentPercent = Math.round(currentScale * 100);

  const handleZoomIn = () => {
    setIsAutoFit(false);
    setCustomZoom(z => Math.min(150, Math.round(z / 10) * 10 + 10));
  };

  const handleZoomOut = () => {
    setIsAutoFit(false);
    setCustomZoom(z => Math.max(40, Math.round(z / 10) * 10 - 10));
  };

  const handleResetFit = () => {
    setIsAutoFit(true);
    setCustomZoom(Math.round(fitScale * 100));
  };

  const handleSetActualSize = () => {
    setIsAutoFit(false);
    setCustomZoom(100);
  };

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
    <div className="flex flex-col h-full bg-slate-200/90 border-l border-slate-300">
      {/* Preview Top Action Bar */}
      <div className="bg-white px-2.5 sm:px-4 py-2 border-b border-slate-200 flex flex-wrap items-center justify-between gap-2 shadow-xs select-none no-print">
        {/* Style Mode Switcher */}
        <div className="flex items-center gap-1 bg-slate-100 p-0.5 sm:p-1 rounded-xl border border-slate-200">
          <button
            onClick={() => onSwitchStyle ? onSwitchStyle('bangladeshi') : setCvData(prev => ({ ...prev, styleMode: 'bangladeshi' }))}
            className={`px-2 sm:px-3 py-1 rounded-lg text-xs font-bold transition flex items-center gap-1 cursor-pointer ${
              isBangladeshi 
                ? 'bg-emerald-600 text-white shadow-xs' 
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
            }`}
          >
            <span>🇧🇩</span>
            <span className="hidden xs:inline">Bangladeshi</span>
            <span className="xs:hidden">BD</span>
          </button>
          <button
            onClick={() => onSwitchStyle ? onSwitchStyle('international') : setCvData(prev => ({ ...prev, styleMode: 'international' }))}
            className={`px-2 sm:px-3 py-1 rounded-lg text-xs font-bold transition flex items-center gap-1 cursor-pointer ${
              !isBangladeshi 
                ? 'bg-blue-600 text-white shadow-xs' 
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
            }`}
          >
            <span>🌍</span>
            <span className="hidden xs:inline">International</span>
            <span className="xs:hidden">Intl</span>
          </button>
        </div>

        {/* Zoom & Print Controls */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* Zoom controls (Touch-friendly & visible on all screen sizes) */}
          <div className="flex items-center bg-slate-100 rounded-lg p-0.5 border border-slate-200 text-xs text-slate-700">
            <button
              onClick={handleZoomOut}
              className="p-1 hover:bg-white rounded transition text-slate-600 cursor-pointer active:scale-95"
              title="Zoom Out"
            >
              <ZoomOut className="w-3.5 h-3.5" />
            </button>

            {/* Quick Fit / 100% Toggle Button */}
            <button
              onClick={isAutoFit ? handleSetActualSize : handleResetFit}
              className={`px-1.5 py-0.5 rounded font-bold text-[11px] min-w-10 text-center transition cursor-pointer ${
                isAutoFit ? 'bg-blue-100 text-blue-700' : 'hover:bg-white text-slate-700'
              }`}
              title={isAutoFit ? 'Currently fit to screen (Click for 100%)' : 'Click to fit screen'}
            >
              {isAutoFit ? 'Fit' : `${currentPercent}%`}
            </button>

            <button
              onClick={handleZoomIn}
              className="p-1 hover:bg-white rounded transition text-slate-600 cursor-pointer active:scale-95"
              title="Zoom In"
            >
              <ZoomIn className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Quick Print Button */}
          <button
            onClick={handlePrint}
            className="flex items-center gap-1 bg-linear-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-2.5 sm:px-3 py-1.5 rounded-lg text-xs font-bold shadow-xs transition cursor-pointer active:scale-95"
            title="Print or Save as PDF"
          >
            <Printer className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Print PDF</span>
            <span className="sm:hidden">PDF</span>
          </button>

          {/* Download JSON backup (desktop) */}
          <button
            onClick={handleDownloadJson}
            className="hidden md:flex items-center gap-1 text-slate-600 hover:text-slate-900 hover:bg-slate-100 px-2 py-1.5 rounded-lg text-xs font-semibold border border-slate-200 transition cursor-pointer"
            title="Download CV data file"
          >
            <Download className="w-3.5 h-3.5" />
            <span>JSON</span>
          </button>
        </div>
      </div>

      {/* A4 Sheet Scroll Container */}
      <div 
        ref={containerRef}
        className="flex-1 overflow-auto p-2 sm:p-6 flex justify-center items-start print:p-0 print:m-0 print:overflow-visible print:block pb-24 lg:pb-8"
      >
        <div 
          className="transition-transform duration-150 origin-top flex flex-col items-center print:transform-none print:w-full print:block"
          style={{ 
            transform: `scale(${currentScale})`,
            // Layout compensation: remove excess vertical whitespace caused by CSS scale
            marginBottom: currentScale < 1 ? `-${Math.round(1123 * (1 - currentScale))}px` : '0px'
          }}
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
              <span className="hidden xs:inline">Click any section to edit</span>
              <span className="xs:hidden">Tap to edit</span>
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
          <div className="text-[11px] text-slate-400 mt-4 mb-4 text-center no-print">
            📄 Standard A4 Paper (210mm × 297mm) • Crisp vector output when printed to PDF
          </div>
        </div>
      </div>
    </div>
  );
}
