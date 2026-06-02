import React, { useState, useEffect } from 'react';
import { Lock, AlertCircle } from 'lucide-react';
import Galaxy from '../../../components/Galaxy';
import ClickSpark from '../../../components/ClickSpark';

const CORRECT_PASSWORD = '.Sreeh@r!462';
const MAX_ATTEMPTS = 3;
const LOCKOUT_DURATION = 30 * 60 * 1000; // 30 minutes in milliseconds

export default function PasswordGate({ onUnlock }) {
  const [passwordInput, setPasswordInput] = useState(Array(CORRECT_PASSWORD.length).fill(''));
  const [attempts, setAttempts] = useState(0);
  const [isLocked, setIsLocked] = useState(false);
  const [lockoutTime, setLockoutTime] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [charValidation, setCharValidation] = useState(Array(CORRECT_PASSWORD.length).fill(null));

  // Check if device is desktop/PC only
  useEffect(() => {
    const isMobile = window.innerWidth < 768 || /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    if (isMobile) {
      setErrorMessage('Content Manager is only available on desktop/PC browsers');
      setIsLocked(true);
    }
  }, []);

  // Check for existing lockout in localStorage
  useEffect(() => {
    const storedLockout = localStorage.getItem('contentManagerLockout');
    if (storedLockout) {
      const lockoutEnd = parseInt(storedLockout);
      const now = Date.now();
      if (now < lockoutEnd) {
        setIsLocked(true);
        setLockoutTime(lockoutEnd);
      } else {
        localStorage.removeItem('contentManagerLockout');
        setAttempts(0);
      }
    }
  }, []);

  // Handle lockout timer countdown
  useEffect(() => {
    if (!lockoutTime) return;
    
    const interval = setInterval(() => {
      const now = Date.now();
      if (now >= lockoutTime) {
        setIsLocked(false);
        setLockoutTime(null);
        setAttempts(0);
        setPasswordInput(Array(CORRECT_PASSWORD.length).fill(''));
        setCharValidation(Array(CORRECT_PASSWORD.length).fill(null));
        localStorage.removeItem('contentManagerLockout');
        clearInterval(interval);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [lockoutTime]);

  const handleCharInput = (index, value) => {
    // Only allow single character input
    const char = value.slice(-1);
    
    if (char === '') {
      // Allow backspace
      const newInput = [...passwordInput];
      newInput[index] = '';
      setPasswordInput(newInput);
      return;
    }

    // Update current position
    const newInput = [...passwordInput];
    newInput[index] = char;
    setPasswordInput(newInput);

    // Auto-move to next field if character entered
    if (char && index < CORRECT_PASSWORD.length - 1) {
      const nextInput = document.getElementById(`password-char-${index + 1}`);
      if (nextInput) nextInput.focus();
    }

    // Check if all fields are filled
    if (index === CORRECT_PASSWORD.length - 1 && char) {
      validatePassword(newInput);
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace') {
      e.preventDefault();
      const newInput = [...passwordInput];
      newInput[index] = '';
      setPasswordInput(newInput);

      // Move to previous field
      if (index > 0) {
        const prevInput = document.getElementById(`password-char-${index - 1}`);
        if (prevInput) prevInput.focus();
      }
    } else if (e.key === 'ArrowLeft' && index > 0) {
      e.preventDefault();
      const prevInput = document.getElementById(`password-char-${index - 1}`);
      if (prevInput) prevInput.focus();
    } else if (e.key === 'ArrowRight' && index < CORRECT_PASSWORD.length - 1) {
      e.preventDefault();
      const nextInput = document.getElementById(`password-char-${index + 1}`);
      if (nextInput) nextInput.focus();
    }
  };

  const validatePassword = (input) => {
    const enteredPassword = input.join('');

    // Validate each character
    const validation = input.map((char, idx) => {
      if (char === CORRECT_PASSWORD[idx]) return 'correct';
      if (char === '') return null;
      return 'incorrect';
    });

    setCharValidation(validation);

    if (enteredPassword === CORRECT_PASSWORD) {
      setErrorMessage('');
      setAttempts(0);
      localStorage.removeItem('contentManagerLockout');
      setTimeout(() => onUnlock(), 500);
    } else {
      const newAttempts = attempts + 1;
      setAttempts(newAttempts);

      if (newAttempts >= MAX_ATTEMPTS) {
        const lockoutEnd = Date.now() + LOCKOUT_DURATION;
        localStorage.setItem('contentManagerLockout', lockoutEnd.toString());
        setIsLocked(true);
        setLockoutTime(lockoutEnd);
        setErrorMessage('Too many incorrect attempts. Locked for 30 minutes.');
      } else {
        setErrorMessage(`Incorrect password. ${MAX_ATTEMPTS - newAttempts} attempts remaining.`);
      }

      // Reset input for next attempt
      setTimeout(() => {
        setPasswordInput(Array(CORRECT_PASSWORD.length).fill(''));
        setCharValidation(Array(CORRECT_PASSWORD.length).fill(null));
      }, 1500);
    }
  };

  const getTimeRemaining = () => {
    if (!lockoutTime) return '';
    const now = Date.now();
    const remaining = Math.ceil((lockoutTime - now) / 1000);
    const minutes = Math.floor(remaining / 60);
    const seconds = remaining % 60;
    return `${minutes}m ${seconds}s`;
  };

  return (
    <ClickSpark isDark={true}>
      <div className="min-h-screen w-full relative flex flex-col items-center justify-center bg-[#0b1f2a] text-[#9fe3ff] p-4 overflow-hidden">
        <Galaxy isDark={true} />
        
        <style dangerouslySetInnerHTML={{ __html: `
          .password-input-box {
            width: 50px;
            height: 50px;
            font-size: 24px;
            font-weight: bold;
            text-align: center;
            border: 2px solid #2aa8d8;
            border-radius: 4px;
            background: rgba(255, 255, 255, 0.05);
            color: #7fdfff;
            transition: all 0.3s ease;
          }
          .password-input-box:focus {
            outline: none;
            border-color: #00d2ff;
            box-shadow: 0 0 10px rgba(0, 210, 255, 0.5);
            background: rgba(0, 210, 255, 0.1);
          }
          .password-input-box.correct {
            border-color: #00ff00;
            background: rgba(0, 255, 0, 0.1);
            color: #00ff00;
          }
          .password-input-box.incorrect {
            border-color: #ff0000;
            background: rgba(255, 0, 0, 0.1);
            color: #ff0000;
          }
        `}} />

        <div className="relative z-10 max-w-md w-full">
          <div className="bg-[rgba(255,255,255,0.03)] backdrop-blur-xl border border-[rgba(255,255,255,0.05)] rounded-none p-12 shadow-[0_0_20px_rgba(0,210,255,0.1)]">
            <div className="flex justify-center mb-8">
              <Lock size={48} className="text-[#00d2ff]" />
            </div>

            <h1 className="text-3xl font-bold text-center text-[#7fdfff] mb-2">
              Content Manager
            </h1>
            <p className="text-center text-[#9fe3ff] mb-8">
              Enter the security password to access
            </p>

            {errorMessage && (
              <div className="mb-6 p-4 bg-[rgba(255,0,0,0.1)] border border-red-500 rounded-none flex items-start gap-3">
                <AlertCircle size={20} className="text-red-500 flex-shrink-0 mt-0.5" />
                <p className="text-red-400 text-sm">{errorMessage}</p>
              </div>
            )}

            {isLocked && lockoutTime && (
              <div className="mb-6 p-4 bg-[rgba(255,165,0,0.1)] border border-orange-500 rounded-none text-center">
                <p className="text-orange-400 font-semibold">
                  Locked for: {getTimeRemaining()}
                </p>
              </div>
            )}

            <div className="mb-8">
              <label className="block text-center text-[#9fe3ff] mb-4 font-semibold">
                Password ({CORRECT_PASSWORD.length} characters)
              </label>
              <div className="flex justify-center gap-2 flex-wrap">
                {passwordInput.map((char, index) => (
                  <input
                    key={index}
                    id={`password-char-${index}`}
                    type="password"
                    maxLength="1"
                    value={char}
                    onChange={(e) => handleCharInput(index, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(index, e)}
                    disabled={isLocked}
                    className={`password-input-box ${
                      charValidation[index] === 'correct'
                        ? 'correct'
                        : charValidation[index] === 'incorrect'
                        ? 'incorrect'
                        : ''
                    } ${isLocked ? 'opacity-50 cursor-not-allowed' : ''}`}
                    autoFocus={index === 0}
                  />
                ))}
              </div>
            </div>

            <div className="text-center text-xs text-[#2aa8d8]">
              <p>Attempts: {attempts}/{MAX_ATTEMPTS}</p>
              <p className="mt-2">Green = Correct | Red = Incorrect</p>
            </div>
          </div>
        </div>
      </div>
    </ClickSpark>
  );
}
