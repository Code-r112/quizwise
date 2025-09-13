import admin from 'firebase-admin';

const serviceAccount = process.env.FIREBASE_SERVICE_ACCOUNT
  ? JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT)
  : null;

if (!admin.apps.length) {
  if (serviceAccount) {
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
    });
  } else {
    // Initialize without credentials in environments where the service account
    // is not available (like client-side). It will have limited capabilities.
    // This is useful to avoid breaking the app where admin SDK is not strictly needed.
    console.warn("Firebase Admin SDK initialized without credentials. This is expected in client-side rendering. Server-side features requiring authentication will not work.");
    admin.initializeApp();
  }
}

const db = admin.firestore();

export { db };
