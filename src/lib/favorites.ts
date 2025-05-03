import { collection, addDoc, deleteDoc, query, where, getDocs, onSnapshot } from 'firebase/firestore';
import { db } from './firebase';

export interface Favorite {
  id: string;
  userId: string;
  restaurantId: number;
  createdAt: Date;
}

export const addFavorite = async (userId: string, restaurantId: number) => {
  try {
    const favoritesRef = collection(db, 'favorites');
    await addDoc(favoritesRef, {
      userId,
      restaurantId,
      createdAt: new Date()
    });
  } catch (error) {
    console.error('Error adding favorite:', error);
    throw error;
  }
};

export const removeFavorite = async (userId: string, restaurantId: number) => {
  try {
    const favoritesRef = collection(db, 'favorites');
    const q = query(favoritesRef, 
      where('userId', '==', userId),
      where('restaurantId', '==', restaurantId)
    );
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach(async (doc) => {
      await deleteDoc(doc.ref);
    });
  } catch (error) {
    console.error('Error removing favorite:', error);
    throw error;
  }
};

export const subscribeFavorites = (userId: string, callback: (favorites: number[]) => void) => {
  const favoritesRef = collection(db, 'favorites');
  const q = query(favoritesRef, where('userId', '==', userId));

  return onSnapshot(q, (snapshot) => {
    const favoriteIds = snapshot.docs.map(doc => doc.data().restaurantId);
    callback(favoriteIds);
  });
};