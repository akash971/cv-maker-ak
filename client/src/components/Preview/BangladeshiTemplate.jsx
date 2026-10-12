import React from 'react';
import { Phone, Mail, MapPin, Globe } from 'lucide-react';
import { LinkedinIcon, GithubIcon, WhatsAppIcon } from '../Common/Icons';
import { 
  cleanTextArtifacts, 
  cleanKeyValue, 
  parseMarkdownTableIfPresent, 
  parseKeyValueLines, 
  isLongOrAddressField 
} from '../../utils/cvPreProcessor';

export default function BangladeshiTemplate({ cvData, onSectionClick, activeSectionId }) {
  const { design = {}, personal = {}, sections = [] } = cvData || {};
  const activeSections = (sections || []).filter(s => s.enabled !== false);

  // Section heading style: 12pt - 14pt bold with distinct spacing or accents
  const getHeadingStyle = () => {
    switch (design.headingStyle) {
      case 'underline':
        return 'text-[12.5pt] font-bold uppercase tracking-wider text-black border-b-2 border-black pb-0.5 mb-2';
      case 'pill':
        return 'text-[11.5pt] font-bold uppercase tracking-wider text-white px-3 py-1 rounded-full inline-block mb-2';
      case 'modern-left-border':
        return 'text-[12.5pt] font-bold uppercase tracking-wider text-black border-l-4 border-gray-800 pl-2.5 mb-2';
      case 'minimal':
        return 'text-[12.5pt] font-bold uppercase tracking-wider text-black border-b border-gray-300 pb-0.5 mb-2';
      case 'shaded-bar':
      default:
        // Authentic Bangladeshi shaded dark bar
        return 'text-[12pt] font-bold uppercase tracking-wider text-white px-2.5 py-0.5 inline-block leading-snug mb-2';
    }
  };

  const getHeadingContainer = (title) => {
    const cleanTitle = cleanTextArtifacts(title || '');
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
            {cleanTitle}
          </span>
        </div>
      );
    }

    return (
      <div className="mb-2">
        <h3 
          className={getHeadingStyle()} 
          style={design.headingStyle === 'modern-left-border' ? { borderColor: customBg } : {}}
        >
          {cleanTitle}
        </h3>
      </div>
    );
  };

  // Primary Body Font: Calibri, Inter, Arial, or Roboto natively supported across platforms
  const getFontClass = () => {
    switch (design.fontFamily) {
      case 'Inter': return 'font-inter';
      case 'Arial': return 'font-arial';
      case 'Roboto': return 'font-roboto';
      case 'Times New Roman': return 'font-times';
      case 'Georgia': return 'font-serif-classic';
      case 'Garamond': return 'font-garamond';
      case 'Calibri':
      default:
        return 'font-calibri';
    }
  };

  // Font sizing & hierarchy: Body 10pt - 11pt, line-height 1.3 - 1.4
  const getFontSizeClass = () => {
    switch (design.fontSize) {
      case 'small': return 'text-[9.5pt] leading-[1.3]';
      case 'large': return 'text-[11pt] leading-[1.4]';
      case 'medium':
      default:
        return 'text-[10pt] leading-[1.35]';
    }
  };

  const headerAlignment = design.headerAlignment || 'center';
  const showHeaderTitle = design.showHeaderTitle !== false && !!design.headerTitle?.trim();
  const showHeaderSubtitle = design.showHeaderSubtitle !== false && !!design.headerSubtitle?.trim();
  const contactStyle = design.contactStyle || (design.showContactIcons !== false ? 'icons-inline' : 'classic-labels');

  const alignClass = 
    headerAlignment === 'left' ? 'text-left items-start' :
    headerAlignment === 'right' ? 'text-right items-end' : 'text-center items-center';

  const flexJustifyClass = 
    headerAlignment === 'left' ? 'justify-start' :
    headerAlignment === 'right' ? 'justify-end' : 'justify-center';

  const hasPhoto = !!(design.photo?.show && design.photo?.url);
  const photoPosition = design.photo?.position || 'top-right';
  const headerPaddingClass = 
    hasPhoto && photoPosition === 'top-right' && headerAlignment !== 'right' ? 'pr-28' :
    hasPhoto && photoPosition === 'top-left' && headerAlignment !== 'left' ? 'pl-28' : '';

  return (
    <div className={`w-full bg-white text-black p-8 sm:p-11 print:p-0 ${getFontClass()} ${getFontSizeClass()} select-text`}>
      {/* Main CV Header Container */}
      <header 
        data-section-id="personal"
        className={`main-cv-header mb-6 pb-2 interactive-preview-section ${
          activeSectionId === 'personal' ? 'active-focused-section' : ''
        }`}
        title="Click to edit Personal Info & Contacts"
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          paddingTop: '24px',
          marginTop: '20px'
        }}
      >
        {/* Left Column: Candidate Name (<h1>) & Contact Details */}
        <div className="flex flex-col items-start text-left flex-1 min-w-0 pr-4">
          {/* Optional Main Title (CURRICULUM VITAE) */}
          {showHeaderTitle && (
            <div className="text-[12pt] sm:text-[13pt] font-bold tracking-widest uppercase mb-0.5 leading-tight text-black">
              {cleanTextArtifacts(design.headerTitle)}
            </div>
          )}
          
          {/* Optional Subtitle ("of") */}
          {showHeaderSubtitle && (
            <div className="italic text-[10.5pt] sm:text-[11pt] mb-1 font-serif leading-none text-black">
              {cleanTextArtifacts(design.headerSubtitle)}
            </div>
          )}

          {/* Candidate Full Name (<h1> with margin-bottom: 4px) */}
          <h1 
            data-field-key="fullName"
            className="text-[16pt] sm:text-[18pt] font-extrabold tracking-wide uppercase leading-tight text-black"
            style={{ marginBottom: '4px' }}
          >
            {cleanTextArtifacts(personal.fullName || 'MD. FULL NAME')}
          </h1>

          {/* Optional Job Title */}
          {personal.jobTitle && (
            <div 
              data-field-key="jobTitle"
              className="text-[10pt] font-semibold text-gray-800 mb-1 leading-tight"
            >
              {cleanTextArtifacts(personal.jobTitle)}
            </div>
          )}

          {/* Compact Contact Details (Phone, Email, etc. packed with gap: 4px / margin: 2px 0) */}
          {contactStyle === 'icons-inline' ? (
            <div 
              className="flex flex-wrap items-center gap-x-4 text-[9.5pt] text-black"
              style={{ gap: '4px' }}
            >
              {personal.mobile && (
                <div data-field-key="mobile" className="inline-flex items-center gap-1.5 cursor-pointer" style={{ margin: '2px 0' }}>
                  <Phone className="w-3.5 h-3.5 shrink-0 text-black" />
                  <span>{cleanTextArtifacts(personal.mobile)}</span>
                </div>
              )}
              {personal.whatsapp && (
                <div data-field-key="whatsapp" className="inline-flex items-center gap-1.5 cursor-pointer" style={{ margin: '2px 0' }}>
                  <WhatsAppIcon className="w-3.5 h-3.5 shrink-0 text-emerald-700" />
                  <span>{cleanTextArtifacts(personal.whatsapp)}</span>
                </div>
              )}
              {personal.email && (
                <div data-field-key="email" className="inline-flex items-center gap-1.5 cursor-pointer" style={{ margin: '2px 0' }}>
                  <Mail className="w-3.5 h-3.5 shrink-0 text-black" />
                  <span>{cleanTextArtifacts(personal.email)}</span>
                </div>
              )}
              {personal.address && (
                <div data-field-key="address" className="inline-flex items-center gap-1.5 cursor-pointer" style={{ margin: '2px 0' }}>
                  <MapPin className="w-3.5 h-3.5 shrink-0 text-black" />
                  <span>{cleanTextArtifacts(personal.address)}</span>
                </div>
              )}
              {personal.linkedin && (
                <div data-field-key="linkedin" className="inline-flex items-center gap-1.5 cursor-pointer" style={{ margin: '2px 0' }}>
                  <LinkedinIcon className="w-3.5 h-3.5 shrink-0 text-blue-800" />
                  <span>{cleanTextArtifacts(personal.linkedin)}</span>
                </div>
              )}
              {personal.github && (
                <div data-field-key="github" className="inline-flex items-center gap-1.5 cursor-pointer" style={{ margin: '2px 0' }}>
                  <GithubIcon className="w-3.5 h-3.5 shrink-0 text-black" />
                  <span>{cleanTextArtifacts(personal.github)}</span>
                </div>
              )}
              {personal.website && (
                <div data-field-key="website" className="inline-flex items-center gap-1.5 cursor-pointer" style={{ margin: '2px 0' }}>
                  <Globe className="w-3.5 h-3.5 shrink-0 text-black" />
                  <span>{cleanTextArtifacts(personal.website)}</span>
                </div>
              )}
            </div>
          ) : (
            <div 
              className="flex flex-col items-start text-[9.5pt] leading-tight text-black"
              style={{ gap: '4px' }}
            >
              {personal.mobile && (
                <div data-field-key="mobile" className="flex items-center gap-1.5" style={{ margin: '2px 0' }}>
                  <Phone className="w-3.5 h-3.5 shrink-0 text-black" />
                  <span>{cleanTextArtifacts(personal.mobile)}</span>
                </div>
              )}
              {personal.whatsapp && (
                <div data-field-key="whatsapp" className="flex items-center gap-1.5" style={{ margin: '2px 0' }}>
                  <WhatsAppIcon className="w-3.5 h-3.5 shrink-0 text-emerald-700" />
                  <span>{cleanTextArtifacts(personal.whatsapp)}</span>
                </div>
              )}
              {personal.email && (
                <div data-field-key="email" className="flex items-center gap-1.5" style={{ margin: '2px 0' }}>
                  <Mail className="w-3.5 h-3.5 shrink-0 text-black" />
                  <span>{cleanTextArtifacts(personal.email)}</span>
                </div>
              )}
              {personal.address && (
                <div data-field-key="address" className="flex items-center gap-1.5" style={{ margin: '2px 0' }}>
                  <MapPin className="w-3.5 h-3.5 shrink-0 text-black" />
                  <span>{cleanTextArtifacts(personal.address)}</span>
                </div>
              )}
              {personal.linkedin && (
                <div data-field-key="linkedin" className="flex items-center gap-1.5" style={{ margin: '2px 0' }}>
                  <LinkedinIcon className="w-3.5 h-3.5 shrink-0 text-blue-800" />
                  <span>{cleanTextArtifacts(personal.linkedin)}</span>
                </div>
              )}
              {personal.github && (
                <div data-field-key="github" className="flex items-center gap-1.5" style={{ margin: '2px 0' }}>
                  <GithubIcon className="w-3.5 h-3.5 shrink-0 text-black" />
                  <span>{cleanTextArtifacts(personal.github)}</span>
                </div>
              )}
              {personal.website && (
                <div data-field-key="website" className="flex items-center gap-1.5" style={{ margin: '2px 0' }}>
                  <Globe className="w-3.5 h-3.5 shrink-0 text-black" />
                  <span>{cleanTextArtifacts(personal.website)}</span>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Right Column: Properly Sized & Right-Aligned Profile Image Container */}
        {hasPhoto && (
          <div data-field-key="photo" className="shrink-0 ml-4 self-center cursor-pointer" title="Click to edit Photo">
            <div 
              className={`overflow-hidden border border-black bg-gray-50 shadow-xs ${
                design.photo.shape === 'circle' ? 'rounded-full w-24 h-24' :
                design.photo.shape === 'square' ? 'w-24 h-24' : 'w-24 h-28' // passport 35x45 ratio
              }`}
            >
              <img 
                src={design.photo.url} 
                alt={cleanTextArtifacts(personal.fullName || 'Passport Photo')} 
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        )}
      </header>

      {/* Dynamic Sections with Clean Spacing & Consistent Flow */}
      <div className="space-y-4">
        {activeSections.map((sec) => (
          <section 
            key={sec.id} 
            data-section-id={sec.id}
            className={`mb-4 last:mb-0 break-inside-avoid section-container interactive-preview-section ${
              activeSectionId === sec.id ? 'active-focused-section' : ''
            }`}
            title={`Click to edit "${cleanTextArtifacts(sec.title || 'this section')}" in the left panel`}
          >
            {getHeadingContainer(sec.title)}

            {/* 1. Simple Text Block or Parsed Key-Value / Markdown Table */}
            {sec.type === 'text' && (() => {
              const rawText = sec.content || '';
              // Check if raw text actually has a markdown table
              const mdTable = parseMarkdownTableIfPresent(rawText);
              if (mdTable) {
                return (
                  <div className="pl-0.5 overflow-x-auto">
                    <table className="w-full border-collapse border border-black text-center text-[9.5pt]">
                      <thead>
                        <tr className="bg-gray-100">
                          {mdTable.headers.map((h, i) => (
                            <th key={i} className="border border-black px-2 py-1 font-bold text-black">
                              {cleanTextArtifacts(h)}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {mdTable.rows.map((row, rIdx) => (
                          <tr key={rIdx}>
                            {row.map((cell, cIdx) => (
                              <td 
                                key={cIdx} 
                                className={`border border-black px-2 py-1 text-black ${cIdx === 0 ? 'text-left pl-3' : 'text-center'}`}
                              >
                                {cleanTextArtifacts(cell)}
                              </td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                );
              }

              // Check if raw text has pipe/colon aligned key-value lines
              const kvPairs = parseKeyValueLines(rawText);
              if (kvPairs) {
                return (
                  <div className="space-y-0.5 pl-0.5 text-[10pt]">
                    {kvPairs.map((pair, pIdx) => (
                      <div key={pIdx} className="grid grid-cols-[165px_16px_1fr] items-start py-0.5">
                        <span className="font-semibold text-black">{cleanTextArtifacts(pair.label)}</span>
                        <span className="font-bold text-black text-center">:</span>
                        <span className="text-black font-normal">{cleanTextArtifacts(pair.value)}</span>
                      </div>
                    ))}
                  </div>
                );
              }

              return (
                <p className="text-justify leading-[1.35] whitespace-pre-line pl-0.5 text-[10pt] text-black">
                  {cleanTextArtifacts(rawText)}
                </p>
              );
            })()}

            {/* 2. Educational Qualification List (Colon-aligned Bangladeshi style without artifacts) */}
            {sec.type === 'education_list' && (
              <div className="space-y-3.5 pl-0.5">
                {sec.items?.map((edu, eduIdx) => {
                  const rows = [
                    edu.examName && { label: 'Name of Examination', value: edu.examName, isPrimary: true },
                    edu.department && { label: 'Department / Group', value: edu.department },
                    edu.institution && { label: 'Name of Institution', value: edu.institution },
                    edu.board && { label: 'Board Name', value: edu.board },
                    edu.session && { label: 'Session', value: edu.session },
                    edu.yearOfPassing && { label: 'Year of Passing', value: edu.yearOfPassing },
                    edu.gpa && { label: 'GPA / CGPA', value: edu.gpa },
                  ].filter(Boolean);

                  return (
                    <div key={edu.id || eduIdx} className="leading-snug break-inside-avoid">
                      {rows.map((row, rIdx) => {
                        const { label, value } = cleanKeyValue(row.label, row.value);
                        return (
                          <div key={rIdx} className="grid grid-cols-[165px_16px_1fr] items-start py-0.5">
                            <span className={`text-black ${row.isPrimary ? 'font-bold' : 'font-normal'}`}>
                              {label}
                            </span>
                            <span className="font-bold text-black text-center">:</span>
                            <span className={`text-black ${row.isPrimary ? 'font-bold' : 'font-normal'}`}>
                              {value}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  );
                })}
              </div>
            )}

            {/* 3. Numbered Bullet List (Key Strengths, Interests, Computer Knowledge, Training) */}
            {sec.type === 'bullet_list' && (
              <ol className="list-none pl-0.5 space-y-1 text-[10pt] leading-[1.35]">
                {sec.items?.map((item, idx) => {
                  const cleanItem = cleanTextArtifacts(item);
                  if (!cleanItem) return null;
                  return (
                    <li key={idx} className="flex items-start">
                      <span className="inline-block w-5.5 font-normal shrink-0 text-black">{idx + 1}.</span>
                      <span className="flex-1 text-black">{cleanItem}</span>
                    </li>
                  );
                })}
              </ol>
            )}

            {/* 4. Language Proficiency Table (Grid Table with Clean Borders, Zero Markdown Artifacts) */}
            {sec.type === 'table' && (
              <div className="pl-0.5 overflow-x-auto">
                <table className="w-full border-collapse border border-black text-center text-[9.5pt]">
                  <thead>
                    <tr className="bg-gray-100">
                      {sec.headers?.map((h, i) => (
                        <th key={i} className="border border-black px-2.5 py-1 font-bold text-black">
                          {cleanTextArtifacts(h)}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {sec.rows
                      ?.filter(row => !row.every(cell => /^\|?[\s:-|]+\|?$/.test(String(cell || '').trim())))
                      ?.map((row, rIdx) => (
                        <tr key={rIdx}>
                          {row.map((cell, cIdx) => (
                            <td 
                              key={cIdx} 
                              className={`border border-black px-2.5 py-1 text-black ${cIdx === 0 ? 'text-left pl-3' : 'text-center'}`}
                            >
                              {cleanTextArtifacts(cell)}
                            </td>
                          ))}
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* 5. Personal Information Two-Column Grid (Compact & Perfectly Aligned) */}
            {sec.type === 'personal_info_grid' && (
              <div className="grid grid-cols-1 md:grid-cols-2 print:grid-cols-2 gap-x-6 gap-y-1 text-[10pt] pl-0.5 leading-snug">
                {sec.fields?.map((field, idx) => {
                  const { label, value } = cleanKeyValue(field.label, field.value);
                  if (!label && !value) return null;
                  const isFullWidth = isLongOrAddressField({ label, value });
                  return (
                    <div 
                      key={idx} 
                      className={`grid grid-cols-[115px_14px_1fr] items-start ${
                        isFullWidth ? 'col-span-full md:col-span-2 print:col-span-2' : ''
                      }`}
                    >
                      <span className="font-normal text-black">{label}</span>
                      <span className="font-normal text-black text-center">:</span>
                      <span className="text-black whitespace-pre-line font-normal">{value}</span>
                    </div>
                  );
                })}
              </div>
            )}

            {/* 6. References Box Grid (2-column framed box) */}
            {sec.type === 'reference_boxes' && (
              <div className="pl-0.5">
                <div className="grid grid-cols-1 sm:grid-cols-2 border border-black text-[9.5pt]">
                  {sec.items?.map((ref, idx) => (
                    <div 
                      key={idx} 
                      className={`p-2.5 ${idx % 2 === 0 ? 'sm:border-r border-b sm:border-b-0 border-black' : ''}`}
                    >
                      <div className="font-bold flex items-start gap-1 text-black">
                        <span>{cleanTextArtifacts(ref.number || `${idx + 1}.`)}</span>
                        <span>{cleanTextArtifacts(ref.name)}</span>
                      </div>
                      {ref.designation && <div className="text-black pl-4">{cleanTextArtifacts(ref.designation)}</div>}
                      {ref.institution && <div className="text-black pl-4">{cleanTextArtifacts(ref.institution)}</div>}
                      {ref.contact && <div className="text-black pl-4">{cleanTextArtifacts(ref.contact)}</div>}
                      {ref.email && <div className="text-black pl-4">Email: {cleanTextArtifacts(ref.email)}</div>}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 7. Experience Cards */}
            {sec.type === 'experience_cards' && (
              <div className="space-y-3 pl-0.5 text-[10pt]">
                {sec.items?.map((exp) => (
                  <div key={exp.id} className="leading-snug">
                    <div className="font-bold text-black">{cleanTextArtifacts(exp.role)} - {cleanTextArtifacts(exp.company)}</div>
                    <div className="text-[9pt] text-gray-700 italic">{cleanTextArtifacts(exp.period)} | {cleanTextArtifacts(exp.location)}</div>
                    <ul className="list-disc pl-5 mt-1 space-y-0.5">
                      {exp.bullets?.map((b, bIdx) => (
                        <li key={bIdx} className="text-black">{cleanTextArtifacts(b)}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            )}

            {/* 8. Skill Badges (if present when switched from International) */}
            {sec.type === 'skill_badges' && (
              <div className="space-y-2.5 pl-0.5 text-[10pt]">
                {sec.categories?.map((cat, idx) => (
                  <div key={idx} className="flex flex-col sm:flex-row sm:items-start gap-1">
                    {cat.name && (
                      <span className="font-bold text-black min-w-[150px] shrink-0">
                        {cleanTextArtifacts(cat.name)}:
                      </span>
                    )}
                    <div className="flex flex-wrap gap-1.5 flex-1">
                      {cat.skills?.map((skill, sIdx) => (
                        <span 
                          key={sIdx} 
                          className="px-2 py-0.5 bg-gray-100 text-black border border-gray-300 rounded text-[9.5pt]"
                        >
                          {cleanTextArtifacts(skill)}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* 9. Education Cards (if present when switched from International) */}
            {sec.type === 'education_cards' && (
              <div className="space-y-3 pl-0.5 text-[10pt]">
                {sec.items?.map((edu) => (
                  <div key={edu.id} className="leading-snug">
                    <div className="grid grid-cols-[165px_16px_1fr] items-start py-0.5">
                      <span className="font-bold text-black">Degree / Exam</span>
                      <span className="font-bold text-black text-center">:</span>
                      <span className="font-bold text-black">{cleanTextArtifacts(edu.degree)}</span>
                    </div>
                    {edu.institution && (
                      <div className="grid grid-cols-[165px_16px_1fr] items-start py-0.5">
                        <span className="text-black">Institution</span>
                        <span className="font-bold text-black text-center">:</span>
                        <span className="text-black">
                          {cleanTextArtifacts(edu.institution)} {edu.location ? `(${cleanTextArtifacts(edu.location)})` : ''}
                        </span>
                      </div>
                    )}
                    {edu.period && (
                      <div className="grid grid-cols-[165px_16px_1fr] items-start py-0.5">
                        <span className="text-black">Year / Period</span>
                        <span className="font-bold text-black text-center">:</span>
                        <span className="text-black">{cleanTextArtifacts(edu.period)}</span>
                      </div>
                    )}
                    {edu.gpa && (
                      <div className="grid grid-cols-[165px_16px_1fr] items-start py-0.5">
                        <span className="text-black">GPA / Result</span>
                        <span className="font-bold text-black text-center">:</span>
                        <span className="text-black">{cleanTextArtifacts(edu.gpa)}</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}

            {/* 10. Declaration Section: Cleanly Anchored with Signature Block (Never Orphaned) */}
            {sec.type === 'declaration' && (
              <div className="declaration-signature-block break-inside-avoid mt-4 pt-1 space-y-3 pl-0.5">
                <p className="text-justify leading-[1.35] text-[10pt] text-black">
                  {cleanTextArtifacts(sec.text || design.declarationText)}
                </p>

                {/* Signature and Date Line anchored at bottom without awkward breaks */}
                <div className="pt-5 flex justify-between items-end break-inside-avoid">
                  <div className="space-y-1">
                    <div className="text-[10pt] text-black font-medium">
                      {cleanTextArtifacts(sec.dateLabel || design.dateText || 'Date: ....................')}
                    </div>
                  </div>
                  <div className="text-center min-w-[170px]">
                    {design.showSignatureLine !== false && (
                      <div className="border-t border-black w-36 mx-auto mb-1" />
                    )}
                    <div className="font-bold text-black text-[10.5pt]">
                      {cleanTextArtifacts(sec.signName || design.signatureText || personal.fullName)}
                    </div>
                    <div className="text-[8.5pt] text-gray-700 italic">
                      (Signature)
                    </div>
                  </div>
                </div>
              </div>
            )}
          </section>
        ))}
      </div>
    </div>
  );
}
