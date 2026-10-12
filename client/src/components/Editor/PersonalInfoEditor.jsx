import React, { useRef } from 'react';
import { User, Phone, Mail, MapPin, Image, Upload, Trash2, Globe } from 'lucide-react';
import { LinkedinIcon, GithubIcon } from '../Common/Icons';

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
          ...prev.design.photo,
          [field]: value
        }
      }
    }));
  };

  const handlePhotoUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Convert to base64 Data URL so it saves easily in local state and offline
    const reader = new FileReader();
    reader.onload = () => {
      updatePhoto('url', reader.result);
      updatePhoto('show', true);
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="space-y-5">
      {/* Friendly banner */}
      <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 flex items-start gap-2.5 text-xs text-amber-900">
        <span className="text-base">👦</span>
        <div>
          <span className="font-bold">Step 1: Fill Your Basic Details!</span>
          <p className="text-amber-700 mt-0.5">
            Type your name, phone number, and email. Any change you make shows on your CV instantly on the right!
          </p>
        </div>
      </div>

      {/* Header Titles (Customizable without restrictions) */}
      <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 space-y-3">
        <div className="text-xs font-bold text-slate-700 flex items-center justify-between">
          <span>👑 Top Header Title</span>
          <span className="text-[11px] font-normal text-slate-500">Edit titles freely</span>
        </div>
        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="block text-[11px] font-semibold text-slate-600 mb-1">Main Title</label>
            <input
              type="text"
              value={design.headerTitle || ''}
              onChange={(e) => updateDesign('headerTitle', e.target.value)}
              placeholder="e.g. RESUM or CURRICULUM VITAE"
              className="w-full text-xs px-2.5 py-1.5 rounded-lg border border-slate-300 bg-white focus:outline-blue-500 font-medium"
            />
          </div>
          <div>
            <label className="block text-[11px] font-semibold text-slate-600 mb-1">Subtitle / Connective</label>
            <input
              type="text"
              value={design.headerSubtitle || ''}
              onChange={(e) => updateDesign('headerSubtitle', e.target.value)}
              placeholder="e.g. of"
              className="w-full text-xs px-2.5 py-1.5 rounded-lg border border-slate-300 bg-white focus:outline-blue-500 font-medium"
            />
          </div>
        </div>
      </div>

      {/* Candidate Full Name */}
      <div>
        <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center gap-1.5">
          <User className="w-3.5 h-3.5 text-blue-500" />
          <span>Full Name (Bold in CV)</span>
        </label>
        <input
          type="text"
          value={personal.fullName || ''}
          onChange={(e) => updatePersonal('fullName', e.target.value)}
          placeholder="e.g. MD. EMRAN HOSSEN BIPLOB"
          className="w-full text-sm px-3 py-2 rounded-xl border border-slate-300 bg-white focus:ring-2 focus:ring-blue-400 focus:outline-hidden font-bold"
        />
      </div>

      {/* Job Title / Profession */}
      <div>
        <label className="block text-xs font-bold text-slate-700 mb-1">
          Job Title or Profession (Optional for Bangladeshi, Great for International)
        </label>
        <input
          type="text"
          value={personal.jobTitle || ''}
          onChange={(e) => updatePersonal('jobTitle', e.target.value)}
          placeholder="e.g. Electrical Engineer / Student"
          className="w-full text-xs px-3 py-2 rounded-xl border border-slate-300 bg-white focus:ring-2 focus:ring-blue-400 focus:outline-hidden"
        />
      </div>

      {/* Contact Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center gap-1.5">
            <Phone className="w-3.5 h-3.5 text-emerald-500" />
            <span>Mobile No</span>
          </label>
          <input
            type="text"
            value={personal.mobile || ''}
            onChange={(e) => updatePersonal('mobile', e.target.value)}
            placeholder="e.g. 01781020390"
            className="w-full text-xs px-3 py-2 rounded-xl border border-slate-300 bg-white focus:ring-2 focus:ring-blue-400 focus:outline-hidden"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center gap-1.5">
            <Mail className="w-3.5 h-3.5 text-rose-500" />
            <span>E-mail Address</span>
          </label>
          <input
            type="email"
            value={personal.email || ''}
            onChange={(e) => updatePersonal('email', e.target.value)}
            placeholder="e.g. yourname@gmail.com"
            className="w-full text-xs px-3 py-2 rounded-xl border border-slate-300 bg-white focus:ring-2 focus:ring-blue-400 focus:outline-hidden"
          />
        </div>
      </div>

      {/* Address */}
      <div>
        <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center gap-1.5">
          <MapPin className="w-3.5 h-3.5 text-amber-500" />
          <span>Present / Contact Address</span>
        </label>
        <textarea
          rows={2}
          value={personal.address || ''}
          onChange={(e) => updatePersonal('address', e.target.value)}
          placeholder="e.g. Vill: Chandrapur Post: Chandrapur, Upazila: Kaligonj Zilla: Lalmonirhat"
          className="w-full text-xs px-3 py-2 rounded-xl border border-slate-300 bg-white focus:ring-2 focus:ring-blue-400 focus:outline-hidden"
        />
      </div>

      {/* Photo Settings Box */}
      <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 space-y-3">
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
            <div className="grid grid-cols-2 gap-2 text-xs">
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

      {/* Online Profiles (useful for International) */}
      <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 space-y-2">
        <div className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
          <Globe className="w-3.5 h-3.5 text-blue-500" />
          <span>Web Links & Profiles (Great for Tech / Global CV)</span>
        </div>
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <LinkedinIcon className="w-3.5 h-3.5 text-blue-600 shrink-0" />
            <input
              type="text"
              value={personal.linkedin || ''}
              onChange={(e) => updatePersonal('linkedin', e.target.value)}
              placeholder="e.g. linkedin.com/in/yourname"
              className="flex-1 text-xs px-2.5 py-1.5 rounded-lg border border-slate-300 bg-white"
            />
          </div>
          <div className="flex items-center gap-2">
            <GithubIcon className="w-3.5 h-3.5 text-slate-800 shrink-0" />
            <input
              type="text"
              value={personal.github || ''}
              onChange={(e) => updatePersonal('github', e.target.value)}
              placeholder="e.g. github.com/yourname"
              className="flex-1 text-xs px-2.5 py-1.5 rounded-lg border border-slate-300 bg-white"
            />
          </div>
          <div className="flex items-center gap-2">
            <Globe className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
            <input
              type="text"
              value={personal.website || ''}
              onChange={(e) => updatePersonal('website', e.target.value)}
              placeholder="e.g. yourwebsite.com"
              className="flex-1 text-xs px-2.5 py-1.5 rounded-lg border border-slate-300 bg-white"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
