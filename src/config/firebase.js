import { initializeApp } from "firebase/app";
// this is what sets up authentication in the project
import { getAuth, GoogleAuthProvider } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'
import { getStorage } from 'firebase/storage'

const firebaseConfig = {
    apiKey: "AIzaSyBWBOjMIexV7z8r9uOfNa-TfwskRyVZNf8",
    authDomain: "fir-course-a2ec3.firebaseapp.com",
    projectId: "fir-course-a2ec3",
    storageBucket: "fir-course-a2ec3.appspot.com",
    messagingSenderId: "862644385753",
    appId: "1:862644385753:web:675c51730c064221954bc8",
    measurementId: "G-S5B74DFSYV"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

export const db = getFirestore(app);
export const storage = getStorage(app);