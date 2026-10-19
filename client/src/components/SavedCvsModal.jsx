import React, { useState, useEffect, useRef } from 'react';
import { X, Save, FolderOpen, Trash2, Clock, Check, AlertCircle, Download, Upload, FileText } from 'lucide-react';

const STORAGE_KEY = 'cv_saved_versions_library';

export default function SavedCvsModal({ isOpen, onClose, cvData, onSelectCv }) {
  const [savedList, setSavedList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [saveTitle, setSaveTitle] = useState(cvData?.title || '');
  const [statusMsg, setStatusMsg] = useState(null);
  const importInputRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      setSaveTitle(cvData?.title || `${cvData?.personal?.fullName || 'My'}_CV`);
      loadSavedVersions();
    }
  }, [isOpen]);

  // Read saved versions directly from browser localStorage
  const loadSavedVersions = () => {
    setLoading(true);
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      let list = raw ? JSON.parse(raw) : [];

      // Check legacy single-cv entries in localStorage and migrate them if any
      const legacyKeys = Object.keys(localStorage).filter(k => k.startsWith('cv_') && k !== 'cv_user_personal_profile' && k !== 'cv_backup_history' && k !== STORAGE_KEY);
      if (legacyKeys.length > 0) {
        let migratedAny = false;
        legacyKeys.forEach(k => {
          try {
            const legacyData = JSON.parse(localStorage.getItem(k));
            if (legacyData && legacyData.personal && !list.some(item => item.id === k)) {
              list.unshift({
                id: k,
                title: legacyData.title || 'Migrated Draft',
                name: legacyData.personal?.fullName || 'Anonymous',
                styleMode: legacyData.styleMode || 'bangladeshi',
                updatedAt: new Date().toISOString(),
                data: legacyData
              });
              migratedAny = true;
            }
          } catch (e) {}
        });
        if (migratedAny) {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
        }
      }

      setSavedList(list);
    } catch (err) {
      console.warn('Error reading localStorage saved CVs', err);
    } finally {
      setLoading(false);
    }
  };

  // Save current CV version to browser localStorage (and optionally sync in-memory server)
  const handleSaveVersion = async () => {
    setLoading(true);
    setStatusMsg(null);
    try {
      const cleanTitle = saveTitle.trim() || `${cvData?.personal?.fullName || 'My'}_CV`;
      const versionId = `cv_${Date.now()}`;
      const payload = {
        ...cvData,
        id: versionId,
        title: cleanTitle,
        updatedAt: new Date().toISOString()
      };

      // 1. Save to browser localStorage (Primary stateless storage)
      const raw = localStorage.getItem(STORAGE_KEY);
      let list = raw ? JSON.parse(raw) : [];
      // If version with same id exists, update; else prepend
      const existingIdx = list.findIndex(item => item.id === payload.id);
      const newEntry = {
        id: payload.id,
        title: cleanTitle,
        name: payload.personal?.fullName || 'Anonymous',
        styleMode: payload.styleMode || 'bangladeshi',
        updatedAt: payload.updatedAt,
        data: payload
      };

      if (existingIdx >= 0) {
        list[existingIdx] = newEntry;
      } else {
        list.unshift(newEntry);
      }

      localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
      setSavedList(list);
      setStatusMsg({ type: 'success', text: 'CV saved successfully in browser storage!' });

      // 2. Non-blocking best-effort sync to backend in-memory cache if available
      fetch('/api/cv/save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      }).catch(() => {
        // Safe to ignore on stateless hosts
      });
    } catch (err) {
      if (err.name === 'QuotaExceededError') {
        setStatusMsg({ type: 'error', text: 'Browser storage full. Please export JSON or delete older versions.' });
      } else {
        setStatusMsg({ type: 'error', text: 'Failed to save version.' });
      }
    } finally {
      setLoading(false);
    }
  };

  // Load a saved CV version into active editor state
  const handleLoadCv = (item) => {
    if (!item || !item.data) return;
    onSelectCv(item.data);
    onClose();
  };

  // Delete a saved CV version from browser localStorage
  const handleDeleteCv = (id, e) => {
    e.stopPropagation();
    if (!window.confirm('Delete this saved CV version?')) return;
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      let list = raw ? JSON.parse(raw) : [];
      list = list.filter(item => item.id !== id);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
      setSavedList(list);

      // Best effort delete on backend in-memory cache
      fetch(`/api/cv/${id}`, { method: 'DELETE' }).catch(() => {});
    } catch (err) {
      alert('Could not delete version');
    }
  };

  // Download individual saved version directly as JSON
  const handleDownloadItemJson = (item, e) => {
    e.stopPropagation();
    try {
      const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(item.data, null, 2));
      const downloadAnchor = document.createElement('a');
      downloadAnchor.setAttribute("href", dataStr);
      downloadAnchor.setAttribute("download", `${(item.title || 'CV').replace(/\s+/g, '_')}.json`);
      document.body.appendChild(downloadAnchor);
      downloadAnchor.click();
      downloadAnchor.remove();
    } catch (err) {
      alert('Failed to export JSON file.');
    }
  };

  // Import external JSON CV file into saved versions library
  const handleImportJsonFile = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target?.result);
        if (parsed.personal && parsed.sections) {
          const newEntry = {
            id: `cv_${Date.now()}`,
            title: parsed.title || `${parsed.personal?.fullName || 'Imported'}_CV`,
            name: parsed.personal?.fullName || 'Anonymous',
            styleMode: parsed.styleMode || 'bangladeshi',
            updatedAt: new Date().toISOString(),
            data: parsed
          };
          const raw = localStorage.getItem(STORAGE_KEY);
          let list = raw ? JSON.parse(raw) : [];
          list.unshift(newEntry);
          localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
          setSavedList(list);
          setStatusMsg({ type: 'success', text: `Imported "${newEntry.title}" to library!` });
        } else {
          alert('Invalid CV file structure.');
        }
      } catch (err) {
        alert('Failed to parse JSON file.');
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden border border-slate-200 animate-in fade-in zoom-in-95 duration-150 flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-2">
            <FolderOpen className="w-5 h-5 text-blue-600" />
            <div>
              <h3 className="text-base font-bold text-slate-800">Saved CVs & Storage</h3>
              <p className="text-[11px] text-slate-500">Stateless local storage & portable JSON backups</p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-700 p-1 rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Save Current CV Section */}
        <div className="p-4 border-b border-slate-100 bg-slate-50/50 space-y-2">
          <label className="block text-xs font-bold text-slate-700">Save Current CV as:</label>
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={saveTitle}
              onChange={(e) => setSaveTitle(e.target.value)}
              placeholder="e.g. Md. Emran Hossen - Version 1"
              className="flex-1 text-xs px-3 py-2 rounded-xl border border-slate-300 bg-white"
            />
            <button
              onClick={handleSaveVersion}
              disabled={loading}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shadow-xs disabled:opacity-50"
            >
              <Save className="w-3.5 h-3.5" />
              <span>Save Version</span>
            </button>
          </div>
          {statusMsg && (
            <div className={`text-xs flex items-center gap-1.5 ${statusMsg.type === 'success' ? 'text-emerald-600' : 'text-rose-600'}`}>
              {statusMsg.type === 'success' ? <Check className="w-3.5 h-3.5" /> : <AlertCircle className="w-3.5 h-3.5" />}
              <span>{statusMsg.text}</span>
            </div>
          )}
        </div>

        {/* Quick JSON Import Action */}
        <div className="px-4 py-2 bg-blue-50/50 border-b border-slate-100 flex items-center justify-between text-xs">
          <span className="text-slate-600 text-[11px]">Have a previous CV backup file?</span>
          <input
            type="file"
            ref={importInputRef}
            onChange={handleImportJsonFile}
            accept=".json"
            className="hidden"
          />
          <button
            onClick={() => importInputRef.current?.click()}
            className="flex items-center gap-1 text-blue-700 hover:text-blue-900 font-semibold text-xs py-1 px-2 rounded-lg hover:bg-blue-100 transition cursor-pointer"
          >
            <Upload className="w-3 h-3" />
            <span>Import JSON to Library</span>
          </button>
        </div>

        {/* List of Saved CVs */}
        <div className="p-4 overflow-y-auto flex-1 space-y-2">
          <div className="text-xs font-bold text-slate-600 mb-2">Saved Versions ({savedList.length})</div>
          {savedList.length === 0 ? (
            <div className="text-center py-8 text-xs text-slate-400 bg-slate-50 rounded-xl border border-dashed border-slate-200 space-y-1">
              <FileText className="w-8 h-8 text-slate-300 mx-auto" />
              <p>No saved versions found yet.</p>
              <p className="text-[11px] text-slate-400">Click &ldquo;Save Version&rdquo; above to save your work!</p>
            </div>
          ) : (
            savedList.map((item) => (
              <div
                key={item.id}
                onClick={() => handleLoadCv(item)}
                className="p-3 rounded-xl border border-slate-200 hover:border-blue-400 hover:bg-blue-50/30 transition flex items-center justify-between gap-3 cursor-pointer group"
              >
                <div className="min-w-0">
                  <div className="text-xs font-bold text-slate-800 group-hover:text-blue-600 truncate">
                    {item.title}
                  </div>
                  <div className="text-[11px] text-slate-500 flex items-center gap-2 mt-0.5">
                    <span>{item.name}</span>
                    <span>•</span>
                    <span className="uppercase text-[10px] px-1.5 py-0.2 rounded bg-slate-100 text-slate-600 font-medium">
                      {item.styleMode}
                    </span>
                    <span>•</span>
                    <span className="text-[10px] text-slate-400">
                      {new Date(item.updatedAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <button
                    onClick={(e) => handleDownloadItemJson(item, e)}
                    className="p-1.5 text-slate-400 hover:text-blue-600 rounded-lg hover:bg-blue-50 transition"
                    title="Export JSON backup"
                  >
                    <Download className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={(e) => handleDeleteCv(item.id, e)}
                    className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition"
                    title="Delete saved CV"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="p-3 bg-slate-50 border-t border-slate-200 text-right">
          <button
            onClick={onClose}
            className="px-4 py-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 rounded-lg cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
