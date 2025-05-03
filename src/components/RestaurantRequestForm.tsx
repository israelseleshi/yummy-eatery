import React, { useState } from 'react';
import { Store, CreditCard, ChevronLeft } from 'lucide-react';
import { useAuth } from '../lib/auth';
import { createRestaurantRequest } from '../lib/restaurant-requests';

const CUISINE_OPTIONS = [
  'Traditional Ethiopian',
  'Italian',
  'Middle Eastern',
  'Continental',
  'International',
  'Indian',
  'Café'
];

const OPENING_HOURS_OPTIONS = [
  '7:00 AM - 8:00 PM',
  '7:00 AM - 9:00 PM',
  '8:00 AM - 9:00 PM',
  '9:00 AM - 9:00 PM',
  '10:00 AM - 10:00 PM',
  '11:00 AM - 10:00 PM',
  '11:00 AM - 11:00 PM',
  '12:00 PM - 10:00 PM',
  '12:00 PM - 11:00 PM'
];

const PAYMENT_PLANS = [
  {
    id: 'basic',
    name: 'Basic',
    price: 5000,
    features: [
      'Basic listing',
      'Standard support',
      'Regular visibility'
    ]
  },
  {
    id: 'premium',
    name: 'Premium',
    price: 7500,
    features: [
      'Featured listing',
      'Priority support',
      'Analytics dashboard',
      'Enhanced visibility'
    ]
  },
  {
    id: 'platinum',
    name: 'Platinum',
    price: 10000,
    features: [
      'Premium listing',
      '24/7 support',
      'Advanced analytics',
      'Marketing tools',
      'Maximum visibility'
    ]
  }
];

const RestaurantRequestForm: React.FC = () => {
  const { user } = useAuth();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: '',
    cuisine: '',
    location: '',
    address: '',
    description: '',
    openingHours: '',
    priceRange: '',
    image: '',
    paymentPlan: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleImageUpload = async (file: File) => {
    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/upload-image`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
        },
        body: formData
      });

      if (!response.ok) {
        throw new Error('Failed to upload image');
      }

      const data = await response.json();
      setFormData({
        ...formData,
        image: data.secure_url
      });
    } catch (error) {
      console.error('Error uploading image:', error);
      setError('Failed to upload image. Please try again.');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    if (!formData.paymentPlan) {
      setError('Please select a payment plan');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      await createRestaurantRequest({
        ...formData,
        ownerId: user.id,
        ownerName: `${user.firstName} ${user.lastName}`,
        ownerEmail: user.email
      });

      setSuccess(true);
      setFormData({
        name: '',
        cuisine: '',
        location: '',
        address: '',
        description: '',
        openingHours: '',
        priceRange: '',
        image: '',
        paymentPlan: ''
      });
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Store className="h-8 w-8 text-green-500" />
          </div>
          <h2 className="text-2xl font-display font-bold text-neutral-900 mb-4">
            Request Submitted Successfully!
          </h2>
          <p className="text-neutral-600 mb-6">
            Your restaurant request has been submitted. Our admin team will review it shortly.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      {step === 1 ? (
        <>
          <h2 className="text-2xl font-display font-bold text-neutral-900 mb-6">
            Submit Restaurant Request
          </h2>

          {error && (
            <div className="bg-red-50 text-red-600 p-4 rounded-lg mb-6">
              {error}
            </div>
          )}

          <form onSubmit={(e) => { e.preventDefault(); setStep(2); }} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  Restaurant Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 rounded-lg border border-neutral-300 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  Cuisine Type
                </label>
                <select
                  name="cuisine"
                  value={formData.cuisine}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 rounded-lg border border-neutral-300 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  required
                >
                  <option value="">Select cuisine type</option>
                  {CUISINE_OPTIONS.map(cuisine => (
                    <option key={cuisine} value={cuisine}>{cuisine}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  Location
                </label>
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 rounded-lg border border-neutral-300 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  Address
                </label>
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 rounded-lg border border-neutral-300 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  Opening Hours
                </label>
                <select
                  name="openingHours"
                  value={formData.openingHours}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 rounded-lg border border-neutral-300 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  required
                >
                  <option value="">Select opening hours</option>
                  {OPENING_HOURS_OPTIONS.map(hours => (
                    <option key={hours} value={hours}>{hours}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  Price Range
                </label>
                <select
                  name="priceRange"
                  value={formData.priceRange}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 rounded-lg border border-neutral-300 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  required
                >
                  <option value="">Select price range</option>
                  <option value="$">$</option>
                  <option value="$$">$$</option>
                  <option value="$$$">$$$</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                Description
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows={4}
                className="w-full px-4 py-2 rounded-lg border border-neutral-300 focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                Restaurant Image
              </label>
              <ImageUpload
                currentImage={formData.image}
                onImageUpload={handleImageUpload}
              />
            </div>

            <button
              type="submit"
              className="w-full bg-primary-500 text-white py-3 rounded-lg font-medium hover:bg-primary-600 transition-colors"
            >
              Next: Select Payment Plan
            </button>
          </form>
        </>
      ) : (
        <>
          <div className="flex items-center mb-6">
            <button
              onClick={() => setStep(1)}
              className="text-neutral-600 hover:text-neutral-900 transition-colors mr-4"
            >
              <ChevronLeft className="h-6 w-6" />
            </button>
            <h2 className="text-2xl font-display font-bold text-neutral-900">
              Select Payment Plan
            </h2>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {PAYMENT_PLANS.map((plan) => (
                <div
                  key={plan.id}
                  className={`border-2 rounded-lg p-6 cursor-pointer transition-colors ${
                    formData.paymentPlan === plan.id
                      ? 'border-primary-500 bg-primary-50'
                      : 'border-neutral-200 hover:border-primary-200'
                  }`}
                  onClick={() => setFormData({ ...formData, paymentPlan: plan.id })}
                >
                  <h4 className="text-lg font-semibold mb-2">{plan.name}</h4>
                  <p className="text-2xl font-bold mb-4">
                    ETB {plan.price.toLocaleString()}
                  </p>
                  <ul className="space-y-2">
                    {plan.features.map((feature, index) => (
                      <li key={index} className="flex items-center text-sm">
                        <Store className="h-4 w-4 text-primary-500 mr-2" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>

            <div className="flex justify-end space-x-4">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="px-6 py-3 border border-neutral-300 rounded-lg text-neutral-700 hover:bg-neutral-50 transition-colors"
              >
                Previous
              </button>
              <button
                type="submit"
                disabled={loading || !formData.paymentPlan}
                className="bg-primary-500 text-white px-6 py-3 rounded-lg font-medium hover:bg-primary-600 transition-colors disabled:opacity-50 flex items-center"
              >
                {loading ? (
                  'Submitting...'
                ) : (
                  <>
                    <CreditCard className="h-5 w-5 mr-2" />
                    Submit Request
                  </>
                )}
              </button>
            </div>
          </form>
        </>
      )}
    </div>
  );
};

export default RestaurantRequestForm;