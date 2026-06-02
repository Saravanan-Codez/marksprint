import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Download, Upload } from 'lucide-react';
import Papa from 'papaparse';
import Galaxy from '../../../components/Galaxy';
import SubjectPanel from './SubjectPanel';
import LessonPanel from './LessonPanel';
import QuestionPanel from './QuestionPanel';
import QuestionEditor from './QuestionEditor';
import VolumeSelector from './VolumeSelector';
import CSVImport from './CSVImport';

// Import all CSV files
import physicsCsv from '../../../data/physics.csv?url';
import chemistryCsv from '../../../data/chemistry.csv?url';
import mathsCsv from '../../../data/maths.csv?url';
import csCsv from '../../../data/cs.csv?url';
import biologyCsv from '../../../data/biology.csv?url';
import englishCsv from '../../../data/english.csv?url';
import tamilCsv from '../../../data/tamil.csv?url';

const CSV_MAP = {
  physics: physicsCsv,
  chemistry: chemistryCsv,
  maths: mathsCsv,
  'computer science': csCsv,
  'computer': csCsv,
  'cs': csCsv,
  biology: biologyCsv,
  english: englishCsv,
  tamil: tamilCsv
};

const DEFAULT_SUBJECTS = [
  'Physics',
  'Chemistry',
  'Maths',
  'Computer Science',
  'Biology',
  'English',
  'Tamil'
];

export default function ContentManager() {
  const [subjects, setSubjects] = useState([]);
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [selectedLesson, setSelectedLesson] = useState(null);
  const [selectedVolume, setSelectedVolume] = useState('1');
  const [questions, setQuestions] = useState([]);
  const [editingQuestion, setEditingQuestion] = useState(null);
  const [showEditor, setShowEditor] = useState(false);
  const [loading, setLoading] = useState(true);

  // Load data from localStorage and CSV files
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        
        // Load from localStorage first
        const storedData = localStorage.getItem('contentManagerData');
        let allQuestions = [];
        let savedSubjects = DEFAULT_SUBJECTS;

        if (storedData) {
          const data = JSON.parse(storedData);
          allQuestions = data.questions || [];
          savedSubjects = data.subjects && data.subjects.length > 0 
            ? data.subjects 
            : DEFAULT_SUBJECTS;
        }

        // Load questions from CSV files
        for (const [subjectKey, csvUrl] of Object.entries(CSV_MAP)) {
          try {
            const response = await fetch(csvUrl);
            if (response.ok) {
              const text = await response.text();
              Papa.parse(text, {
                header: true,
                dynamicTyping: false,
                skipEmptyLines: true,
                complete: (results) => {
                  const csvQuestions = results.data
                    .filter(q => (q.question && q.question.trim()) || q.question_image)
                    .map(q => ({
                      id: `csv-${subjectKey}-${Math.random()}`,
                      subject: DEFAULT_SUBJECTS.find(s => 
                        s.toLowerCase().replace(/\s+/g, '') === subjectKey.toLowerCase().replace(/\s+/g, '')
                      ) || subjectKey,
                      lesson: q.lesson || '1',
                      volume: q.vol || '1',
                      question: q.question || '',
                      option_1: q.option_1 || '',
                      option_2: q.option_2 || '',
                      option_3: q.option_3 || '',
                      option_4: q.option_4 || '',
                      answer: q.answer || '',
                      question_image: q.question_image || '',
                      option_1_image: q.option_1_image || '',
                      option_2_image: q.option_2_image || '',
                      option_3_image: q.option_3_image || '',
                      option_4_image: q.option_4_image || '',
                      createdAt: new Date().toISOString(),
                      updatedAt: new Date().toISOString(),
                      isFromCSV: true
                    }));
                  
                  // Merge with existing questions (avoid duplicates)
                  setQuestions(prev => {
                    const merged = [...prev];
                    csvQuestions.forEach(csvQ => {
                      const exists = merged.some(q => 
                        q.subject === csvQ.subject && 
                        q.question === csvQ.question &&
                        q.lesson === csvQ.lesson
                      );
                      if (!exists) {
                        merged.push(csvQ);
                      }
                    });
                    return merged;
                  });
                }
              });
            }
          } catch (error) {
            console.error(`Error loading CSV for ${subjectKey}:`, error);
          }
        }

        // Set subjects and questions
        setSubjects(savedSubjects);
        setQuestions(allQuestions);
      } catch (error) {
        console.error('Error loading data:', error);
        setSubjects(DEFAULT_SUBJECTS);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  // Save data to localStorage
  const saveData = (newSubjects, newQuestions) => {
    const data = {
      subjects: newSubjects || subjects,
      questions: newQuestions || questions,
      lastUpdated: new Date().toISOString()
    };
    localStorage.setItem('contentManagerData', JSON.stringify(data));
  };

  const handleAddSubject = (subjectName) => {
    if (!subjects.includes(subjectName)) {
      const newSubjects = [...subjects, subjectName];
      setSubjects(newSubjects);
      saveData(newSubjects, questions);
    }
  };

  const handleDeleteSubject = (subjectName) => {
    const newSubjects = subjects.filter(s => s !== subjectName);
    const newQuestions = questions.filter(q => q.subject !== subjectName);
    setSubjects(newSubjects);
    setQuestions(newQuestions);
    if (selectedSubject === subjectName) {
      setSelectedSubject(null);
      setSelectedLesson(null);
    }
    saveData(newSubjects, newQuestions);
  };

  const handleAddLesson = (lessonNumber) => {
    // Lessons are managed within the context of a subject
    // This is handled in the QuestionEditor
  };

  const handleAddQuestion = (questionData) => {
    const newQuestion = {
      id: Date.now().toString(),
      subject: selectedSubject,
      lesson: selectedLesson,
      volume: selectedVolume,
      ...questionData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      isFromCSV: false
    };

    const newQuestions = [...questions, newQuestion];
    setQuestions(newQuestions);
    saveData(subjects, newQuestions);
    setShowEditor(false);
    setEditingQuestion(null);
  };

  const handleEditQuestion = (question) => {
    setEditingQuestion(question);
    setShowEditor(true);
  };

  const handleUpdateQuestion = (updatedQuestion) => {
    const newQuestions = questions.map(q =>
      q.id === updatedQuestion.id
        ? { ...updatedQuestion, updatedAt: new Date().toISOString() }
        : q
    );
    setQuestions(newQuestions);
    saveData(subjects, newQuestions);
    setShowEditor(false);
    setEditingQuestion(null);
  };

  const handleDeleteQuestion = (questionId) => {
    if (confirm('Are you sure you want to delete this question?')) {
      const newQuestions = questions.filter(q => q.id !== questionId);
      setQuestions(newQuestions);
      saveData(subjects, newQuestions);
    }
  };

  const handleImportCSV = (importedQuestions) => {
    const newQuestions = [
      ...questions,
      ...importedQuestions.map(q => ({
        ...q,
        id: Date.now().toString() + Math.random(),
        subject: q.subject || selectedSubject,
        lesson: q.lesson || selectedLesson,
        volume: q.vol || selectedVolume,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        isFromCSV: false
      }))
    ];
    setQuestions(newQuestions);
    saveData(subjects, newQuestions);
  };

  const handleExportCSV = () => {
    const filteredQuestions = questions.filter(
      q => q.subject === selectedSubject && q.lesson === selectedLesson && q.volume === selectedVolume
    );

    if (filteredQuestions.length === 0) {
      alert('No questions to export');
      return;
    }

    const csv = [
      ['question', 'option_1', 'option_2', 'option_3', 'option_4', 'answer', 'lesson', 'vol', 'question_image', 'option_1_image', 'option_2_image', 'option_3_image', 'option_4_image'],
      ...filteredQuestions.map(q => [
        q.question || '',
        q.option_1 || '',
        q.option_2 || '',
        q.option_3 || '',
        q.option_4 || '',
        q.answer || '',
        q.lesson || '',
        q.volume || '',
        q.question_image || '',
        q.option_1_image || '',
        q.option_2_image || '',
        q.option_3_image || '',
        q.option_4_image || ''
      ])
    ];

    const csvContent = csv.map(row => row.map(cell => `"${cell}"`).join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${selectedSubject}_${selectedLesson}_${selectedVolume}.csv`;
    a.click();
  };

  const currentQuestions = questions.filter(
    q => q.subject === selectedSubject && q.lesson === selectedLesson && q.volume === selectedVolume
  );

  const lessons = [...new Set(questions
    .filter(q => q.subject === selectedSubject && q.volume === selectedVolume)
    .map(q => q.lesson)
    .filter(Boolean)
  )].sort((a, b) => parseInt(a) - parseInt(b));

  if (loading) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center bg-[#0b1f2a]">
        <p className="text-[#9fe3ff] text-xl">Loading...</p>
      </div>
    );
  }

  if (showEditor) {
    return (
      <QuestionEditor
        question={editingQuestion}
        subject={selectedSubject}
        lesson={selectedLesson}
        volume={selectedVolume}
        onSave={editingQuestion ? handleUpdateQuestion : handleAddQuestion}
        onCancel={() => {
          setShowEditor(false);
          setEditingQuestion(null);
        }}
      />
    );
  }

  return (
    <div className="min-h-screen w-full relative flex bg-[#0b1f2a] text-[#9fe3ff] overflow-hidden">
      <Galaxy isDark={true} />

      <div className="relative z-10 flex w-full h-screen">
        {/* Left Panel - Subjects */}
        <SubjectPanel
          subjects={subjects}
          selectedSubject={selectedSubject}
          onSelectSubject={setSelectedSubject}
          onAddSubject={handleAddSubject}
          onDeleteSubject={handleDeleteSubject}
        />

        {/* Middle Panel - Lessons */}
        {selectedSubject && (
          <LessonPanel
            lessons={lessons}
            selectedLesson={selectedLesson}
            onSelectLesson={setSelectedLesson}
            subject={selectedSubject}
          />
        )}

        {/* Main Panel - Questions */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {selectedSubject && selectedLesson ? (
            <>
              {/* Top Controls */}
              <div className="p-4 border-b border-[rgba(255,255,255,0.1)] flex flex-wrap gap-4 items-center justify-between">
                <div className="flex gap-4 items-center">
                  <VolumeSelector
                    selectedVolume={selectedVolume}
                    onVolumeChange={setSelectedVolume}
                  />
                  <button
                    onClick={handleExportCSV}
                    className="flex items-center gap-2 px-4 py-2 bg-[#2aa8d8] text-white font-semibold rounded-none hover:bg-[#1a88b8] transition-all duration-300"
                  >
                    <Download size={18} /> Export CSV
                  </button>
                  <CSVImport onImport={handleImportCSV} />
                </div>
              </div>

              {/* Questions List */}
              <QuestionPanel
                questions={currentQuestions}
                onEdit={handleEditQuestion}
                onDelete={handleDeleteQuestion}
                onAddNew={() => {
                  setEditingQuestion(null);
                  setShowEditor(true);
                }}
              />
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center">
                <h2 className="text-2xl font-bold text-[#7fdfff] mb-4">
                  Welcome to Content Manager
                </h2>
                <div className="bg-[rgba(255,255,255,0.03)] backdrop-blur-xl border border-[rgba(255,255,255,0.05)] rounded-none p-8 max-w-2xl">
                  <h3 className="text-xl font-semibold text-[#00d2ff] mb-4">How to Use:</h3>
                  <ul className="text-left space-y-3 text-[#9fe3ff]">
                    <li className="flex gap-3">
                      <span className="text-[#00d2ff] font-bold">1.</span>
                      <span>Select a subject from the left panel</span>
                    </li>
                    <li className="flex gap-3">
                      <span className="text-[#00d2ff] font-bold">2.</span>
                      <span>Select or create a lesson in the middle panel</span>
                    </li>
                    <li className="flex gap-3">
                      <span className="text-[#00d2ff] font-bold">3.</span>
                      <span>Choose the volume (1 or 2) for your questions</span>
                    </li>
                    <li className="flex gap-3">
                      <span className="text-[#00d2ff] font-bold">4.</span>
                      <span>Add, edit, or remove questions using the buttons</span>
                    </li>
                    <li className="flex gap-3">
                      <span className="text-[#00d2ff] font-bold">5.</span>
                      <span>Export to CSV or import from CSV file</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
