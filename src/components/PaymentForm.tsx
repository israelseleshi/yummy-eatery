import React from 'react';
import { CreditCard } from 'lucide-react';

interface PaymentFormProps {
  onSuccess: () => void;
  onError: (error: string) => void;
}

const PaymentForm: React.FC<PaymentFormProps> = ({
  onSuccess,
  onError
}) => {
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      onSuccess();
    } catch (err: any) {
      onError(err.message);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-lg border border-neutral-200">
        <div className="flex items-center mb-6">
          <CreditCard className="h-6 w-6 text-neutral-500 mr-2" />
          <h3 className="text-lg font-semibold">Payment Information</h3>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <button
            type="submit"
            className="w-full bg-primary-500 text-white px-6 py-3 rounded-lg font-medium hover:bg-primary-600 transition-colors flex items-center justify-center"
          >
            <CreditCard className="h-5 w-5 mr-2" />
            Complete Payment
          </button>
        </form>
      </div>
    </div>
  );
};

export default PaymentForm;