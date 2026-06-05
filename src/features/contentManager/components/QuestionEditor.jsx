import React, { useState, useEffect } from 'react';
import { Save, X, Upload } from 'lucide-react';
import Galaxy from '../../../components/Galaxy';

export default function QuestionEditor({
  question,
  subject,
  lesson,
  volume,
  onSave,
  onCancel
}) {
  const [formData, setFormData] = useState({
    question: '',
    option_1: '',
    option_2: '',
    option_3: '',
    option_4: '',
    answer: '',
    question_image: '',
    option_1_image: '',
    option_2_image: '',
    option_3_image: '',
    option_4_image: '',
    volume: volume
  });

  useEffect(() => {
    if (question) {
      setFormData(question);
    } else {
      setFormData(prev => ({
        ...prev,
        volume: volume
      }));
    }
  }, [question, volume]);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleImageUpload = (field, e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        handleInputChange(field, event.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = () => {
    if (!formData.question.trim()) {
      alert('Please enter a question');
      return;
    }
    if (!formData.option_1.trim() && !formData.option_1_image) {
      alert('Please add at least one option');
      return;
    }
    if (!formData.answer.trim()) {
      alert('Please select the correct answer');
      return;
    }

    onSave({
      ...formData,
      subject,
      lesson,
      volume: formData.volume
    });
  };

  return (
    <div className="min-h-screen w-full relative flex flex-col bg-[#0b1f2a] text-[#9fe3ff] overflow-y-auto">
      <Galaxy isDark={true} />

      <div className="relative z-10 max-w-4xl w-full mx-auto p-6 my-8">
        <div className="bg-[rgba(255,255,255,0.03)] backdrop-blur-xl border border-[rgba(255,255,255,0.05)] rounded-none p-8 shadow-[0_0_20px_rgba(0,210,255,0.1)]">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold text-[#7fdfff]">
              {question ? 'Edit Question' : 'Add New Question'}
            </h1>
            <button
              onClick={onCancel}
              className="p-2 hover:bg-red-500 hover:bg-opacity-30 rounded-none transition-colors"
            >
              <X size={24} />
            </button>
          </div>

          <div className="space-y-6">
            {/* Question Text */}
            <div>
              <label className="block text-[#00d2ff] font-semibold mb-2">
                Question Text
              </label>
              <textarea
                value={formData.question}
                onChange={(e) => handleInputChange('question', e.target.value)}
                className="w-full p-4 bg-[rgba(255,255,255,0.05)] border border-[#2aa8d8] rounded-none text-[#9fe3ff] focus:outline-none focus:border-[#00d2ff] focus:bg-[rgba(0,210,255,0.1)] resize-none h-24"
                placeholder="Enter the question..."
              />
            </div>

            {/* Question Image */}
            <div>
              <label className="block text-[#00d2ff] font-semibold mb-2">
                Question Image (Optional)
              </label>
              <div className="flex gap-4 items-start">
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleImageUpload('question_image', e)}
                  className="hidden"
                  id="question-image-input"
                />
                <button
                  onClick={() => document.getElementById('question-image-input').click()}
                  className="flex items-center gap-2 px-4 py-2 bg-[#2aa8d8] text-white font-semibold rounded-none hover:bg-[#1a88b8] transition-all"
                >
                  <Upload size={18} /> Upload Image
                </button>
                {formData.question_image && (
                  <div className="relative">
                    <img
                      src={formData.question_image}
                      alt="Question"
                      className="max-h-32 rounded-none"
                    />
                    <button
                      onClick={() => handleInputChange('question_image', '')}
                      className="absolute top-1 right-1 p-1 bg-red-600 text-white rounded-none"
                    >
                      <X size={16} />
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Options */}
            <div className="space-y-4">
              <h3 className="text-[#00d2ff] font-semibold text-lg">Options</h3>
              {[1, 2, 3, 4].map((optNum) => (
                <div key={optNum} className="bg-[rgba(255,255,255,0.02)] p-4 rounded-none border border-[rgba(255,255,255,0.05)]">
                  <label className="block text-[#2aa8d8] font-semibold mb-2">
                    Option {String.fromCharCode(64 + optNum)}
                  </label>
                  <textarea
                    value={formData[`option_${optNum}`]}
                    onChange={(e) => handleInputChange(`option_${optNum}`, e.target.value)}
                    className="w-full p-3 bg-[rgba(255,255,255,0.05)] border border-[#2aa8d8] rounded-none text-[#9fe3ff] focus:outline-none focus:border-[#00d2ff] focus:bg-[rgba(0,210,255,0.1)] resize-none h-16 mb-3"
                    placeholder={`Enter option ${String.fromCharCode(64 + optNum)}...`}
                  />

                  <div className="flex gap-4 items-start">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleImageUpload(`option_${optNum}_image`, e)}
                      className="hidden"
                      id={`option-${optNum}-image-input`}
                    />
                    <button
                      onClick={() => document.getElementById(`option-${optNum}-image-input`).click()}
                      className="flex items-center gap-2 px-3 py-1 bg-[#2aa8d8] text-white text-sm font-semibold rounded-none hover:bg-[#1a88b8] transition-all"
                    >
                      <Upload size={16} /> Image
                    </button>
                    {formData[`option_${optNum}_image`] && (
                      <div className="relative">
                        <img
                          src={formData[`option_${optNum}_image`]}
                          alt={`Option ${optNum}`}
                          className="max-h-24 rounded-none"
                        />
                        <button
                          onClick={() => handleInputChange(`option_${optNum}_image`, '')}
                          className="absolute top-1 right-1 p-1 bg-red-600 text-white rounded-none"
                        >
                          <X size={14} />
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Volume Selection */}
            <div>
              <label className="block text-[#00d2ff] font-semibold mb-2">
                Volume
              </label>
              <select
                value={formData.volume || '1'}
                onChange={(e) => handleInputChange('volume', e.target.value)}
                className="w-full p-3 bg-[rgba(255,255,255,0.05)] border border-[#2aa8d8] rounded-none text-[#9fe3ff] focus:outline-none focus:border-[#00d2ff] focus:bg-[rgba(0,210,255,0.1)]"
              >
                <option value="1">Volume 1</option>
                <option value="2">Volume 2</option>
              </select>
            </div>

            {/* Correct Answer */}
            <div>
              <label className="block text-[#00d2ff] font-semibold mb-2">
                Correct Answer
              </label>
              <select
                value={formData.answer}
                onChange={(e) => handleInputChange('answer', e.target.value)}
                className="w-full p-3 bg-[rgba(255,255,255,0.05)] border border-[#2aa8d8] rounded-none text-[#9fe3ff] focus:outline-none focus:border-[#00d2ff] focus:bg-[rgba(0,210,255,0.1)]"
              >
                <option value="">Select the correct answer...</option>
                {[1, 2, 3, 4].map((optNum) => {
                  const optionText = formData[`option_${optNum}`];
                  if (!optionText) return null;
                  return (
                    <option key={optNum} value={optionText}>
                      Option {String.fromCharCode(64 + optNum)}: {optionText.substring(0, 50)}...
                    </option>
                  );
                })}
              </select>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4 pt-6 border-t border-[rgba(255,255,255,0.1)]">
              <button
                onClick={handleSave}
                className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-[#00ff00] text-black font-bold rounded-none hover:bg-[#00dd00] transition-all duration-300 text-lg"
              >
                <Save size={20} /> {question ? 'Update' : 'Save'} Question
              </button>
              <button
                onClick={onCancel}
                className="flex-1 px-6 py-3 bg-[rgba(255,255,255,0.05)] text-[#9fe3ff] font-bold rounded-none hover:bg-[rgba(255,255,255,0.1)] transition-all duration-300"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
