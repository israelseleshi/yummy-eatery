import { 
  collection, 
  addDoc,
  updateDoc,
  doc,
  query as firestoreQuery,
  where,
  getDocs,
  getDoc,
  Timestamp,
  orderBy,
  serverTimestamp
} from 'firebase/firestore';
import { db } from './firebase';

export interface RestaurantRequest {
  id: string;
  ownerId: string;
  ownerName: string;
  ownerEmail: string;
  name: string;
  cuisine: string;
  location: string;
  address: string;
  priceRange: string;
  description: string;
  openingHours: string;
  image: string;
  paymentPlan: string;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export const PAYMENT_PLANS = [
  {
    id: 'basic',
    name: 'Basic',
    price: 5000,
    features: [
      'Basic listing',
      'Standard support',
      'Regular visibility'
    ]
  },
  {
    id: 'premium',
    name: 'Premium',
    price: 7500,
    features: [
      'Featured listing',
      'Priority support',
      'Analytics dashboard',
      'Enhanced visibility'
    ]
  },
  {
    id: 'platinum',
    name: 'Platinum',
    price: 10000,
    features: [
      'Premium listing',
      '24/7 support',
      'Advanced analytics',
      'Marketing tools',
      'Maximum visibility'
    ]
  }
];

export const createRestaurantRequest = async (data: Omit<RestaurantRequest, 'id' | 'status' | 'createdAt' | 'updatedAt'>) => {
  try {
    const requestsRef = collection(db, 'restaurant_requests');
    const docRef = await addDoc(requestsRef, {
      ...data,
      status: 'pending',
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });
    return docRef.id;
  } catch (error) {
    console.error('Error creating restaurant request:', error);
    throw error;
  }
};

export const getRestaurantRequests = async (ownerId?: string) => {
  try {
    const requestsRef = collection(db, 'restaurant_requests');
    const q = ownerId 
      ? firestoreQuery(
          requestsRef,
          where('ownerId', '==', ownerId),
          orderBy('createdAt', 'desc')
        )
      : firestoreQuery(requestsRef, orderBy('createdAt', 'desc'));

    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as RestaurantRequest[];
  } catch (error) {
    console.error('Error getting restaurant requests:', error);
    throw error;
  }
};

export const getRestaurantRequest = async (requestId: string) => {
  try {
    const requestRef = doc(db, 'restaurant_requests', requestId);
    const snapshot = await getDoc(requestRef);
    if (!snapshot.exists()) return null;
    return {
      id: snapshot.id,
      ...snapshot.data()
    } as RestaurantRequest;
  } catch (error) {
    console.error('Error getting restaurant request:', error);
    throw error;
  }
};

export const updateRestaurantRequest = async (requestId: string, data: Partial<RestaurantRequest>) => {
  try {
    const requestRef = doc(db, 'restaurant_requests', requestId);
    await updateDoc(requestRef, {
      ...data,
      updatedAt: serverTimestamp()
    });
  } catch (error) {
    console.error('Error updating restaurant request:', error);
    throw error;
  }
};