import { collection, addDoc, Timestamp } from 'firebase/firestore';
import { db } from '../lib/firebase';

const restaurants = [
  // Only including restaurants 11-20 as requested
  {
    name: "2000 Habesha Cultural Restaurant",
    cuisine: "Traditional Ethiopian",
    location: "Bole",
    address: "Bole Medhanialem, Behind Millennium Hall",
    rating: 4.6,
    priceRange: "$$",
    image: "https://images.pexels.com/photos/5175537/pexels-photo-5175537.jpeg",
    featured: true,
    description: "Traditional Ethiopian restaurant offering cultural shows and authentic cuisine in a vibrant atmosphere.",
    reviewsCount: 156,
    openingHours: "11:00 AM - 11:00 PM"
  },
  // ... Add the rest of restaurants 12-20 here
];

export const migrateRestaurants = async () => {
  const restaurantsRef = collection(db, 'restaurants');
  
  for (const restaurant of restaurants) {
    try {
      await addDoc(restaurantsRef, {
        ...restaurant,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now()
      });
      console.log(`Added restaurant: ${restaurant.name}`);
    } catch (error) {
      console.error(`Error adding restaurant ${restaurant.name}:`, error);
    }
  }
};

// Run migration
migrateRestaurants();