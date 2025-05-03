import React, { useState, useEffect } from 'react';
import { Clock, CheckCircle, XCircle, Store, ChevronDown, ChevronUp, User } from 'lucide-react';
import { RestaurantRequest, getRestaurantRequests, updateRestaurantRequest } from '../lib/restaurant-requests';
import { addDoc, collection, deleteDoc, doc, getDocs, query, where, Timestamp } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { createNotification } from '../lib/notifications';
import LoadingState from './LoadingState';
import Pagination from './Pagination';

const REQUESTS_PER_PAGE = 4;

const AdminRequestList: React.FC = () => {
  const [requests, setRequests] = useState<RestaurantRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedRequest, setExpandedRequest] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    fetchRequests();
  }, [currentPage]);

  const fetchRequests = async () => {
    try {
      const data = await getRestaurantRequests();
      setRequests(data);
      setTotalPages(Math.ceil(data.length / REQUESTS_PER_PAGE));
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (requestId: string, status: 'approved' | 'rejected') => {
    try {
      const request = requests.find(r => r.id === requestId);
      if (!request) return;

      // Update request status
      await updateRestaurantRequest(requestId, { status });

      if (status === 'approved') {
        // Check if restaurant already exists
        const restaurantsRef = collection(db, 'restaurants');
        const q = query(restaurantsRef, 
          where('name', '==', request.name),
          where('ownerId', '==', request.ownerId)
        );
        const existingRestaurants = await getDocs(q);

        if (existingRestaurants.empty) {
          // Create new restaurant only if it doesn't exist
          await addDoc(collection(db, 'restaurants'), {
            name: request.name,
            cuisine: request.cuisine,
            location: request.location,
            address: request.address,
            priceRange: request.priceRange,
            image: request.image,
            description: request.description,
            openingHours: request.openingHours,
            rating: 0,
            reviewsCount: 0,
            featured: false,
            ownerId: request.ownerId,
            createdAt: Timestamp.now(),
            updatedAt: Timestamp.now()
          });
        }

        // Create notification for approval
        await createNotification({
          userId: request.ownerId,
          type: 'request_status',
          title: 'Restaurant Request Approved',
          message: `Your request for ${request.name} has been approved! Your restaurant is now live on the platform.`,
          read: false,
          data: { requestId }
        });
      } else {
        // Create notification for rejection
        await createNotification({
          userId: request.ownerId,
          type: 'request_status',
          title: 'Restaurant Request Rejected',
          message: `Your request for ${request.name} has been rejected. Please review and resubmit with any necessary changes.`,
          read: false,
          data: { requestId }
        });
      }

      // Update local state
      setRequests(requests.map(r => 
        r.id === requestId ? { ...r, status } : r
      ));
    } catch (err: any) {
      setError(err.message);
    }
  };

  const toggleRequestDetails = (requestId: string) => {
    setExpandedRequest(expandedRequest === requestId ? null : requestId);
  };

  if (loading) {
    return <LoadingState message="Loading requests..." />;
  }

  if (error) {
    return (
      <div className="bg-red-50 text-red-600 p-4 rounded-lg">
        {error}
      </div>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved':
        return 'bg-green-100 text-green-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      case 'published':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-yellow-100 text-yellow-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved':
        return <CheckCircle className="h-5 w-5" />;
      case 'rejected':
        return <XCircle className="h-5 w-5" />;
      case 'published':
        return <Store className="h-5 w-5" />;
      default:
        return <Clock className="h-5 w-5" />;
    }
  };

  // Calculate pagination
  const startIndex = (currentPage - 1) * REQUESTS_PER_PAGE;
  const endIndex = startIndex + REQUESTS_PER_PAGE;
  const paginatedRequests = requests.slice(startIndex, endIndex);

  return (
    <div className="space-y-6">
      {requests.length > 0 ? (
        <>
          <div className="space-y-4">
            {paginatedRequests.map((request) => (
              <div
                key={request.id}
                className="bg-white rounded-lg shadow p-6 hover:shadow-md transition-shadow"
              >
                {/* Owner Info Badge */}
                <div className="mb-4 inline-flex items-center bg-neutral-100 rounded-lg px-3 py-1">
                  <User className="h-4 w-4 text-neutral-500 mr-2" />
                  <span className="text-sm text-neutral-700">From: {request.ownerName}</span>
                </div>

                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex-grow">
                    <div className="flex flex-wrap items-center gap-3 mb-2">
                      <h3 className="text-lg font-semibold text-neutral-900">
                        {request.name}
                      </h3>
                      <span className={`px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1 ${getStatusColor(request.status)}`}>
                        {getStatusIcon(request.status)}
                        {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                      </span>
                    </div>
                    <div className="text-neutral-600 space-y-1">
                      <p>{request.cuisine} • {request.location}</p>
                      <p className="text-sm">Submitted on {request.createdAt.toDate().toLocaleDateString()}</p>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-2">
                    {request.status === 'pending' && (
                      <>
                        <button
                          onClick={() => handleStatusUpdate(request.id, 'approved')}
                          className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors"
                        >
                          Approve
                        </button>
                        <button
                          onClick={() => handleStatusUpdate(request.id, 'rejected')}
                          className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors"
                        >
                          Reject
                        </button>
                      </>
                    )}
                    <button
                      onClick={() => toggleRequestDetails(request.id)}
                      className="flex items-center justify-center px-4 py-2 border border-neutral-300 rounded-lg hover:bg-neutral-50 transition-colors"
                    >
                      {expandedRequest === request.id ? (
                        <>
                          Hide Details
                          <ChevronUp className="ml-2 h-4 w-4" />
                        </>
                      ) : (
                        <>
                          View Details
                          <ChevronDown className="ml-2 h-4 w-4" />
                        </>
                      )}
                    </button>
                  </div>
                </div>

                {expandedRequest === request.id && (
                  <div className="mt-6 border-t pt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-semibold text-neutral-900 mb-2">Restaurant Details</h4>
                      <dl className="space-y-2">
                        <div>
                          <dt className="text-sm font-medium text-neutral-500">Address</dt>
                          <dd className="text-neutral-900">{request.address}</dd>
                        </div>
                        <div>
                          <dt className="text-sm font-medium text-neutral-500">Opening Hours</dt>
                          <dd className="text-neutral-900">{request.openingHours}</dd>
                        </div>
                        <div>
                          <dt className="text-sm font-medium text-neutral-500">Price Range</dt>
                          <dd className="text-neutral-900">{request.priceRange}</dd>
                        </div>
                        <div>
                          <dt className="text-sm font-medium text-neutral-500">Description</dt>
                          <dd className="text-neutral-900">{request.description}</dd>
                        </div>
                      </dl>
                    </div>
                    <div>
                      <h4 className="font-semibold text-neutral-900 mb-2">Owner Information</h4>
                      <dl className="space-y-2">
                        <div>
                          <dt className="text-sm font-medium text-neutral-500">Name</dt>
                          <dd className="text-neutral-900">{request.ownerName}</dd>
                        </div>
                        <div>
                          <dt className="text-sm font-medium text-neutral-500">Email</dt>
                          <dd className="text-neutral-900">{request.ownerEmail}</dd>
                        </div>
                        <div>
                          <dt className="text-sm font-medium text-neutral-500">Payment Plan</dt>
                          <dd className="text-neutral-900">{request.paymentPlan}</dd>
                        </div>
                        <div>
                          <dt className="text-sm font-medium text-neutral-500">Payment Status</dt>
                          <dd className="text-neutral-900">{request.paymentStatus}</dd>
                        </div>
                      </dl>
                      {request.image && (
                        <div className="mt-4">
                          <h4 className="font-semibold text-neutral-900 mb-2">Restaurant Image</h4>
                          <img
                            src={request.image}
                            alt={request.name}
                            className="w-full h-48 object-cover rounded-lg"
                          />
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          {totalPages > 1 && (
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />
          )}
        </>
      ) : (
        <div className="text-center py-12 bg-neutral-50 rounded-lg">
          <Clock className="h-12 w-12 text-neutral-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-neutral-900 mb-2">
            No restaurant requests
          </h3>
          <p className="text-neutral-600">
            Restaurant requests will appear here once owners submit them
          </p>
        </div>
      )}
    </div>
  );
};

export default AdminRequestList;