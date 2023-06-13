import { initializeApp } from 'firebase/app';
import { GoogleAuthProvider, getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: 'AIzaSyC3kcwb2QO-CL9nhJPqsc0MjMyz5x-uV1k',
  authDomain: 'eden-heardle.firebaseapp.com',
  projectId: 'eden-heardle',
  storageBucket: 'eden-heardle.appspot.com',
  messagingSenderId: '762503136922',
  appId: '1:762503136922:web:c7fa91063ec89cccf60123'
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export const db = getFirestore(app);
