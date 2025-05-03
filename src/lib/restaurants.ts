import { 
  collection, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  getDocs, 
  getDoc,
  query, 
  where, 
  onSnapshot, 
  Timestamp,
  orderBy,
  limit,
  startAfter,
  QueryDocumentSnapshot,
  DocumentData,
  getCountFromServer,
  Query,
  and
} from 'firebase/firestore';
import { db } from './firebase';

export interface Restaurant {
  id: string;
  name: string;
  cuisine: string;
  location: string;
  address: string;
  rating: number;
  priceRange: string;
  image: string;
  featured: boolean;
  description: string;
  reviewsCount: number;
  openingHours: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export interface RestaurantStats {
  total: number;
  averageRating: number;
  cuisineDistribution: Record<string, number>;
  locationDistribution: Record<string, number>;
}

const RESTAURANTS_PER_PAGE = 6;

export const uploadRestaurantImage = async (file: File): Promise<string> => {
  try {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', 'restaurant_images');

    const response = await fetch(
      `https://api.cloudinary.com/v1_1/dxqnlqxa1/image/upload`,
      {
        method: 'POST',
        body: formData,
      }
    );

    if (!response.ok) {
      throw new Error('Failed to upload image');
    }

    const data = await response.json();
    return data.secure_url;
  } catch (error) {
    console.error('Error uploading image:', error);
    throw error;
  }
};

export const deleteRestaurantImage = async (imageUrl: string) => {
  try {
    // Extract public_id from Cloudinary URL
    const publicId = imageUrl.split('/').slice(-2).join('/').split('.')[0];
    
    const response = await fetch(
      `https://api.cloudinary.com/v1_1/dxqnlqxa1/image/destroy`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          public_id: publicId,
          api_key: '123456789012345',
          api_secret: 'your-api-secret',
        }),
      }
    );

    if (!response.ok) {
      throw new Error('Failed to delete image');
    }
  } catch (error) {
    console.error('Error deleting image:', error);
    throw error;
  }
};

export const getRestaurants = async (
  page: number = 1,
  filters?: {
    cuisine?: string;
    location?: string;
    featured?: boolean;
  }
) => {
  try {
    const restaurantsRef = collection(db, 'restaurants');
    const conditions = [];

    // Add filter conditions
    if (filters?.cuisine) {
      conditions.push(where('cuisine', '==', filters.cuisine));
    }
    if (filters?.location) {
      conditions.push(where('location', '==', filters.location));
    }
    if (filters?.featured) {
      conditions.push(where('featured', '==', true));
    }

    // Create base query with filters and ordering
    const baseQuery = conditions.length > 0
      ? query(restaurantsRef, and(...conditions), orderBy('createdAt', 'desc'))
      : query(restaurantsRef, orderBy('createdAt', 'desc'));

    // Get total count
    const snapshot = await getCountFromServer(baseQuery);
    const total = snapshot.data().count;

    // Add pagination
    let finalQuery = query(baseQuery, limit(RESTAURANTS_PER_PAGE));
    if (page > 1) {
      const prevSnapshot = await getDocs(
        query(baseQuery, limit((page - 1) * RESTAURANTS_PER_PAGE))
      );
      const lastDoc = prevSnapshot.docs[prevSnapshot.docs.length - 1];
      if (lastDoc) {
        finalQuery = query(finalQuery, startAfter(lastDoc));
      }
    }

    const querySnapshot = await getDocs(finalQuery);
    const restaurants = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as Restaurant[];

    return { 
      restaurants,
      total
    };
  } catch (error) {
    console.error('Error getting restaurants:', error);
    throw error;
  }
};

export const getRestaurantStats = async (): Promise<RestaurantStats> => {
  try {
    const restaurantsRef = collection(db, 'restaurants');
    const snapshot = await getDocs(restaurantsRef);
    const restaurants = snapshot.docs.map(doc => ({
      ...doc.data(),
      id: doc.id
    } as Restaurant));

    const cuisineDistribution: Record<string, number> = {};
    const locationDistribution: Record<string, number> = {};
    let totalRating = 0;

    restaurants.forEach(restaurant => {
      cuisineDistribution[restaurant.cuisine] = (cuisineDistribution[restaurant.cuisine] || 0) + 1;
      locationDistribution[restaurant.location] = (locationDistribution[restaurant.location] || 0) + 1;
      totalRating += restaurant.rating || 0;
    });

    return {
      total: restaurants.length,
      averageRating: restaurants.length > 0 ? totalRating / restaurants.length : 0,
      cuisineDistribution,
      locationDistribution
    };
  } catch (error) {
    console.error('Error getting restaurant stats:', error);
    throw error;
  }
};

export const getRestaurantById = async (id: string): Promise<Restaurant | null> => {
  try {
    // Ensure id is a string and not undefined/null
    if (!id || typeof id !== 'string') {
      throw new Error('Invalid restaurant ID');
    }

    const docRef = doc(db, 'restaurants', id);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      return {
        id: docSnap.id,
        ...docSnap.data()
      } as Restaurant;
    }
    return null;
  } catch (error) {
    console.error('Error getting restaurant:', error);
    throw error;
  }
};

export const addRestaurant = async (restaurantData: Omit<Restaurant, 'id' | 'createdAt' | 'updatedAt' | 'rating' | 'reviewsCount'>) => {
  try {
    const restaurantsRef = collection(db, 'restaurants');
    const docRef = await addDoc(restaurantsRef, {
      ...restaurantData,
      rating: 0,
      reviewsCount: 0,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now()
    });
    return docRef.id;
  } catch (error) {
    console.error('Error adding restaurant:', error);
    throw error;
  }
};

export const updateRestaurant = async (id: string, data: Partial<Restaurant>) => {
  try {
    const restaurantRef = doc(db, 'restaurants', id);
    await updateDoc(restaurantRef, {
      ...data,
      updatedAt: Timestamp.now()
    });
  } catch (error) {
    console.error('Error updating restaurant:', error);
    throw error;
  }
};

export const deleteRestaurant = async (id: string, imageUrl?: string) => {
  try {
    if (imageUrl) {
      await deleteRestaurantImage(imageUrl);
    }
    const restaurantRef = doc(db, 'restaurants', id);
    await deleteDoc(restaurantRef);
  } catch (error) {
    console.error('Error deleting restaurant:', error);
    throw error;
  }
};

export const searchRestaurants = async (searchTerm: string) => {
  try {
    const restaurantsRef = collection(db, 'restaurants');
    const nameQuery = query(
      restaurantsRef, 
      where('name', '>=', searchTerm.toLowerCase()),
      where('name', '<=', searchTerm.toLowerCase() + '\uf8ff')
    );
    
    const snapshot = await getDocs(nameQuery);
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as Restaurant[];
  } catch (error) {
    console.error('Error searching restaurants:', error);
    throw error;
  }
};

export const getCuisineTypes = async (): Promise<string[]> => {
  try {
    const restaurantsRef = collection(db, 'restaurants');
    const snapshot = await getDocs(restaurantsRef);
    const cuisines = new Set<string>();
    
    snapshot.docs.forEach(doc => {
      const restaurant = doc.data() as Restaurant;
      cuisines.add(restaurant.cuisine);
    });
    
    return Array.from(cuisines);
  } catch (error) {
    console.error('Error getting cuisine types:', error);
    throw error;
  }
};

export const getLocations = async (): Promise<string[]> => {
  try {
    const restaurantsRef = collection(db, 'restaurants');
    const snapshot = await getDocs(restaurantsRef);
    const locations = new Set<string>();
    
    snapshot.docs.forEach(doc => {
      const restaurant = doc.data() as Restaurant;
      locations.add(restaurant.location);
    });
    
    return Array.from(locations);
  } catch (error) {
    console.error('Error getting locations:', error);
    throw error;
  }
};

export const subscribeToRestaurants = (
  callback: (restaurants: Restaurant[]) => void,
  filters?: {
    cuisine?: string;
    location?: string;
    featured?: boolean;
  }
) => {
  const restaurantsRef = collection(db, 'restaurants');
  let q = query(restaurantsRef, orderBy('createdAt', 'desc'));

  if (filters?.cuisine) {
    q = query(q, where('cuisine', '==', filters.cuisine));
  }

  if (filters?.location) {
    q = query(q, where('location', '==', filters.location));
  }

  if (filters?.featured) {
    q = query(q, where('featured', '==', true));
  }

  return onSnapshot(q, (snapshot) => {
    const restaurants = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as Restaurant[];
    callback(restaurants);
  });
};