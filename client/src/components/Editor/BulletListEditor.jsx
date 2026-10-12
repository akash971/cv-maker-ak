import React from 'react';
import { Plus, Trash2, GripVertical } from 'lucide-react';

export default function BulletListEditor({ section, onUpdate }) {
  const items = section.items || [];

  const handleTitleChange = (newTitle) => {
    onUpdate({ ...section, title: newTitle });
  };

  const handleItemChange = (index, value) => {
    const newItems = [...items];
    newItems[index] = value;
    onUpdate({ ...section, items: newItems });
  };

  const addItem = () => {
    onUpdate({ ...section, items: [...items, ''] });
  };

  const removeItem = (index) => {
    const newItems = items.filter((_, i) => i !== index);
    onUpdate({ ...section, items: newItems });
  };

  return (
    <div className="space-y-3">
      <div>
        <label className="block text-xs font-semibold text-slate-600 mb-1">
          Section Title (e.g. KEY STRENGTHS: or INTERESTS:)
        </label>
        <input
          type="text"
          value={section.title || ''}
          onChange={(e) => handleTitleChange(e.target.value)}
          className="w-full text-xs font-bold px-3 py-1.5 rounded-lg border border-slate-300 bg-white focus:outline-blue-500 uppercase"
        />
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs font-semibold text-slate-600">
          <span>List Points ({items.length})</span>
          <button
            type="button"
            onClick={addItem}
            className="flex items-center gap-1 text-blue-600 hover:text-blue-800 text-[11px] font-bold cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add New Point</span>
          </button>
        </div>

        {items.map((item, idx) => (
          <div key={idx} className="flex items-center gap-2">
            <span className="w-5 text-center text-xs font-semibold text-slate-400">
              {idx + 1}.
            </span>
            <input
              type="text"
              value={item}
              onChange={(e) => handleItemChange(idx, e.target.value)}
              placeholder={`Point ${idx + 1}...`}
              className="flex-1 text-xs px-2.5 py-1.5 rounded-lg border border-slate-300 bg-white focus:outline-blue-500"
            />
            <button
              type="button"
              onClick={() => removeItem(idx)}
              className="text-slate-400 hover:text-rose-500 p-1 rounded transition"
              title="Delete point"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        ))}

        {items.length === 0 && (
          <div className="text-center py-4 bg-slate-50 border border-dashed border-slate-300 rounded-lg text-xs text-slate-400">
            No items yet. Click below to add your first point!
          </div>
        )}

        <button
          type="button"
          onClick={addItem}
          className="w-full py-1.5 border border-dashed border-slate-300 hover:border-blue-400 text-slate-600 hover:text-blue-600 rounded-lg text-xs font-medium flex items-center justify-center gap-1 transition"
        >
          <Plus className="w-3 h-3" />
          <span>Add another point</span>
        </button>
      </div>
    </div>
  );
}
