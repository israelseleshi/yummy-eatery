import React, { useState } from 'react';
import { ArrowRight, Utensils, Star, MapPin, Search } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import RestaurantCard from '../components/RestaurantCard';
import { restaurants, cuisineTypes } from '../data/restaurants';

const HomePage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();
  
  const topRatedRestaurants = [...restaurants]
    .sort((a, b) => b.rating - a.rating)
    .slice(0, 6);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/restaurants?search=${encodeURIComponent(searchQuery)}`);
    }
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative h-[85vh] flex items-center">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.pexels.com/photos/958545/pexels-photo-958545.jpeg"
            alt="Ethiopian cuisine" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 to-black/40"></div>
        </div>
        
        <div className="container mx-auto px-4 md:px-6 relative z-10">
          <div className="max-w-3xl">
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-display font-bold text-white mb-4 md:mb-6 leading-tight">
              Discover the Authentic Flavors of Addis Ababa
            </h1>
            <p className="text-lg md:text-xl text-white/90 mb-6 md:mb-8 leading-relaxed">
              From traditional Ethiopian cuisine to international delights, find your next favorite dining spot in the heart of Ethiopia.
            </p>
            
            <form onSubmit={handleSearch} className="bg-white rounded-full shadow-lg p-2 flex items-center max-w-2xl">
              <Search className="h-5 w-5 md:h-6 md:w-6 text-neutral-400 ml-3 md:ml-4 flex-shrink-0" />
              <input
                type="text"
                placeholder="Search for restaurants, cuisines, or locations..."
                className="flex-grow px-2 md:px-4 py-2 bg-transparent focus:outline-none text-neutral-900 text-sm md:text-base"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <button 
                type="submit"
                className="bg-primary-500 text-white px-4 md:px-6 py-2 md:py-3 rounded-full text-sm md:text-base font-medium hover:bg-primary-600 transition-colors"
              >
                Search
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* Popular Cuisines */}
      <section className="py-12 md:py-20 bg-neutral-50">
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-8 md:mb-12">
            <div>
              <h2 className="text-2xl md:text-3xl lg:text-4xl font-display font-bold text-neutral-900 mb-3 md:mb-4">
                Popular Cuisines
              </h2>
              <p className="text-neutral-600 max-w-2xl">
                Explore the diverse culinary landscape of Addis Ababa
              </p>
            </div>
            <Link 
              to="/restaurants" 
              className="inline-flex items-center text-primary-500 font-medium hover:text-primary-600 mt-4 md:mt-0"
            >
              View all cuisines <ArrowRight className="h-4 w-4 ml-2" />
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 md:gap-6">
            {cuisineTypes.map((cuisine, index) => (
              <Link 
                to={`/restaurants?cuisine=${cuisine}`} 
                key={index}
                className="group relative overflow-hidden rounded-2xl aspect-square"
              >
                <img 
                  src={restaurants.find(r => r.cuisine === cuisine)?.image} 
                  alt={cuisine}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent flex items-end p-3 md:p-4">
                  <div>
                    <h3 className="text-sm md:text-base font-display font-semibold text-white mb-1 group-hover:text-primary-500 transition-colors">
                      {cuisine}
                    </h3>
                    <p className="text-xs md:text-sm text-white/80">
                      {restaurants.filter(r => r.cuisine === cuisine).length} restaurants
                    </p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Restaurants */}
      <section className="py-12 md:py-20">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center max-w-3xl mx-auto mb-8 md:mb-12">
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-display font-bold text-neutral-900 mb-4">
              Top-Rated Restaurants
            </h2>
            <p className="text-neutral-600">
              Discover the highest-rated dining experiences that Addis Ababa has to offer, 
              carefully curated based on authentic reviews and ratings
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {topRatedRestaurants.map(restaurant => (
              <RestaurantCard key={restaurant.id} restaurant={restaurant} />
            ))}
          </div>

          <div className="text-center mt-8 md:mt-12">
            <Link
              to="/restaurants"
              className="inline-flex items-center justify-center bg-neutral-900 text-white px-6 md:px-8 py-2 md:py-3 rounded-full text-sm md:text-base font-medium hover:bg-neutral-800 transition-colors"
            >
              Explore All Restaurants
              <ArrowRight className="h-4 w-4 ml-2" />
            </Link>
          </div>
        </div>
      </section>

      {/* Download App Section */}
      <section className="py-12 md:py-20 bg-accent-300">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 items-center">
            <div>
              <h2 className="text-2xl md:text-3xl lg:text-4xl font-display font-bold text-neutral-900 mb-4 md:mb-6">
                Get the Best Food Experience with Our Mobile App
              </h2>
              <p className="text-neutral-800 text-base md:text-lg mb-6 md:mb-8">
                Download our mobile app to discover exclusive deals, make reservations, 
                and enjoy a seamless dining experience across Addis Ababa.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 md:gap-4">
                <button className="bg-neutral-900 text-white px-6 md:px-8 py-3 md:py-4 rounded-xl text-sm md:text-base font-medium hover:bg-neutral-800 transition-colors flex items-center justify-center">
                  Download for iOS
                </button>
                <button className="bg-neutral-900 text-white px-6 md:px-8 py-3 md:py-4 rounded-xl text-sm md:text-base font-medium hover:bg-neutral-800 transition-colors flex items-center justify-center">
                  Download for Android
                </button>
              </div>
            </div>
            <div className="relative">
              <div className="aspect-[4/3] rounded-2xl overflow-hidden">
                <img 
                  src="https://images.pexels.com/photos/1640774/pexels-photo-1640774.jpeg"
                  alt="Mobile app preview" 
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute -bottom-4 -right-4 md:-bottom-6 md:-right-6 bg-primary-500 text-white p-4 md:p-6 rounded-2xl shadow-xl">
                <p className="text-xl md:text-2xl font-bold">50K+</p>
                <p className="text-xs md:text-sm">Happy Users</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;