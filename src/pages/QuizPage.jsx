import React from "react";
import { useParams } from "react-router-dom";

import { useQuizEngine } from "../features/quiz/hooks/useQuizEngine";
import QuizSetup from "../features/quiz/components/QuizSetup";
import QuizActive from "../features/quiz/components/QuizActive";
import ResultsBoard from "../features/quiz/components/ResultsBoard";
import RevisionBoard from "../features/quiz/components/RevisionBoard";

function QuizLoadingSkeleton({ subject }) {
  return (
    <div className="container py-4" style={{ maxWidth: '800px' }}>
      <div className="text-center mb-5">
        <div
          className="d-inline-block mb-3"
          style={{
            width: '52px', height: '52px',
            background: 'rgba(99, 102, 241, 0.15)',
            border: '1px solid rgba(99, 102, 241, 0.3)',
            borderRadius: '0px',
            animation: 'pulse 1.5s ease-in-out infinite'
          }}
        />
        <h2 className="font-bold text-white mb-2 text-uppercase" style={{ fontSize: '1.6rem', letterSpacing: '0.05em' }}>
          {subject}
        </h2>
        <p className="text-muted font-medium" style={{ fontSize: '0.88rem' }}>
          Loading dataset and preparing questions...
        </p>
        <div className="d-flex justify-content-center mt-3">
          <div className="spinner-border text-primary" role="status" style={{ width: '2rem', height: '2rem' }}>
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function QuizPage() {
  const { subject } = useParams();
  const engine = useQuizEngine(subject);

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
      {engine.quizMode === "result" && <ResultsBoard engine={engine} />}
      {engine.quizMode === "revision" && <RevisionBoard engine={engine} />}
    </div>
  );
}
