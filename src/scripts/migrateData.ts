import { collection, addDoc, Timestamp } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { restaurants } from '../data/restaurants';

export const migrateRestaurants = async () => {
  const restaurantsRef = collection(db, 'restaurants');
  
  for (const restaurant of restaurants) {
    try {
      await addDoc(restaurantsRef, {
        ...restaurant,
        reviewsCount: restaurant.reviews || 0,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now()
      });
      console.log(`Migrated restaurant: ${restaurant.name}`);
    } catch (error) {
      console.error(`Error migrating restaurant ${restaurant.name}:`, error);
    }
  }
};

// Run the migration
migrateRestaurants();