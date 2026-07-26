const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
};

let app = null;
let auth = null;
let db = null;
let isFirebaseConfigured = false;
let firebaseAppPromise = null;
let firebaseAuthPromise = null;
let firebaseFirestorePromise = null;

function validateConfig() {
  return (
    firebaseConfig.apiKey &&
    firebaseConfig.authDomain &&
    firebaseConfig.projectId &&
    firebaseConfig.appId
  );
}

async function initializeFirebaseApp() {
  if (firebaseAppPromise) {
    return firebaseAppPromise;
  }

  firebaseAppPromise = (async () => {
    if (!validateConfig()) {
      console.warn(
        'Firebase config is incomplete. Auth and Firestore are disabled. Please check your .env file and ensure all VITE_FIREBASE_* variables are set.'
      );
      return null;
    }

    const { initializeApp } = await import('firebase/app');
    const appInstance = initializeApp(firebaseConfig);

    app = appInstance;
    return app;
  })();

  return firebaseAppPromise;
}

async function loadFirebaseAuth() {
  if (firebaseAuthPromise) {
    return firebaseAuthPromise;
  }

  firebaseAuthPromise = (async () => {
    const appInstance = await initializeFirebaseApp();
    if (!appInstance) {
      auth = null;
      isFirebaseConfigured = false;
      return { auth: null, isFirebaseConfigured: false };
    }

    const { getAuth } = await import('firebase/auth');
    auth = getAuth(appInstance);
    isFirebaseConfigured = true;
    return { auth, isFirebaseConfigured };
  })();

  return firebaseAuthPromise;
}

async function loadFirestore() {
  if (firebaseFirestorePromise) {
    return firebaseFirestorePromise;
  }

  firebaseFirestorePromise = (async () => {
    const appInstance = await initializeFirebaseApp();
    if (!appInstance) {
      db = null;
      return null;
    }

    const { getFirestore } = await import('firebase/firestore');
    db = getFirestore(appInstance);
    return db;
  })();

  return firebaseFirestorePromise;
}

async function loadFirebase() {
  const authResult = await loadFirebaseAuth();
  const firestore = await loadFirestore();
  return {
    auth: authResult.auth,
    db: firestore,
    isFirebaseConfigured: authResult.isFirebaseConfigured,
  };
}

export { loadFirebase, loadFirebaseAuth, loadFirestore };
