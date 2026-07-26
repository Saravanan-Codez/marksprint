import React, { Suspense, lazy } from "react";
import { useParams } from "react-router-dom";
import { useAuth } from "../context/useAuth";

import { useQuizEngine } from "../features/quiz/hooks/useQuizEngine";
import QuizSetup from "../features/quiz/components/QuizSetup";
import QuizActive from "../features/quiz/components/QuizActive";

const ResultsBoard = lazy(() => import("../features/quiz/components/ResultsBoard"));
const RevisionBoard = lazy(() => import("../features/quiz/components/RevisionBoard"));

function QuizLoadingSkeleton({ subject }) {
  return (
    <div className="container py-5 d-flex align-items-center justify-content-center" style={{ minHeight: '60vh' }}>
      <div className="neo-brutal-card p-5 text-center shadow-hard" style={{ maxWidth: '400px', width: '100%', background: 'var(--bg-main)' }}>
        <div className="mb-4">
          <div className="d-flex align-items-center justify-content-center gap-2 font-mono font-bold text-xs uppercase mb-2" style={{ color: 'var(--text-muted)' }}>
            <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true" style={{ width: '1rem', height: '1rem', borderWidth: '0.15em' }}></span>
            INITIALIZING SPRINT...
          </div>
          <h2 className="font-headline text-3xl font-black uppercase italic m-0" style={{ color: 'var(--text-main)' }}>
            {subject}
          </h2>
        </div>
        
        <div className="progress border-brutal" style={{ height: '24px', background: 'var(--bg-input)' }}>
          <div 
            className="progress-bar progress-bar-striped progress-bar-animated font-mono text-xs font-bold text-black border-r-2 border-black" 
            role="progressbar" 
            aria-valuenow="100" 
            aria-valuemin="0" 
            aria-valuemax="100" 
            style={{ width: '100%', background: 'var(--brand)' }}
          >
            LOADING DATASET
          </div>
        </div>
        <p className="mt-3 mb-0 font-mono text-xs font-bold uppercase" style={{ color: 'var(--text-muted)' }}>
          ESTABLISHING SECURE CONNECTION TO MARKSPRINT CORE...
        </p>
      </div>
    </div>
  );
}

export default function QuizPage() {
  const { subject } = useParams();
  const { userProfile } = useAuth();
  const board = userProfile?.board || 'tn_state';
  const standard = userProfile?.standard || '12';
  const engine = useQuizEngine(subject, board, standard);

  if (engine.loading) {
    return (
      <div className="w-full flex-1 h-full flex flex-col items-center">
        <QuizLoadingSkeleton subject={subject ? subject.charAt(0).toUpperCase() + subject.slice(1) : 'Subject'} />
      </div>
    );
  }

  return (
    <div className="w-full flex-1 h-full flex flex-col items-center">
      {engine.quizMode === "setup" && <QuizSetup engine={engine} subject={subject} />}
      {engine.quizMode === "active" && <QuizActive engine={engine} />}
      {engine.quizMode === "result" && (
        <Suspense fallback={<div className="text-center py-6">Loading results...</div>}>
          <ResultsBoard engine={engine} />
        </Suspense>
      )}
      {engine.quizMode === "revision" && (
        <Suspense fallback={<div className="text-center py-6">Loading revision board...</div>}>
          <RevisionBoard engine={engine} />
        </Suspense>
      )}
    </div>
  );
}
