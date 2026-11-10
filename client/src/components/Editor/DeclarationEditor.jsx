import React, { useRef } from 'react';
import { Upload, Trash2, PenTool } from 'lucide-react';

export default function DeclarationEditor({ section, onUpdate }) {
  const sigInputRef = useRef(null);

  const updateField = (field, val) => {
    onUpdate({
      ...section,
      [field]: val
    });
  };

  const handleSignatureUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file || !file.type.startsWith('image/')) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result;
      if (!dataUrl) return;

      const img = new window.Image();
      img.onload = () => {
        try {
          const maxW = 400;
          const maxH = 150;
          let width = img.width;
          let height = img.height;
          const ratio = Math.min(maxW / width, maxH / height, 1);
          width = Math.round(width * ratio);
          height = Math.round(height * ratio);

          const canvas = document.createElement('canvas');
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          ctx.fillStyle = '#ffffff';
          ctx.fillRect(0, 0, width, height);
          ctx.drawImage(img, 0, 0, width, height);

          updateField('signatureImage', canvas.toDataURL('image/jpeg', 0.88));
        } catch {
          updateField('signatureImage', dataUrl);
        }
      };
      img.src = dataUrl;
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  return (
    <div className="space-y-3">
      <div>
        <label className="block text-xs font-semibold text-slate-600 mb-1">
          Section Title (e.g. DECLARATION:)
        </label>
        <input
          type="text"
          value={section.title || ''}
          onChange={(e) => updateField('title', e.target.value)}
          className="w-full text-xs font-bold px-3 py-1.5 rounded-lg border border-slate-300 bg-white focus:outline-blue-500 uppercase"
        />
      </div>

      <div>
        <label className="block text-xs font-semibold text-slate-600 mb-1">
          Declaration Statement
        </label>
        <textarea
          rows={3}
          value={section.text || ''}
          onChange={(e) => updateField('text', e.target.value)}
          placeholder="I hereby declared to the best of my knowledge and believe that this CV correctly described my qualification..."
          className="w-full text-xs px-3 py-2 rounded-lg border border-slate-300 bg-white focus:outline-blue-500 leading-relaxed"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
        <div>
          <label className="block text-[11px] font-semibold text-slate-600 mb-1">
            Signer / Candidate Name
          </label>
          <input
            type="text"
            value={section.signName || ''}
            onChange={(e) => updateField('signName', e.target.value)}
            placeholder="e.g. Emran Hossen"
            className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 bg-white"
          />
        </div>

        <div>
          <label className="block text-[11px] font-semibold text-slate-600 mb-1">
            Date Line Text
          </label>
          <input
            type="text"
            value={section.dateLabel || ''}
            onChange={(e) => updateField('dateLabel', e.target.value)}
            placeholder="e.g. Date: ...................."
            className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 bg-white"
          />
        </div>
      </div>

      {/* Optional Scanned Signature Image Upload */}
      <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-200 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2.5 min-w-0">
          <PenTool className="w-4 h-4 text-blue-600 shrink-0" />
          <div className="text-xs">
            <div className="font-semibold text-slate-700">Signature Image (Optional)</div>
            <div className="text-[10px] text-slate-500">Upload a scanned signature above your name</div>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          {section.signatureImage && (
            <img 
              src={section.signatureImage} 
              alt="Signature preview" 
              className="h-8 w-20 object-contain bg-white border border-slate-300 rounded px-1"
            />
          )}
          <input
            type="file"
            ref={sigInputRef}
            onChange={handleSignatureUpload}
            accept="image/*"
            className="hidden"
          />
          <button
            type="button"
            onClick={() => sigInputRef.current?.click()}
            className="flex items-center gap-1 text-xs bg-white border border-slate-300 hover:bg-slate-100 text-slate-700 px-2.5 py-1 rounded-lg font-semibold cursor-pointer transition"
          >
            <Upload className="w-3 h-3 text-blue-600" />
            <span>{section.signatureImage ? 'Change' : 'Upload'}</span>
          </button>
          {section.signatureImage && (
            <button
              type="button"
              onClick={() => updateField('signatureImage', '')}
              className="text-rose-600 hover:bg-rose-50 p-1 rounded transition cursor-pointer"
              title="Remove signature image"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
