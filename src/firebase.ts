import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut, onAuthStateChanged, User } from 'firebase/auth';
import { getFirestore, doc, getDoc, setDoc, serverTimestamp, collection, query, orderBy, onSnapshot, updateDoc, deleteDoc, addDoc } from 'firebase/firestore';

// Import the Firebase configuration
import firebaseConfig from '../firebase-applet-config.json';

// Initialize Firebase SDK
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

export { signInWithPopup, signOut, onAuthStateChanged, serverTimestamp, doc, getDoc, setDoc, collection, query, orderBy, onSnapshot, updateDoc, deleteDoc, addDoc };
export type { User };

// Helper to handle user profile in Firestore
export const syncUserProfile = async (user: User) => {
  const userRef = doc(db, 'users', user.uid);
  const userDoc = await getDoc(userRef);
  const isAdminEmail = user.email === 'fabianaisabel0@gmail.com';

  if (!userDoc.exists()) {
    await setDoc(userRef, {
      uid: user.uid,
      displayName: user.displayName,
      email: user.email,
      photoURL: user.photoURL,
      role: isAdminEmail ? 'admin' : 'user',
      createdAt: serverTimestamp(),
    });
  } else if (isAdminEmail && userDoc.data().role !== 'admin') {
    // Ensure the specific user always has admin role if it was somehow changed or initialized as user
    await updateDoc(userRef, { role: 'admin' });
  }
};
