import React, { useState } from 'react';
import { Plus, Trash2, X, Wrench } from 'lucide-react';

export default function SkillBadgesEditor({ section, onUpdate }) {
  const categories = section.categories || [];
  const [newSkillInput, setNewSkillInput] = useState({});

  const handleTitleChange = (newTitle) => {
    onUpdate({ ...section, title: newTitle });
  };

  const addCategory = () => {
    onUpdate({
      ...section,
      categories: [...categories, { name: 'New Category', skills: [] }]
    });
  };

  const removeCategory = (catIdx) => {
    onUpdate({
      ...section,
      categories: categories.filter((_, i) => i !== catIdx)
    });
  };

  const updateCategoryName = (catIdx, name) => {
    const updated = [...categories];
    updated[catIdx].name = name;
    onUpdate({ ...section, categories: updated });
  };

  const addSkill = (catIdx) => {
    const skillText = (newSkillInput[catIdx] || '').trim();
    if (!skillText) return;
    const updated = [...categories];
    updated[catIdx].skills = [...(updated[catIdx].skills || []), skillText];
    onUpdate({ ...section, categories: updated });
    setNewSkillInput({ ...newSkillInput, [catIdx]: '' });
  };

  const removeSkill = (catIdx, skillIdx) => {
    const updated = [...categories];
    updated[catIdx].skills = updated[catIdx].skills.filter((_, i) => i !== skillIdx);
    onUpdate({ ...section, categories: updated });
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-xs font-semibold text-slate-600 mb-1">
          Section Title (e.g. TECHNICAL SKILLS: or CORE SKILLS:)
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
            <Wrench className="w-4 h-4 text-amber-600" />
            <span>Skill Groups ({categories.length})</span>
          </span>
          <button
            type="button"
            onClick={addCategory}
            className="flex items-center gap-1 text-amber-600 hover:text-amber-800 text-[11px] font-bold cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Group</span>
          </button>
        </div>

        {categories.map((cat, catIdx) => (
          <div key={catIdx} className="bg-slate-50 border border-slate-200 rounded-xl p-3 space-y-2">
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={cat.name}
                onChange={(e) => updateCategoryName(catIdx, e.target.value)}
                placeholder="Category Name (e.g. Programming Languages)"
                className="flex-1 text-xs font-bold px-2.5 py-1 rounded border border-slate-300 bg-white"
              />
              <button
                type="button"
                onClick={() => removeCategory(catIdx)}
                className="text-slate-400 hover:text-rose-500 p-1"
                title="Remove group"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Badges List */}
            <div className="flex flex-wrap gap-1.5 pt-1">
              {cat.skills?.map((skill, sIdx) => (
                <span 
                  key={sIdx}
                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs bg-white border border-slate-300 text-slate-800 shadow-2xs"
                >
                  <span>{skill}</span>
                  <button
                    type="button"
                    onClick={() => removeSkill(catIdx, sIdx)}
                    className="hover:text-rose-500 text-slate-400"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>

            {/* Add skill input */}
            <div className="flex items-center gap-1.5 pt-1">
              <input
                type="text"
                value={newSkillInput[catIdx] || ''}
                onChange={(e) => setNewSkillInput({ ...newSkillInput, [catIdx]: e.target.value })}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    addSkill(catIdx);
                  }
                }}
                placeholder="Type a skill & press Enter or Add..."
                className="flex-1 text-xs px-2.5 py-1 rounded border border-slate-300 bg-white"
              />
              <button
                type="button"
                onClick={() => addSkill(catIdx)}
                className="px-2.5 py-1 text-xs bg-amber-600 hover:bg-amber-700 text-white font-semibold rounded transition"
              >
                Add
              </button>
            </div>
          </div>
        ))}

        <button
          type="button"
          onClick={addCategory}
          className="w-full py-2 border border-dashed border-slate-300 hover:border-amber-500 text-slate-600 hover:text-amber-700 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Add Another Skill Category</span>
        </button>
      </div>
    </div>
  );
}
