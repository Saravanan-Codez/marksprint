import express from 'express';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import admin from 'firebase-admin';
import fs from 'fs';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(cookieParser());

// Initialize Firebase Admin
let firebaseAdmin = null;
try {
  const serviceAccountPath = process.env.FIREBASE_SERVICE_ACCOUNT_PATH || './firebase-service-account.json';
  if (fs.existsSync(serviceAccountPath)) {
    const serviceAccount = JSON.parse(fs.readFileSync(serviceAccountPath, 'utf8'));
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
      projectId: process.env.VITE_FIREBASE_PROJECT_ID
    });
    firebaseAdmin = admin;
    console.log('Firebase Admin initialized successfully');
  } else {
    console.warn('Firebase service account file not found. Firebase auth disabled.');
  }
} catch (error) {
  console.error('Failed to initialize Firebase Admin:', error.message);
  console.warn('Firebase auth is disabled for this session.');
}

// Middleware to verify Firebase ID token
async function verifyFirebaseToken(req, res, next) {
  if (!firebaseAdmin) {
    return res.status(503).json({ error: 'Firebase not configured' });
  }

  const token = req.headers.authorization?.split('Bearer ')[1];
  if (!token) {
    return res.status(401).json({ error: 'No token provided' });
  }

  try {
    const decodedToken = await firebaseAdmin.auth().verifyIdToken(token);
    req.user = decodedToken;
    next();
  } catch (error) {
    console.error('Token verification failed:', error.message);
    return res.status(401).json({ error: 'Invalid token' });
  }
}

app.get('/api/auth/status', verifyFirebaseToken, async (req, res) => {
  try {
    if (!firebaseAdmin) {
      return res.status(503).json({ error: 'Firebase not configured' });
    }

    // Get user from Firestore
    const db = firebaseAdmin.firestore();
    const userDoc = await db.collection('users').doc(req.user.uid).get();
    
    if (!userDoc.exists) {
      return res.status(404).json({ error: 'User profile not found' });
    }

    const userProfile = userDoc.data();
    return res.json({
      authenticated: true,
      uid: req.user.uid,
      email: req.user.email,
      role: userProfile.role,
      displayName: userProfile.displayName
    });
  } catch (error) {
    console.error('Status check failed:', error.message);
    return res.status(500).json({ error: 'Failed to get status' });
  }
});

app.post('/api/auth/verify-teacher', verifyFirebaseToken, async (req, res) => {
  try {
    if (!firebaseAdmin) {
      return res.status(503).json({ error: 'Firebase not configured' });
    }

    const db = firebaseAdmin.firestore();
    const userDoc = await db.collection('users').doc(req.user.uid).get();
    
    if (!userDoc.exists) {
      return res.status(404).json({ error: 'User profile not found' });
    }

    const userProfile = userDoc.data();
    if (userProfile.role !== 'teacher' && userProfile.role !== 'admin') {
      return res.status(403).json({ error: 'Insufficient permissions' });
    }

    return res.json({
      authorized: true,
      role: userProfile.role
    });
  } catch (error) {
    console.error('Teacher verification failed:', error.message);
    return res.status(500).json({ error: 'Verification failed' });
  }
});

app.listen(PORT, () => {
  console.log(`Auth server listening on port ${PORT}`);
});
