
import { initializeApp, getApp, getApps, type FirebaseApp } from 'firebase/app';
import { firebaseConfig } from './config';
import { AuthProvider, useAuth } from './auth';

let firebaseApp: FirebaseApp;

function getFirebaseApp(): FirebaseApp {
    if (getApps().length === 0) {
        firebaseApp = initializeApp(firebaseConfig);
    } else {
        firebaseApp = getApp();
    }
    return firebaseApp;
}

export { getFirebaseApp, AuthProvider, useAuth };
