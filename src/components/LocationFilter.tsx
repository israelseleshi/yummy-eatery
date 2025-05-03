import React from 'react';
import { MapPin } from 'lucide-react';

interface LocationFilterProps {
  locations: string[];
  selectedLocation: string | null;
  onLocationChange: (location: string | null) => void;
}

const LocationFilter: React.FC<LocationFilterProps> = ({ 
  locations, 
  selectedLocation, 
  onLocationChange 
}) => {
  return (
    <div className="bg-white p-4 rounded-lg shadow-md">
      <h3 className="font-display font-semibold text-lg mb-3 text-neutral-900">Locations</h3>
      
      <div className="space-y-2">
        <div 
          className={`flex items-center px-3 py-2 rounded-md cursor-pointer transition-colors ${
            selectedLocation === null ? 'bg-primary-50 text-primary-600' : 'hover:bg-gray-50'
          }`}
          onClick={() => onLocationChange(null)}
        >
          <MapPin className={`h-4 w-4 mr-2 ${selectedLocation === null ? 'text-primary-500' : 'text-gray-400'}`} />
          <span className={selectedLocation === null ? 'font-medium' : ''}>All Locations</span>
        </div>
        
        {locations.map(location => (
          <div 
            key={location}
            className={`flex items-center px-3 py-2 rounded-md cursor-pointer transition-colors ${
              selectedLocation === location ? 'bg-primary-50 text-primary-600' : 'hover:bg-gray-50'
            }`}
            onClick={() => onLocationChange(location)}
          >
            <MapPin className={`h-4 w-4 mr-2 ${selectedLocation === location ? 'text-primary-500' : 'text-gray-400'}`} />
            <span className={selectedLocation === location ? 'font-medium' : ''}>{location}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LocationFilter;