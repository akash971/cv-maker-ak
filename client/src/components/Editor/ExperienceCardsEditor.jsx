import React from 'react';
import { Plus, Trash2, Briefcase } from 'lucide-react';

export default function ExperienceCardsEditor({ section, onUpdate }) {
  const items = section.items || [];

  const handleTitleChange = (newTitle) => {
    onUpdate({ ...section, title: newTitle });
  };

  const updateItem = (index, field, value) => {
    const newItems = [...items];
    newItems[index] = {
      ...newItems[index],
      [field]: value
    };
    onUpdate({ ...section, items: newItems });
  };

  const addItem = () => {
    const newItem = {
      id: `exp_${Date.now()}`,
      role: '',
      company: '',
      location: '',
      period: '',
      bullets: ['']
    };
    onUpdate({ ...section, items: [...items, newItem] });
  };

  const removeItem = (index) => {
    const newItems = items.filter((_, i) => i !== index);
    onUpdate({ ...section, items: newItems });
  };

  const updateBullet = (itemIdx, bulletIdx, val) => {
    const newItems = [...items];
    const newBullets = [...(newItems[itemIdx].bullets || [])];
    newBullets[bulletIdx] = val;
    newItems[itemIdx].bullets = newBullets;
    onUpdate({ ...section, items: newItems });
  };

  const addBullet = (itemIdx) => {
    const newItems = [...items];
    const newBullets = [...(newItems[itemIdx].bullets || []), ''];
    newItems[itemIdx].bullets = newBullets;
    onUpdate({ ...section, items: newItems });
  };

  const removeBullet = (itemIdx, bulletIdx) => {
    const newItems = [...items];
    newItems[itemIdx].bullets = newItems[itemIdx].bullets.filter((_, i) => i !== bulletIdx);
    onUpdate({ ...section, items: newItems });
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-xs font-semibold text-slate-600 mb-1">
          Section Title (e.g. WORK EXPERIENCE: or EMPLOYMENT HISTORY:)
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
            <Briefcase className="w-4 h-4 text-blue-600" />
            <span>Work Positions / Jobs ({items.length})</span>
          </span>
          <button
            type="button"
            onClick={addItem}
            className="flex items-center gap-1 text-blue-600 hover:text-blue-800 text-[11px] font-bold cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Job / Experience</span>
          </button>
        </div>

        {items.map((exp, idx) => (
          <div key={exp.id || idx} className="bg-slate-50 border border-slate-200 rounded-xl p-3 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-800">
                Job #{idx + 1}: {exp.role || 'Position Title'}
              </span>
              <button
                type="button"
                onClick={() => removeItem(idx)}
                className="text-slate-400 hover:text-rose-500 p-1"
                title="Remove job"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              <div>
                <label className="block text-[11px] font-medium text-slate-600 mb-0.5">Job Role / Title</label>
                <input
                  type="text"
                  value={exp.role || ''}
                  onChange={(e) => updateItem(idx, 'role', e.target.value)}
                  placeholder="e.g. Lead Software Engineer"
                  className="w-full px-2.5 py-1.5 rounded border border-slate-300 bg-white"
                />
              </div>

              <div>
                <label className="block text-[11px] font-medium text-slate-600 mb-0.5">Company / Organization</label>
                <input
                  type="text"
                  value={exp.company || ''}
                  onChange={(e) => updateItem(idx, 'company', e.target.value)}
                  placeholder="e.g. Horizon Cloud Technologies"
                  className="w-full px-2.5 py-1.5 rounded border border-slate-300 bg-white"
                />
              </div>

              <div>
                <label className="block text-[11px] font-medium text-slate-600 mb-0.5">Location</label>
                <input
                  type="text"
                  value={exp.location || ''}
                  onChange={(e) => updateItem(idx, 'location', e.target.value)}
                  placeholder="e.g. Dhaka, Bangladesh or Remote"
                  className="w-full px-2.5 py-1.5 rounded border border-slate-300 bg-white"
                />
              </div>

              <div>
                <label className="block text-[11px] font-medium text-slate-600 mb-0.5">Period / Dates</label>
                <input
                  type="text"
                  value={exp.period || ''}
                  onChange={(e) => updateItem(idx, 'period', e.target.value)}
                  placeholder="e.g. 2021 - Present"
                  className="w-full px-2.5 py-1.5 rounded border border-slate-300 bg-white"
                />
              </div>
            </div>

            {/* Bullets */}
            <div className="space-y-1.5 pt-1">
              <div className="flex items-center justify-between text-[11px] font-semibold text-slate-600">
                <span>Key Accomplishments & Responsibilities:</span>
                <button
                  type="button"
                  onClick={() => addBullet(idx)}
                  className="text-blue-600 hover:text-blue-800 text-[10px] font-bold"
                >
                  + Add Point
                </button>
              </div>

              {exp.bullets?.map((b, bIdx) => (
                <div key={bIdx} className="flex items-center gap-1.5">
                  <span className="text-slate-400 text-xs">•</span>
                  <input
                    type="text"
                    value={b}
                    onChange={(e) => updateBullet(idx, bIdx, e.target.value)}
                    placeholder="Describe what you achieved..."
                    className="flex-1 text-xs px-2 py-1 rounded border border-slate-300 bg-white"
                  />
                  <button
                    type="button"
                    onClick={() => removeBullet(idx, bIdx)}
                    className="text-slate-400 hover:text-rose-500 p-0.5"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        ))}

        <button
          type="button"
          onClick={addItem}
          className="w-full py-2 border border-dashed border-slate-300 hover:border-blue-500 text-slate-600 hover:text-blue-700 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Add Another Work Position</span>
        </button>
      </div>
    </div>
  );
}
