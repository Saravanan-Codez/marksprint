import React, { createContext, useState, useEffect } from 'react';
import { loadFirebase, loadFirebaseAuth, loadFirestore } from '../config/firebase';

const AuthContext = createContext();

function formatAuthError(err) {
  if (!err) return 'An unexpected authentication error occurred.';
  const message = (err.code || err.message || '').toString();
  
  if (message.includes('auth/invalid-credential') || message.includes('auth/wrong-password') || message.includes('auth/user-not-found')) {
    return 'Invalid email or password. Please verify your credentials and try again.';
  }
  if (message.includes('auth/email-already-in-use')) {
    return 'An account with this email address already exists. Please log in using your existing account.';
  }
  if (message.includes('auth/weak-password') || message.includes('password-policy')) {
    return 'Password must be at least 8 characters long and contain at least one uppercase letter, lowercase letter, number, and special character.';
  }
  if (message.includes('auth/invalid-email')) {
    return 'Please enter a valid email address (e.g. student@school.com).';
  }
  if (message.includes('auth/network-request-failed')) {
    return 'Network connection failed. Please check your internet connection and try again.';
  }
  if (message.includes('auth/popup-closed-by-user')) {
    return 'Google sign-in popup was closed before completion. Please try again.';
  }
  if (message.includes('auth/popup-blocked')) {
    return 'Google sign-in popup was blocked by your browser. Please allow popups for this site and retry.';
  }
  if (message.includes('auth/account-exists-with-different-credential')) {
    return 'An account already exists with the same email address using a different sign-in method.';
  }
  if (message.includes('auth/too-many-requests')) {
    return 'Access temporarily throttled due to multiple failed attempts. Please wait 60 seconds before trying again.';
  }
  if (message.includes('auth/unauthorized-domain')) {
    return 'This web domain is not authorized in Firebase authentication settings.';
  }

  return err.message || 'Authentication error. Please check your network and try again.';
}

export { AuthContext };
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Set persistence to local if Firebase is available
  useEffect(() => {
    let stopped = false;

    const initPersistence = async () => {
      const { auth, isFirebaseConfigured } = await loadFirebaseAuth();
      if (stopped || !isFirebaseConfigured || !auth) {
        setLoading(false);
        return;
      }
      const { setPersistence, browserLocalPersistence } = await import('firebase/auth');
      setPersistence(auth, browserLocalPersistence).catch((err) => {
        console.warn('Error setting persistence:', err);
      });
    };

    initPersistence();
    return () => {
      stopped = true;
    };
  }, []);

  // Listen to auth state
  useEffect(() => {
    let stopped = false;
    let unsubscribe = null;

    const initAuthListener = async () => {
      const { auth, isFirebaseConfigured } = await loadFirebaseAuth();
      if (stopped || !isFirebaseConfigured || !auth) {
        setLoading(false);
        return;
      }

      const { onAuthStateChanged } = await import('firebase/auth');
      unsubscribe = onAuthStateChanged(auth, async (authUser) => {
        setLoading(true);
        try {
          if (authUser) {
            setUser(authUser);
            const fallbackProfile = {
              uid: authUser.uid,
              email: authUser.email,
              displayName: authUser.displayName || authUser.email?.split('@')[0] || 'Student',
              role: 'student',
              providers: authUser.providerData.map((p) => p.providerId),
            };

            // Check local gamification data for setup state
            try {
              const { getLocalGamificationData } = await import('../services/gamificationService');
              const localData = getLocalGamificationData();
              if (localData?.setupCompleted || (localData?.board && localData?.standard)) {
                fallbackProfile.setupCompleted = true;
                fallbackProfile.board = localData.board;
                fallbackProfile.standard = localData.standard;
              }
            } catch (e) {
              console.warn('Local data check warning:', e);
            }

            // Check Google Drive if token available
            const sessionToken = sessionStorage.getItem('marksprint_gdrive_token');
            if (sessionToken) {
              try {
                const { loadRecordBookFromDrive } = await import('../services/driveOrganizerService');
                const driveData = await loadRecordBookFromDrive(sessionToken);
                if (driveData && (driveData.setupCompleted || (driveData.board && driveData.standard))) {
                  fallbackProfile.setupCompleted = true;
                  fallbackProfile.board = driveData.board || fallbackProfile.board;
                  fallbackProfile.standard = driveData.standard || fallbackProfile.standard;
                }
              } catch (dErr) {
                console.warn('Drive check on auth state change warning:', dErr);
              }
            }

            try {
              const dbInstance = await loadFirestore();
              if (dbInstance) {
                const { doc, getDoc, setDoc, serverTimestamp } = await import('firebase/firestore');
                const userRef = doc(dbInstance, 'users', authUser.uid);
                const userDoc = await getDoc(userRef);
                if (userDoc.exists()) {
                  const dbData = userDoc.data();
                  setUserProfile({ ...fallbackProfile, ...dbData });
                } else {
                  const defaultProfile = {
                    ...fallbackProfile,
                    createdAt: serverTimestamp(),
                  };
                  await setDoc(userRef, defaultProfile).catch(() => {});
                  setUserProfile(defaultProfile);
                }
              } else {
                setUserProfile(fallbackProfile);
              }
            } catch (fsErr) {
              console.warn('Firestore profile fetch warning:', fsErr);
              setUserProfile(fallbackProfile);
            }
          } else {
            setUser(null);
            setUserProfile(null);
          }
        } catch (err) {
          console.error('Error fetching user profile:', err);
          setError(formatAuthError(err));
        } finally {
          setLoading(false);
        }
      });
    };

    initAuthListener();
    return () => {
      stopped = true;
      if (typeof unsubscribe === 'function') unsubscribe();
    };
  }, []);

  const assertFirebaseEnabled = async () => {
    const { auth, isFirebaseConfigured } = await loadFirebaseAuth();
    if (!isFirebaseConfigured || !auth) {
      const error = new Error('Firebase is not configured. Please check your .env file and ensure all VITE_FIREBASE_* variables are set.');
      setError(error.message);
      throw error;
    }
    return { auth };
  };

  // Sign up with email
  const signUp = async (email, password, displayName = 'Student') => {
    setError(null);
    try {
      const { auth } = await assertFirebaseEnabled();
      const dbInstance = await loadFirestore();
      const { createUserWithEmailAndPassword, updateProfile } = await import('firebase/auth');
      const { doc, setDoc, serverTimestamp } = await import('firebase/firestore');

      const result = await createUserWithEmailAndPassword(auth, email, password);
      const newUser = result.user;
      await updateProfile(newUser, { displayName: displayName || 'Student' }).catch(() => {});

      const profileData = {
        uid: newUser.uid,
        email: newUser.email,
        displayName: displayName || 'Student',
        role: 'student',
        providers: newUser.providerData.map((p) => p.providerId),
      };

      if (dbInstance) {
        const userRef = doc(dbInstance, 'users', newUser.uid);
        await setDoc(userRef, { ...profileData, createdAt: serverTimestamp() }).catch(() => {});
      }
      setUserProfile(profileData);
      return result.user;
    } catch (err) {
      const formatted = formatAuthError(err);
      setError(formatted);
      throw new Error(formatted);
    }
  };

  // Sign in with email
  const signIn = async (email, password) => {
    setError(null);
    try {
      const { auth } = await assertFirebaseEnabled();
      const { signInWithEmailAndPassword } = await import('firebase/auth');
      const result = await signInWithEmailAndPassword(auth, email, password);
      return result.user;
    } catch (err) {
      const formatted = formatAuthError(err);
      setError(formatted);
      throw new Error(formatted);
    }
  };

  const [googleAccessToken, setGoogleAccessToken] = useState(() => {
    try {
      return sessionStorage.getItem('marksprint_gdrive_token') || null;
    } catch {
      return null;
    }
  });

  // Sign in with Google
  const signInWithGoogle = async () => {
    setError(null);
    try {
      const { auth, db } = await assertFirebaseEnabled();
      const { GoogleAuthProvider, signInWithPopup } = await import('firebase/auth');
      const { doc, getDoc, setDoc, serverTimestamp } = await import('firebase/firestore');

      const provider = new GoogleAuthProvider();
      // Request permission to store test results files in user's Google Drive account
      provider.addScope('https://www.googleapis.com/auth/drive.file');

      const result = await signInWithPopup(auth, provider);
      const credential = GoogleAuthProvider.credentialFromResult(result);
      const token = credential?.accessToken || null;

      if (token) {
        setGoogleAccessToken(token);
        try {
          sessionStorage.setItem('marksprint_gdrive_token', token);
        } catch (e) {
          console.warn('SessionStorage token write notice:', e);
        }
      }

      const newUser = result.user;
      setUser(newUser);

      const profileData = {
        uid: newUser.uid,
        email: newUser.email,
        displayName: newUser.displayName || 'Student',
        role: 'student',
        providers: newUser.providerData.map((p) => p.providerId),
      };

      // Check Drive record book if token is available
      if (token) {
        try {
          const { loadRecordBookFromDrive } = await import('../services/driveOrganizerService');
          const driveData = await loadRecordBookFromDrive(token);
          if (driveData) {
            const { getLocalGamificationData, saveGamificationData } = await import('../services/gamificationService');
            const localData = getLocalGamificationData();
            saveGamificationData({ ...localData, ...driveData });
            if (driveData.setupCompleted || (driveData.board && driveData.standard)) {
              profileData.setupCompleted = true;
              profileData.board = driveData.board;
              profileData.standard = driveData.standard;
            }
          }
        } catch (dErr) {
          console.warn('Drive check on Google login warning:', dErr);
        }
      }

      // Check local storage fallback
      if (!profileData.setupCompleted) {
        try {
          const { getLocalGamificationData } = await import('../services/gamificationService');
          const localData = getLocalGamificationData();
          if (localData?.setupCompleted || (localData?.board && localData?.standard)) {
            profileData.setupCompleted = true;
            profileData.board = localData.board;
            profileData.standard = localData.standard;
          }
        } catch (e) {
          console.warn('Local data check on sign-in warning:', e);
        }
      }

      if (db) {
        try {
          const userRef = doc(db, 'users', newUser.uid);
          const userDoc = await getDoc(userRef);
          if (!userDoc.exists()) {
            await setDoc(userRef, { ...profileData, createdAt: serverTimestamp() }).catch(() => {});
            setUserProfile(profileData);
          } else {
            const existingData = userDoc.data();
            const merged = { ...profileData, ...existingData };
            if (profileData.setupCompleted) merged.setupCompleted = true;
            if (profileData.board) merged.board = profileData.board;
            if (profileData.standard) merged.standard = profileData.standard;
            setUserProfile(merged);
          }
        } catch (fsErr) {
          console.warn('Firestore Google sign in profile warning:', fsErr);
          setUserProfile(profileData);
        }
      } else {
        setUserProfile(profileData);
      }

      setLoading(false);
      return result.user;
    } catch (err) {
      setLoading(false);
      const formatted = formatAuthError(err);
      setError(formatted);
      throw new Error(formatted);
    }
  };

  // Quick Guest Demo Mode Login
  const loginAsGuest = () => {
    const guestUser = {
      uid: 'guest_student_demo',
      email: 'guest@marksprint.falkonlabs',
      displayName: 'Guest Student',
      isAnonymous: true,
    };
    const guestProfile = {
      uid: 'guest_student_demo',
      email: 'guest@marksprint.falkonlabs',
      displayName: 'Guest Student',
      role: 'student',
      providers: ['guest'],
    };
    setUser(guestUser);
    setUserProfile(guestProfile);
    setLoading(false);
    return guestUser;
  };

  // Sign out
  const logOut = async () => {
    setError(null);
    try {
      const { auth, isFirebaseConfigured } = await loadFirebase();
      if (auth && isFirebaseConfigured && user?.uid !== 'guest_student_demo') {
        const { signOut } = await import('firebase/auth');
        await signOut(auth);
      }
      setUser(null);
      setUserProfile(null);
    } catch (err) {
      console.warn('Error signing out:', err);
      setUser(null);
      setUserProfile(null);
    }
  };

  const updateProfileData = async (updates) => {
    if (!user || user.uid === 'guest_student_demo') {
      setUserProfile((prev) => ({ ...prev, ...updates }));
      return;
    }
    try {
      const dbInstance = await loadFirestore();
      if (!dbInstance) throw new Error('Firestore not initialized');
      const { doc, updateDoc } = await import('firebase/firestore');
      const userRef = doc(dbInstance, 'users', user.uid);
      await updateDoc(userRef, updates);
      setUserProfile((prev) => ({ ...prev, ...updates }));
    } catch (err) {
      console.error('Error updating profile:', err);
      throw err;
    }
  };

  const value = {
    user,
    userProfile,
    googleAccessToken,
    loading,
    error,
    signUp,
    signIn,
    signInWithGoogle,
    loginAsGuest,
    logOut,
    updateProfileData,
  };
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

