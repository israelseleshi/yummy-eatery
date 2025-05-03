import { doc, setDoc, Timestamp } from 'firebase/firestore';
import { db } from './firebase';

export interface PaymentIntent {
  id: string;
  clientSecret: string;
  amount: number;
  status: string;
  restaurantId: string;
  userId: string;
  createdAt: Date;
}

export const createCheckoutSession = async (amount: number, restaurantId: string, userId: string) => {
  try {
    const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/create-checkout-session`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
      },
      body: JSON.stringify({
        amount,
        restaurantId,
        userId,
        successUrl: `${window.location.origin}/owner/dashboard?success=true`,
        cancelUrl: `${window.location.origin}/owner/dashboard?canceled=true`,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to create checkout session');
    }

    const session = await response.json();
    return session;
  } catch (error) {
    console.error('Error creating checkout session:', error);
    throw error;
  }
};

export const getPaymentStatus = async (sessionId: string): Promise<string> => {
  try {
    const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/payment-status?session_id=${sessionId}`, {
      headers: {
        'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
      },
    });

    if (!response.ok) {
      throw new Error('Failed to get payment status');
    }

    const data = await response.json();
    return data.status;
  } catch (error) {
    console.error('Error getting payment status:', error);
    throw error;
  }
};

export const updatePaymentStatus = async (requestId: string, sessionId: string, status: string) => {
  try {
    const requestRef = doc(db, 'restaurant_requests', requestId);
    await setDoc(requestRef, {
      paymentStatus: status === 'complete' ? 'paid' : 'failed',
      paymentSessionId: sessionId,
      updatedAt: Timestamp.now()
    }, { merge: true });
  } catch (error) {
    console.error('Error updating payment status:', error);
    throw error;
  }
};