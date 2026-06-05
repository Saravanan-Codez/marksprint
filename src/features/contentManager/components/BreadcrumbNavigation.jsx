import React, { useState } from 'react';
import { ChevronRight, Plus, X } from 'lucide-react';

export default function BreadcrumbNavigation({
  subjects,
  lessons,
  selectedSubject,
  selectedLesson,
  onSelectSubject,
  onSelectLesson,
  onAddSubject,
  onAddLesson,
  onDeleteSubject,
  onDeleteLesson
}) {
  const [showSubjectDropdown, setShowSubjectDropdown] = useState(false);
  const [showLessonDropdown, setShowLessonDropdown] = useState(false);
  const [newSubjectName, setNewSubjectName] = useState('');
  const [newLessonNumber, setNewLessonNumber] = useState('');
  const [showAddSubjectForm, setShowAddSubjectForm] = useState(false);
  const [showAddLessonForm, setShowAddLessonForm] = useState(false);

  const handleAddSubject = () => {
    if (newSubjectName.trim()) {
      onAddSubject(newSubjectName.trim());
      setNewSubjectName('');
      setShowAddSubjectForm(false);
      setShowSubjectDropdown(false);
    }
  };

  const handleAddLesson = () => {
    if (newLessonNumber.trim()) {
      onAddLesson(newLessonNumber.trim());
      setNewLessonNumber('');
      setShowAddLessonForm(false);
      setShowLessonDropdown(false);
    }
  };

  return (
    <div className="w-full px-8 py-6 bg-[rgba(0,0,0,0.3)] border-b border-[rgba(255,255,255,0.1)]">
      <div className="flex items-center gap-4 flex-wrap">
        {/* Subject Breadcrumb */}
        <div className="relative">
          <button
            onClick={() => {
              setShowSubjectDropdown(!showSubjectDropdown);
              setShowLessonDropdown(false);
            }}
            className={`flex items-center gap-3 px-6 py-3 rounded-lg font-semibold transition-all duration-300 border ${
              selectedSubject
                ? 'bg-[#2aa8d8] text-white border-[#2aa8d8] shadow-[0_0_15px_rgba(42,168,216,0.3)]'
                : 'bg-[rgba(255,255,255,0.05)] text-[#9fe3ff] border-[rgba(255,255,255,0.1)] hover:bg-[rgba(255,255,255,0.08)]'
            }`}
          >
            <span className="text-sm uppercase tracking-wide">Subject</span>
            {selectedSubject && <span className="text-base font-bold">{selectedSubject}</span>}
          </button>

          {/* Subject Dropdown */}
          {showSubjectDropdown && (
            <div className="absolute top-full left-0 mt-2 w-72 bg-[rgba(15,20,30,0.95)] backdrop-blur-xl border border-[rgba(255,255,255,0.1)] rounded-lg shadow-2xl z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
              <div className="max-h-80 overflow-y-auto custom-scrollbar">
                {subjects.map(subject => (
                  <div key={subject} className="group">
                    <button
                      onClick={() => {
                        onSelectSubject(subject);
                        setShowSubjectDropdown(false);
                      }}
                      className={`w-full px-6 py-3 text-left font-semibold transition-all duration-200 flex items-center justify-between group/item ${
                        selectedSubject === subject
                          ? 'bg-[#2aa8d8] text-white'
                          : 'text-[#9fe3ff] hover:bg-[rgba(255,255,255,0.05)]'
                      }`}
                    >
                      <span>{subject}</span>
                      {selectedSubject === subject && <div className="w-2 h-2 bg-white rounded-full"></div>}
                    </button>
                    {selectedSubject === subject && (
                      <button
                        onClick={() => {
                          onDeleteSubject(subject);
                          setShowSubjectDropdown(false);
                        }}
                        className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-red-400 opacity-0 group-hover:opacity-100 hover:text-red-500 transition-all"
                      >
                        <X size={16} />
                      </button>
                    )}
                  </div>
                ))}
              </div>

              {/* Add Subject Form */}
              <div className="border-t border-[rgba(255,255,255,0.1)] p-4 bg-[rgba(0,0,0,0.2)]">
                {showAddSubjectForm ? (
                  <div className="space-y-2 animate-in fade-in duration-200">
                    <input
                      type="text"
                      value={newSubjectName}
                      onChange={(e) => setNewSubjectName(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleAddSubject()}
                      placeholder="Subject name..."
                      className="w-full px-3 py-2 bg-[rgba(255,255,255,0.05)] border border-[#2aa8d8] rounded-lg text-[#9fe3ff] placeholder-[#2aa8d8] focus:outline-none focus:border-[#00d2ff] focus:bg-[rgba(0,210,255,0.1)]"
                      autoFocus
                    />
                    <div className="flex gap-2">
                      <button
                        onClick={handleAddSubject}
                        className="flex-1 px-3 py-2 bg-[#2aa8d8] text-white font-semibold rounded-lg hover:bg-[#1a88b8] transition-all text-sm"
                      >
                        Add
                      </button>
                      <button
                        onClick={() => {
                          setShowAddSubjectForm(false);
                          setNewSubjectName('');
                        }}
                        className="flex-1 px-3 py-2 bg-[rgba(255,255,255,0.05)] text-[#9fe3ff] font-semibold rounded-lg hover:bg-[rgba(255,255,255,0.1)] transition-all text-sm"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <button
                    onClick={() => setShowAddSubjectForm(true)}
                    className="w-full flex items-center justify-center gap-2 px-3 py-2 bg-[#2aa8d8] text-white font-semibold rounded-lg hover:bg-[#1a88b8] transition-all text-sm"
                  >
                    <Plus size={16} /> Add Subject
                  </button>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Chevron */}
        {selectedSubject && (
          <ChevronRight size={24} className="text-[#2aa8d8]" />
        )}

        {/* Lesson Breadcrumb */}
        {selectedSubject && (
          <div className="relative">
            <button
              onClick={() => {
                setShowLessonDropdown(!showLessonDropdown);
                setShowSubjectDropdown(false);
              }}
              className={`flex items-center gap-3 px-6 py-3 rounded-lg font-semibold transition-all duration-300 border ${
                selectedLesson
                  ? 'bg-[#2aa8d8] text-white border-[#2aa8d8] shadow-[0_0_15px_rgba(42,168,216,0.3)]'
                  : 'bg-[rgba(255,255,255,0.05)] text-[#9fe3ff] border-[rgba(255,255,255,0.1)] hover:bg-[rgba(255,255,255,0.08)]'
              }`}
            >
              <span className="text-sm uppercase tracking-wide">Lesson</span>
              {selectedLesson && <span className="text-base font-bold">Lesson {selectedLesson}</span>}
            </button>

            {/* Lesson Dropdown */}
            {showLessonDropdown && (
              <div className="absolute top-full left-0 mt-2 w-72 bg-[rgba(15,20,30,0.95)] backdrop-blur-xl border border-[rgba(255,255,255,0.1)] rounded-lg shadow-2xl z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                <div className="max-h-80 overflow-y-auto custom-scrollbar">
                  {lessons.length > 0 ? (
                    lessons.map(lesson => (
                      <button
                        key={lesson}
                        onClick={() => {
                          onSelectLesson(lesson);
                          setShowLessonDropdown(false);
                        }}
                        className={`w-full px-6 py-3 text-left font-semibold transition-all duration-200 flex items-center justify-between ${
                          selectedLesson === lesson
                            ? 'bg-[#2aa8d8] text-white'
                            : 'text-[#9fe3ff] hover:bg-[rgba(255,255,255,0.05)]'
                        }`}
                      >
                        <span>Lesson {lesson}</span>
                        {selectedLesson === lesson && <div className="w-2 h-2 bg-white rounded-full"></div>}
                      </button>
                    ))
                  ) : (
                    <div className="px-6 py-8 text-center text-[#2aa8d8] text-sm">
                      No lessons available
                    </div>
                  )}
                </div>

                {/* Add Lesson Form */}
                <div className="border-t border-[rgba(255,255,255,0.1)] p-4 bg-[rgba(0,0,0,0.2)]">
                  {showAddLessonForm ? (
                    <div className="space-y-2 animate-in fade-in duration-200">
                      <input
                        type="text"
                        value={newLessonNumber}
                        onChange={(e) => setNewLessonNumber(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleAddLesson()}
                        placeholder="Lesson e.g. 1"
                        className="w-full px-3 py-2 bg-[rgba(255,255,255,0.05)] border border-[#2aa8d8] rounded-lg text-[#9fe3ff] placeholder-[#2aa8d8] focus:outline-none focus:border-[#00d2ff] focus:bg-[rgba(0,210,255,0.1)]"
                        autoFocus
                      />
                      <div className="flex gap-2">
                        <button
                          onClick={handleAddLesson}
                          className="flex-1 px-3 py-2 bg-[#2aa8d8] text-white font-semibold rounded-lg hover:bg-[#1a88b8] transition-all text-sm"
                        >
                          Add
                        </button>
                        <button
                          onClick={() => {
                            setShowAddLessonForm(false);
                            setNewLessonNumber('');
                          }}
                          className="flex-1 px-3 py-2 bg-[rgba(255,255,255,0.05)] text-[#9fe3ff] font-semibold rounded-lg hover:bg-[rgba(255,255,255,0.1)] transition-all text-sm"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <button
                      onClick={() => setShowAddLessonForm(true)}
                      className="w-full flex items-center justify-center gap-2 px-3 py-2 bg-[#2aa8d8] text-white font-semibold rounded-lg hover:bg-[#1a88b8] transition-all text-sm"
                    >
                      <Plus size={16} /> Add Lesson
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
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
