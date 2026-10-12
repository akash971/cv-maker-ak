import React from 'react';
import { Palette, Type, Sliders, Check } from 'lucide-react';

export default function StyleCustomizer({ cvData, setCvData }) {
  const design = cvData.design || {};

  const updateDesign = (field, val) => {
    setCvData(prev => ({
      ...prev,
      design: {
        ...prev.design,
        [field]: val
      }
    }));
  };

  const fonts = [
    { name: 'Calibri (Standard Corporate & BD)', value: 'Calibri', fontClass: 'font-calibri' },
    { name: 'Inter (Clean Modern Sans)', value: 'Inter', fontClass: 'font-inter' },
    { name: 'Arial (Universal Clean Sans)', value: 'Arial', fontClass: 'font-arial' },
    { name: 'Roboto (Crisp Google Sans)', value: 'Roboto', fontClass: 'font-roboto' },
    { name: 'Times New Roman (Legacy Serif)', value: 'Times New Roman', fontClass: 'font-serif' },
    { name: 'Georgia (Classic Editorial)', value: 'Georgia', fontClass: 'font-serif' },
    { name: 'Garamond (Executive Serif)', value: 'Garamond', fontClass: 'font-serif' },
  ];

  const headingStyles = [
    { 
      id: 'shaded-bar', 
      name: 'Shaded Grey Bar (Exact BD Photo)', 
      desc: 'Dark shaded background block as seen in Bangladeshi official CVs',
      previewClass: 'bg-gray-600 text-white px-2 py-0.5 text-[10px] font-bold'
    },
    { 
      id: 'modern-left-border', 
      name: 'Modern Left Bar', 
      desc: 'Thick colored vertical bar on the left of each section',
      previewClass: 'border-l-4 border-blue-600 pl-1.5 text-slate-800 text-[10px] font-bold'
    },
    { 
      id: 'underline', 
      name: 'Underline Accent', 
      desc: 'Clean horizontal dividing border underneath',
      previewClass: 'border-b-2 border-slate-800 pb-0.5 text-slate-800 text-[10px] font-bold'
    },
    { 
      id: 'pill', 
      name: 'Rounded Pill Tag', 
      desc: 'Sleek rounded banner with colored fill',
      previewClass: 'bg-blue-600 text-white px-2 py-0.5 rounded-full text-[10px] font-bold'
    },
    { 
      id: 'minimal', 
      name: 'Minimalist Clean', 
      desc: 'No bars or background boxes, clean modern typography',
      previewClass: 'text-slate-800 text-[10px] font-bold'
    }
  ];

  const presetColors = [
    { label: 'BD Charcoal', color: '#4b5563' },
    { label: 'Deep Black', color: '#111827' },
    { label: 'Navy Blue', color: '#1e40af' },
    { label: 'Ocean Blue', color: '#2563eb' },
    { label: 'BD Green', color: '#047857' },
    { label: 'Emerald', color: '#059669' },
    { label: 'Crimson', color: '#dc2626' },
    { label: 'Royal Purple', color: '#7c3aed' },
  ];

  return (
    <div className="space-y-5">
      {/* Friendly helper banner */}
      <div className="bg-purple-50 border border-purple-200 rounded-xl p-3 flex items-start gap-2.5 text-xs text-purple-900">
        <span className="text-base">🎨</span>
        <div>
          <span className="font-bold">Step 3: Customize Look, Fonts & Colors!</span>
          <p className="text-purple-700 mt-0.5">
            You can make your CV look classic Bangladeshi or sleek International in just a click!
          </p>
        </div>
      </div>

      {/* Font Selection */}
      <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 space-y-2.5">
        <div className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
          <Type className="w-3.5 h-3.5 text-blue-600" />
          <span>Font Family</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {fonts.map((f) => (
            <button
              key={f.value}
              type="button"
              onClick={() => updateDesign('fontFamily', f.value)}
              className={`p-2.5 rounded-xl border text-left transition flex items-center justify-between text-xs cursor-pointer ${
                design.fontFamily === f.value
                  ? 'border-blue-500 bg-blue-50/60 font-bold text-blue-900'
                  : 'border-slate-200 bg-white hover:bg-slate-100 text-slate-700'
              }`}
            >
              <span className={f.fontClass}>{f.name}</span>
              {design.fontFamily === f.value && <Check className="w-3.5 h-3.5 text-blue-600" />}
            </button>
          ))}
        </div>
      </div>

      {/* Heading Style */}
      <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 space-y-2.5">
        <div className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
          <Sliders className="w-3.5 h-3.5 text-purple-600" />
          <span>Section Heading Style</span>
        </div>
        <div className="space-y-2">
          {headingStyles.map((s) => (
            <button
              key={s.id}
              type="button"
              onClick={() => updateDesign('headingStyle', s.id)}
              className={`w-full p-2.5 rounded-xl border text-left transition flex items-center justify-between gap-3 text-xs cursor-pointer ${
                design.headingStyle === s.id
                  ? 'border-purple-500 bg-purple-50/60 text-purple-950 font-bold'
                  : 'border-slate-200 bg-white hover:bg-slate-100 text-slate-700'
              }`}
            >
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <span>{s.name}</span>
                  {design.headingStyle === s.id && <Check className="w-3.5 h-3.5 text-purple-600" />}
                </div>
                <div className="text-[11px] font-normal text-slate-500 mt-0.5">{s.desc}</div>
              </div>
              <div className="shrink-0">
                <span className={s.previewClass}>SAMPLE</span>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Accent Color Picker */}
      <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 space-y-2.5">
        <div className="text-xs font-bold text-slate-700 flex items-center justify-between">
          <span className="flex items-center gap-1.5">
            <Palette className="w-3.5 h-3.5 text-rose-600" />
            <span>Theme & Accent Color</span>
          </span>
          <span className="font-mono text-[11px] text-slate-500">{design.accentColor || '#4b5563'}</span>
        </div>

        {/* Color presets */}
        <div className="flex flex-wrap items-center gap-2">
          {presetColors.map((c) => (
            <button
              key={c.color}
              type="button"
              onClick={() => updateDesign('accentColor', c.color)}
              title={c.label}
              className={`w-7 h-7 rounded-full transition-transform flex items-center justify-center cursor-pointer ${
                design.accentColor === c.color ? 'scale-110 ring-2 ring-offset-2 ring-slate-800' : 'hover:scale-105'
              }`}
              style={{ backgroundColor: c.color }}
            >
              {design.accentColor === c.color && <Check className="w-3.5 h-3.5 text-white" />}
            </button>
          ))}
          {/* Custom color input */}
          <div className="flex items-center gap-1 ml-auto">
            <input
              type="color"
              value={design.accentColor || '#4b5563'}
              onChange={(e) => updateDesign('accentColor', e.target.value)}
              className="w-7 h-7 rounded-lg border border-slate-300 cursor-pointer"
            />
            <span className="text-[10px] text-slate-500">Custom</span>
          </div>
        </div>
      </div>

      {/* Font Size & Spacing Sliders */}
      <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 space-y-3">
        <div className="text-xs font-bold text-slate-700">Text Size & Density</div>
        <div className="grid grid-cols-2 gap-2 text-xs">
          <div>
            <label className="block text-[11px] font-semibold text-slate-600 mb-1">Text Size</label>
            <select
              value={design.fontSize || 'medium'}
              onChange={(e) => updateDesign('fontSize', e.target.value)}
              className="w-full px-2 py-1.5 rounded-lg border border-slate-300 bg-white"
            >
              <option value="small">Small (Fits more text)</option>
              <option value="medium">Medium (Standard)</option>
              <option value="large">Large (Comfortable)</option>
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-slate-600 mb-1">Page Margins</label>
            <select
              value={design.lineSpacing || 'normal'}
              onChange={(e) => updateDesign('lineSpacing', e.target.value)}
              className="w-full px-2 py-1.5 rounded-lg border border-slate-300 bg-white"
            >
              <option value="compact">Compact (Tighter)</option>
              <option value="normal">Normal</option>
              <option value="relaxed">Relaxed (Spacious)</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
}
