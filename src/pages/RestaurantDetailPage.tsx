import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Star, MapPin, Clock, DollarSign } from 'lucide-react';
import { useAuth } from '../lib/auth';
import { Review, subscribeToRestaurantReviews } from '../lib/reviews';
import { getRestaurantById } from '../lib/restaurants';
import ReviewForm from '../components/ReviewForm';
import RestaurantActions from '../components/RestaurantActions';
import LoadingState from '../components/LoadingState';

const RestaurantDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const [restaurant, setRestaurant] = useState<any>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRestaurant = async () => {
      if (!id) return;
      
      try {
        const data = await getRestaurantById(id);
        if (data) {
          setRestaurant(data);
        } else {
          setError('Restaurant not found');
        }
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchRestaurant();
  }, [id]);

  useEffect(() => {
    if (!id) return;

    const unsubscribe = subscribeToRestaurantReviews(id, (newReviews) => {
      setReviews(newReviews);
    });

    return () => unsubscribe();
  }, [id]);

  if (loading) {
    return <LoadingState message="Loading restaurant details..." />;
  }

  if (error || !restaurant) {
    return (
      <div className="min-h-screen pt-20 pb-16">
        <div className="container mx-auto px-4 md:px-6">
          <div className="bg-red-50 text-red-600 p-4 rounded-lg">
            {error || 'Restaurant not found'}
          </div>
          <Link 
            to="/restaurants" 
            className="mt-4 inline-block text-primary-500 hover:text-primary-600"
          >
            Back to restaurants
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative h-[60vh]">
        <div className="absolute inset-0">
          <img 
            src={restaurant.image} 
            alt={restaurant.name} 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent"></div>
        </div>
        
        <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8">
          <div className="container mx-auto">
            <div className="max-w-4xl">
              <div className="flex items-start justify-between">
                <div>
                  <h1 className="text-4xl md:text-5xl font-display font-bold text-white mb-3">
                    {restaurant.name}
                  </h1>
                  <div className="flex items-center text-white/90 space-x-4 mb-4">
                    <span className="flex items-center">
                      <Star className="h-5 w-5 text-accent-300 fill-current mr-1" />
                      {restaurant.rating.toFixed(1)}
                    </span>
                    <span>•</span>
                    <span>{restaurant.cuisine}</span>
                    <span>•</span>
                    <span>{restaurant.priceRange}</span>
                  </div>
                  <div className="flex items-center text-white/80 space-x-4">
                    <div className="flex items-center">
                      <MapPin className="h-5 w-5 mr-1" />
                      {restaurant.location}
                    </div>
                    <div className="flex items-center">
                      <Clock className="h-5 w-5 mr-1" />
                      {restaurant.openingHours}
                    </div>
                  </div>
                </div>
                <RestaurantActions restaurantId={parseInt(id)} />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Content Section */}
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4 md:px-6">
          <div className="max-w-4xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="md:col-span-2">
                <h2 className="text-2xl font-display font-semibold mb-4">About</h2>
                <p className="text-neutral-700 leading-relaxed mb-8">
                  {restaurant.description}
                </p>

                <div className="space-y-6">
                  <h2 className="text-2xl font-display font-semibold mb-4">
                    Reviews ({reviews.length})
                  </h2>
                  
                  <ReviewForm restaurantId={parseInt(id)} user={user} />

                  {reviews.length > 0 ? (
                    <div className="space-y-6">
                      {reviews.map((review) => (
                        <div key={review.id} className="bg-neutral-50 rounded-lg p-6">
                          <div className="flex items-center mb-4">
                            <div className="flex-shrink-0">
                              <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
                                <span className="font-medium text-primary-600">
                                  {review.userName.charAt(0)}
                                </span>
                              </div>
                            </div>
                            <div className="ml-4">
                              <h4 className="font-medium text-neutral-900">
                                {review.userName}
                              </h4>
                              <div className="flex items-center mt-1">
                                <div className="flex">
                                  {[1, 2, 3, 4, 5].map((star) => (
                                    <Star 
                                      key={star}
                                      className={`h-4 w-4 ${
                                        star <= review.rating
                                          ? 'fill-accent-300 text-accent-300'
                                          : 'text-gray-300'
                                      }`}
                                    />
                                  ))}
                                </div>
                                <span className="ml-2 text-sm text-neutral-500">
                                  {new Date(review.createdAt.toDate()).toLocaleDateString()}
                                </span>
                              </div>
                            </div>
                          </div>
                          <p className="text-neutral-700">{review.comment}</p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 bg-neutral-50 rounded-lg">
                      <Star className="h-12 w-12 text-neutral-300 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-neutral-900 mb-2">
                        No reviews yet
                      </h3>
                      <p className="text-neutral-600">
                        Be the first to review this restaurant
                      </p>
                    </div>
                  )}
                </div>
              </div>

              <div>
                <div className="bg-neutral-50 rounded-lg p-6">
                  <h3 className="font-display font-semibold mb-4">Location</h3>
                  <div className="space-y-3">
                    <div className="flex items-start">
                      <MapPin className="h-5 w-5 text-neutral-500 mt-1 flex-shrink-0" />
                      <p className="ml-3 text-neutral-700">{restaurant.address}</p>
                    </div>
                    <div className="flex items-start">
                      <Clock className="h-5 w-5 text-neutral-500 mt-1 flex-shrink-0" />
                      <p className="ml-3 text-neutral-700">{restaurant.openingHours}</p>
                    </div>
                    <div className="flex items-start">
                      <DollarSign className="h-5 w-5 text-neutral-500 mt-1 flex-shrink-0" />
                      <p className="ml-3 text-neutral-700">{restaurant.priceRange}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default RestaurantDetailPage;