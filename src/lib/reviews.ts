import { collection, addDoc, query, where, orderBy, onSnapshot, Timestamp, deleteDoc, doc, getDocs } from 'firebase/firestore';
import { db } from './firebase';

export interface Review {
  id: string;
  restaurantId: string;
  userId: string;
  userName: string;
  rating: number;
  comment: string;
  createdAt: Timestamp;
}

export const createReview = async (data: Omit<Review, 'id' | 'createdAt'>) => {
  try {
    const reviewsRef = collection(db, 'reviews');
    const reviewData = {
      ...data,
      createdAt: Timestamp.now()
    };
    
    const docRef = await addDoc(reviewsRef, reviewData);
    return docRef.id;
  } catch (error) {
    console.error('Error creating review:', error);
    throw error;
  }
};

export const subscribeToRestaurantReviews = (
  restaurantId: string,
  callback: (reviews: Review[]) => void
) => {
  const reviewsRef = collection(db, 'reviews');
  const q = query(
    reviewsRef,
    where('restaurantId', '==', restaurantId),
    orderBy('createdAt', 'desc')
  );

  return onSnapshot(q, (snapshot) => {
    const reviews = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as Review));
    callback(reviews);
  });
};

export const subscribeToAllReviews = (callback: (reviews: Review[]) => void) => {
  const reviewsRef = collection(db, 'reviews');
  const q = query(reviewsRef, orderBy('createdAt', 'desc'));

  return onSnapshot(q, (snapshot) => {
    const reviews = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as Review));
    callback(reviews);
  });
};

export const deleteReview = async (reviewId: string) => {
  try {
    const reviewRef = doc(db, 'reviews', reviewId);
    await deleteDoc(reviewRef);
  } catch (error) {
    console.error('Error deleting review:', error);
    throw error;
  }
};

export const getReviewStats = async () => {
  try {
    const reviewsRef = collection(db, 'reviews');
    const snapshot = await getDocs(reviewsRef);
    const reviews = snapshot.docs.map(doc => doc.data() as Review);

    return {
      total: reviews.length,
      averageRating: reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length || 0
    };
  } catch (error) {
    console.error('Error getting review stats:', error);
    throw error;
  }
};