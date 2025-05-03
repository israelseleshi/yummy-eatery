import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { getRestaurantStats } from '../lib/restaurants';
import { getReviewStats } from '../lib/reviews';
import { getRestaurantRequests } from '../lib/restaurant-requests';
import { Utensils, Star, MapPin, Users, MessageSquare, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';

interface Stats {
  restaurants: {
    total: number;
    averageRating: number;
    cuisineDistribution: Record<string, number>;
    locationDistribution: Record<string, number>;
  };
  reviews: {
    total: number;
    averageRating: number;
  };
}

const COLORS = ['#E12C2C', '#F5B700', '#006B3D', '#4B5563', '#1D4ED8'];

const AdminDashboard: React.FC = () => {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pendingRequests, setPendingRequests] = useState(0);
  const [unreadMessages, setUnreadMessages] = useState(0);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [restaurantStats, reviewStats, requests] = await Promise.all([
          getRestaurantStats(),
          getReviewStats(),
          getRestaurantRequests()
        ]);
        
        setStats({
          restaurants: restaurantStats,
          reviews: reviewStats
        });

        // Count pending requests
        setPendingRequests(requests.filter(req => req.status === 'pending').length);
        
        // TODO: Implement unread messages count
        setUnreadMessages(0);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 text-red-600 p-4 rounded-lg">
        Error loading dashboard data: {error}
      </div>
    );
  }

  if (!stats) return null;

  const cuisineData = Object.entries(stats.restaurants.cuisineDistribution).map(([name, value]) => ({
    name,
    value
  }));

  const locationData = Object.entries(stats.restaurants.locationDistribution).map(([name, value]) => ({
    name,
    value
  }));

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center">
              <Utensils className="h-6 w-6 text-primary-500" />
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-semibold text-neutral-900">Total Restaurants</h3>
              <p className="text-2xl font-bold text-primary-500">{stats.restaurants.total}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-accent-100 rounded-full flex items-center justify-center">
              <Star className="h-6 w-6 text-accent-300" />
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-semibold text-neutral-900">Average Rating</h3>
              <p className="text-2xl font-bold text-accent-300">
                {stats.restaurants.averageRating.toFixed(1)}
              </p>
            </div>
          </div>
        </div>

        <Link
          to="/admin/requests"
          className="bg-white rounded-lg shadow-md p-6 hover:bg-neutral-50 transition-colors"
        >
          <div className="flex items-center">
            <div className="w-12 h-12 bg-secondary-100 rounded-full flex items-center justify-center">
              <Clock className="h-6 w-6 text-secondary-600" />
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-semibold text-neutral-900">Pending Requests</h3>
              <p className="text-2xl font-bold text-secondary-600">{pendingRequests}</p>
            </div>
          </div>
        </Link>

        <Link
          to="/admin/chat"
          className="bg-white rounded-lg shadow-md p-6 hover:bg-neutral-50 transition-colors"
        >
          <div className="flex items-center">
            <div className="w-12 h-12 bg-neutral-100 rounded-full flex items-center justify-center">
              <MessageSquare className="h-6 w-6 text-neutral-600" />
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-semibold text-neutral-900">Unread Messages</h3>
              <p className="text-2xl font-bold text-neutral-600">{unreadMessages}</p>
            </div>
          </div>
        </Link>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold mb-4">Cuisine Distribution</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={cuisineData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {cuisineData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold mb-4">Restaurants by Location</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={locationData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="value" fill="#E12C2C" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;