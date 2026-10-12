import React from 'react';
import { Plus, Trash2, ShieldCheck } from 'lucide-react';

export default function PersonalInfoGridEditor({ section, onUpdate }) {
  const fields = section.fields || [];

  const handleTitleChange = (newTitle) => {
    onUpdate({ ...section, title: newTitle });
  };

  const updateField = (index, key, val) => {
    const newFields = [...fields];
    newFields[index] = {
      ...newFields[index],
      [key]: val
    };
    onUpdate({ ...section, fields: newFields });
  };

  const handleBlurClean = (index) => {
    const newFields = [...fields];
    const target = newFields[index];
    if (target) {
      newFields[index] = {
        label: (target.label || '').replace(/[:|]+$/, '').replace(/^[:|]+/, '').trim(),
        value: (target.value || '').replace(/^\s*[:|]+\s*/, '').trim()
      };
      onUpdate({ ...section, fields: newFields });
    }
  };

  const addField = () => {
    onUpdate({
      ...section,
      fields: [...fields, { label: 'New Field', value: '' }]
    });
  };

  const removeField = (index) => {
    const newFields = fields.filter((_, i) => i !== index);
    onUpdate({ ...section, fields: newFields });
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-xs font-semibold text-slate-600 mb-1">
          Section Title (e.g. PERSONAL INFORMATION: or BIO-DATA:)
        </label>
        <input
          type="text"
          value={section.title || ''}
          onChange={(e) => handleTitleChange(e.target.value)}
          className="w-full text-xs font-bold px-3 py-1.5 rounded-lg border border-slate-300 bg-white focus:outline-blue-500 uppercase"
        />
      </div>

      {/* 2-Column Grid Indicator */}
      <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-lg px-2.5 py-1.5 text-[11px] flex items-center justify-between">
        <span className="font-semibold">⚡ Compact 2-Column Grid Active</span>
        <span className="text-emerald-700">Saves 50% vertical page height</span>
      </div>

      <div className="space-y-2.5">
        <div className="flex items-center justify-between text-xs font-semibold text-slate-700">
          <span className="flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-blue-600" />
            <span>Personal Bio Details ({fields.length} fields)</span>
          </span>
          <button
            type="button"
            onClick={addField}
            className="flex items-center gap-1 text-blue-600 hover:text-blue-800 text-[11px] font-bold cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Custom Field</span>
          </button>
        </div>

        <div className="space-y-2">
          {fields.map((field, idx) => (
            <div key={idx} className="flex items-start gap-2 bg-slate-50 p-2 rounded-lg border border-slate-200">
              {/* Field Label (editable with no restriction) */}
              <div className="w-1/3">
                <input
                  type="text"
                  value={field.label}
                  onChange={(e) => updateField(idx, 'label', e.target.value)}
                  onBlur={() => handleBlurClean(idx)}
                  placeholder="Field Name"
                  className="w-full text-xs font-semibold px-2 py-1.5 rounded border border-slate-300 bg-white focus:outline-blue-500"
                />
              </div>

              {/* Colon divider indicator */}
              <span className="text-slate-400 font-bold self-center">:</span>

              {/* Field Value (multiline or singleline) */}
              <div className="flex-1">
                {field.label.toLowerCase().includes('address') ? (
                  <textarea
                    rows={2}
                    value={field.value}
                    onChange={(e) => updateField(idx, 'value', e.target.value)}
                    onBlur={() => handleBlurClean(idx)}
                    placeholder="Enter value..."
                    className="w-full text-xs px-2 py-1.5 rounded border border-slate-300 bg-white focus:outline-blue-500 leading-tight"
                  />
                ) : (
                  <input
                    type="text"
                    value={field.value}
                    onChange={(e) => updateField(idx, 'value', e.target.value)}
                    onBlur={() => handleBlurClean(idx)}
                    placeholder="Enter value..."
                    className="w-full text-xs px-2 py-1.5 rounded border border-slate-300 bg-white focus:outline-blue-500"
                  />
                )}
              </div>

              {/* Delete button */}
              <button
                type="button"
                onClick={() => removeField(idx)}
                className="text-slate-400 hover:text-rose-500 p-1 rounded transition self-center"
                title="Remove field"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>

        <button
          type="button"
          onClick={addField}
          className="w-full py-1.5 border border-dashed border-slate-300 hover:border-blue-500 text-slate-600 hover:text-blue-600 rounded-lg text-xs font-medium flex items-center justify-center gap-1 transition"
        >
          <Plus className="w-3 h-3" />
          <span>Add Custom Field (e.g. Religion, Passport No)</span>
        </button>
      </div>
    </div>
  );
}
