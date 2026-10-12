import React from 'react';

export default function TextSectionEditor({ section, onUpdate }) {
  return (
    <div className="space-y-3">
      <div>
        <label className="block text-xs font-semibold text-slate-600 mb-1">
          Section Title (e.g. CAREER OBJECTIVE: or SUMMARY)
        </label>
        <input
          type="text"
          value={section.title || ''}
          onChange={(e) => onUpdate({ ...section, title: e.target.value })}
          className="w-full text-xs font-bold px-3 py-1.5 rounded-lg border border-slate-300 bg-white focus:outline-blue-500 uppercase"
        />
      </div>

      <div>
        <label className="block text-xs font-semibold text-slate-600 mb-1">
          Content / Description
        </label>
        <textarea
          rows={5}
          value={section.content || ''}
          onChange={(e) => onUpdate({ ...section, content: e.target.value })}
          placeholder="Write your objective or summary here..."
          className="w-full text-xs px-3 py-2 rounded-lg border border-slate-300 bg-white focus:outline-blue-500 leading-relaxed"
        />
      </div>
    </div>
  );
}
