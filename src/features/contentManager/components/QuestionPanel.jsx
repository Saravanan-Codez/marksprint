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
      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        {questions.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <p className="text-[#9fe3ff] text-lg mb-4">No questions in this lesson yet</p>
              <button
                onClick={onAddNew}
                className="px-6 py-3 bg-[#2aa8d8] text-white font-semibold rounded-none hover:bg-[#1a88b8] transition-all"
              >
                Add First Question
              </button>
            </div>
          </div>
        ) : (
          questions.map((question, index) => (
            <div
              key={question.id}
              className="bg-[rgba(255,255,255,0.03)] backdrop-blur-xl border border-[rgba(255,255,255,0.05)] rounded-none p-6 shadow-[0_0_20px_rgba(0,210,255,0.1)]"
            >
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-lg font-bold text-[#7fdfff]">
                  Q{index + 1}: {question.question || 'Untitled'}
                </h3>
                <div className="flex gap-2">
                  <button
                    onClick={() => onEdit(question)}
                    className="p-2 bg-[#2aa8d8] text-white rounded-none hover:bg-[#1a88b8] transition-all"
                    title="Edit"
                  >
                    <Edit2 size={18} />
                  </button>
                  <button
                    onClick={() => onDelete(question.id)}
                    className="p-2 bg-red-600 text-white rounded-none hover:bg-red-700 transition-all"
                    title="Delete"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>

              {question.question_image && (
                <div className="mb-4">
                  <img
                    src={question.question_image}
                    alt="Question"
                    className="max-h-48 rounded-none"
                  />
                </div>
              )}

              <div className="space-y-3 mb-4">
                <div>
                  <p className="text-[#2aa8d8] text-sm font-semibold">Options:</p>
                  <ul className="space-y-2 mt-2 text-[#9fe3ff]">
                    {[1, 2, 3, 4].map((optNum) => {
                      const optionKey = `option_${optNum}`;
                      const imageKey = `option_${optNum}_image`;
                      const option = question[optionKey];
                      const image = question[imageKey];

                      if (!option && !image) return null;

                      return (
                        <li key={optNum} className="flex gap-2">
                          <span className="text-[#00d2ff] font-semibold">({String.fromCharCode(64 + optNum)})</span>
                          <div>
                            {option && <span>{option}</span>}
                            {image && (
                              <div className="mt-1">
                                <img
                                  src={image}
                                  alt={`Option ${optNum}`}
                                  className="max-h-24 rounded-none"
                                />
                              </div>
                            )}
                          </div>
                        </li>
                      );
                    })}
                  </ul>
                </div>

                <div>
                  <p className="text-[#2aa8d8] text-sm font-semibold">Correct Answer:</p>
                  <p className="text-[#00ff00] font-bold mt-1">{question.answer}</p>
                </div>
              </div>

              <div className="text-xs text-[#2aa8d8] pt-3 border-t border-[rgba(255,255,255,0.1)]">
                <p>Last updated: {new Date(question.updatedAt).toLocaleString()}</p>
              </div>
            </div>
          ))
        )}
      </div>

      {questions.length > 0 && (
        <div className="p-6 border-t border-[rgba(255,255,255,0.1)] bg-[rgba(255,255,255,0.02)]">
          <button
            onClick={onAddNew}
            className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-[#2aa8d8] text-white font-bold rounded-none hover:bg-[#1a88b8] transition-all duration-300 text-lg"
          >
            <Plus size={24} /> ADD QUESTION
          </button>
        </div>
      )}
    </div>
  );
}
