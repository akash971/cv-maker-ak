import React from 'react';
import { Plus, Trash2, Users } from 'lucide-react';

export default function ReferenceBoxesEditor({ section, onUpdate }) {
  const items = section.items || [];

  const handleTitleChange = (newTitle) => {
    onUpdate({ ...section, title: newTitle });
  };

  const updateRef = (index, field, value) => {
    const newItems = [...items];
    newItems[index] = {
      ...newItems[index],
      [field]: value
    };
    onUpdate({ ...section, items: newItems });
  };

  const addReference = () => {
    const newRef = {
      number: `${items.length + 1}.`,
      name: '',
      designation: '',
      institution: '',
      contact: '',
      email: ''
    };
    onUpdate({ ...section, items: [...items, newRef] });
  };

  const removeReference = (index) => {
    const newItems = items.filter((_, i) => i !== index);
    onUpdate({ ...section, items: newItems });
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-xs font-semibold text-slate-600 mb-1">
          Section Title (e.g. REFERENCE:)
        </label>
        <input
          type="text"
          value={section.title || ''}
          onChange={(e) => handleTitleChange(e.target.value)}
          className="w-full text-xs font-bold px-3 py-1.5 rounded-lg border border-slate-300 bg-white focus:outline-blue-500 uppercase"
        />
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between text-xs font-semibold text-slate-700">
          <span className="flex items-center gap-1.5">
            <Users className="w-4 h-4 text-purple-600" />
            <span>References / Referees ({items.length})</span>
          </span>
          <button
            type="button"
            onClick={addReference}
            className="flex items-center gap-1 text-purple-600 hover:text-purple-800 text-[11px] font-bold cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Referee</span>
          </button>
        </div>

        {items.map((ref, idx) => (
          <div key={idx} className="bg-slate-50 border border-slate-200 rounded-xl p-3 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-800">
                Referee #{idx + 1}
              </span>
              <button
                type="button"
                onClick={() => removeReference(idx)}
                className="text-slate-400 hover:text-rose-500 p-1"
                title="Remove referee"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="space-y-2 text-xs">
              <div>
                <label className="block text-[11px] font-medium text-slate-600 mb-0.5">Name</label>
                <input
                  type="text"
                  value={ref.name || ''}
                  onChange={(e) => updateRef(idx, 'name', e.target.value)}
                  placeholder="e.g. Engr. Rahul Amin"
                  className="w-full px-2.5 py-1.5 rounded border border-slate-300 bg-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[11px] font-medium text-slate-600 mb-0.5">Designation</label>
                  <input
                    type="text"
                    value={ref.designation || ''}
                    onChange={(e) => updateRef(idx, 'designation', e.target.value)}
                    placeholder="e.g. Chief Instructor"
                    className="w-full px-2.5 py-1.5 rounded border border-slate-300 bg-white"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-medium text-slate-600 mb-0.5">Institution / Org</label>
                  <input
                    type="text"
                    value={ref.institution || ''}
                    onChange={(e) => updateRef(idx, 'institution', e.target.value)}
                    placeholder="e.g. Rangpur Polytechnic"
                    className="w-full px-2.5 py-1.5 rounded border border-slate-300 bg-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[11px] font-medium text-slate-600 mb-0.5">Phone / Mobile</label>
                  <input
                    type="text"
                    value={ref.contact || ''}
                    onChange={(e) => updateRef(idx, 'contact', e.target.value)}
                    placeholder="e.g. Mobile No: 01703452142"
                    className="w-full px-2.5 py-1.5 rounded border border-slate-300 bg-white"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-medium text-slate-600 mb-0.5">Email (Optional)</label>
                  <input
                    type="email"
                    value={ref.email || ''}
                    onChange={(e) => updateRef(idx, 'email', e.target.value)}
                    placeholder="e.g. referee@email.com"
                    className="w-full px-2.5 py-1.5 rounded border border-slate-300 bg-white"
                  />
                </div>
              </div>
            </div>
          </div>
        ))}

        <button
          type="button"
          onClick={addReference}
          className="w-full py-2 border border-dashed border-slate-300 hover:border-purple-500 text-slate-600 hover:text-purple-700 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Add Another Reference Box</span>
        </button>
      </div>
    </div>
  );
}
