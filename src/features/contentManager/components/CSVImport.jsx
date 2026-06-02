import React from 'react';
import { Upload } from 'lucide-react';
import Papa from 'papaparse';

export default function CSVImport({ onImport }) {
  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        const questions = results.data.filter(q => q.question || q.question_image);
        if (questions.length > 0) {
          onImport(questions);
          alert(`Successfully imported ${questions.length} questions`);
        } else {
          alert('No valid questions found in the CSV file');
        }
      },
      error: (error) => {
        alert(`Error parsing CSV: ${error.message}`);
      }
    });

    // Reset input
    e.target.value = '';
  };

  return (
    <>
      <input
        type="file"
        accept=".csv"
        onChange={handleFileUpload}
        className="hidden"
        id="csv-import-input"
      />
      <button
        onClick={() => document.getElementById('csv-import-input').click()}
        className="flex items-center gap-2 px-4 py-2 bg-[#2aa8d8] text-white font-semibold rounded-none hover:bg-[#1a88b8] transition-all duration-300"
      >
        <Upload size={18} /> Import CSV
      </button>
    </>
  );
}
