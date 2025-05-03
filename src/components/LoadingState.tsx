import React from 'react';
import { Loader2 } from 'lucide-react';

interface LoadingStateProps {
  message?: string;
}

const LoadingState: React.FC<LoadingStateProps> = ({ message = 'Loading...' }) => {
  return (
    <div className="flex flex-col items-center justify-center p-8">
      <Loader2 className="h-8 w-8 text-primary-500 animate-spin" />
      <p className="mt-4 text-neutral-600">{message}</p>
    </div>
  );
};

export default LoadingState;