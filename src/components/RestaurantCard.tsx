import React from 'react';
import { Star, MapPin, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Restaurant } from '../data/restaurants';

interface RestaurantCardProps {
  restaurant: Restaurant;
  featured?: boolean;
}

const RestaurantCard: React.FC<RestaurantCardProps> = ({ restaurant, featured = false }) => {
  const renderStars = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;

    for (let i = 0; i < fullStars; i++) {
      stars.push(<Star key={`full-${i}`} className="h-4 w-4 fill-accent-300 text-accent-300" />);
    }

    if (hasHalfStar) {
      stars.push(
        <div key="half" className="relative">
          <Star className="h-4 w-4 text-accent-300" />
          <Star className="absolute top-0 left-0 h-4 w-4 fill-accent-300 text-accent-300 overflow-hidden" style={{ clipPath: 'inset(0 50% 0 0)' }} />
        </div>
      );
    }

    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<Star key={`empty-${i}`} className="h-4 w-4 text-accent-300" />);
    }

    return stars;
  };

  return (
    <Link to={`/restaurant/${restaurant.id}`}>
      <div 
        className={`bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-all duration-300 
          ${featured ? 'transform hover:-translate-y-1' : 'hover:scale-[1.02]'}`}
      >
        <div className="relative">
          <img 
            src={restaurant.image} 
            alt={restaurant.name} 
            className={`w-full object-cover ${featured ? 'h-64' : 'h-48'}`}
          />
          {restaurant.featured && (
            <div className="absolute top-4 left-4 bg-accent-300 text-black text-xs px-2 py-1 rounded-full font-medium">
              Featured
            </div>
          )}
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent pt-10 pb-4 px-4">
            <div className="flex items-center gap-1 text-white">
              {renderStars(restaurant.rating)}
              <span className="ml-1 text-sm font-medium">{restaurant.rating.toFixed(1)}</span>
              <span className="text-xs text-gray-300">({restaurant.reviews})</span>
            </div>
          </div>
        </div>
        
        <div className="p-4">
          <div className="flex justify-between items-start">
            <h3 className="font-display font-semibold text-lg text-neutral-900 mb-1">{restaurant.name}</h3>
            <span className="text-sm font-medium text-neutral-600">{restaurant.priceRange}</span>
          </div>
          <p className="text-sm text-primary-500 font-medium mb-2">{restaurant.cuisine}</p>
          <div className="flex items-center text-sm text-neutral-600 mb-2">
            <MapPin className="h-4 w-4 mr-1 flex-shrink-0" />
            <span>{restaurant.location}</span>
          </div>
          <div className="flex items-center text-sm text-neutral-500">
            <Clock className="h-4 w-4 mr-1 flex-shrink-0" />
            <span>{restaurant.openingHours}</span>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default RestaurantCard;