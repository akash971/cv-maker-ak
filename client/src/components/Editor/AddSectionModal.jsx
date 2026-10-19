import React from 'react';
import { X, FileText, ListOrdered, GraduationCap, Briefcase, UserCheck, Table, Users, Award, PenTool } from 'lucide-react';

export default function AddSectionModal({ isOpen, onClose, onAddSection }) {
  if (!isOpen) return null;

  const sectionTemplates = [
    {
      type: 'text',
      title: 'SUMMARY OR OBJECTIVE',
      name: 'Paragraph Text',
      desc: 'A block of text to write your goal, summary, or background.',
      icon: FileText,
      color: 'bg-blue-50 text-blue-600 border-blue-200',
      defaultData: {
        content: 'Write your description or objective here...'
      }
    },
    {
      type: 'bullet_list',
      title: 'KEY POINTS & ACHIEVEMENTS',
      name: 'Numbered / Bullet List',
      desc: 'Numbered 1, 2, 3 points for Strengths, Hobbies, or Responsibilities.',
      icon: ListOrdered,
      color: 'bg-emerald-50 text-emerald-600 border-emerald-200',
      defaultData: {
        items: ['First point here', 'Second point here']
      }
    },
    {
      type: 'education_list',
      title: 'EDUCATIONAL QUALIFICATION',
      name: 'Examinations & Degrees',
      desc: 'Bangladeshi style colon-aligned exams, boards, institutes, and years.',
      icon: GraduationCap,
      color: 'bg-amber-50 text-amber-600 border-amber-200',
      defaultData: {
        items: [
          {
            id: `edu_${Date.now()}`,
            examName: 'Secondary School Certificate (SSC)',
            department: 'Science',
            session: '2016-2017',
            yearOfPassing: '2018',
            institution: 'Government High School',
            board: 'Dhaka',
            gpa: '5.00'
          }
        ]
      }
    },
    {
      type: 'experience_cards',
      title: 'WORK EXPERIENCE',
      name: 'Work History / Jobs',
      desc: 'Position titles, company names, work dates, and bullet points.',
      icon: Briefcase,
      color: 'bg-indigo-50 text-indigo-600 border-indigo-200',
      defaultData: {
        items: [
          {
            id: `exp_${Date.now()}`,
            role: 'Job Role / Title',
            company: 'Company Name',
            location: 'Dhaka, Bangladesh',
            period: '2023 - Present',
            bullets: ['Key responsibility or major achievement achieved']
          }
        ]
      }
    },
    {
      type: 'personal_info_grid',
      title: 'PERSONAL INFORMATION',
      name: 'Bio-Data Colon Grid',
      desc: 'Colon-aligned personal details (Father, Mother, Address, Blood Group, etc.)',
      icon: UserCheck,
      color: 'bg-purple-50 text-purple-600 border-purple-200',
      defaultData: {
        fields: [
          { label: "Father's Name", value: '' },
          { label: "Mother's Name", value: '' },
          { label: 'Permanent Address', value: '' },
          { label: 'Date of Birth', value: '' },
          { label: 'Nationality', value: 'Bangladeshi' },
          { label: 'Blood Group', value: 'O+' }
        ]
      }
    },
    {
      type: 'table',
      title: 'LANGUAGE PROFICIENCY',
      name: 'Custom Table / Grid',
      desc: 'Bordered grid with custom columns and rows like language ratings.',
      icon: Table,
      color: 'bg-rose-50 text-rose-600 border-rose-200',
      defaultData: {
        headers: ['Language', 'Reading', 'Writing', 'Speaking'],
        rows: [
          ['Bengali', 'Good', 'Good', 'Good'],
          ['English', 'Good', 'Good', 'Good']
        ]
      }
    },
    {
      type: 'reference_boxes',
      title: 'REFERENCE',
      name: 'Referee Framed Boxes',
      desc: 'Side-by-side framed boxes for teachers, mentors, or former managers.',
      icon: Users,
      color: 'bg-teal-50 text-teal-600 border-teal-200',
      defaultData: {
        items: [
          {
            number: '1.',
            name: 'Referee Full Name',
            designation: 'Designation / Title',
            institution: 'Institution or Company Name',
            contact: 'Mobile: 01XXXXXXXXX',
            email: 'referee@email.com'
          }
        ]
      }
    },
    {
      type: 'skill_badges',
      title: 'SKILLS & TOOLS',
      name: 'Skill Badges & Tags',
      desc: 'Modern clickable tag pills categorized by language or tool.',
      icon: Award,
      color: 'bg-cyan-50 text-cyan-600 border-cyan-200',
      defaultData: {
        categories: [
          { name: 'Technical', skills: ['Computer Basics', 'MS Word', 'Typing'] }
        ]
      }
    },
    {
      type: 'declaration',
      title: 'DECLARATION',
      name: 'Declaration & Signature',
      desc: 'Official honesty statement and candidate signature line at the end.',
      icon: PenTool,
      color: 'bg-slate-100 text-slate-700 border-slate-300',
      defaultData: {
        text: 'I hereby declared to the best of my knowledge and believe that this CV correctly described my qualification, experiences and me.',
        signName: 'Your Name',
        dateLabel: 'Date: ....................'
      }
    }
  ];

  const handlePick = (tmpl) => {
    const newSection = {
      id: `sec_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
      type: tmpl.type,
      title: tmpl.title,
      enabled: true,
      ...tmpl.defaultData
    };
    onAddSection(newSection);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-xl w-full overflow-hidden border border-slate-200 flex flex-col max-h-[88dvh]">
        {/* Header */}
        <div className="px-4 py-3 sm:px-5 sm:py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div>
            <h3 className="text-sm sm:text-base font-bold text-slate-800 flex items-center gap-2">
              <span>✨ Add Any Section You Want</span>
            </h3>
            <p className="text-[11px] sm:text-xs text-slate-500">Pick what you want to add to your CV. No restrictions!</p>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-700 p-1.5 rounded-lg hover:bg-slate-200/60 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Section Template Cards */}
        <div className="p-4 overflow-y-auto space-y-2.5">
          {sectionTemplates.map((t) => {
            const Icon = t.icon;
            return (
              <button
                key={t.type}
                type="button"
                onClick={() => handlePick(t)}
                className="w-full text-left p-3 rounded-xl border border-slate-200 hover:border-blue-400 hover:bg-blue-50/40 transition flex items-start gap-3.5 group cursor-pointer"
              >
                <div className={`p-2.5 rounded-xl border ${t.color} shrink-0 group-hover:scale-105 transition-transform`}>
                  <Icon className="w-5 h-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-xs font-bold text-slate-800 group-hover:text-blue-600 transition flex items-center gap-1.5">
                    <span>{t.name}</span>
                    <span className="text-[10px] font-normal text-slate-400">({t.title})</span>
                  </div>
                  <p className="text-[11px] text-slate-500 mt-0.5 leading-snug">
                    {t.desc}
                  </p>
                </div>
              </button>
            );
          })}
        </div>

        {/* Footer */}
        <div className="px-5 py-3 border-t border-slate-200 bg-slate-50 text-right">
          <button
            onClick={onClose}
            className="px-4 py-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 rounded-lg hover:bg-slate-200/60 transition"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
