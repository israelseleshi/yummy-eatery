import { getAuth } from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { db } from './firebase';

// Function to set up admin role for a user
export const setupAdminRole = async (userId: string) => {
  try {
    // First, create or update the user_claims document
    const claimsRef = doc(db, 'user_claims', userId);
    await setDoc(claimsRef, { role: 'admin' });

    // Then update the users collection
    const userRef = doc(db, 'users', userId);
    const userDoc = await getDoc(userRef);
    
    if (userDoc.exists()) {
      await setDoc(userRef, {
        ...userDoc.data(),
        role: 'admin'
      }, { merge: true });
    }

    // Force token refresh
    const currentUser = getAuth().currentUser;
    if (currentUser) {
      await currentUser.getIdToken(true);
    }

    return true;
  } catch (error) {
    console.error('Error setting up admin role:', error);
    return false;
  }
};

// Function to check if user has admin role
export const checkAdminRole = async (userId: string): Promise<boolean> => {
  try {
    const claimsRef = doc(db, 'user_claims', userId);
    const claimsDoc = await getDoc(claimsRef);
    
    return claimsDoc.exists() && claimsDoc.data()?.role === 'admin';
  } catch (error) {
    console.error('Error checking admin role:', error);
    return false;
  }
};