import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Restaurant } from '../data/restaurants';
import RestaurantCard from './RestaurantCard';

interface FeaturedSliderProps {
  restaurants: Restaurant[];
}

const FeaturedSlider: React.FC<FeaturedSliderProps> = ({ restaurants }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovering, setIsHovering] = useState(false);
  const featuredRestaurants = restaurants.filter(r => r.featured);
  
  // Auto scroll when not hovering
  useEffect(() => {
    if (isHovering) return;
    
    const interval = setInterval(() => {
      setCurrentIndex(current => 
        current === featuredRestaurants.length - 1 ? 0 : current + 1
      );
    }, 5000);
    
    return () => clearInterval(interval);
  }, [isHovering, featuredRestaurants.length]);
  
  const goToSlide = (index: number) => {
    setCurrentIndex(index);
  };
  
  const goToPrevious = () => {
    setCurrentIndex(current => 
      current === 0 ? featuredRestaurants.length - 1 : current - 1
    );
  };
  
  const goToNext = () => {
    setCurrentIndex(current => 
      current === featuredRestaurants.length - 1 ? 0 : current + 1
    );
  };

  return (
    <div 
      className="relative overflow-hidden rounded-lg shadow-lg"
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      <div className="flex transition-transform duration-500 ease-in-out h-[500px]" 
        style={{ transform: `translateX(-${currentIndex * 100}%)` }}>
        {featuredRestaurants.map((restaurant) => (
          <div key={restaurant.id} className="w-full flex-shrink-0 relative">
            <img 
              src={restaurant.image} 
              alt={restaurant.name} 
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-90"></div>
            <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8 text-white">
              <h2 className="text-3xl md:text-4xl font-display font-bold mb-2">
                {restaurant.name}
              </h2>
              <p className="text-xl mb-3">{restaurant.cuisine} • {restaurant.location}</p>
              <p className="text-gray-200 mb-6 max-w-2xl">{restaurant.description}</p>
              <button className="bg-primary-500 hover:bg-primary-600 transition-colors text-white py-2 px-6 rounded-full text-lg font-medium">
                Explore Now
              </button>
            </div>
          </div>
        ))}
      </div>
      
      {/* Navigation arrows */}
      <button 
        onClick={goToPrevious}
        className="absolute top-1/2 left-4 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 rounded-full p-2 text-white transition-colors"
      >
        <ChevronLeft className="h-6 w-6" />
      </button>
      
      <button 
        onClick={goToNext}
        className="absolute top-1/2 right-4 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 rounded-full p-2 text-white transition-colors"
      >
        <ChevronRight className="h-6 w-6" />
      </button>
      
      {/* Indicators */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
        {featuredRestaurants.map((_, index) => (
          <button 
            key={index} 
            onClick={() => goToSlide(index)}
            className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
              index === currentIndex ? 'bg-white w-8' : 'bg-white/50'
            }`}
          />
        ))}
      </div>
    </div>
  );
};

export default FeaturedSlider;