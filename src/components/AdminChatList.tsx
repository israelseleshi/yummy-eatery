import React, { useState, useEffect } from 'react';
import { MessageSquare } from 'lucide-react';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { useAuth } from '../lib/auth';
import ChatInterface from './ChatInterface';
import LoadingState from './LoadingState';

interface RestaurantOwner {
  id: string;
  firstName: string;
  lastName: string;
}

const AdminChatList: React.FC = () => {
  const { user } = useAuth();
  const [owners, setOwners] = useState<RestaurantOwner[]>([]);
  const [selectedOwner, setSelectedOwner] = useState<RestaurantOwner | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchOwners = async () => {
      try {
        const usersRef = collection(db, 'users');
        const q = query(usersRef, where('role', '==', 'restaurant_owner'));
        const snapshot = await getDocs(q);
        
        const ownersList = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as RestaurantOwner[];
        
        setOwners(ownersList);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchOwners();
  }, []);

  if (loading) {
    return <LoadingState message="Loading chat..." />;
  }

  if (error) {
    return (
      <div className="bg-red-50 text-red-600 p-4 rounded-lg">
        {error}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {/* Owners List */}
      <div className="bg-white rounded-lg shadow-md p-4">
        <h2 className="font-semibold text-lg mb-4">Restaurant Owners</h2>
        {owners.length > 0 ? (
          <div className="space-y-2">
            {owners.map((owner) => (
              <button
                key={owner.id}
                onClick={() => setSelectedOwner(owner)}
                className={`w-full p-3 rounded-lg text-left transition-colors ${
                  selectedOwner?.id === owner.id
                    ? 'bg-primary-50 text-primary-600'
                    : 'hover:bg-neutral-50'
                }`}
              >
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
                    <span className="font-medium text-primary-600">
                      {owner.firstName[0]}
                    </span>
                  </div>
                  <div className="ml-3">
                    <p className="font-medium">{owner.firstName} {owner.lastName}</p>
                    <p className="text-sm text-neutral-500">Restaurant Owner</p>
                  </div>
                </div>
              </button>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <MessageSquare className="h-8 w-8 text-neutral-300 mx-auto mb-2" />
            <p className="text-neutral-600">No restaurant owners found</p>
          </div>
        )}
      </div>

      {/* Chat Interface */}
      <div className="md:col-span-2">
        {selectedOwner ? (
          <ChatInterface
            receiverId={selectedOwner.id}
            receiverName={`${selectedOwner.firstName} ${selectedOwner.lastName}`}
          />
        ) : (
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <MessageSquare className="h-12 w-12 text-neutral-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-neutral-900 mb-2">
              Select a restaurant owner
            </h3>
            <p className="text-neutral-600">
              Choose a restaurant owner from the list to start chatting
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminChatList;