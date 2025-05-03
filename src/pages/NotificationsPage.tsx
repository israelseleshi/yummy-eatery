import React, { useState, useEffect } from 'react';
import { Bell, ChevronLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../lib/auth';
import { Notification, getNotifications, markNotificationAsRead } from '../lib/notifications';

const NotificationsPage: React.FC = () => {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNotifications = async () => {
      if (!user) return;
      try {
        const data = await getNotifications(user.id);
        setNotifications(data);
      } catch (error) {
        console.error('Error fetching notifications:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();
  }, [user]);

  const handleNotificationClick = async (notification: Notification) => {
    if (!notification.read) {
      try {
        await markNotificationAsRead(notification.id);
        setNotifications(prev =>
          prev.map(n =>
            n.id === notification.id ? { ...n, read: true } : n
          )
        );
      } catch (error) {
        console.error('Error marking notification as read:', error);
      }
    }
  };

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
            Notifications
          </h1>
        </div>

        {notifications.length > 0 ? (
          <div className="space-y-4">
            {notifications.map((notification) => (
              <div
                key={notification.id}
                onClick={() => handleNotificationClick(notification)}
                className={`bg-white rounded-lg shadow-md p-6 cursor-pointer transition-colors ${
                  !notification.read ? 'border-l-4 border-primary-500' : ''
                }`}
              >
                <div className="flex items-start gap-4">
                  <div className={`rounded-full p-2 ${
                    notification.read ? 'bg-neutral-100' : 'bg-primary-50'
                  }`}>
                    <Bell className={`h-5 w-5 ${
                      notification.read ? 'text-neutral-500' : 'text-primary-500'
                    }`} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-neutral-900 mb-1">
                      {notification.title}
                    </h3>
                    <p className="text-neutral-600">{notification.message}</p>
                    <p className="text-sm text-neutral-500 mt-2">
                      {notification.createdAt.toDate().toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-white rounded-lg shadow-md">
            <Bell className="h-12 w-12 text-neutral-300 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-neutral-900 mb-2">
              No notifications
            </h2>
            <p className="text-neutral-600">
              You don't have any notifications at the moment.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default NotificationsPage;