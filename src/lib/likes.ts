import { collection, addDoc, deleteDoc, query, where, getDocs, onSnapshot } from 'firebase/firestore';
import { db } from './firebase';

export interface Like {
  id: string;
  userId: string;
  restaurantId: number;
  createdAt: Date;
}

export const addLike = async (userId: string, restaurantId: number) => {
  try {
    const likesRef = collection(db, 'likes');
    const q = query(likesRef, 
      where('userId', '==', userId),
      where('restaurantId', '==', restaurantId)
    );
    const querySnapshot = await getDocs(q);
    
    // Only add if not already liked
    if (querySnapshot.empty) {
      await addDoc(likesRef, {
        userId,
        restaurantId,
        createdAt: new Date()
      });
    }
  } catch (error) {
    console.error('Error adding like:', error);
    throw error;
  }
};

export const removeLike = async (userId: string, restaurantId: number) => {
  try {
    const likesRef = collection(db, 'likes');
    const q = query(likesRef, 
      where('userId', '==', userId),
      where('restaurantId', '==', restaurantId)
    );
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach(async (doc) => {
      await deleteDoc(doc.ref);
    });
  } catch (error) {
    console.error('Error removing like:', error);
    throw error;
  }
};

export const subscribeLikes = (userId: string, callback: (likes: number[]) => void) => {
  const likesRef = collection(db, 'likes');
  const q = query(likesRef, where('userId', '==', userId));

  return onSnapshot(q, (snapshot) => {
    const likeIds = snapshot.docs.map(doc => doc.data().restaurantId);
    callback(likeIds);
  });
};