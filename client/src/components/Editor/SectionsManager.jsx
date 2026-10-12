import React, { useState } from 'react';
import { 
  ChevronUp, 
  ChevronDown, 
  Eye, 
  EyeOff, 
  Trash2, 
  Plus, 
  ChevronRight,
  GripVertical,
  Edit3
} from 'lucide-react';
import TextSectionEditor from './TextSectionEditor';
import BulletListEditor from './BulletListEditor';
import EducationListEditor from './EducationListEditor';
import PersonalInfoGridEditor from './PersonalInfoGridEditor';
import TableSectionEditor from './TableSectionEditor';
import ReferenceBoxesEditor from './ReferenceBoxesEditor';
import ExperienceCardsEditor from './ExperienceCardsEditor';
import SkillBadgesEditor from './SkillBadgesEditor';
import DeclarationEditor from './DeclarationEditor';
import AddSectionModal from './AddSectionModal';

export default function SectionsManager({ 
  cvData, 
  setCvData,
  openSectionId: externalOpenSectionId,
  setOpenSectionId: externalSetOpenSectionId
}) {
  const sections = cvData.sections || [];
  const [internalOpenSectionId, setInternalOpenSectionId] = useState(sections[0]?.id || null);

  const openSectionId = externalOpenSectionId !== undefined ? externalOpenSectionId : internalOpenSectionId;
  const setOpenSectionId = externalSetOpenSectionId || setInternalOpenSectionId;
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const updateSection = (updatedSec) => {
    const newSections = sections.map(s => s.id === updatedSec.id ? updatedSec : s);
    setCvData(prev => ({ ...prev, sections: newSections }));
  };

  const moveUp = (index) => {
    if (index === 0) return;
    const newSections = [...sections];
    const temp = newSections[index - 1];
    newSections[index - 1] = newSections[index];
    newSections[index] = temp;
    setCvData(prev => ({ ...prev, sections: newSections }));
  };

  const moveDown = (index) => {
    if (index === sections.length - 1) return;
    const newSections = [...sections];
    const temp = newSections[index + 1];
    newSections[index + 1] = newSections[index];
    newSections[index] = temp;
    setCvData(prev => ({ ...prev, sections: newSections }));
  };

  const toggleVisibility = (id) => {
    const newSections = sections.map(s => s.id === id ? { ...s, enabled: s.enabled === false ? true : false } : s);
    setCvData(prev => ({ ...prev, sections: newSections }));
  };

  const deleteSection = (id) => {
    const newSections = sections.filter(s => s.id !== id);
    setCvData(prev => ({ ...prev, sections: newSections }));
  };

  const handleAddSection = (newSec) => {
    setCvData(prev => ({ ...prev, sections: [...prev.sections, newSec] }));
    setOpenSectionId(newSec.id);
  };

  const renderSectionEditor = (sec) => {
    switch (sec.type) {
      case 'text':
        return <TextSectionEditor section={sec} onUpdate={updateSection} />;
      case 'bullet_list':
        return <BulletListEditor section={sec} onUpdate={updateSection} />;
      case 'education_list':
        return <EducationListEditor section={sec} onUpdate={updateSection} />;
      case 'personal_info_grid':
        return <PersonalInfoGridEditor section={sec} onUpdate={updateSection} />;
      case 'table':
        return <TableSectionEditor section={sec} onUpdate={updateSection} />;
      case 'reference_boxes':
        return <ReferenceBoxesEditor section={sec} onUpdate={updateSection} />;
      case 'experience_cards':
        return <ExperienceCardsEditor section={sec} onUpdate={updateSection} />;
      case 'skill_badges':
        return <SkillBadgesEditor section={sec} onUpdate={updateSection} />;
      case 'declaration':
        return <DeclarationEditor section={sec} onUpdate={updateSection} />;
      default:
        return (
          <div className="text-xs text-slate-500">
            Unknown section type. Edit as plain text:
            <TextSectionEditor section={sec} onUpdate={updateSection} />
          </div>
        );
    }
  };

  return (
    <div className="space-y-4">
      {/* Friendly helper banner */}
      <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3 flex items-start gap-2.5 text-xs text-emerald-900">
        <span className="text-base">🎒</span>
        <div>
          <span className="font-bold">Step 2: Customize Your CV Sections!</span>
          <p className="text-emerald-700 mt-0.5">
            Click on any section to open and edit it. You can move sections up/down, hide them, or add any new section!
          </p>
        </div>
      </div>

      {/* Sections Accordion List */}
      <div className="space-y-2.5">
        {sections.map((sec, idx) => {
          const isOpen = openSectionId === sec.id;
          const isEnabled = sec.enabled !== false;

          return (
            <div 
              key={sec.id} 
              id={`editor-section-${sec.id}`}
              data-editor-section-id={sec.id}
              className={`rounded-xl border transition-all duration-150 ${
                isOpen 
                  ? 'border-blue-400 bg-white shadow-xs ring-2 ring-blue-100' 
                  : 'border-slate-200 bg-slate-50/80 hover:bg-white'
              } ${!isEnabled ? 'opacity-50' : ''}`}
            >
              {/* Accordion Header */}
              <div className="p-2.5 sm:p-3 flex items-center justify-between gap-2">
                <button
                  type="button"
                  onClick={() => setOpenSectionId(isOpen ? null : sec.id)}
                  className="flex items-center gap-2.5 flex-1 text-left min-w-0 cursor-pointer"
                >
                  <span className="text-xs font-bold text-slate-400 w-5">
                    #{idx + 1}
                  </span>
                  <div className="min-w-0">
                    <span className="text-xs font-bold text-slate-800 block truncate">
                      {sec.title || 'Untitled Section'}
                    </span>
                    <span className="text-[10px] text-slate-400 uppercase font-medium">
                      Type: {sec.type.replace('_', ' ')}
                    </span>
                  </div>
                </button>

                {/* Section Action Controls */}
                <div className="flex items-center gap-1 shrink-0">
                  {/* Move Up */}
                  <button
                    type="button"
                    disabled={idx === 0}
                    onClick={() => moveUp(idx)}
                    className="p-1 rounded text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 disabled:opacity-20 transition"
                    title="Move section up"
                  >
                    <ChevronUp className="w-3.5 h-3.5" />
                  </button>

                  {/* Move Down */}
                  <button
                    type="button"
                    disabled={idx === sections.length - 1}
                    onClick={() => moveDown(idx)}
                    className="p-1 rounded text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 disabled:opacity-20 transition"
                    title="Move section down"
                  >
                    <ChevronDown className="w-3.5 h-3.5" />
                  </button>

                  {/* Show / Hide */}
                  <button
                    type="button"
                    onClick={() => toggleVisibility(sec.id)}
                    className={`p-1 rounded transition ${isEnabled ? 'text-slate-500 hover:text-slate-700' : 'text-amber-500'}`}
                    title={isEnabled ? 'Hide from CV' : 'Show on CV'}
                  >
                    {isEnabled ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                  </button>

                  {/* Delete */}
                  <button
                    type="button"
                    onClick={() => deleteSection(sec.id)}
                    className="p-1 rounded text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition"
                    title="Delete section completely"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>

                  {/* Expand / Collapse arrow */}
                  <button
                    type="button"
                    onClick={() => setOpenSectionId(isOpen ? null : sec.id)}
                    className="p-1 text-slate-400 hover:text-slate-700"
                  >
                    <ChevronRight className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-90' : ''}`} />
                  </button>
                </div>
              </div>

              {/* Accordion Body Editor */}
              {isOpen && (
                <div className="p-3 sm:p-4 border-t border-slate-100 bg-white rounded-b-xl">
                  {renderSectionEditor(sec)}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Big Add Section Button */}
      <button
        type="button"
        onClick={() => setIsAddModalOpen(true)}
        className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 shadow-sm transition cursor-pointer active:scale-98"
      >
        <Plus className="w-4 h-4" />
        <span>➕ Add Any New Section You Want!</span>
      </button>

      {/* Add Section Modal */}
      <AddSectionModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAddSection={handleAddSection}
      />
    </div>
  );
}
