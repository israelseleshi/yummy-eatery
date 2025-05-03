import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore, enableIndexedDbPersistence } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

// Firebase config
const firebaseConfig = {
  apiKey: 'AIzaSyCMhaq8lsJsPNAZazTbSSPSRPHdHzo0BLs',
  authDomain: 'yummy-food-review.firebaseapp.com',
  projectId: 'yummy-food-review',
  storageBucket: 'yummy-food-review.appspot.com',
  messagingSenderId: '352563316505',
  appId: '1:352563316505:web:243d81a239a1a5591b2788',
  measurementId: 'G-YE2X76RVDE'
};

// Initialize Firebase app
const app = initializeApp(firebaseConfig);

// Initialize services
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

// Try to enable offline persistence only if supported
try {
  enableIndexedDbPersistence(db, {
    synchronizeTabs: true
  }).catch((err) => {
    if (err.code === 'failed-precondition') {
      console.warn('Multiple tabs open, persistence can only be enabled in one tab at a time.');
    } else if (err.code === 'unimplemented') {
      console.warn('The current browser does not support persistence.');
    }
  });
} catch (e) {
  console.warn('Offline persistence could not be enabled. Some features may be limited:', e);
}

export { app, auth, db, storage };