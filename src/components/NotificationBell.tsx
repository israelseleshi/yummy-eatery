import React, { useState, useEffect } from 'react';
import { Bell } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../lib/auth';
import { getUnreadNotifications, Notification } from '../lib/notifications';

const NotificationBell: React.FC = () => {
  const { user } = useAuth();
  const [unreadCount, setUnreadCount] = useState(0);
  const [hasNewNotification, setHasNewNotification] = useState(false);

  useEffect(() => {
    if (!user) return;

    const fetchUnreadCount = async () => {
      const count = await getUnreadNotifications(user.id);
      if (count > unreadCount) {
        setHasNewNotification(true);
        setTimeout(() => setHasNewNotification(false), 5000); // Reset animation after 5 seconds
      }
      setUnreadCount(count);
    };

    fetchUnreadCount();
    const interval = setInterval(fetchUnreadCount, 5000); // Check every 5 seconds

    return () => clearInterval(interval);
  }, [user, unreadCount]);

  if (!user) return null;

  return (
    <Link to="/notifications" className="relative">
      <Bell className={`h-6 w-6 text-neutral-600 hover:text-neutral-900 transition-colors ${
        hasNewNotification ? 'animate-bounce' : ''
      }`} />
      {unreadCount > 0 && (
        <span className={`absolute -top-1 -right-1 bg-primary-500 text-white text-xs w-4 h-4 flex items-center justify-center rounded-full ${
          hasNewNotification ? 'animate-pulse' : ''
        }`}>
          {unreadCount > 9 ? '9+' : unreadCount}
        </span>
      )}
    </Link>
  );
};

export default NotificationBell;