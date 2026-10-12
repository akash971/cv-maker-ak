import React, { useState, useEffect } from 'react';
import { X, Save, FolderOpen, Trash2, Clock, Check, AlertCircle } from 'lucide-react';

export default function SavedCvsModal({ isOpen, onClose, cvData, onSelectCv }) {
  const [savedList, setSavedList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [saveTitle, setSaveTitle] = useState(cvData?.title || '');
  const [statusMsg, setStatusMsg] = useState(null);

  useEffect(() => {
    if (isOpen) {
      setSaveTitle(cvData?.title || `${cvData?.personal?.fullName || 'My'}_CV`);
      fetchSavedList();
    }
  }, [isOpen]);

  const fetchSavedList = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/cv/list');
      const data = await res.json();
      if (data.success) {
        setSavedList(data.cvs || []);
      }
    } catch (err) {
      console.warn('Backend offline, reading local state only');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveToServer = async () => {
    setLoading(true);
    setStatusMsg(null);
    try {
      const payload = {
        ...cvData,
        title: saveTitle.trim() || 'Untitled CV'
      };
      const res = await fetch('/api/cv/save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      if (data.success) {
        setStatusMsg({ type: 'success', text: 'CV saved successfully to server!' });
        fetchSavedList();
      } else {
        setStatusMsg({ type: 'error', text: data.error || 'Failed to save' });
      }
    } catch (err) {
      // Local fallback
      localStorage.setItem(`cv_${Date.now()}`, JSON.stringify(cvData));
      setStatusMsg({ type: 'success', text: 'Saved to local storage!' });
    } finally {
      setLoading(false);
    }
  };

  const handleLoadCv = async (id) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/cv/${id}`);
      const data = await res.json();
      if (data.success && data.cv) {
        onSelectCv(data.cv);
        onClose();
      }
    } catch (err) {
      alert('Could not load CV');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteCv = async (id, e) => {
    e.stopPropagation();
    if (!window.confirm('Delete this saved CV?')) return;
    try {
      await fetch(`/api/cv/${id}`, { method: 'DELETE' });
      fetchSavedList();
    } catch (err) {
      alert('Could not delete');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden border border-slate-200 animate-in fade-in zoom-in-95 duration-150 flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-2">
            <FolderOpen className="w-5 h-5 text-blue-600" />
            <h3 className="text-base font-bold text-slate-800">Saved CVs & Storage</h3>
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
              onClick={handleSaveToServer}
              disabled={loading}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shadow-xs disabled:opacity-50"
            >
              <Save className="w-3.5 h-3.5" />
              <span>Save Now</span>
            </button>
          </div>
          {statusMsg && (
            <div className={`text-xs flex items-center gap-1.5 ${statusMsg.type === 'success' ? 'text-emerald-600' : 'text-rose-600'}`}>
              {statusMsg.type === 'success' ? <Check className="w-3.5 h-3.5" /> : <AlertCircle className="w-3.5 h-3.5" />}
              <span>{statusMsg.text}</span>
            </div>
          )}
        </div>

        {/* List of Saved CVs */}
        <div className="p-4 overflow-y-auto flex-1 space-y-2">
          <div className="text-xs font-bold text-slate-600 mb-2">Previous Saved Versions ({savedList.length})</div>
          {savedList.length === 0 ? (
            <div className="text-center py-8 text-xs text-slate-400 bg-slate-50 rounded-xl border border-dashed border-slate-200">
              No saved CVs found yet. Save your first one above!
            </div>
          ) : (
            savedList.map((item) => (
              <div
                key={item.id}
                onClick={() => handleLoadCv(item.id)}
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
                  </div>
                </div>
                <div className="flex items-center gap-1">
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
            className="px-4 py-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 rounded-lg"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
