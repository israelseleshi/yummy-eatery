import React from 'react';
import { motion } from 'framer-motion';

interface CuisineFilterProps {
  cuisines: string[];
  selectedCuisine: string | null;
  onCuisineChange: (cuisine: string | null) => void;
}

const CuisineFilter: React.FC<CuisineFilterProps> = ({ 
  cuisines, 
  selectedCuisine, 
  onCuisineChange 
}) => {
  return (
    <div className="overflow-x-auto py-4">
      <div className="flex space-x-2 min-w-max">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => onCuisineChange(null)}
          className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
            selectedCuisine === null
              ? 'bg-primary-500 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          All
        </motion.button>
        
        {cuisines.map((cuisine) => (
          <motion.button
            key={cuisine}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onCuisineChange(cuisine)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              selectedCuisine === cuisine
                ? 'bg-primary-500 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {cuisine}
          </motion.button>
        ))}
      </div>
    </div>
  );
};

export default CuisineFilter;