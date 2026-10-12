import React from 'react';
import { Mail, Phone, MapPin, Globe } from 'lucide-react';
import { LinkedinIcon, GithubIcon } from '../Common/Icons';

export default function InternationalTemplate({ cvData }) {
  const { design = {}, personal = {}, sections = [] } = cvData || {};
  const activeSections = sections.filter(s => s.enabled !== false);
  const accentColor = design.accentColor || '#2563eb';

  // Font family
  const getFontClass = () => {
    switch (design.fontFamily) {
      case 'Times New Roman': return 'font-times';
      case 'Georgia': return 'font-serif-classic';
      case 'Arial': return 'font-arial';
      case 'Garamond': return 'font-garamond';
      case 'Inter':
      case 'Roboto':
      default:
        return 'font-inter';
    }
  };

  const getFontSizeClass = () => {
    switch (design.fontSize) {
      case 'small': return 'text-[12px]';
      case 'large': return 'text-[14px]';
      case 'medium':
      default:
        return 'text-[13px]';
    }
  };

  return (
    <div className={`w-full bg-white text-slate-800 p-8 sm:p-12 print:p-0 ${getFontClass()} ${getFontSizeClass()} select-text`}>
      {/* Header Container */}
      <header className="border-b pb-6 mb-6 flex flex-col-reverse sm:flex-row sm:items-center sm:justify-between gap-6" style={{ borderColor: `${accentColor}33` }}>
        <div className="flex-1">
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 mb-1" style={{ color: '#0f172a' }}>
            {personal.fullName || 'Alex Morgan'}
          </h1>
          {personal.jobTitle && (
            <div className="text-base sm:text-lg font-semibold mb-3" style={{ color: accentColor }}>
              {personal.jobTitle}
            </div>
          )}

          {/* Contact Bar */}
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-slate-600">
            {personal.email && (
              <a href={`mailto:${personal.email}`} className="flex items-center gap-1.5 hover:text-blue-600 transition">
                <Mail className="w-3.5 h-3.5 text-slate-400" />
                <span>{personal.email}</span>
              </a>
            )}
            {personal.mobile && (
              <span className="flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5 text-slate-400" />
                <span>{personal.mobile}</span>
              </span>
            )}
            {personal.address && (
              <span className="flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-slate-400" />
                <span>{personal.address}</span>
              </span>
            )}
            {personal.linkedin && (
              <a href={`https://${personal.linkedin.replace(/^https?:\/\//, '')}`} target="_blank" rel="noreferrer" className="flex items-center gap-1.5 hover:text-blue-600 transition">
                <LinkedinIcon className="w-3.5 h-3.5 text-slate-400" />
                <span>{personal.linkedin}</span>
              </a>
            )}
            {personal.github && (
              <a href={`https://${personal.github.replace(/^https?:\/\//, '')}`} target="_blank" rel="noreferrer" className="flex items-center gap-1.5 hover:text-blue-600 transition">
                <GithubIcon className="w-3.5 h-3.5 text-slate-400" />
                <span>{personal.github}</span>
              </a>
            )}
            {personal.website && (
              <a href={`https://${personal.website.replace(/^https?:\/\//, '')}`} target="_blank" rel="noreferrer" className="flex items-center gap-1.5 hover:text-blue-600 transition">
                <Globe className="w-3.5 h-3.5 text-slate-400" />
                <span>{personal.website}</span>
              </a>
            )}
          </div>
        </div>

        {/* Profile Photo */}
        {design.photo?.show && design.photo?.url && (
          <div className="shrink-0">
            <div className={`overflow-hidden border-2 shadow-sm ${
              design.photo.shape === 'circle' ? 'rounded-full w-24 h-24' :
              design.photo.shape === 'square' ? 'rounded-xl w-24 h-24' : 'rounded-lg w-20 h-24'
            }`} style={{ borderColor: accentColor }}>
              <img 
                src={design.photo.url} 
                alt={personal.fullName || 'Profile'} 
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        )}
      </header>

      {/* Dynamic Sections */}
      <div className="space-y-6">
        {activeSections.map((sec) => (
          <section key={sec.id} className="break-inside-avoid">
            {/* Section Header */}
            <div className="flex items-center gap-3 mb-3 pb-1 border-b" style={{ borderColor: `${accentColor}25` }}>
              <h2 className="text-sm font-bold uppercase tracking-wider text-slate-900" style={{ color: accentColor }}>
                {sec.title}
              </h2>
            </div>

            {/* Content Based on Section Type */}
            {/* 1. Text Summary */}
            {sec.type === 'text' && (
              <p className="text-slate-700 leading-relaxed text-justify">
                {sec.content}
              </p>
            )}

            {/* 2. Work Experience Cards */}
            {sec.type === 'experience_cards' && (
              <div className="space-y-4">
                {sec.items?.map((exp) => (
                  <div key={exp.id} className="group">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 mb-1">
                      <div>
                        <span className="font-bold text-slate-900 text-sm">{exp.role}</span>
                        {exp.company && <span className="text-slate-600 font-medium"> • {exp.company}</span>}
                      </div>
                      <div className="text-xs font-semibold px-2 py-0.5 rounded bg-slate-100 text-slate-700 self-start sm:self-auto">
                        {exp.period}
                      </div>
                    </div>
                    {exp.location && <div className="text-xs text-slate-500 mb-1.5">{exp.location}</div>}
                    
                    {exp.bullets && exp.bullets.length > 0 && (
                      <ul className="list-disc pl-4 space-y-1 text-slate-700 text-xs sm:text-[12.5px] leading-relaxed marker:text-slate-400">
                        {exp.bullets.map((b, i) => (
                          <li key={i}>{b}</li>
                        ))}
                      </ul>
                    )}
                  </div>
                ))}
              </div>
            )}

            {/* 3. Skill Badges */}
            {sec.type === 'skill_badges' && (
              <div className="space-y-3">
                {sec.categories?.map((cat, idx) => (
                  <div key={idx}>
                    {cat.name && <div className="text-xs font-bold text-slate-700 mb-1.5">{cat.name}:</div>}
                    <div className="flex flex-wrap gap-1.5">
                      {cat.skills?.map((skill, sIdx) => (
                        <span 
                          key={sIdx} 
                          className="px-2.5 py-1 text-xs font-medium rounded-md border"
                          style={{ 
                            backgroundColor: `${accentColor}0a`, 
                            color: '#1e293b',
                            borderColor: `${accentColor}25`
                          }}
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* 4. Education Cards */}
            {sec.type === 'education_cards' && (
              <div className="space-y-3">
                {sec.items?.map((edu) => (
                  <div key={edu.id} className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-1">
                    <div>
                      <div className="font-bold text-slate-900 text-sm">{edu.degree}</div>
                      <div className="text-xs text-slate-600 font-medium">{edu.institution} {edu.location ? `• ${edu.location}` : ''}</div>
                      {edu.gpa && <div className="text-xs text-slate-500 mt-0.5">{edu.gpa}</div>}
                    </div>
                    {edu.period && (
                      <div className="text-xs font-semibold px-2 py-0.5 rounded bg-slate-100 text-slate-700 self-start sm:self-auto shrink-0">
                        {edu.period}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}

            {/* 5. Bullet List */}
            {sec.type === 'bullet_list' && (
              <ul className="list-disc pl-4 space-y-1 text-slate-700 text-xs sm:text-[12.5px] leading-relaxed marker:text-slate-400">
                {sec.items?.map((item, idx) => (
                  <li key={idx}>{item}</li>
                ))}
              </ul>
            )}

            {/* 6. Education List (fallback if user keeps BD education list in International style) */}
            {sec.type === 'education_list' && (
              <div className="space-y-3">
                {sec.items?.map((edu) => (
                  <div key={edu.id} className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-1">
                    <div>
                      <div className="font-bold text-slate-900 text-sm">{edu.examName}</div>
                      <div className="text-xs text-slate-600">{edu.institution} • {edu.department || 'General'}</div>
                      {edu.gpa && <div className="text-xs text-slate-500">Result: {edu.gpa}</div>}
                    </div>
                    <div className="text-xs font-semibold px-2 py-0.5 rounded bg-slate-100 text-slate-700 self-start sm:self-auto shrink-0">
                      {edu.yearOfPassing || edu.session}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* 7. Grid / Table */}
            {sec.type === 'table' && (
              <div className="overflow-x-auto">
                <table className="w-full border-collapse border border-slate-200 text-xs text-slate-700">
                  <thead>
                    <tr className="bg-slate-50">
                      {sec.headers?.map((h, i) => (
                        <th key={i} className="border border-slate-200 px-3 py-1.5 font-bold text-left">
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {sec.rows?.map((row, rIdx) => (
                      <tr key={rIdx} className="hover:bg-slate-50">
                        {row.map((cell, cIdx) => (
                          <td key={cIdx} className="border border-slate-200 px-3 py-1.5">
                            {cell}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* 8. Personal Info Grid (if shown in International) */}
            {sec.type === 'personal_info_grid' && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                {sec.fields?.map((f, i) => (
                  <div key={i} className="bg-slate-50 p-2 rounded border border-slate-100">
                    <span className="font-bold text-slate-600 block text-[11px] uppercase tracking-wider">{f.label}</span>
                    <span className="text-slate-800">{f.value}</span>
                  </div>
                ))}
              </div>
            )}

            {/* 9. Reference Boxes */}
            {sec.type === 'reference_boxes' && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                {sec.items?.map((ref, idx) => (
                  <div key={idx} className="p-3 rounded-lg border border-slate-200 bg-slate-50/50">
                    <div className="font-bold text-slate-900 text-sm">{ref.name}</div>
                    {ref.designation && <div className="text-slate-600">{ref.designation}</div>}
                    {ref.institution && <div className="text-slate-600">{ref.institution}</div>}
                    {ref.contact && <div className="text-slate-500 mt-1">{ref.contact}</div>}
                    {ref.email && <div className="text-slate-500">{ref.email}</div>}
                  </div>
                ))}
              </div>
            )}

            {/* 10. Declaration */}
            {sec.type === 'declaration' && (
              <div className="pt-2 text-xs text-slate-600">
                <p className="italic leading-relaxed">{sec.text || design.declarationText}</p>
                {sec.signName && (
                  <div className="mt-4 font-bold text-slate-900">
                    {sec.signName}
                  </div>
                )}
              </div>
            )}
          </section>
        ))}
      </div>
    </div>
  );
}
