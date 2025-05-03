import React, { useState, useEffect } from 'react';
import { Star, ChevronLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../lib/auth';
import { Review, subscribeToAllReviews } from '../lib/reviews';
import { restaurants } from '../data/restaurants';

const UserReviewsPage: React.FC = () => {
  const { user } = useAuth();
  const [reviews, setReviews] = useState<Review[]>([]);

  useEffect(() => {
    if (!user) return;

    const unsubscribe = subscribeToAllReviews((allReviews) => {
      const userReviews = allReviews.filter(review => review.userId === user.id);
      setReviews(userReviews);
    });

    return () => unsubscribe();
  }, [user]);

  if (!user) return null;

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
            My Reviews
          </h1>
        </div>

        {reviews.length > 0 ? (
          <div className="space-y-6">
            {reviews.map((review) => {
              const restaurant = restaurants.find(r => r.id === review.restaurantId);
              if (!restaurant) return null;

              return (
                <div key={review.id} className="bg-white rounded-lg shadow-md p-6">
                  <div className="flex items-start">
                    <img 
                      src={restaurant.image}
                      alt={restaurant.name}
                      className="w-20 h-20 object-cover rounded-lg"
                    />
                    <div className="ml-4 flex-grow">
                      <Link 
                        to={`/restaurant/${restaurant.id}`}
                        className="text-xl font-display font-semibold text-neutral-900 hover:text-primary-500 transition-colors"
                      >
                        {restaurant.name}
                      </Link>
                      <div className="flex items-center mt-1 mb-2">
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
                        <span className="ml-2 text-sm text-gray-500">
                          {new Date(review.createdAt.toDate()).toLocaleDateString()}
                        </span>
                      </div>
                      <p className="text-neutral-700">{review.comment}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-12 bg-white rounded-lg shadow-md">
            <Star className="h-12 w-12 text-neutral-300 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-neutral-900 mb-2">
              No reviews yet
            </h2>
            <p className="text-neutral-600 mb-4">
              You haven't written any reviews yet.
            </p>
            <Link
              to="/restaurants"
              className="text-primary-500 hover:text-primary-600 font-medium"
            >
              Explore restaurants to review
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserReviewsPage