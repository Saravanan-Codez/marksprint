import React, { useState } from 'react';
import { Plus, Trash2, Library } from 'lucide-react';

export default function SubjectPanel({
  subjects,
  selectedSubject,
  onSelectSubject,
  onAddSubject,
  onDeleteSubject
}) {
  const [newSubjectName, setNewSubjectName] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);

  const handleAddSubject = () => {
    if (newSubjectName.trim()) {
      onAddSubject(newSubjectName.trim());
      setNewSubjectName('');
      setShowAddForm(false);
    }
  };

  return (
    <div className="w-64 border-r border-[rgba(255,255,255,0.1)] flex flex-col bg-[rgba(255,255,255,0.02)] overflow-hidden">
      <div className="p-4 border-b border-[rgba(255,255,255,0.1)] bg-[rgba(0,0,0,0.2)]">
        <div className="flex items-center gap-2">
          <Library size={18} className="text-[#00d2ff]" />
          <h2 className="text-lg font-bold text-[#7fdfff]">Subjects</h2>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-2 custom-scrollbar">
        {subjects && subjects.length > 0 ? (
          subjects.map((subject) => (
            <div key={subject} className="group relative">
              <button
                onClick={() => onSelectSubject(subject)}
                className={`w-full p-3 pr-10 rounded-none text-left font-semibold transition-all duration-300 flex items-center justify-between ${
                  selectedSubject === subject
                    ? 'bg-[#2aa8d8] text-white shadow-[0_0_15px_rgba(42,168,216,0.3)]'
                    : 'bg-[rgba(255,255,255,0.05)] text-[#9fe3ff] hover:bg-[rgba(255,255,255,0.1)]'
                }`}
              >
                <span className="truncate">{subject}</span>
                {selectedSubject === subject && <div className="w-2 h-2 bg-white rounded-full"></div>}
              </button>
              
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onDeleteSubject(subject);
                }}
                className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 text-red-400 opacity-0 group-hover:opacity-100 hover:text-red-500 hover:bg-red-500/10 transition-all"
                title="Delete Subject"
              >
                <Trash2 size={14} />
              </button>
            </div>
          ))
        ) : (
          <div className="text-center py-8">
            <p className="text-[#2aa8d8] text-sm italic">No subjects available</p>
          </div>
        )}
      </div>

      <div className="p-4 border-t border-[rgba(255,255,255,0.1)] bg-[rgba(0,0,0,0.1)]">
        {showAddForm ? (
          <div className="space-y-2 animate-in fade-in slide-in-from-bottom-2 duration-300">
            <input
              type="text"
              value={newSubjectName}
              onChange={(e) => setNewSubjectName(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleAddSubject()}
              placeholder="Subject name..."
              className="w-full px-3 py-2 bg-[rgba(255,255,255,0.05)] border border-[#2aa8d8] rounded-none text-[#9fe3ff] placeholder-[#2aa8d8] focus:outline-none focus:border-[#00d2ff] focus:bg-[rgba(0,210,255,0.1)]"
              autoFocus
            />
            <div className="flex gap-2">
              <button
                onClick={handleAddSubject}
                className="flex-1 px-3 py-2 bg-[#2aa8d8] text-white font-semibold rounded-none hover:bg-[#1a88b8] transition-all"
              >
                Add
              </button>
              <button
                onClick={() => {
                  setShowAddForm(false);
                  setNewSubjectName('');
                }}
                className="flex-1 px-3 py-2 bg-[rgba(255,255,255,0.05)] text-[#9fe3ff] font-semibold rounded-none hover:bg-[rgba(255,255,255,0.1)] transition-all"
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <button
            onClick={() => setShowAddForm(true)}
            className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-[#2aa8d8] text-white font-semibold rounded-none hover:bg-[#1a88b8] transition-all duration-300 shadow-lg hover:shadow-[#2aa8d8]/20"
          >
            <Plus size={18} /> ADD SUBJECT
          </button>
        )}
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.02);
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(42, 168, 216, 0.3);
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(42, 168, 216, 0.5);
        }
      `}} />
    </div>
  );
}
