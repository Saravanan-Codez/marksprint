import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
  setPersistence,
  browserLocalPersistence,
  onAuthStateChanged,
} from 'firebase/auth';
import { doc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db, isFirebaseConfigured } from '../config/firebase';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Set persistence to local if Firebase is available
  useEffect(() => {
    if (!isFirebaseConfigured) {
      setLoading(false);
      return;
    }

    setPersistence(auth, browserLocalPersistence).catch((err) => {
      console.error('Error setting persistence:', err);
    });
  }, []);

  // Listen to auth state
  useEffect(() => {
    if (!isFirebaseConfigured) {
      setLoading(false);
      return () => {};
    }

    const unsubscribe = onAuthStateChanged(auth, async (authUser) => {
      setLoading(true);
      try {
        if (authUser) {
          setUser(authUser);
          // Fetch user profile from Firestore
          const userRef = doc(db, 'users', authUser.uid);
          const userDoc = await getDoc(userRef);
          if (userDoc.exists()) {
            setUserProfile(userDoc.data());
          } else {
            // If profile doesn't exist, create a default student profile
            const defaultProfile = {
              uid: authUser.uid,
              email: authUser.email,
              displayName: authUser.displayName || 'User',
              role: 'student',
              createdAt: serverTimestamp(),
              providers: authUser.providerData.map((p) => p.providerId),
            };
            await setDoc(userRef, defaultProfile);
            setUserProfile(defaultProfile);
          }
        } else {
          setUser(null);
          setUserProfile(null);
        }
      } catch (err) {
        console.error('Error fetching user profile:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  const assertFirebaseEnabled = () => {
    if (!isFirebaseConfigured) {
      const error = new Error('Firebase is not configured. Login features are disabled in this build.');
      setError(error.message);
      throw error;
    }
  };

  // Sign up with email
  const signUp = async (email, password, displayName = 'Student') => {
    assertFirebaseEnabled();
    setError(null);
    try {
      const result = await createUserWithEmailAndPassword(auth, email, password);
      const newUser = result.user;

      // Create user profile in Firestore
      const userRef = doc(db, 'users', newUser.uid);
      const profileData = {
        uid: newUser.uid,
        email: newUser.email,
        displayName,
        role: 'student',
        createdAt: serverTimestamp(),
        providers: newUser.providerData.map((p) => p.providerId),
      };
      await setDoc(userRef, profileData);
      setUserProfile(profileData);
      return result.user;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  // Sign in with email
  const signIn = async (email, password) => {
    assertFirebaseEnabled();
    setError(null);
    try {
      const result = await signInWithEmailAndPassword(auth, email, password);
      return result.user;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  // Sign in with Google
  const signInWithGoogle = async () => {
    assertFirebaseEnabled();
    setError(null);
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const newUser = result.user;

      // Check or create user profile
      const userRef = doc(db, 'users', newUser.uid);
      const userDoc = await getDoc(userRef);

      if (!userDoc.exists()) {
        const profileData = {
          uid: newUser.uid,
          email: newUser.email,
          displayName: newUser.displayName,
          role: 'student',
          createdAt: serverTimestamp(),
          providers: newUser.providerData.map((p) => p.providerId),
        };
        await setDoc(userRef, profileData);
        setUserProfile(profileData);
      }
      return result.user;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  // Sign out
  const logOut = async () => {
    assertFirebaseEnabled();
    setError(null);
    try {
      await signOut(auth);
      setUser(null);
      setUserProfile(null);
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const value = {
    user,
    userProfile,
    loading,
    error,
    signUp,
    signIn,
    signInWithGoogle,
    logOut,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
