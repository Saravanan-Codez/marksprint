import React from 'react';
import { Edit2, Trash2, Plus } from 'lucide-react';

export default function QuestionPanel({
  questions,
  onEdit,
  onDelete,
  onAddNew
}) {
  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      <div className="flex-1 overflow-y-auto p-12 space-y-8 custom-scrollbar">
        {questions.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <div className="w-20 h-20 rounded-full bg-[rgba(0,210,255,0.1)] flex items-center justify-center border-2 border-[#00d2ff] mx-auto mb-6 animate-pulse">
                <Plus size={40} className="text-[#00d2ff]" />
              </div>
              <p className="text-[#9fe3ff] text-xl mb-8 font-semibold">No questions in this lesson yet</p>
              <button
                onClick={onAddNew}
                className="px-10 py-4 bg-[#2aa8d8] text-white font-bold rounded-lg hover:bg-[#1a88b8] transition-all shadow-lg hover:shadow-[#2aa8d8]/40 text-lg"
              >
                + Add First Question
              </button>
            </div>
          </div>
        ) : (
          questions.map((question, index) => (
            <div
              key={question.id}
              className="bg-[rgba(255,255,255,0.03)] backdrop-blur-xl border border-[rgba(255,255,255,0.05)] rounded-lg p-8 shadow-[0_0_20px_rgba(0,210,255,0.1)] hover:shadow-[0_0_30px_rgba(0,210,255,0.15)] transition-all duration-300 flex flex-col"
            >
              {/* Question Header */}
              <div className="mb-6">
                <h3 className="text-lg font-bold text-[#7fdfff] mb-2">
                  <span className="text-[#00d2ff]">Q{index + 1}:</span> {question.question || 'Untitled Question'}
                </h3>
              </div>

              {/* Question Image */}
              {question.question_image && (
                <div className="mb-8 rounded-lg overflow-hidden border border-[rgba(255,255,255,0.1)]">
                  <img
                    src={question.question_image}
                    alt="Question"
                    className="max-h-56 w-full object-cover"
                  />
                </div>
              )}

              {/* Options */}
              <div className="space-y-4 mb-8">
                <p className="text-[#2aa8d8] text-sm font-semibold uppercase tracking-wide">Options:</p>
                <ul className="space-y-3 text-[#9fe3ff]">
                  {[1, 2, 3, 4].map((optNum) => {
                    const optionKey = `option_${optNum}`;
                    const imageKey = `option_${optNum}_image`;
                    const option = question[optionKey];
                    const image = question[imageKey];

                    if (!option && !image) return null;

                    return (
                      <li key={optNum} className="flex gap-3 p-4 bg-[rgba(255,255,255,0.02)] rounded-lg border border-[rgba(255,255,255,0.05)]">
                        <span className="text-[#00d2ff] font-bold min-w-fit text-lg">({String.fromCharCode(64 + optNum)})</span>
                        <div className="flex-1">
                          {option && <span className="block text-base">{option}</span>}
                          {image && (
                            <div className="mt-3 rounded-lg overflow-hidden border border-[rgba(255,255,255,0.1)]">
                              <img
                                src={image}
                                alt={`Option ${optNum}`}
                                className="max-h-32 w-full object-cover"
                              />
                            </div>
                          )}
                        </div>
                      </li>
                    );
                  })}
                </ul>
              </div>

              {/* Correct Answer */}
              <div className="bg-[rgba(0,255,0,0.08)] border border-[rgba(0,255,0,0.2)] p-5 rounded-lg mb-8">
                <p className="text-[#2aa8d8] text-sm font-semibold uppercase tracking-wide mb-2">Correct Answer:</p>
                <p className="text-[#00ff00] font-bold text-xl">{question.answer}</p>
              </div>

              {/* Metadata */}
              <div className="text-xs text-[#2aa8d8] pb-6 border-b border-[rgba(255,255,255,0.1)] flex justify-between">
                <span>Created: {new Date(question.createdAt).toLocaleDateString()}</span>
                <span>Updated: {new Date(question.updatedAt).toLocaleDateString()}</span>
              </div>

              {/* Action Buttons - Bottom */}
              <div className="flex gap-4 mt-6 pt-6">
                <button
                  onClick={() => onEdit(question)}
                  className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-[#2aa8d8] text-white rounded-lg hover:bg-[#1a88b8] transition-all shadow-md hover:shadow-[#2aa8d8]/40 font-semibold"
                >
                  <Edit2 size={18} /> Edit
                </button>
                <button
                  onClick={() => onDelete(question.id)}
                  className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-all shadow-md hover:shadow-red-600/40 font-semibold"
                >
                  <Trash2 size={18} /> Delete
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {questions.length > 0 && (
        <div className="p-8 border-t border-[rgba(255,255,255,0.1)] bg-[rgba(255,255,255,0.02)]">
          <button
            onClick={onAddNew}
            className="w-full flex items-center justify-center gap-3 px-8 py-4 bg-[#2aa8d8] text-white font-bold rounded-lg hover:bg-[#1a88b8] transition-all duration-300 text-lg shadow-lg hover:shadow-[#2aa8d8]/40"
          >
            <Plus size={24} /> ADD QUESTION
          </button>
        </div>
      )}

      <style dangerouslySetInnerHTML={{ __html: `
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.02);
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(42, 168, 216, 0.3);
          border-radius: 3px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(42, 168, 216, 0.5);
        }
      `}} />
    </div>
  );
}
