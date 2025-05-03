import React, { useState, useEffect } from 'react';
import { Heart, ChevronLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../lib/auth';
import { subscribeLikes } from '../lib/likes';
import { restaurants } from '../data/restaurants';
import RestaurantCard from '../components/RestaurantCard';

const FavoritesPage: React.FC = () => {
  const { user } = useAuth();
  const [likedRestaurants, setLikedRestaurants] = useState<typeof restaurants>([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    if (!user) return;
    
    const unsubscribe = subscribeLikes(user.id, (likedIds) => {
      const filtered = restaurants.filter(r => likedIds.includes(r.id));
      setLikedRestaurants(filtered);
      setLoading(false);
    });
    
    return () => unsubscribe();
  }, [user]);

  if (!user) return null;

  if (loading) {
    return (
      <div className="min-h-screen pt-20 pb-16 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-20 pb-16">
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex items-center mb-8">
          <Link 
            to="/profile" 
            className="mr-4 text-neutral-600 hover:text-neutral-900 transition-colors"
          >
            <ChevronLeft className="h-6 w-6" />
          </Link>
          <h1 className="text-3xl font-display font-bold text-neutral-900">
            Liked Restaurants
          </h1>
        </div>

        {likedRestaurants.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {likedRestaurants.map(restaurant => (
              <RestaurantCard key={restaurant.id} restaurant={restaurant} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-white rounded-lg shadow-md">
            <Heart className="h-12 w-12 text-neutral-300 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-neutral-900 mb-2">
              No liked restaurants
            </h2>
            <p className="text-neutral-600 mb-4">
              Start exploring and like the restaurants you love!
            </p>
            <Link
              to="/restaurants"
              className="text-primary-500 hover:text-primary-600 font-medium"
            >
              Explore restaurants
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default FavoritesPage