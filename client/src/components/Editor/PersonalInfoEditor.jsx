import React, { useRef } from 'react';
import { 
  User, 
  Phone, 
  Mail, 
  MapPin, 
  Image, 
  Upload, 
  Trash2, 
  Globe, 
  AlignLeft, 
  AlignCenter, 
  AlignRight, 
  Eye, 
  EyeOff, 
  Briefcase
} from 'lucide-react';
import { LinkedinIcon, GithubIcon, WhatsAppIcon } from '../Common/Icons';

export default function PersonalInfoEditor({ cvData, setCvData }) {
  const fileInputRef = useRef(null);
  const personal = cvData.personal || {};
  const design = cvData.design || {};
  const photo = design.photo || {};

  const updatePersonal = (field, value) => {
    setCvData(prev => ({
      ...prev,
      personal: {
        ...prev.personal,
        [field]: value
      }
    }));
  };

  const updateDesign = (field, value) => {
    setCvData(prev => ({
      ...prev,
      design: {
        ...prev.design,
        [field]: value
      }
    }));
  };

  const updatePhoto = (field, value) => {
    setCvData(prev => ({
      ...prev,
      design: {
        ...prev.design,
        photo: {
          ...prev.design?.photo,
          [field]: value
        }
      }
    }));
  };

  const handlePhotoUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Please select a valid image file (JPG, PNG, WebP).');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result;
      if (!dataUrl) return;

      // Optimize image resolution for passport photo usage to protect localStorage quota
      const img = new Image();
      img.onload = () => {
        try {
          const maxDim = 800; // Optimal for sharp 300DPI passport printing
          let width = img.width;
          let height = img.height;

          if (width > maxDim || height > maxDim) {
            if (width > height) {
              height = Math.round((height * maxDim) / width);
              width = maxDim;
            } else {
              width = Math.round((width * maxDim) / height);
              height = maxDim;
            }
          }

          const canvas = document.createElement('canvas');
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0, width, height);

          const mimeType = file.type === 'image/png' ? 'image/png' : 'image/jpeg';
          const optimizedBase64 = canvas.toDataURL(mimeType, 0.9);

          setCvData(prev => ({
            ...prev,
            design: {
              ...prev.design,
              photo: {
                ...prev.design?.photo,
                url: optimizedBase64,
                show: true
              }
            }
          }));
        } catch (err) {
          // Direct fallback to raw Base64 data URL
          setCvData(prev => ({
            ...prev,
            design: {
              ...prev.design,
              photo: {
                ...prev.design?.photo,
                url: dataUrl,
                show: true
              }
            }
          }));
        }
      };

      img.onerror = () => {
        setCvData(prev => ({
          ...prev,
          design: {
            ...prev.design,
            photo: {
              ...prev.design?.photo,
              url: dataUrl,
              show: true
            }
          }
        }));
      };

      img.src = dataUrl;
    };

    reader.onerror = () => {
      alert('Failed to read image file.');
    };

    reader.readAsDataURL(file);
    e.target.value = '';
  };

  const headerAlignment = design.headerAlignment || 'center';
  const showHeaderTitle = design.showHeaderTitle !== false && (design.headerTitle !== '' || design.showHeaderTitle === true);
  const showHeaderSubtitle = design.showHeaderSubtitle !== false && (design.headerSubtitle !== '' || design.showHeaderSubtitle === true);
  const contactStyle = design.contactStyle || (design.showContactIcons !== false ? 'icons-inline' : 'classic-labels');

  return (
    <div className="space-y-4">
      {/* Friendly Guide Banner */}
      <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 flex items-start gap-2.5 text-xs text-amber-900">
        <span className="text-base">👤</span>
        <div>
          <span className="font-bold">Step 1: Customize Your Header & Contacts!</span>
          <p className="text-amber-700 mt-0.5">
            You can align your header (Left / Center / Right), remove titles as you wish, and display modern icons for phone, email & social media!
          </p>
        </div>
      </div>

      {/* 1. Header Alignment & Removable Titles Card */}
      <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
            <span>📐 Header Alignment (Left to Right)</span>
          </span>
          <span className="text-[10px] text-slate-500 font-medium">Move as you wish</span>
        </div>

        {/* Alignment Segmented Buttons */}
        <div className="grid grid-cols-3 gap-1.5 bg-slate-200/80 p-1 rounded-xl">
          <button
            type="button"
            onClick={() => updateDesign('headerAlignment', 'left')}
            className={`py-1.5 px-2 rounded-lg text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer ${
              headerAlignment === 'left' 
                ? 'bg-white text-blue-700 shadow-xs' 
                : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
            }`}
          >
            <AlignLeft className="w-3.5 h-3.5" />
            <span>Left Align</span>
          </button>

          <button
            type="button"
            onClick={() => updateDesign('headerAlignment', 'center')}
            className={`py-1.5 px-2 rounded-lg text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer ${
              headerAlignment === 'center' 
                ? 'bg-white text-blue-700 shadow-xs' 
                : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
            }`}
          >
            <AlignCenter className="w-3.5 h-3.5" />
            <span>Center</span>
          </button>

          <button
            type="button"
            onClick={() => updateDesign('headerAlignment', 'right')}
            className={`py-1.5 px-2 rounded-lg text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer ${
              headerAlignment === 'right' 
                ? 'bg-white text-blue-700 shadow-xs' 
                : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
            }`}
          >
            <AlignRight className="w-3.5 h-3.5" />
            <span>Right Align</span>
          </button>
        </div>

        {/* Removable Title & Subtitle Options */}
        <div className="space-y-2.5 pt-1 border-t border-slate-200">
          {/* Main Title ("CURRICULUM VITAE") */}
          <div className="space-y-1">
            <div className="flex items-center justify-between text-[11px] font-semibold text-slate-700">
              <span className="flex items-center gap-1">
                <span>Top Main Title</span>
                <span className="text-slate-400 font-normal">(e.g. CURRICULUM VITAE / RESUM)</span>
              </span>
              <button
                type="button"
                onClick={() => updateDesign('showHeaderTitle', !showHeaderTitle)}
                className={`flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded cursor-pointer transition ${
                  showHeaderTitle ? 'text-rose-600 hover:bg-rose-50' : 'text-emerald-700 hover:bg-emerald-50'
                }`}
              >
                {showHeaderTitle ? (
                  <>
                    <EyeOff className="w-3 h-3" />
                    <span>Remove / Hide</span>
                  </>
                ) : (
                  <>
                    <Eye className="w-3 h-3" />
                    <span>Show Title</span>
                  </>
                )}
              </button>
            </div>

            {showHeaderTitle && (
              <div className="flex items-center gap-1.5">
                <input
                  type="text"
                  value={design.headerTitle ?? 'CURRICULUM VITAE'}
                  onChange={(e) => updateDesign('headerTitle', e.target.value)}
                  placeholder="e.g. CURRICULUM VITAE or RESUM"
                  className="flex-1 text-xs px-2.5 py-1.5 rounded-lg border border-slate-300 bg-white font-bold"
                />
                <button
                  type="button"
                  onClick={() => {
                    updateDesign('headerTitle', '');
                    updateDesign('showHeaderTitle', false);
                  }}
                  className="text-xs text-rose-500 hover:text-rose-700 px-2 py-1.5 border border-slate-200 rounded-lg hover:bg-rose-50 transition"
                  title="Completely remove title"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            )}
          </div>

          {/* Subtitle / Connective ("of") */}
          <div className="space-y-1">
            <div className="flex items-center justify-between text-[11px] font-semibold text-slate-700">
              <span className="flex items-center gap-1">
                <span>Connective Subtitle</span>
                <span className="text-slate-400 font-normal">(e.g. "of")</span>
              </span>
              <button
                type="button"
                onClick={() => updateDesign('showHeaderSubtitle', !showHeaderSubtitle)}
                className={`flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded cursor-pointer transition ${
                  showHeaderSubtitle ? 'text-rose-600 hover:bg-rose-50' : 'text-emerald-700 hover:bg-emerald-50'
                }`}
              >
                {showHeaderSubtitle ? (
                  <>
                    <EyeOff className="w-3 h-3" />
                    <span>Remove / Hide</span>
                  </>
                ) : (
                  <>
                    <Eye className="w-3 h-3" />
                    <span>Show Subtitle</span>
                  </>
                )}
              </button>
            </div>

            {showHeaderSubtitle && (
              <div className="flex items-center gap-1.5">
                <input
                  type="text"
                  value={design.headerSubtitle ?? 'of'}
                  onChange={(e) => updateDesign('headerSubtitle', e.target.value)}
                  placeholder="e.g. of"
                  className="flex-1 text-xs px-2.5 py-1.5 rounded-lg border border-slate-300 bg-white italic font-serif"
                />
                <button
                  type="button"
                  onClick={() => {
                    updateDesign('headerSubtitle', '');
                    updateDesign('showHeaderSubtitle', false);
                  }}
                  className="text-xs text-rose-500 hover:text-rose-700 px-2 py-1.5 border border-slate-200 rounded-lg hover:bg-rose-50 transition"
                  title="Completely remove subtitle"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 2. Contact Display Style & Icons Options Card */}
      <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
            <span>✨ Contact & Social Icons Option</span>
          </span>
          <span className="text-[10px] text-blue-600 font-semibold">Phone, Email, Social</span>
        </div>

        {/* Contact Format Selector */}
        <div className="grid grid-cols-3 gap-1.5 bg-slate-200/80 p-1 rounded-xl text-xs">
          <button
            type="button"
            onClick={() => {
              updateDesign('contactStyle', 'icons-inline');
              updateDesign('showContactIcons', true);
            }}
            className={`py-1.5 px-2 rounded-lg font-bold transition flex flex-col items-center justify-center text-center cursor-pointer ${
              contactStyle === 'icons-inline' 
                ? 'bg-white text-blue-700 shadow-xs' 
                : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
            }`}
          >
            <span>🏷️ Icons Bar</span>
            <span className="text-[9.5px] font-normal text-slate-500">Horizontal bar</span>
          </button>

          <button
            type="button"
            onClick={() => {
              updateDesign('contactStyle', 'icons-stacked');
              updateDesign('showContactIcons', true);
            }}
            className={`py-1.5 px-2 rounded-lg font-bold transition flex flex-col items-center justify-center text-center cursor-pointer ${
              contactStyle === 'icons-stacked' 
                ? 'bg-white text-blue-700 shadow-xs' 
                : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
            }`}
          >
            <span>📋 Icons Stacked</span>
            <span className="text-[9.5px] font-normal text-slate-500">Row-by-row</span>
          </button>

          <button
            type="button"
            onClick={() => {
              updateDesign('contactStyle', 'classic-labels');
              updateDesign('showContactIcons', false);
            }}
            className={`py-1.5 px-2 rounded-lg font-bold transition flex flex-col items-center justify-center text-center cursor-pointer ${
              contactStyle === 'classic-labels' 
                ? 'bg-white text-blue-700 shadow-xs' 
                : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
            }`}
          >
            <span>🔤 Classic Text</span>
            <span className="text-[9.5px] font-normal text-slate-500">Mobile No: ...</span>
          </button>
        </div>

        <div className="flex items-center justify-between text-xs pt-1 border-t border-slate-200">
          <span className="text-slate-600 font-medium">Show Icons for Contacts</span>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={design.showContactIcons !== false && contactStyle !== 'classic-labels'}
              onChange={(e) => {
                const checked = e.target.checked;
                updateDesign('showContactIcons', checked);
                if (checked && contactStyle === 'classic-labels') {
                  updateDesign('contactStyle', 'icons-inline');
                } else if (!checked) {
                  updateDesign('contactStyle', 'classic-labels');
                }
              }}
              className="sr-only peer"
            />
            <div className="w-8 h-4.5 bg-slate-300 peer-focus:outline-hidden rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-3.5 after:w-3.5 after:transition-all peer-checked:bg-blue-600"></div>
          </label>
        </div>
      </div>

      {/* 3. Candidate Full Name & Profession */}
      <div className="space-y-3">
        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center gap-1.5">
            <User className="w-3.5 h-3.5 text-blue-600" />
            <span>Full Name (Prominent on CV)</span>
          </label>
          <input
            id="field-fullName"
            data-field-key="fullName"
            type="text"
            value={personal.fullName || ''}
            onChange={(e) => updatePersonal('fullName', e.target.value)}
            placeholder="e.g. MOLLA KHAIRUJJAMAN AKASH"
            className="w-full text-sm px-3 py-2 rounded-xl border border-slate-300 bg-white focus:ring-2 focus:ring-blue-400 focus:outline-hidden font-bold transition-all"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center gap-1.5">
            <Briefcase className="w-3.5 h-3.5 text-slate-500" />
            <span>Job Title / Profession (Optional)</span>
          </label>
          <input
            id="field-jobTitle"
            data-field-key="jobTitle"
            type="text"
            value={personal.jobTitle || ''}
            onChange={(e) => updatePersonal('jobTitle', e.target.value)}
            placeholder="e.g. Software Engineer / Diploma Engineer"
            className="w-full text-xs px-3 py-2 rounded-xl border border-slate-300 bg-white focus:ring-2 focus:ring-blue-400 focus:outline-hidden transition-all"
          />
        </div>
      </div>

      {/* 4. Contact Numbers & Social Media Details */}
      <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 space-y-3">
        <div className="text-xs font-bold text-slate-800 flex items-center justify-between">
          <span>📞 Contact & Social Media Information</span>
          <span className="text-[10px] text-slate-500 font-normal">All fields support icons</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          {/* Mobile No */}
          <div>
            <label className="block text-[11px] font-bold text-slate-700 mb-1 flex items-center gap-1.5">
              <Phone className="w-3 h-3 text-emerald-600" />
              <span>Mobile Number</span>
            </label>
            <input
              id="field-mobile"
              data-field-key="mobile"
              type="text"
              value={personal.mobile || ''}
              onChange={(e) => updatePersonal('mobile', e.target.value)}
              placeholder="e.g. 01303948891"
              className="w-full text-xs px-2.5 py-1.5 rounded-lg border border-slate-300 bg-white focus:outline-blue-500 transition-all"
            />
          </div>

          {/* WhatsApp Number */}
          <div>
            <label className="block text-[11px] font-bold text-slate-700 mb-1 flex items-center gap-1.5">
              <WhatsAppIcon className="w-3 h-3 text-emerald-600" />
              <span>WhatsApp (Optional)</span>
            </label>
            <input
              id="field-whatsapp"
              data-field-key="whatsapp"
              type="text"
              value={personal.whatsapp || ''}
              onChange={(e) => updatePersonal('whatsapp', e.target.value)}
              placeholder="e.g. +8801303948891"
              className="w-full text-xs px-2.5 py-1.5 rounded-lg border border-slate-300 bg-white focus:outline-blue-500 transition-all"
            />
          </div>

          {/* Email Address */}
          <div>
            <label className="block text-[11px] font-bold text-slate-700 mb-1 flex items-center gap-1.5">
              <Mail className="w-3 h-3 text-rose-500" />
              <span>E-mail Address</span>
            </label>
            <input
              id="field-email"
              data-field-key="email"
              type="email"
              value={personal.email || ''}
              onChange={(e) => updatePersonal('email', e.target.value)}
              placeholder="e.g. khairujjaman.999@gmail.com"
              className="w-full text-xs px-2.5 py-1.5 rounded-lg border border-slate-300 bg-white focus:outline-blue-500 transition-all"
            />
          </div>

          {/* LinkedIn Profile */}
          <div>
            <label className="block text-[11px] font-bold text-slate-700 mb-1 flex items-center gap-1.5">
              <LinkedinIcon className="w-3 h-3 text-blue-600" />
              <span>LinkedIn Profile</span>
            </label>
            <input
              id="field-linkedin"
              data-field-key="linkedin"
              type="text"
              value={personal.linkedin || ''}
              onChange={(e) => updatePersonal('linkedin', e.target.value)}
              placeholder="e.g. linkedin.com/in/yourname"
              className="w-full text-xs px-2.5 py-1.5 rounded-lg border border-slate-300 bg-white focus:outline-blue-500 transition-all"
            />
          </div>

          {/* GitHub Profile */}
          <div>
            <label className="block text-[11px] font-bold text-slate-700 mb-1 flex items-center gap-1.5">
              <GithubIcon className="w-3 h-3 text-slate-800" />
              <span>GitHub Profile</span>
            </label>
            <input
              id="field-github"
              data-field-key="github"
              type="text"
              value={personal.github || ''}
              onChange={(e) => updatePersonal('github', e.target.value)}
              placeholder="e.g. github.com/yourname"
              className="w-full text-xs px-2.5 py-1.5 rounded-lg border border-slate-300 bg-white focus:outline-blue-500 transition-all"
            />
          </div>

          {/* Website / Portfolio */}
          <div>
            <label className="block text-[11px] font-bold text-slate-700 mb-1 flex items-center gap-1.5">
              <Globe className="w-3 h-3 text-indigo-600" />
              <span>Website / Portfolio</span>
            </label>
            <input
              id="field-website"
              data-field-key="website"
              type="text"
              value={personal.website || ''}
              onChange={(e) => updatePersonal('website', e.target.value)}
              placeholder="e.g. yourportfolio.com"
              className="w-full text-xs px-2.5 py-1.5 rounded-lg border border-slate-300 bg-white focus:outline-blue-500 transition-all"
            />
          </div>
        </div>

        {/* Address */}
        <div>
          <label className="block text-[11px] font-bold text-slate-700 mb-1 flex items-center gap-1.5">
            <MapPin className="w-3 h-3 text-amber-500" />
            <span>Present / Contact Address</span>
          </label>
          <textarea
            id="field-address"
            data-field-key="address"
            rows={2}
            value={personal.address || ''}
            onChange={(e) => updatePersonal('address', e.target.value)}
            placeholder="e.g. h-50, seroil, shantibag, rajshahi, bangladesh"
            className="w-full text-xs px-2.5 py-1.5 rounded-lg border border-slate-300 bg-white focus:outline-blue-500 transition-all"
          />
        </div>
      </div>

      {/* 5. Photo Settings Box */}
      <div id="field-photo" data-field-key="photo" className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
            <Image className="w-4 h-4 text-purple-600" />
            <span>Passport Photo / Picture</span>
          </span>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={!!photo.show}
              onChange={(e) => updatePhoto('show', e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-9 h-5 bg-slate-300 peer-focus:outline-hidden rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-purple-600"></div>
            <span className="ml-2 text-xs font-medium text-slate-600">
              {photo.show ? 'Shown' : 'Hidden'}
            </span>
          </label>
        </div>

        {photo.show && (
          <div className="space-y-3 pt-1 border-t border-slate-200">
            <div className="flex items-center gap-3">
              {/* Photo preview thumbnail */}
              <div className="w-16 h-20 rounded border border-slate-300 overflow-hidden bg-slate-200 shrink-0 flex items-center justify-center">
                {photo.url ? (
                  <img src={photo.url} alt="Photo Preview" className="w-full h-full object-cover" />
                ) : (
                  <span className="text-[10px] text-slate-400 text-center px-1">No Image</span>
                )}
              </div>

              <div className="flex-1 space-y-2">
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handlePhotoUpload}
                  accept="image/*"
                  className="hidden"
                />
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="flex items-center gap-1 text-xs bg-white border border-slate-300 hover:bg-slate-100 text-slate-700 px-3 py-1.5 rounded-lg font-semibold cursor-pointer transition shadow-2xs"
                  >
                    <Upload className="w-3 h-3 text-purple-600" />
                    <span>Upload From Device</span>
                  </button>
                  {photo.url && (
                    <button
                      type="button"
                      onClick={() => updatePhoto('url', '')}
                      className="text-xs text-rose-600 hover:bg-rose-50 p-1.5 rounded-lg transition"
                      title="Remove Photo"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>

                <div>
                  <input
                    type="text"
                    value={photo.url || ''}
                    onChange={(e) => updatePhoto('url', e.target.value)}
                    placeholder="Or paste an image web link here..."
                    className="w-full text-[11px] px-2.5 py-1 rounded-md border border-slate-300 bg-white"
                  />
                </div>
              </div>
            </div>

            {/* Shape and position controls */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              <div>
                <label className="block text-[11px] font-semibold text-slate-600 mb-1">Photo Shape</label>
                <select
                  value={photo.shape || 'passport'}
                  onChange={(e) => updatePhoto('shape', e.target.value)}
                  className="w-full px-2 py-1 text-xs rounded-lg border border-slate-300 bg-white"
                >
                  <option value="passport">Passport Rectangle (35x45)</option>
                  <option value="square">Square</option>
                  <option value="circle">Circle / Round</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-600 mb-1">Position</label>
                <select
                  value={photo.position || 'top-right'}
                  onChange={(e) => updatePhoto('position', e.target.value)}
                  className="w-full px-2 py-1 text-xs rounded-lg border border-slate-300 bg-white"
                >
                  <option value="top-right">Top Right (Standard)</option>
                  <option value="top-left">Top Left</option>
                  <option value="center">Centered</option>
                </select>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
