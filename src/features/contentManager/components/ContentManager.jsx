import React from 'react';
import { Download } from 'lucide-react';
import { useContentManager } from '../hooks/useContentManager';
import BreadcrumbNavigation from './BreadcrumbNavigation';
import QuestionPanel from './QuestionPanel';
import QuestionEditor from './QuestionEditor';
import VolumeSelector from './VolumeSelector';
import CSVImport from './CSVImport';

export default function ContentManager() {
  const {
    availableSubjects,
    availableLessons,
    availableVolumes,
    selectedSubject,
    selectedLesson,
    selectedVolume,
    editingQuestion,
    showEditor,
    loading,
    currentQuestions,
    setSelectedSubject,
    setSelectedLesson,
    setSelectedVolume,
    setShowEditor,
    setEditingQuestion,
    handleAddQuestion,
    handleEditQuestion,
    handleUpdateQuestion,
    handleDeleteQuestion,
    handleAddSubject,
    handleDeleteSubject,
    handleImportCSV,
    handleExportCSV
  } = useContentManager();

  if (loading) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center bg-[#0b1f2a]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#00d2ff] mx-auto mb-4"></div>
          <p className="text-[#9fe3ff] text-xl font-mono">Loading Content Manager...</p>
        </div>
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
    <div className="min-h-screen w-full flex flex-col" style={{ background: 'var(--color-base)', color: '#C8ACD6' }}>

      <div className="relative z-10 flex flex-col w-full h-screen">
        {/* Breadcrumb Navigation */}
        <BreadcrumbNavigation
          subjects={availableSubjects}
          lessons={availableLessons}
          selectedSubject={selectedSubject}
          selectedLesson={selectedLesson}
          onSelectSubject={(s) => {
            setSelectedSubject(s);
            setSelectedLesson(null);
          }}
          onSelectLesson={setSelectedLesson}
          onAddSubject={handleAddSubject}
          onAddLesson={(lesson) => {
            setSelectedLesson(lesson);
          }}
          onDeleteSubject={handleDeleteSubject}
          onDeleteLesson={() => {}}
        />

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {selectedSubject && selectedLesson ? (
            <>
              {/* Top Controls */}
              <div className="px-8 py-5 border-b border-[rgba(255,255,255,0.1)] flex flex-wrap gap-6 items-center justify-between bg-[rgba(0,0,0,0.2)]">
                <div className="flex gap-6 items-center">
                  <VolumeSelector
                    selectedVolume={selectedVolume}
                    onVolumeChange={setSelectedVolume}
                    availableVolumes={availableVolumes}
                  />
                  <div className="h-6 w-[1px] bg-[rgba(255,255,255,0.1)]"></div>
                  <button
                    onClick={handleExportCSV}
                    className="flex items-center gap-2 px-6 py-2 bg-[#2aa8d8] text-white font-semibold rounded-lg hover:bg-[#1a88b8] transition-all duration-300 shadow-md hover:shadow-[#2aa8d8]/40"
                  >
                    <Download size={18} /> Export CSV
                  </button>
                  <CSVImport onImport={handleImportCSV} />
                </div>
                <div className="text-sm text-[#2aa8d8] font-mono bg-[rgba(0,210,255,0.1)] px-4 py-2 rounded-lg">
                  {currentQuestions.length} Questions
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
            <div className="flex-1 flex items-center justify-center p-12">
              <div className="text-center max-w-3xl">
                <h2 className="text-4xl font-bold text-[#7fdfff] mb-8">
                  Content Manager
                </h2>
                <div className="bg-[rgba(255,255,255,0.03)] backdrop-blur-xl border border-[rgba(255,255,255,0.05)] rounded-lg p-16 shadow-2xl">
                  {!selectedSubject ? (
                    <>
                      <h3 className="text-2xl font-semibold text-[#00d2ff] mb-8">Getting Started:</h3>
                      <div className="flex flex-col items-center gap-8">
                        <div className="w-24 h-24 rounded-full bg-[rgba(0,210,255,0.1)] flex items-center justify-center border-2 border-[#00d2ff] animate-pulse">
                          <span className="text-5xl">📚</span>
                        </div>
                        <p className="text-[#9fe3ff] text-xl leading-relaxed">
                          Select a <span className="text-[#00d2ff] font-bold">Subject</span> to begin managing content.
                        </p>
                        <div className="text-sm text-[#2aa8d8] mt-6 space-y-3">
                          <p className="font-semibold">Available Subjects:</p>
                          <div className="flex flex-wrap gap-3 justify-center">
                            {availableSubjects.map(s => (
                              <button
                                key={s}
                                onClick={() => {
                                  setSelectedSubject(s);
                                  setSelectedLesson(null);
                                }}
                                className="px-4 py-2 bg-[rgba(0,210,255,0.1)] hover:bg-[rgba(0,210,255,0.25)] text-[#2aa8d8] hover:text-[#00d2ff] rounded-lg text-sm font-medium border border-[rgba(0,210,255,0.2)] hover:border-[#00d2ff] transition-all duration-300 cursor-pointer"
                              >
                                {s}
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>
                    </>
                  ) : (
                    <>
                      <h3 className="text-2xl font-semibold text-[#00d2ff] mb-8">Next Step:</h3>
                      <div className="flex flex-col items-center gap-8">
                        <div className="w-24 h-24 rounded-full bg-[rgba(0,210,255,0.1)] flex items-center justify-center border-2 border-[#00d2ff] animate-pulse">
                          <span className="text-5xl">📖</span>
                        </div>
                        <p className="text-[#9fe3ff] text-xl leading-relaxed">
                          Now select a <span className="text-[#00d2ff] font-bold">Lesson</span> for <span className="text-white font-bold">{selectedSubject}</span> from the breadcrumb navigation above.
                        </p>
                        {availableLessons.length > 0 ? (
                          <div className="text-sm text-[#2aa8d8] mt-6">
                            <p className="mb-3 font-semibold">Available Lessons:</p>
                            <div className="flex flex-wrap gap-3 justify-center">
                              {availableLessons.map(l => (
                                <button
                                  key={l}
                                  onClick={() => setSelectedLesson(l)}
                                  className="px-4 py-2 bg-[rgba(0,210,255,0.1)] hover:bg-[rgba(0,210,255,0.25)] text-[#2aa8d8] hover:text-[#00d2ff] rounded-lg text-sm font-medium border border-[rgba(0,210,255,0.2)] hover:border-[#00d2ff] transition-all duration-300 cursor-pointer"
                                >
                                  Lesson {l}
                                </button>
                              ))}
                            </div>
                          </div>
                        ) : (
                          <p className="text-[#2aa8d8] text-base mt-6">
                            No lessons found. Click "Add Lesson" in the breadcrumb navigation to create one.
                          </p>
                        )}
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
