import React from 'react';

export default function BangladeshiTemplate({ cvData }) {
  const { design = {}, personal = {}, sections = [] } = cvData || {};
  const activeSections = sections.filter(s => s.enabled !== false);

  const getHeadingStyle = () => {
    switch (design.headingStyle) {
      case 'underline':
        return 'font-bold uppercase tracking-wider text-black border-b-2 border-black pb-0.5 mb-2';
      case 'pill':
        return 'font-bold uppercase tracking-wider text-white px-3 py-1 rounded-full text-xs inline-block mb-2';
      case 'modern-left-border':
        return 'font-bold uppercase tracking-wider text-black border-l-4 border-gray-800 pl-2 mb-2';
      case 'minimal':
        return 'font-bold uppercase tracking-wider text-black mb-1';
      case 'shaded-bar':
      default:
        // Authentic Bangladeshi shaded grey heading block as in user image
        return 'font-bold uppercase tracking-wider text-white px-2 py-0.5 inline-block text-[13px] leading-tight mb-2';
    }
  };

  const getHeadingContainer = (title) => {
    const isShaded = !design.headingStyle || design.headingStyle === 'shaded-bar';
    const isPill = design.headingStyle === 'pill';
    const customBg = design.accentColor || '#4b5563';

    if (isShaded || isPill) {
      return (
        <div className="mb-2">
          <span 
            className={getHeadingStyle()}
            style={{ backgroundColor: customBg }}
          >
            {title}
          </span>
        </div>
      );
    }

    return (
      <div className="mb-2">
        <h3 className={getHeadingStyle()} style={design.headingStyle === 'modern-left-border' ? { borderColor: customBg } : {}}>
          {title}
        </h3>
      </div>
    );
  };

  // Font family class
  const getFontClass = () => {
    switch (design.fontFamily) {
      case 'Arial': return 'font-arial';
      case 'Georgia': return 'font-serif-classic';
      case 'Inter': return 'font-inter';
      case 'Roboto': return 'font-sans-modern';
      case 'Garamond': return 'font-garamond';
      case 'Times New Roman':
      default:
        return 'font-times';
    }
  };

  // Font size multiplier
  const getFontSizeClass = () => {
    switch (design.fontSize) {
      case 'small': return 'text-[12px] leading-relaxed';
      case 'large': return 'text-[14.5px] leading-relaxed';
      case 'medium':
      default:
        return 'text-[13.5px] leading-normal';
    }
  };

  return (
    <div className={`w-full bg-white text-black p-8 sm:p-12 print:p-0 ${getFontClass()} ${getFontSizeClass()} select-text`}>
      {/* Header Section */}
      <div className="relative mb-6 pb-2 text-center">
        {/* Optional Passport Photo */}
        {design.photo?.show && design.photo?.url && (
          <div 
            className={`absolute top-0 ${
              design.photo.position === 'top-left' ? 'left-0' : 
              design.photo.position === 'center' ? 'left-1/2 -translate-x-1/2 -top-12' : 'right-0'
            }`}
          >
            <div className={`overflow-hidden border border-black bg-gray-50 shadow-sm ${
              design.photo.shape === 'circle' ? 'rounded-full w-24 h-24' :
              design.photo.shape === 'square' ? 'w-24 h-24' : 'w-24 h-28' // passport 35x45 ratio
            }`}>
              <img 
                src={design.photo.url} 
                alt={personal.fullName || 'Passport Photo'} 
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        )}

        {/* Title: RESUM */}
        <h1 className="text-xl sm:text-2xl font-bold tracking-widest uppercase mb-0">
          {design.headerTitle || 'RESUM'}
        </h1>
        
        {/* "of" in italic script style */}
        <div className="italic text-base sm:text-lg my-0 font-serif">
          {design.headerSubtitle || 'of'}
        </div>

        {/* Candidate Full Name */}
        <h2 className="text-lg sm:text-xl font-bold tracking-wide uppercase mt-0 mb-1">
          {personal.fullName || 'MD. FULL NAME'}
        </h2>

        {/* Contact Numbers and Email */}
        <div className="text-[13px] leading-tight space-y-0.5">
          {personal.mobile && (
            <p className="font-medium">
              Mobile No: <span className="font-normal">{personal.mobile}</span>
            </p>
          )}
          {personal.email && (
            <p className="font-medium">
              E-mail: <span className="font-normal">{personal.email}</span>
            </p>
          )}
          {personal.address && (
            <p className="text-[12px] text-gray-700">
              {personal.address}
            </p>
          )}
        </div>
      </div>

      {/* Dynamic Sections */}
      <div className="space-y-4">
        {activeSections.map((sec) => (
          <div key={sec.id} className="break-inside-avoid">
            {getHeadingContainer(sec.title)}

            {/* Render based on section type */}

            {/* 1. Simple Text Block (Career Objective, Summary) */}
            {sec.type === 'text' && (
              <p className="text-justify leading-relaxed whitespace-pre-line pl-1 text-[13px]">
                {sec.content}
              </p>
            )}

            {/* 2. Educational Qualification List (Colon-aligned Bangladeshi style) */}
            {sec.type === 'education_list' && (
              <div className="space-y-4 pl-1 text-[13px]">
                {sec.items?.map((edu) => (
                  <div key={edu.id} className="leading-snug">
                    <div className="grid grid-cols-[180px_15px_1fr] items-start">
                      <span className="font-bold text-black">Name of Examination</span>
                      <span className="font-bold">:</span>
                      <span className="font-bold text-black">{edu.examName}</span>
                    </div>

                    {edu.department && (
                      <div className="grid grid-cols-[180px_15px_1fr] items-start">
                        <span className="text-black">Department</span>
                        <span>:</span>
                        <span className="text-black">{edu.department}</span>
                      </div>
                    )}

                    {edu.session && (
                      <div className="grid grid-cols-[180px_15px_1fr] items-start">
                        <span className="text-black">Session</span>
                        <span>:</span>
                        <span className="text-black">{edu.session}</span>
                      </div>
                    )}

                    {edu.gpa && (
                      <div className="grid grid-cols-[180px_15px_1fr] items-start">
                        <span className="text-black">GPA / CGPA</span>
                        <span>:</span>
                        <span className="text-black">{edu.gpa}</span>
                      </div>
                    )}

                    {edu.yearOfPassing && (
                      <div className="grid grid-cols-[180px_15px_1fr] items-start">
                        <span className="text-black">Year of Passing</span>
                        <span>:</span>
                        <span className="text-black">{edu.yearOfPassing}</span>
                      </div>
                    )}

                    {edu.institution && (
                      <div className="grid grid-cols-[180px_15px_1fr] items-start">
                        <span className="text-black">Name of Institution</span>
                        <span>:</span>
                        <span className="text-black">{edu.institution}</span>
                      </div>
                    )}

                    {edu.board && (
                      <div className="grid grid-cols-[180px_15px_1fr] items-start">
                        <span className="text-black">Board Name</span>
                        <span>:</span>
                        <span className="text-black">{edu.board}</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}

            {/* 3. Numbered Bullet List (Key Strengths, Interests, Computer Knowledge, Training) */}
            {sec.type === 'bullet_list' && (
              <ol className="list-none pl-1 space-y-1 text-[13px]">
                {sec.items?.map((item, idx) => (
                  <li key={idx} className="flex items-start">
                    <span className="inline-block w-5 font-normal">{idx + 1}.</span>
                    <span className="flex-1 text-black">{item}</span>
                  </li>
                ))}
              </ol>
            )}

            {/* 4. Language Proficiency Table (Grid Table with borders) */}
            {sec.type === 'table' && (
              <div className="pl-1 overflow-x-auto">
                <table className="w-full border-collapse border border-black text-center text-[12.5px]">
                  <thead>
                    <tr className="bg-gray-100">
                      {sec.headers?.map((h, i) => (
                        <th key={i} className="border border-black px-2 py-1 font-bold">
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {sec.rows?.map((row, rIdx) => (
                      <tr key={rIdx}>
                        {row.map((cell, cIdx) => (
                          <td 
                            key={cIdx} 
                            className={`border border-black px-2 py-1 ${cIdx === 0 ? 'text-left pl-3' : 'text-center'}`}
                          >
                            {cell}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* 5. Personal Information Grid (Standard Bangladeshi Colon Alignment) */}
            {sec.type === 'personal_info_grid' && (
              <div className="space-y-1 pl-1 text-[13px]">
                {sec.fields?.map((field, idx) => (
                  <div key={idx} className="grid grid-cols-[180px_15px_1fr] items-start">
                    <span className="font-normal text-black">{field.label}</span>
                    <span className="font-normal">:</span>
                    <span className="text-black whitespace-pre-line font-normal">{field.value}</span>
                  </div>
                ))}
              </div>
            )}

            {/* 6. References Box Grid (2-column framed box as in user image) */}
            {sec.type === 'reference_boxes' && (
              <div className="pl-1">
                <div className="grid grid-cols-1 sm:grid-cols-2 border border-black text-[12.5px]">
                  {sec.items?.map((ref, idx) => (
                    <div 
                      key={idx} 
                      className={`p-2.5 ${idx % 2 === 0 ? 'sm:border-r border-b sm:border-b-0 border-black' : ''}`}
                    >
                      <div className="font-bold flex items-start gap-1">
                        <span>{ref.number || `${idx + 1}.`}</span>
                        <span>{ref.name}</span>
                      </div>
                      {ref.designation && <div className="text-black pl-4">{ref.designation}</div>}
                      {ref.institution && <div className="text-black pl-4">{ref.institution}</div>}
                      {ref.contact && <div className="text-black pl-4">{ref.contact}</div>}
                      {ref.email && <div className="text-black pl-4">Email: {ref.email}</div>}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 7. Experience Cards (if used in BD layout) */}
            {sec.type === 'experience_cards' && (
              <div className="space-y-3 pl-1 text-[13px]">
                {sec.items?.map((exp) => (
                  <div key={exp.id}>
                    <div className="font-bold text-black">{exp.role} - {exp.company}</div>
                    <div className="text-xs text-gray-700 italic">{exp.period} | {exp.location}</div>
                    <ul className="list-disc pl-5 mt-1 space-y-0.5">
                      {exp.bullets?.map((b, bIdx) => (
                        <li key={bIdx}>{b}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            )}

            {/* 8. Declaration Section */}
            {sec.type === 'declaration' && (
              <div className="space-y-6 pl-1 text-[13px]">
                <p className="text-justify leading-relaxed">
                  {sec.text || design.declarationText}
                </p>

                {/* Signature line at the bottom left */}
                <div className="pt-6">
                  <div className="font-bold text-black text-sm">
                    {sec.signName || design.signatureText || personal.fullName}
                  </div>
                  <div className="text-gray-900 mt-1">
                    {sec.dateLabel || design.dateText || 'Date: ....................'}
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
