import React, { useState, useEffect } from 'react';
import { Search, SlidersHorizontal, X } from 'lucide-react';
import { useSearchParams } from 'react-router-dom';
import RestaurantCard from '../components/RestaurantCard';
import CuisineFilter from '../components/CuisineFilter';
import LocationFilter from '../components/LocationFilter';
import LoadingState from '../components/LoadingState';
import Pagination from '../components/Pagination';
import { 
  getRestaurants, 
  getCuisineTypes, 
  getLocations,
  Restaurant,
  searchRestaurants
} from '../lib/restaurants';

const RestaurantsPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCuisine, setSelectedCuisine] = useState<string | null>(null);
  const [selectedLocation, setSelectedLocation] = useState<string | null>(null);
  const [isFilterOpen, setIsFilterOpen] = useState<boolean>(false);
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [cuisineTypes, setCuisineTypes] = useState<string[]>([]);
  const [locations, setLocations] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalRestaurants, setTotalRestaurants] = useState(0);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchFilters = async () => {
      try {
        const [cuisines, locs] = await Promise.all([
          getCuisineTypes(),
          getLocations()
        ]);
        setCuisineTypes(cuisines);
        setLocations(locs);
      } catch (error) {
        console.error('Error fetching filters:', error);
      }
    };
    fetchFilters();
  }, []);

  useEffect(() => {
    const cuisineParam = searchParams.get('cuisine');
    const locationParam = searchParams.get('location');
    const searchParam = searchParams.get('search');
    
    if (cuisineParam) setSelectedCuisine(cuisineParam);
    if (locationParam) setSelectedLocation(locationParam);
    if (searchParam) setSearchQuery(searchParam);
  }, [searchParams]);

  useEffect(() => {
    const fetchRestaurants = async () => {
      setLoading(true);
      setError(null);
      try {
        const filters = {
          cuisine: selectedCuisine || undefined,
          location: selectedLocation || undefined,
        };

        if (searchQuery) {
          const results = await searchRestaurants(searchQuery);
          setRestaurants(results);
          setTotalRestaurants(results.length);
          setTotalPages(Math.ceil(results.length / 6));
        } else {
          const { restaurants: fetchedRestaurants, total } = await getRestaurants(
            currentPage,
            filters
          );
          setRestaurants(fetchedRestaurants);
          setTotalRestaurants(total);
          setTotalPages(Math.ceil(total / 6));
        }
      } catch (error: any) {
        setError(error.message);
        console.error('Error fetching restaurants:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchRestaurants();
  }, [selectedCuisine, selectedLocation, searchQuery, currentPage]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(1);
    
    const newParams = new URLSearchParams();
    if (selectedCuisine) newParams.set('cuisine', selectedCuisine);
    if (selectedLocation) newParams.set('location', selectedLocation);
    if (searchQuery) newParams.set('search', searchQuery);
    setSearchParams(newParams);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo(0, 0);
  };

  const clearFilters = () => {
    setSelectedCuisine(null);
    setSelectedLocation(null);
    setSearchQuery('');
    setCurrentPage(1);
    setSearchParams(new URLSearchParams());
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative h-[40vh] flex items-center">
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
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-display font-bold text-white mb-3 md:mb-4">
              Discover Restaurants
            </h1>
            <p className="text-lg md:text-xl text-white/90 mb-6 md:mb-8 leading-relaxed">
              Explore the finest dining experiences in Addis Ababa
            </p>
            
            <form onSubmit={handleSearch} className="bg-white rounded-full shadow-lg p-2 flex items-center max-w-2xl">
              <Search className="h-5 w-5 md:h-6 md:w-6 text-neutral-400 ml-3 md:ml-4 flex-shrink-0" />
              <input
                type="text"
                placeholder="Search restaurants, cuisines, or locations..."
                className="flex-grow px-2 md:px-4 py-2 bg-transparent focus:outline-none text-neutral-900 text-sm md:text-base"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="p-2 hover:bg-neutral-100 rounded-full transition-colors"
                >
                  <X className="h-4 w-4 md:h-5 md:w-5 text-neutral-400" />
                </button>
              )}
            </form>
          </div>
        </div>
      </section>

      <div className="bg-neutral-50 py-8 md:py-12">
        <div className="container mx-auto px-4 md:px-6">
          {/* Cuisine Filter */}
          <div className="mb-6 md:mb-8 overflow-x-auto">
            <CuisineFilter 
              cuisines={cuisineTypes} 
              selectedCuisine={selectedCuisine} 
              onCuisineChange={(cuisine) => {
                setSelectedCuisine(cuisine);
                setCurrentPage(1);
              }} 
            />
          </div>

          <div className="flex flex-col lg:flex-row gap-6 md:gap-8">
            {/* Sidebar Filters */}
            <div className="lg:w-64 flex-shrink-0">
              <div className="sticky top-24">
                <button 
                  onClick={() => setIsFilterOpen(!isFilterOpen)}
                  className="lg:hidden w-full bg-white text-neutral-700 px-4 py-3 rounded-lg font-medium flex items-center justify-center shadow-sm hover:bg-neutral-50 transition-colors mb-4"
                >
                  <SlidersHorizontal className="h-5 w-5 mr-2" />
                  Filters {(selectedCuisine || selectedLocation) && "(Active)"}
                </button>

                <div className={`lg:block ${isFilterOpen ? 'block' : 'hidden'}`}>
                  <LocationFilter 
                    locations={locations} 
                    selectedLocation={selectedLocation} 
                    onLocationChange={(location) => {
                      setSelectedLocation(location);
                      setCurrentPage(1);
                      setIsFilterOpen(false);
                    }} 
                  />
                </div>
              </div>
            </div>
            
            {/* Restaurant Grid */}
            <div className="flex-grow">
              <div className="flex items-center justify-between mb-6">
                <div className="text-neutral-600 text-sm md:text-base">
                  Found {totalRestaurants} restaurant{totalRestaurants !== 1 ? 's' : ''}
                </div>
                {(selectedCuisine || selectedLocation || searchQuery) && (
                  <button 
                    onClick={clearFilters}
                    className="text-primary-500 hover:text-primary-600 font-medium flex items-center text-sm md:text-base"
                  >
                    <X className="h-4 w-4 mr-1" />
                    Clear filters
                  </button>
                )}
              </div>

              {error && (
                <div className="bg-red-50 text-red-600 p-4 rounded-lg mb-6">
                  {error}
                </div>
              )}

              {loading ? (
                <LoadingState message="Loading restaurants..." />
              ) : restaurants.length > 0 ? (
                <>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                    {restaurants.map(restaurant => (
                      <RestaurantCard key={restaurant.id} restaurant={restaurant} />
                    ))}
                  </div>
                  
                  <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={handlePageChange}
                  />
                </>
              ) : (
                <div className="bg-white rounded-lg shadow-md p-6 md:p-8 text-center">
                  <h3 className="text-lg md:text-xl font-semibold text-neutral-900 mb-2">No restaurants found</h3>
                  <p className="text-neutral-600 mb-4">Try adjusting your filters or search query</p>
                  <button 
                    onClick={clearFilters}
                    className="text-primary-500 hover:text-primary-600 font-medium"
                  >
                    Clear all filters
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RestaurantsPage;