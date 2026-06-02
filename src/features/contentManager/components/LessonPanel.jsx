import React, { useState } from 'react';
import { Plus } from 'lucide-react';

export default function LessonPanel({
  lessons,
  selectedLesson,
  onSelectLesson,
  subject
}) {
  const [newLessonNumber, setNewLessonNumber] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);

  const handleAddLesson = () => {
    if (newLessonNumber.trim()) {
      onSelectLesson(newLessonNumber.trim());
      setNewLessonNumber('');
      setShowAddForm(false);
    }
  };

  return (
    <div className="w-64 border-r border-[rgba(255,255,255,0.1)] flex flex-col bg-[rgba(255,255,255,0.02)] overflow-y-auto">
      <div className="p-4 border-b border-[rgba(255,255,255,0.1)]">
        <h2 className="text-lg font-bold text-[#7fdfff]">Lessons</h2>
        <p className="text-xs text-[#2aa8d8] mt-1">{subject}</p>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-2">
        {lessons.map((lesson) => (
          <button
            key={lesson}
            onClick={() => onSelectLesson(lesson)}
            className={`w-full p-3 rounded-none text-left font-semibold transition-all duration-300 ${
              selectedLesson === lesson
                ? 'bg-[#2aa8d8] text-white'
                : 'bg-[rgba(255,255,255,0.05)] text-[#9fe3ff] hover:bg-[rgba(255,255,255,0.1)]'
            }`}
          >
            Lesson {lesson}
          </button>
        ))}
      </div>

      <div className="p-4 border-t border-[rgba(255,255,255,0.1)]">
        {showAddForm ? (
          <div className="space-y-2">
            <input
              type="text"
              value={newLessonNumber}
              onChange={(e) => setNewLessonNumber(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleAddLesson()}
              placeholder="Lesson number..."
              className="w-full px-3 py-2 bg-[rgba(255,255,255,0.05)] border border-[#2aa8d8] rounded-none text-[#9fe3ff] placeholder-[#2aa8d8] focus:outline-none focus:border-[#00d2ff]"
              autoFocus
            />
            <div className="flex gap-2">
              <button
                onClick={handleAddLesson}
                className="flex-1 px-3 py-2 bg-[#2aa8d8] text-white font-semibold rounded-none hover:bg-[#1a88b8] transition-all"
              >
                Add
              </button>
              <button
                onClick={() => {
                  setShowAddForm(false);
                  setNewLessonNumber('');
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
            className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-[#2aa8d8] text-white font-semibold rounded-none hover:bg-[#1a88b8] transition-all duration-300"
          >
            <Plus size={18} /> ADD LESSON
          </button>
        )}
      </div>
    </div>
  );
}
