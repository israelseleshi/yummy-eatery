import React, { useState, useEffect } from 'react';
import { Heart, Bookmark } from 'lucide-react';
import { useAuth } from '../lib/auth';
import { addLike, removeLike, subscribeLikes } from '../lib/likes';
import { addSave, removeSave, subscribeSaves } from '../lib/saves';
import { useNavigate } from 'react-router-dom';

interface RestaurantActionsProps {
  restaurantId: number;
  onActionComplete?: () => void;
}

const RestaurantActions: React.FC<RestaurantActionsProps> = ({ 
  restaurantId, 
  onActionComplete 
}) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isLiked, setIsLiked] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!user) return;

    const unsubscribeLikes = subscribeLikes(user.id, (likedIds) => {
      setIsLiked(likedIds.includes(restaurantId));
    });

    const unsubscribeSaves = subscribeSaves(user.id, (savedIds) => {
      setIsSaved(savedIds.includes(restaurantId));
    });

    return () => {
      unsubscribeLikes();
      unsubscribeSaves();
    };
  }, [user, restaurantId]);

  const handleAction = async (action: 'like' | 'save') => {
    if (!user) {
      navigate('/login');
      return;
    }
    
    setIsLoading(true);
    try {
      if (action === 'like') {
        if (isLiked) {
          await removeLike(user.id, restaurantId);
        } else {
          await addLike(user.id, restaurantId);
        }
      } else {
        if (isSaved) {
          await removeSave(user.id, restaurantId);
        } else {
          await addSave(user.id, restaurantId);
        }
      }
      onActionComplete?.();
    } catch (error) {
      console.error(`Error toggling ${action}:`, error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex space-x-2">
      <button
        onClick={() => handleAction('like')}
        disabled={isLoading}
        className={`p-2 rounded-full transition-colors ${
          isLiked 
            ? 'bg-red-500 text-white' 
            : 'bg-white/20 hover:bg-white/30 backdrop-blur-sm'
        }`}
        title={isLiked ? 'Unlike' : 'Like'}
      >
        <Heart className={`h-5 w-5 ${isLiked ? 'fill-current' : ''}`} />
      </button>
      
      <button
        onClick={() => handleAction('save')}
        disabled={isLoading}
        className={`p-2 rounded-full transition-colors ${
          isSaved 
            ? 'bg-primary-500 text-white' 
            : 'bg-white/20 hover:bg-white/30 backdrop-blur-sm'
        }`}
        title={isSaved ? 'Unsave' : 'Save'}
      >
        <Bookmark className={`h-5 w-5 ${isSaved ? 'fill-current' : ''}`} />
      </button>
    </div>
  );
};

export default RestaurantActions