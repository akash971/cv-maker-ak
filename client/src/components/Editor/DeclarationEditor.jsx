import React from 'react';

export default function DeclarationEditor({ section, onUpdate }) {
  const updateField = (field, val) => {
    onUpdate({
      ...section,
      [field]: val
    });
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
    </div>
  );
}
