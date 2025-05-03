import { collection, addDoc, deleteDoc, query, where, getDocs, onSnapshot } from 'firebase/firestore';
import { db } from './firebase';

export interface Bookmark {
  id: string;
  userId: string;
  restaurantId: number;
  createdAt: Date;
}

export const addBookmark = async (userId: string, restaurantId: number) => {
  try {
    const bookmarksRef = collection(db, 'bookmarks');
    await addDoc(bookmarksRef, {
      userId,
      restaurantId,
      createdAt: new Date()
    });
  } catch (error) {
    console.error('Error adding bookmark:', error);
    throw error;
  }
};

export const removeBookmark = async (userId: string, restaurantId: number) => {
  try {
    const bookmarksRef = collection(db, 'bookmarks');
    const q = query(bookmarksRef, 
      where('userId', '==', userId),
      where('restaurantId', '==', restaurantId)
    );
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach(async (doc) => {
      await deleteDoc(doc.ref);
    });
  } catch (error) {
    console.error('Error removing bookmark:', error);
    throw error;
  }
};

export const subscribeToBookmarks = (userId: string, callback: (bookmarks: number[]) => void) => {
  const bookmarksRef = collection(db, 'bookmarks');
  const q = query(bookmarksRef, where('userId', '==', userId));

  return onSnapshot(q, (snapshot) => {
    const bookmarkIds = snapshot.docs.map(doc => doc.data().restaurantId);
    callback(bookmarkIds);
  });
};