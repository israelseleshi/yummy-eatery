import { useState, useEffect } from 'react';
import { 
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile,
  updatePassword as firebaseUpdatePassword,
  User as FirebaseUser
} from 'firebase/auth';
import { 
  doc, 
  setDoc, 
  getDoc, 
  updateDoc,
  serverTimestamp
} from 'firebase/firestore';
import { auth, db } from './firebase';

export type UserRole = 'user' | 'admin' | 'restaurant_owner';

export interface User {
  id: string;
  email: string | null;
  firstName: string;
  lastName: string;
  role: UserRole;
  photoURL?: string;
  status?: 'active' | 'inactive';
}

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      try {
        if (firebaseUser) {
          const userData = await convertFirebaseUser(firebaseUser);
          setUser(userData);
        } else {
          setUser(null);
        }
      } catch (err: any) {
        console.error("Error fetching user data:", err);
        setError(err.message);
        setUser(null);
      } finally {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  const logout = async () => {
    try {
      await signOut(auth);
      localStorage.removeItem('user');
      sessionStorage.clear();
    } catch (error: any) {
      console.error('Error logging out:', error);
      throw new Error(error.message || 'Failed to log out');
    }
  };

  return { user, loading, error, logout };
};

export const createUser = async (data: { 
  email: string; 
  password: string; 
  firstName: string; 
  lastName: string; 
  role?: UserRole;
}): Promise<User> => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, data.email, data.password);
    const { user: firebaseUser } = userCredential;

    await updateProfile(firebaseUser, {
      displayName: `${data.firstName} ${data.lastName}`
    });

    const userDoc = {
      id: firebaseUser.uid,
      email: firebaseUser.email,
      firstName: data.firstName,
      lastName: data.lastName,
      role: data.role || 'user',
      status: 'active',
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    };

    await setDoc(doc(db, 'users', firebaseUser.uid), userDoc);

    return userDoc;
  } catch (error: any) {
    console.error('Error creating user:', error);
    throw new Error(error.message || 'Failed to create user');
  }
};

export const login = async (email: string, password: string): Promise<User> => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const { user: firebaseUser } = userCredential;

    const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
    
    if (!userDoc.exists()) {
      const names = firebaseUser.displayName?.split(' ') || ['User', ''];
      const userData = {
        id: firebaseUser.uid,
        email: firebaseUser.email,
        firstName: names[0],
        lastName: names[1],
        role: 'user',
        status: 'active',
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      };
      await setDoc(doc(db, 'users', firebaseUser.uid), userData);
      return userData;
    }

    return {
      ...userDoc.data(),
      id: userDoc.id
    } as User;
  } catch (error: any) {
    console.error('Error logging in:', error);
    throw new Error(error.message || 'Failed to log in');
  }
};

export const updateUserProfile = async (userId: string, data: Partial<User>): Promise<void> => {
  try {
    const userRef = doc(db, 'users', userId);
    await updateDoc(userRef, {
      ...data,
      updatedAt: serverTimestamp()
    });

    if (auth.currentUser) {
      await updateProfile(auth.currentUser, {
        displayName: `${data.firstName} ${data.lastName}`,
        photoURL: data.photoURL
      });
    }
  } catch (error: any) {
    console.error('Error updating user profile:', error);
    throw new Error(error.message || 'Failed to update profile');
  }
};

export const updateUserPassword = async (newPassword: string): Promise<void> => {
  try {
    if (!auth.currentUser) {
      throw new Error('No authenticated user');
    }
    await firebaseUpdatePassword(auth.currentUser, newPassword);
  } catch (error: any) {
    console.error('Error updating password:', error);
    throw new Error(error.message || 'Failed to update password');
  }
};

export const convertFirebaseUser = async (firebaseUser: FirebaseUser): Promise<User> => {
  try {
    const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
    
    if (!userDoc.exists()) {
      const names = firebaseUser.displayName?.split(' ') || ['User', ''];
      const userData = {
        id: firebaseUser.uid,
        email: firebaseUser.email,
        firstName: names[0],
        lastName: names[1],
        role: 'user',
        status: 'active',
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      };
      
      await setDoc(doc(db, 'users', firebaseUser.uid), userData);
      return userData;
    }

    return {
      ...userDoc.data(),
      id: userDoc.id
    } as User;
  } catch (error) {
    console.error('Error converting Firebase user:', error);
    throw error;
  }
};

export { auth };