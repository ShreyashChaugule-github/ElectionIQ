import admin from 'firebase-admin';

// Initialize Firebase Admin with Application Default Credentials
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.applicationDefault(),
    projectId: 'pw-challenge-2-494710'
  });
}

export const db = admin.firestore();
export const auth = admin.auth();
