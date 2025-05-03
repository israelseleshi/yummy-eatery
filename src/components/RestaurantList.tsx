import React, { useState, useEffect } from 'react';
import { Star, Edit, Trash2 } from 'lucide-react';
import { Restaurant, getRestaurants, deleteRestaurant } from '../lib/restaurants';
import AdminRestaurantForm from './AdminRestaurantForm';
import Pagination from './Pagination';
import LoadingState from './LoadingState';

const RestaurantList: React.FC = () => {
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editingRestaurant, setEditingRestaurant] = useState<Restaurant | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [showAddForm, setShowAddForm] = useState(false);

  useEffect(() => {
    fetchRestaurants();
  }, [currentPage]);

  const fetchRestaurants = async () => {
    try {
      setLoading(true);
      const { restaurants: data, total } = await getRestaurants(currentPage);
      setRestaurants(data);
      setTotalPages(Math.ceil(total / 6));
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (restaurant: Restaurant) => {
    if (!window.confirm(`Are you sure you want to delete ${restaurant.name}?`)) {
      return;
    }

    try {
      await deleteRestaurant(restaurant.id, restaurant.image);
      await fetchRestaurants();
    } catch (err: any) {
      setError(err.message);
    }
  };

  if (loading) {
    return <LoadingState message="Loading restaurants..." />;
  }

  if (error) {
    return (
      <div className="bg-red-50 text-red-600 p-4 rounded-lg">
        {error}
      </div>
    );
  }

  if (editingRestaurant || showAddForm) {
    return (
      <AdminRestaurantForm
        restaurant={editingRestaurant}
        onSubmit={() => {
          setEditingRestaurant(null);
          setShowAddForm(false);
          fetchRestaurants();
        }}
        onCancel={() => {
          setEditingRestaurant(null);
          setShowAddForm(false);
        }}
      />
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-gray-900">Manage Restaurants</h2>
        <button
          onClick={() => setShowAddForm(true)}
          className="bg-primary-500 text-white px-4 py-2 rounded-lg hover:bg-primary-600 transition-colors"
        >
          Add Restaurant
        </button>
      </div>

      <div className="overflow-x-auto">
        <div className="min-w-full inline-block align-middle">
          <div className="overflow-hidden border rounded-lg">
            <table className="min-w-full divide-y divide-neutral-200">
              <thead className="bg-neutral-50">
                <tr>
                  <th scope="col" className="px-4 py-3 text-left text-sm font-semibold text-neutral-900">Restaurant</th>
                  <th scope="col" className="px-4 py-3 text-left text-sm font-semibold text-neutral-900 hidden md:table-cell">Location</th>
                  <th scope="col" className="px-4 py-3 text-left text-sm font-semibold text-neutral-900 hidden lg:table-cell">Cuisine</th>
                  <th scope="col" className="px-4 py-3 text-left text-sm font-semibold text-neutral-900 hidden sm:table-cell">Rating</th>
                  <th scope="col" className="px-4 py-3 text-left text-sm font-semibold text-neutral-900 hidden md:table-cell">Status</th>
                  <th scope="col" className="px-4 py-3 text-right text-sm font-semibold text-neutral-900">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-200 bg-white">
                {restaurants.map((restaurant) => (
                  <tr key={restaurant.id} className="hover:bg-neutral-50">
                    <td className="px-4 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <img
                          src={restaurant.image}
                          alt={restaurant.name}
                          className="w-10 h-10 rounded-lg object-cover"
                        />
                        <div className="ml-3">
                          <p className="font-medium text-neutral-900">{restaurant.name}</p>
                          <p className="text-sm text-neutral-500 md:hidden">{restaurant.location}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap hidden md:table-cell">
                      {restaurant.location}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap hidden lg:table-cell">
                      {restaurant.cuisine}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap hidden sm:table-cell">
                      <div className="flex items-center">
                        <Star className="h-4 w-4 fill-accent-300 text-accent-300" />
                        <span className="ml-1">{restaurant.rating.toFixed(1)}</span>
                      </div>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap hidden md:table-cell">
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        restaurant.featured
                          ? 'bg-green-100 text-green-800'
                          : 'bg-neutral-100 text-neutral-800'
                      }`}>
                        {restaurant.featured ? 'Featured' : 'Regular'}
                      </span>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-right">
                      <div className="flex justify-end space-x-2">
                        <button
                          onClick={() => setEditingRestaurant(restaurant)}
                          className="text-neutral-600 hover:text-primary-500 transition-colors p-2"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(restaurant)}
                          className="text-neutral-600 hover:text-red-500 transition-colors p-2"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
      />
    </div>
  );
};

export default RestaurantList;