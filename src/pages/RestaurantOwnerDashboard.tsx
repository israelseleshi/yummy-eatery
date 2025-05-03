import React, { useState, useEffect } from 'react';
import { Store, PlusCircle, Clock, CheckCircle, XCircle, MessageSquare, CreditCard } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../lib/auth';
import { RestaurantRequest, getRestaurantRequests } from '../lib/restaurant-requests';
import LoadingState from '../components/LoadingState';
import ChatInterface from '../components/ChatInterface';
import RestaurantRequestForm from '../components/RestaurantRequestForm';
import PaymentForm from '../components/PaymentForm';

const PAYMENT_PLANS = {
  basic: 5000,
  premium: 7500,
  platinum: 10000
};

const RestaurantOwnerDashboard: React.FC = () => {
  const { user } = useAuth();
  const [requests, setRequests] = useState<RestaurantRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showRequestForm, setShowRequestForm] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<RestaurantRequest | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [showPayment, setShowPayment] = useState(false);

  useEffect(() => {
    const fetchRequests = async () => {
      if (!user) return;
      try {
        const data = await getRestaurantRequests(user.id);
        setRequests(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchRequests();
  }, [user]);

  if (!user) return null;

  if (loading) {
    return <LoadingState message="Loading dashboard..." />;
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

  const handleViewDetails = (request: RestaurantRequest) => {
    setSelectedRequest(request);
    setIsEditing(false);
    setShowPayment(false);
  };

  const handleEdit = (request: RestaurantRequest) => {
    setSelectedRequest(request);
    setIsEditing(true);
    setShowPayment(false);
  };

  const handleContinuePayment = (request: RestaurantRequest) => {
    setSelectedRequest(request);
    setShowPayment(true);
  };

  const handlePaymentSuccess = () => {
    setShowPayment(false);
    setSelectedRequest(null);
    // Refresh requests
    if (user) {
      getRestaurantRequests(user.id).then(setRequests);
    }
  };

  const renderRequestDetails = () => {
    if (!selectedRequest) return null;

    if (showPayment) {
      return (
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-semibold">Complete Payment</h2>
            <button
              onClick={() => setShowPayment(false)}
              className="bg-neutral-100 text-neutral-700 px-4 py-2 rounded-lg hover:bg-neutral-200 transition-colors"
            >
              Back
            </button>
          </div>
          <PaymentForm
            amount={PAYMENT_PLANS[selectedRequest.paymentPlan as keyof typeof PAYMENT_PLANS]}
            restaurantId={selectedRequest.id}
            onSuccess={handlePaymentSuccess}
            onError={setError}
          />
        </div>
      );
    }

    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold">Request Details</h2>
          <div className="flex gap-3">
            {selectedRequest.status === 'rejected' && (
              <button
                onClick={() => handleEdit(selectedRequest)}
                className="bg-primary-500 text-white px-4 py-2 rounded-lg hover:bg-primary-600 transition-colors"
              >
                Edit Request
              </button>
            )}
            {selectedRequest.status === 'pending' && selectedRequest.paymentStatus !== 'paid' && (
              <button
                onClick={() => handleContinuePayment(selectedRequest)}
                className="bg-primary-500 text-white px-4 py-2 rounded-lg hover:bg-primary-600 transition-colors flex items-center"
              >
                <CreditCard className="h-5 w-5 mr-2" />
                Continue Payment
              </button>
            )}
            <button
              onClick={() => setSelectedRequest(null)}
              className="bg-neutral-100 text-neutral-700 px-4 py-2 rounded-lg hover:bg-neutral-200 transition-colors"
            >
              Close
            </button>
          </div>
        </div>

        {isEditing ? (
          <RestaurantRequestForm initialData={selectedRequest} />
        ) : (
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-neutral-500 mb-1">Restaurant Name</label>
                <p className="text-neutral-900">{selectedRequest.name}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-neutral-500 mb-1">Status</label>
                <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(String(selectedRequest.status))}`}>
                  {getStatusIcon(String(selectedRequest.status))}
                  <span className="ml-2">{String(selectedRequest.status).charAt(0).toUpperCase() + String(selectedRequest.status).slice(1)}</span>
                </span>
              </div>
              <div>
                <label className="block text-sm font-medium text-neutral-500 mb-1">Cuisine</label>
                <p className="text-neutral-900">{selectedRequest.cuisine}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-neutral-500 mb-1">Location</label>
                <p className="text-neutral-900">{selectedRequest.location}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-neutral-500 mb-1">Address</label>
                <p className="text-neutral-900">{selectedRequest.address}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-neutral-500 mb-1">Price Range</label>
                <p className="text-neutral-900">{selectedRequest.priceRange}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-neutral-500 mb-1">Opening Hours</label>
                <p className="text-neutral-900">{selectedRequest.openingHours}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-neutral-500 mb-1">Submitted On</label>
                <p className="text-neutral-900">{selectedRequest.createdAt.toDate().toLocaleDateString()}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-neutral-500 mb-1">Payment Plan</label>
                <p className="text-neutral-900">{selectedRequest.paymentPlan}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-neutral-500 mb-1">Payment Status</label>
                <p className="text-neutral-900">{selectedRequest.paymentStatus}</p>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-neutral-500 mb-1">Description</label>
              <p className="text-neutral-900">{selectedRequest.description}</p>
            </div>
            {selectedRequest.image && (
              <div>
                <label className="block text-sm font-medium text-neutral-500 mb-1">Restaurant Image</label>
                <img src={selectedRequest.image} alt={selectedRequest.name} className="w-full max-w-lg rounded-lg" />
              </div>
            )}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen pt-20 pb-16">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-md p-6 md:p-8">
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h1 className="text-2xl md:text-3xl font-display font-bold text-neutral-900">
                    Restaurant Owner Dashboard
                  </h1>
                  <p className="text-neutral-600 mt-1">
                    Manage your restaurant listings and requests
                  </p>
                </div>
                {!selectedRequest && (
                  <button
                    onClick={() => {
                      setShowRequestForm(true);
                      setSelectedRequest(null);
                    }}
                    className="bg-primary-500 text-white px-4 py-2 rounded-lg font-medium hover:bg-primary-600 transition-colors flex items-center"
                  >
                    <PlusCircle className="h-5 w-5 mr-2" />
                    New Request
                  </button>
                )}
              </div>

              {error && (
                <div className="bg-red-50 text-red-600 p-4 rounded-lg mb-6">
                  {error}
                </div>
              )}

              {selectedRequest ? (
                renderRequestDetails()
              ) : showRequestForm ? (
                <RestaurantRequestForm />
              ) : requests.length > 0 ? (
                <div className="space-y-6">
                  {requests.map((request) => (
                    <div
                      key={request.id}
                      className="bg-neutral-50 rounded-lg p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
                    >
                      <div className="flex-grow">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-lg font-semibold text-neutral-900">
                            {request.name}
                          </h3>
                          <span className={`px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1 ${getStatusColor(String(request.status))}`}>
                            {getStatusIcon(String(request.status))}
                            {String(request.status).charAt(0).toUpperCase() + String(request.status).slice(1)}
                          </span>
                        </div>
                        <div className="text-neutral-600 space-y-1">
                          <p>{request.cuisine} • {request.location}</p>
                          <p className="text-sm">Submitted on {request.createdAt.toDate().toLocaleDateString()}</p>
                        </div>
                      </div>
                      <div className="flex flex-col md:flex-row gap-3">
                        <button
                          onClick={() => handleViewDetails(request)}
                          className="bg-neutral-100 text-neutral-700 px-4 py-2 rounded-lg font-medium hover:bg-neutral-200 transition-colors text-center"
                        >
                          View Details
                        </button>
                        {request.status === 'rejected' && (
                          <button
                            onClick={() => handleEdit(request)}
                            className="bg-primary-500 text-white px-4 py-2 rounded-lg font-medium hover:bg-primary-600 transition-colors text-center"
                          >
                            Edit Request
                          </button>
                        )}
                        {request.status === 'pending' && request.paymentStatus !== 'paid' && (
                          <button
                            onClick={() => handleContinuePayment(request)}
                            className="bg-primary-500 text-white px-4 py-2 rounded-lg font-medium hover:bg-primary-600 transition-colors flex items-center justify-center"
                          >
                            <CreditCard className="h-5 w-5 mr-2" />
                            Continue Payment
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 bg-neutral-50 rounded-lg">
                  <Store className="h-12 w-12 text-neutral-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-neutral-900 mb-2">
                    No restaurant requests yet
                  </h3>
                  <p className="text-neutral-600 mb-6">
                    Start by submitting your first restaurant listing request
                  </p>
                  <button
                    onClick={() => setShowRequestForm(true)}
                    className="bg-primary-500 text-white px-6 py-3 rounded-lg font-medium hover:bg-primary-600 transition-colors inline-flex items-center"
                  >
                    <PlusCircle className="h-5 w-5 mr-2" />
                    Submit Request
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Chat Section */}
          <div>
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="mb-6">
                <h2 className="text-xl font-semibold">Chat with Admin</h2>
              </div>
              <ChatInterface
                receiverId="admin"
                receiverName="Admin Support"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RestaurantOwnerDashboard;