import admin from 'firebase-admin';

const FIREBASE_PROJECT_ID = process.env.FIREBASE_PROJECT_ID || process.env.GOOGLE_CLOUD_PROJECT || 'pw-challenge-2-494710';

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.applicationDefault(),
    projectId: FIREBASE_PROJECT_ID,
  });
}

if (!process.env.FIREBASE_PROJECT_ID && !process.env.GOOGLE_CLOUD_PROJECT) {
  console.warn('⚠️ Firebase project ID fallback is in use. Set FIREBASE_PROJECT_ID or GOOGLE_CLOUD_PROJECT in production.');
}

export const db = admin.firestore();
export const auth = admin.auth();
