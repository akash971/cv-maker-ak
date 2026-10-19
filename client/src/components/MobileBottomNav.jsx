import React from 'react';
import { Edit3, Eye, Palette, FolderOpen, Printer } from 'lucide-react';

export default function MobileBottomNav({
  mobileView,
  setMobileView,
  activeSidebarTab,
  setActiveSidebarTab,
  onOpenSaved,
  onPrint
}) {
  const isEditing = mobileView === 'edit';
  const isPreviewing = mobileView === 'preview';
  const isStyleTab = isEditing && activeSidebarTab === 'style';

  const handleEditClick = () => {
    setMobileView('edit');
    if (activeSidebarTab === 'style') {
      setActiveSidebarTab('personal');
    }
  };

  const handleStyleClick = () => {
    setMobileView('edit');
    setActiveSidebarTab('style');
  };

  const handlePreviewClick = () => {
    setMobileView('preview');
  };

  return (
    <nav 
      aria-label="Mobile Navigation"
      className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-slate-900/95 backdrop-blur-md border-t border-slate-800 text-white pb-safe select-none shadow-2xl no-print"
    >
      <div className="grid grid-cols-5 h-14 items-center px-1 max-w-lg mx-auto">
        {/* 1. Edit Form Tab */}
        <button
          type="button"
          onClick={handleEditClick}
          className={`flex flex-col items-center justify-center h-full py-1 gap-1 transition-colors relative cursor-pointer ${
            isEditing && !isStyleTab ? 'text-blue-400 font-bold' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <div className="relative">
            <Edit3 className="w-5 h-5" />
            {isEditing && !isStyleTab && (
              <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-blue-500 rounded-full"></span>
            )}
          </div>
          <span className="text-[10px] tracking-tight">Edit Form</span>
        </button>

        {/* 2. Live Preview Tab */}
        <button
          type="button"
          onClick={handlePreviewClick}
          className={`flex flex-col items-center justify-center h-full py-1 gap-1 transition-colors relative cursor-pointer ${
            isPreviewing ? 'text-blue-400 font-bold' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <div className="relative">
            <Eye className="w-5 h-5" />
            {isPreviewing && (
              <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-blue-500 rounded-full"></span>
            )}
          </div>
          <span className="text-[10px] tracking-tight">Preview</span>
        </button>

        {/* 3. Style & Look Tab */}
        <button
          type="button"
          onClick={handleStyleClick}
          className={`flex flex-col items-center justify-center h-full py-1 gap-1 transition-colors relative cursor-pointer ${
            isStyleTab ? 'text-purple-400 font-bold' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <div className="relative">
            <Palette className="w-5 h-5" />
            {isStyleTab && (
              <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-purple-500 rounded-full"></span>
            )}
          </div>
          <span className="text-[10px] tracking-tight">Style</span>
        </button>

        {/* 4. Saved CVs */}
        <button
          type="button"
          onClick={onOpenSaved}
          className="flex flex-col items-center justify-center h-full py-1 gap-1 text-slate-400 hover:text-slate-200 transition-colors cursor-pointer"
        >
          <FolderOpen className="w-5 h-5 text-amber-400/90" />
          <span className="text-[10px] tracking-tight">Saved</span>
        </button>

        {/* 5. Print / PDF Button */}
        <button
          type="button"
          onClick={onPrint}
          className="flex flex-col items-center justify-center h-full py-1 gap-1 text-emerald-400 hover:text-emerald-300 transition-colors cursor-pointer active:scale-95"
        >
          <Printer className="w-5 h-5" />
          <span className="text-[10px] font-bold tracking-tight">PDF</span>
        </button>
      </div>
    </nav>
  );
}
