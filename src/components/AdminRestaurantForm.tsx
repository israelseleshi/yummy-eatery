import React, { useState, useRef, useEffect } from 'react';
import { Upload, X, Loader2 } from 'lucide-react';
import { addRestaurant, updateRestaurant } from '../lib/restaurants';
import { Restaurant } from '../data/restaurants';

// Cloudinary configuration
const CLOUD_NAME = 'dasieigwp';
const UPLOAD_PRESET = 'restaurant_images';

interface AdminRestaurantFormProps {
  restaurant?: Restaurant;
  onSubmit: () => void;
  onCancel: () => void;
}

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

const AdminRestaurantForm: React.FC<AdminRestaurantFormProps> = ({
  restaurant,
  onSubmit,
  onCancel
}) => {
  const [formData, setFormData] = useState({
    name: restaurant?.name || '',
    cuisine: restaurant?.cuisine || '',
    location: restaurant?.location || '',
    address: restaurant?.address || '',
    priceRange: restaurant?.priceRange || '',
    image: restaurant?.image || '',
    description: restaurant?.description || '',
    openingHours: restaurant?.openingHours || ''
  });

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(restaurant?.image || null);
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (restaurant) {
      setFormData({
        name: restaurant.name,
        cuisine: restaurant.cuisine,
        location: restaurant.location,
        address: restaurant.address,
        priceRange: restaurant.priceRange,
        image: restaurant.image,
        description: restaurant.description,
        openingHours: restaurant.openingHours
      });
      setImagePreview(restaurant.image);
    }
  }, [restaurant]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setError('Image size should be less than 5MB');
        return;
      }
      
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const uploadImageToCloudinary = async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', UPLOAD_PRESET);

    try {
      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
        {
          method: 'POST',
          body: formData
        }
      );

      if (!response.ok) {
        throw new Error('Failed to upload image');
      }

      const data = await response.json();
      return data.secure_url;
    } catch (error) {
      console.error('Error uploading to Cloudinary:', error);
      throw new Error('Failed to upload image to Cloudinary');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setUploadProgress(0);

    try {
      let imageUrl = formData.image;
      
      if (imageFile) {
        imageUrl = await uploadImageToCloudinary(imageFile);
      }

      const restaurantData = {
        ...formData,
        image: imageUrl,
        rating: restaurant?.rating || 0,
        reviews: restaurant?.reviews || 0,
        featured: restaurant?.featured || false
      };

      if (restaurant) {
        await updateRestaurant(restaurant.id.toString(), restaurantData);
      } else {
        await addRestaurant(restaurantData);
      }
      
      onSubmit();
    } catch (error: any) {
      setError(error.message || 'Failed to save restaurant');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {error && (
        <div className="bg-red-50 text-red-600 p-4 rounded-lg">
          {error}
        </div>
      )}

      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Restaurant Name</label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Cuisine</label>
          <select
            value={formData.cuisine}
            onChange={(e) => setFormData({ ...formData, cuisine: e.target.value })}
            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            required
          >
            <option value="">Select cuisine type</option>
            {CUISINE_OPTIONS.map(cuisine => (
              <option key={cuisine} value={cuisine}>{cuisine}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
          <input
            type="text"
            value={formData.location}
            onChange={(e) => setFormData({ ...formData, location: e.target.value })}
            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Address</label>
          <input
            type="text"
            value={formData.address}
            onChange={(e) => setFormData({ ...formData, address: e.target.value })}
            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Price Range</label>
          <select
            value={formData.priceRange}
            onChange={(e) => setFormData({ ...formData, priceRange: e.target.value })}
            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            required
          >
            <option value="">Select price range</option>
            <option value="$">$</option>
            <option value="$$">$$</option>
            <option value="$$$">$$$</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Opening Hours</label>
          <select
            value={formData.openingHours}
            onChange={(e) => setFormData({ ...formData, openingHours: e.target.value })}
            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            required
          >
            <option value="">Select opening hours</option>
            {OPENING_HOURS_OPTIONS.map(hours => (
              <option key={hours} value={hours}>{hours}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
          <textarea
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            rows={4}
            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-4">Restaurant Image</label>
          <div className="mt-1 flex items-center">
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleImageChange}
              accept="image/*"
              className="hidden"
            />
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="inline-flex items-center px-4 py-3 border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
            >
              <Upload className="h-5 w-5 mr-2" />
              Upload Image
            </button>
            {imagePreview && (
              <div className="ml-4 relative">
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="h-20 w-20 object-cover rounded-lg"
                />
                <button
                  type="button"
                  onClick={() => {
                    setImagePreview(null);
                    setImageFile(null);
                  }}
                  className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            )}
          </div>
          {uploadProgress > 0 && uploadProgress < 100 && (
            <div className="mt-2">
              <div className="bg-gray-200 rounded-full h-2.5">
                <div
                  className="bg-primary-500 h-2.5 rounded-full"
                  style={{ width: `${uploadProgress}%` }}
                ></div>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="flex justify-end space-x-4 pt-6">
        <button
          type="button"
          onClick={onCancel}
          className="px-6 py-3 border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={loading}
          className="px-6 py-3 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 disabled:opacity-50 flex items-center"
        >
          {loading && <Loader2 className="animate-spin h-4 w-4 mr-2" />}
          {loading ? 'Saving...' : restaurant ? 'Update Restaurant' : 'Add Restaurant'}
        </button>
      </div>
    </form>
  );
};

export default AdminRestaurantForm;