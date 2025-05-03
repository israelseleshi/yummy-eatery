import { collection, addDoc, deleteDoc, query, where, getDocs, onSnapshot } from 'firebase/firestore';
import { db } from './firebase';

export interface Save {
  id: string;
  userId: string;
  restaurantId: number;
  createdAt: Date;
}

export const addSave = async (userId: string, restaurantId: number) => {
  try {
    const savesRef = collection(db, 'saves');
    const q = query(savesRef, 
      where('userId', '==', userId),
      where('restaurantId', '==', restaurantId)
    );
    const querySnapshot = await getDocs(q);
    
    // Only add if not already saved
    if (querySnapshot.empty) {
      await addDoc(savesRef, {
        userId,
        restaurantId,
        createdAt: new Date()
      });
    }
  } catch (error) {
    console.error('Error adding save:', error);
    throw error;
  }
};

export const removeSave = async (userId: string, restaurantId: number) => {
  try {
    const savesRef = collection(db, 'saves');
    const q = query(savesRef, 
      where('userId', '==', userId),
      where('restaurantId', '==', restaurantId)
    );
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach(async (doc) => {
      await deleteDoc(doc.ref);
    });
  } catch (error) {
    console.error('Error removing save:', error);
    throw error;
  }
};

export const subscribeSaves = (userId: string, callback: (saves: number[]) => void) => {
  const savesRef = collection(db, 'saves');
  const q = query(savesRef, where('userId', '==', userId));

  return onSnapshot(q, (snapshot) => {
    const saveIds = snapshot.docs.map(doc => doc.data().restaurantId);
    callback(saveIds);
  });
};