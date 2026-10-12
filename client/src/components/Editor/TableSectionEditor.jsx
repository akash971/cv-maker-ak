import React from 'react';
import { Plus, Trash2, Table as TableIcon } from 'lucide-react';

export default function TableSectionEditor({ section, onUpdate }) {
  const headers = section.headers || ['Name', 'Reading', 'Writing', 'Speaking'];
  const rows = section.rows || [];

  const handleTitleChange = (newTitle) => {
    onUpdate({ ...section, title: newTitle });
  };

  const updateHeader = (colIdx, val) => {
    const newHeaders = [...headers];
    newHeaders[colIdx] = val;
    onUpdate({ ...section, headers: newHeaders });
  };

  const addColumn = () => {
    const newHeaders = [...headers, `Column ${headers.length + 1}`];
    const newRows = rows.map(r => [...r, '']);
    onUpdate({ ...section, headers: newHeaders, rows: newRows });
  };

  const removeColumn = (colIdx) => {
    if (headers.length <= 1) return;
    const newHeaders = headers.filter((_, i) => i !== colIdx);
    const newRows = rows.map(r => r.filter((_, i) => i !== colIdx));
    onUpdate({ ...section, headers: newHeaders, rows: newRows });
  };

  const updateCell = (rowIdx, colIdx, val) => {
    const newRows = rows.map((row, r) => {
      if (r !== rowIdx) return row;
      const updatedRow = [...row];
      updatedRow[colIdx] = val;
      return updatedRow;
    });
    onUpdate({ ...section, rows: newRows });
  };

  const addRow = () => {
    const emptyRow = new Array(headers.length).fill('');
    emptyRow[0] = `${rows.length + 1}. `;
    onUpdate({ ...section, rows: [...rows, emptyRow] });
  };

  const removeRow = (rowIdx) => {
    const newRows = rows.filter((_, r) => r !== rowIdx);
    onUpdate({ ...section, rows: newRows });
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-xs font-semibold text-slate-600 mb-1">
          Section Title (e.g. LANGUAGE PROFICIENCY :)
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
            <TableIcon className="w-4 h-4 text-indigo-600" />
            <span>Table Headers & Rows</span>
          </span>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={addColumn}
              className="text-[11px] font-bold text-indigo-600 hover:text-indigo-800"
            >
              + Add Column
            </button>
            <span className="text-slate-300">|</span>
            <button
              type="button"
              onClick={addRow}
              className="text-[11px] font-bold text-emerald-600 hover:text-emerald-800"
            >
              + Add Row
            </button>
          </div>
        </div>

        {/* Column Headers */}
        <div className="bg-slate-100 p-2 rounded-lg border border-slate-200">
          <div className="text-[11px] font-bold text-slate-600 mb-1.5">Column Headers:</div>
          <div className="flex items-center gap-2 overflow-x-auto pb-1">
            {headers.map((h, colIdx) => (
              <div key={colIdx} className="flex items-center gap-1 min-w-[100px] flex-1">
                <input
                  type="text"
                  value={h}
                  onChange={(e) => updateHeader(colIdx, e.target.value)}
                  className="w-full text-xs font-semibold px-2 py-1 rounded border border-slate-300 bg-white"
                />
                {headers.length > 2 && (
                  <button
                    type="button"
                    onClick={() => removeColumn(colIdx)}
                    className="text-slate-400 hover:text-rose-500 p-0.5"
                    title="Remove column"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Rows */}
        <div className="space-y-2">
          {rows.map((row, rIdx) => (
            <div key={rIdx} className="flex items-center gap-2 bg-slate-50 p-2 rounded-lg border border-slate-200">
              <span className="text-xs font-semibold text-slate-400 w-4">{rIdx + 1}</span>
              <div className="flex-1 grid gap-2" style={{ gridTemplateColumns: `repeat(${headers.length}, minmax(0, 1fr))` }}>
                {headers.map((_, colIdx) => (
                  <input
                    key={colIdx}
                    type="text"
                    value={row[colIdx] || ''}
                    onChange={(e) => updateCell(rIdx, colIdx, e.target.value)}
                    placeholder={`e.g. ${colIdx === 0 ? 'Bengali' : 'Good'}`}
                    className="w-full text-xs px-2 py-1 rounded border border-slate-300 bg-white"
                  />
                ))}
              </div>
              <button
                type="button"
                onClick={() => removeRow(rIdx)}
                className="text-slate-400 hover:text-rose-500 p-1"
                title="Remove row"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>

        <button
          type="button"
          onClick={addRow}
          className="w-full py-1.5 border border-dashed border-slate-300 hover:border-emerald-500 text-slate-600 hover:text-emerald-700 rounded-lg text-xs font-medium flex items-center justify-center gap-1 transition"
        >
          <Plus className="w-3 h-3" />
          <span>Add Another Language / Row</span>
        </button>
      </div>
    </div>
  );
}
