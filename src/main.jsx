import React, { Suspense } from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import MainLayout from './layouts/MainLayout.jsx';
import { ThemeProvider } from './context/ThemeProvider.jsx';
import { AuthProvider } from './context/AuthContext.jsx';
import { ToastProvider } from './context/ToastContext.jsx';
import { ProtectedRoute } from './components/ProtectedRoute.jsx';
import { ErrorBoundary } from './components/ErrorBoundary.jsx';
import LoadingFallback from './components/LoadingFallback.jsx';
import './index.css';
import { HomePage, QuizPage, AboutPage, ContentManagerPage, DashboardPage, LoginPage, SignupPage, NotFoundPage } from './routes/lazyPages';

// Register Service Worker for Offline-First capability
if ('serviceWorker' in navigator && import.meta.env.PROD) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js').catch((err) => {
      console.warn('Service worker registration notice:', err);
    });
  });
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ErrorBoundary>
      <ToastProvider>
        <AuthProvider>
          <ThemeProvider>
            <BrowserRouter>
              <Suspense fallback={<LoadingFallback message="Loading the app experience..." />}>
                <Routes>
                  <Route path='/login' element={<LoginPage />} />
                  <Route path='/signup' element={<SignupPage />} />
                  <Route element={<MainLayout />}>
                    <Route path='/' element={<HomePage />} />
                    <Route path='/dashboard' element={<DashboardPage />} />
                    <Route path='/quiz/:subject' element={<QuizPage />} />
                    <Route path='/about' element={<AboutPage />} />
                    <Route
                      path='/content-manager'
                      element={
                        <ProtectedRoute requiredRole='teacher'>
                          <ContentManagerPage />
                        </ProtectedRoute>
                      }
                    />
                    <Route path='*' element={<NotFoundPage />} />
                  </Route>
                </Routes>
              </Suspense>
            </BrowserRouter>
          </ThemeProvider>
        </AuthProvider>
      </ToastProvider>
    </ErrorBoundary>
  </React.StrictMode>
);