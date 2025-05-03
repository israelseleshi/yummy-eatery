import React, { useState, useEffect } from 'react';
import { Bell } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../lib/auth';
import { subscribeToUnreadMessages } from '../lib/chat';

const ChatNotifications: React.FC = () => {
  const { user } = useAuth();
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    if (!user) return;

    const unsubscribe = subscribeToUnreadMessages(user.id, (count) => {
      setUnreadCount(count);
    });

    return () => unsubscribe();
  }, [user]);

  if (!user) return null;

  return (
    <Link to="/chat" className="relative">
      <Bell className="h-6 w-6 text-neutral-600 hover:text-neutral-900 transition-colors" />
      {unreadCount > 0 && (
        <span className="absolute -top-1 -right-1 bg-primary-500 text-white text-xs w-4 h-4 flex items-center justify-center rounded-full">
          {unreadCount > 9 ? '9+' : unreadCount}
        </span>
      )}
    </Link>
  );
};

export default ChatNotifications;