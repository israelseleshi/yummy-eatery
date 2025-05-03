import React, { useState, useEffect } from 'react';
import { LayoutGrid, Users, Utensils, Star, MessageSquare, Clock } from 'lucide-react';
import AdminDashboard from '../components/AdminDashboard';
import RestaurantList from '../components/RestaurantList';
import UserList from '../components/UserList';
import AdminReviewsTable from '../components/AdminReviewsTable';
import AdminChatList from '../components/AdminChatList';
import AdminRequestList from '../components/AdminRequestList';
import { useAuth } from '../lib/auth';
import { Review, subscribeToAllReviews } from '../lib/reviews';
import NotificationBell from '../components/NotificationBell';

const AdminPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const { user } = useAuth();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    const unsubscribe = subscribeToAllReviews((newReviews) => {
      setReviews(newReviews);
    });

    return () => unsubscribe();
  }, []);

  if (!user) return null;

  const tabs = [
    { id: 'dashboard', name: 'Dashboard', icon: LayoutGrid },
    { id: 'restaurants', name: 'Restaurants', icon: Utensils },
    { id: 'users', name: 'Users', icon: Users },
    { id: 'reviews', name: 'Reviews', icon: Star },
    { id: 'requests', name: 'Restaurant Requests', icon: Clock },
    { id: 'chat', name: 'Chat Messages', icon: MessageSquare },
  ];

  return (
    <div className="min-h-screen pt-24 pb-16 bg-neutral-50">
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Mobile Menu Button */}
          <button
            className="md:hidden bg-white p-3 rounded-lg shadow-sm mb-4"
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          >
            <div className="flex items-center justify-between">
              <span className="font-medium">Menu</span>
              <div className="w-6 h-6 relative">
                <span className={`block w-full h-0.5 bg-neutral-900 absolute transition-all ${isSidebarOpen ? 'rotate-45 top-3' : 'top-1'}`}></span>
                <span className={`block w-full h-0.5 bg-neutral-900 absolute top-3 ${isSidebarOpen ? 'opacity-0' : ''}`}></span>
                <span className={`block w-full h-0.5 bg-neutral-900 absolute transition-all ${isSidebarOpen ? '-rotate-45 top-3' : 'top-5'}`}></span>
              </div>
            </div>
          </button>

          {/* Sidebar */}
          <div className={`md:w-64 flex-shrink-0 ${isSidebarOpen ? 'block' : 'hidden'} md:block`}>
            <div className="bg-white rounded-lg shadow-md p-6 sticky top-24">
              <nav className="space-y-2">
                {tabs.map((tab) => {
                  const Icon = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => {
                        setActiveTab(tab.id);
                        setIsSidebarOpen(false);
                      }}
                      className={`w-full flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors ${
                        activeTab === tab.id
                          ? 'bg-primary-50 text-primary-500'
                          : 'text-neutral-600 hover:bg-neutral-50'
                      }`}
                    >
                      <Icon className="h-5 w-5 mr-3" />
                      {tab.name}
                    </button>
                  );
                })}
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            <div className="bg-white rounded-lg shadow-md p-6 md:p-8">
              <div className="mb-8">
                <div className="flex items-center justify-between">
                  <div>
                    <h1 className="text-2xl md:text-3xl font-display font-semibold text-neutral-900">
                      {tabs.find((tab) => tab.id === activeTab)?.name}
                    </h1>
                    <p className="text-neutral-600 mt-1">
                      Manage your {activeTab} and monitor activity
                    </p>
                  </div>
                  <NotificationBell />
                </div>
              </div>

              <div className="space-y-8">
                {activeTab === 'dashboard' && <AdminDashboard />}
                
                {activeTab === 'restaurants' && (
                  <div className="space-y-6">
                    <RestaurantList />
                  </div>
                )}

                {activeTab === 'users' && (
                  <div className="space-y-6">
                    <UserList />
                  </div>
                )}

                {activeTab === 'reviews' && (
                  <div className="space-y-6">
                    <AdminReviewsTable reviews={reviews} currentUser={user.id} />
                  </div>
                )}

                {activeTab === 'requests' && (
                  <div className="space-y-6">
                    <AdminRequestList />
                  </div>
                )}

                {activeTab === 'chat' && (
                  <div className="space-y-6">
                    <AdminChatList />
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPage;