// src/services/api.ts
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export interface CreateCheckoutSessionRequest {
  items: {
    id: string;
    name: string;
    price: number;
    quantity: number;
    image?: string;
    category: string;
  }[];
  deliveryInfo: {
    name: string;
    phone: string;
    email?: string;
    address: string;
  };
  totalAmount: number;
}

export interface CreateCheckoutSessionResponse {
  success: boolean;
  checkoutUrl: string;
  sessionId: string;
}

export interface ApiError {
  error: string;
  message?: string;
}

export const createCheckoutSession = async (
  data: CreateCheckoutSessionRequest
): Promise<CreateCheckoutSessionResponse> => {
  try {
    console.log('Creating checkout session with data:', data);
    console.log('API URL:', `${API_BASE_URL}/checkout/create-session`);

    const response = await fetch(`${API_BASE_URL}/checkout/create-session`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    console.log('Response status:', response.status);

    if (!response.ok) {
      const errorData: ApiError = await response.json();
      console.error('API Error response:', errorData);
      throw new Error(errorData.message || errorData.error || 'Failed to create checkout session');
    }

    const result = await response.json();
    console.log('Checkout session created successfully:', result);
    return result;
  } catch (error) {
    console.error('API Error:', error);
    if (error instanceof TypeError && error.message.includes('fetch')) {
      throw new Error('Unable to connect to server. Please check if the backend is running.');
    }
    throw error;
  }
};

export const verifyPaymentSession = async (sessionId: string) => {
  try {
    console.log('Verifying payment session:', sessionId);
    
    const response = await fetch(`${API_BASE_URL}/checkout/verify-session/${sessionId}`);
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to verify payment');
    }

    const result = await response.json();
    console.log('Payment verification result:', result);
    return result;
  } catch (error) {
    console.error('Payment verification error:', error);
    throw error;
  }
};