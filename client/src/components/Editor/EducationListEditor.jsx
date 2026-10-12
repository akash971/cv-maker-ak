import React from 'react';
import { Plus, Trash2, GraduationCap } from 'lucide-react';

export default function EducationListEditor({ section, onUpdate }) {
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

  const handleBlurClean = (index, field) => {
    const newItems = [...items];
    if (newItems[index] && typeof newItems[index][field] === 'string') {
      newItems[index][field] = newItems[index][field]
        .replace(/^\s*\|\s*:\s*/, '')
        .replace(/^\s*[|:]\s*/, '')
        .replace(/\s*[|:]\s*$/, '')
        .trim();
      onUpdate({ ...section, items: newItems });
    }
  };

  const addItem = () => {
    const newItem = {
      id: `edu_${Date.now()}`,
      examName: '',
      department: '',
      session: '',
      yearOfPassing: '',
      institution: '',
      board: '',
      gpa: ''
    };
    onUpdate({ ...section, items: [...items, newItem] });
  };

  const removeItem = (index) => {
    const newItems = items.filter((_, i) => i !== index);
    onUpdate({ ...section, items: newItems });
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-xs font-semibold text-slate-600 mb-1">
          Section Title (e.g. EDUCATIONAL QUALIFICATION:)
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
            <GraduationCap className="w-4 h-4 text-emerald-600" />
            <span>Examinations / Degrees ({items.length})</span>
          </span>
          <button
            type="button"
            onClick={addItem}
            className="flex items-center gap-1 text-emerald-600 hover:text-emerald-800 text-[11px] font-bold cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Degree / Exam</span>
          </button>
        </div>

        {items.map((edu, idx) => (
          <div key={edu.id || idx} className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-2.5 relative">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-800">
                Exam #{idx + 1}: {edu.examName || 'Untitled Examination'}
              </span>
              <button
                type="button"
                onClick={() => removeItem(idx)}
                className="text-slate-400 hover:text-rose-500 p-1 rounded transition"
                title="Delete this examination"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              <div>
                <label className="block text-[11px] font-medium text-slate-600 mb-0.5">
                  Name of Examination
                </label>
                <input
                  type="text"
                  value={edu.examName || ''}
                  onChange={(e) => updateItem(idx, 'examName', e.target.value)}
                  onBlur={() => handleBlurClean(idx, 'examName')}
                  placeholder="e.g. Diploma-In-Engineering or SSC"
                  className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 bg-white focus:outline-blue-500 text-xs"
                />
              </div>

              <div>
                <label className="block text-[11px] font-medium text-slate-600 mb-0.5">
                  Department / Trade / Group
                </label>
                <input
                  type="text"
                  value={edu.department || ''}
                  onChange={(e) => updateItem(idx, 'department', e.target.value)}
                  onBlur={() => handleBlurClean(idx, 'department')}
                  placeholder="e.g. Power Technology or Science"
                  className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 bg-white focus:outline-blue-500 text-xs"
                />
              </div>

              <div>
                <label className="block text-[11px] font-medium text-slate-600 mb-0.5">
                  Session
                </label>
                <input
                  type="text"
                  value={edu.session || ''}
                  onChange={(e) => updateItem(idx, 'session', e.target.value)}
                  onBlur={() => handleBlurClean(idx, 'session')}
                  placeholder="e.g. 2014-2015"
                  className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 bg-white focus:outline-blue-500 text-xs"
                />
              </div>

              <div>
                <label className="block text-[11px] font-medium text-slate-600 mb-0.5">
                  Year of Passing
                </label>
                <input
                  type="text"
                  value={edu.yearOfPassing || ''}
                  onChange={(e) => updateItem(idx, 'yearOfPassing', e.target.value)}
                  onBlur={() => handleBlurClean(idx, 'yearOfPassing')}
                  placeholder="e.g. 2018 or Appear"
                  className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 bg-white focus:outline-blue-500 text-xs"
                />
              </div>

              <div>
                <label className="block text-[11px] font-medium text-slate-600 mb-0.5">
                  Name of Institution
                </label>
                <input
                  type="text"
                  value={edu.institution || ''}
                  onChange={(e) => updateItem(idx, 'institution', e.target.value)}
                  onBlur={() => handleBlurClean(idx, 'institution')}
                  placeholder="e.g. Rangpur Polytechnic Institute"
                  className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 bg-white focus:outline-blue-500 text-xs"
                />
              </div>

              <div>
                <label className="block text-[11px] font-medium text-slate-600 mb-0.5">
                  Board Name
                </label>
                <input
                  type="text"
                  value={edu.board || ''}
                  onChange={(e) => updateItem(idx, 'board', e.target.value)}
                  onBlur={() => handleBlurClean(idx, 'board')}
                  placeholder="e.g. BTEB, Dhaka or Dinajpur"
                  className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 bg-white focus:outline-blue-500 text-xs"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-[11px] font-medium text-slate-600 mb-0.5">
                  GPA / CGPA (Optional)
                </label>
                <input
                  type="text"
                  value={edu.gpa || ''}
                  onChange={(e) => updateItem(idx, 'gpa', e.target.value)}
                  onBlur={() => handleBlurClean(idx, 'gpa')}
                  placeholder="e.g. 5.00 (Out of 5.00)"
                  className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 bg-white focus:outline-blue-500 text-xs"
                />
              </div>
            </div>
          </div>
        ))}

        <button
          type="button"
          onClick={addItem}
          className="w-full py-2 border border-dashed border-slate-300 hover:border-emerald-500 text-slate-600 hover:text-emerald-700 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Add Another Examination / Degree</span>
        </button>
      </div>
    </div>
  );
}
