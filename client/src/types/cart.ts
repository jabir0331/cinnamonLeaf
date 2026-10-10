export interface CartItem {
  id: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
  category: string;
}

// A named place near the delivery pin, to help riders find the address
export interface Landmark {
  name: string;
  kind: string;
  distance: number; // metres
}

export interface DeliveryInfo {
  name: string;
  phone: string;
  email: string;
  address: string;
  location?: { lat: number; lng: number };
  landmarks?: Landmark[];
  specialNotes?: string;
}

// What the client sends to create an order; the server re-prices the items and ignores any price or total
export interface OrderPayload {
  orderNumber: string;
  items: CartItem[];
  deliveryInfo: DeliveryInfo;
  totalAmount: number;
  paymentMethod: 'cod' | 'card';
  paymentStatus: 'pending' | 'paid' | 'failed';
}

export interface Order {
  id: string;
  items: CartItem[];
  deliveryInfo: DeliveryInfo;
  total: number;
  paymentMethod: 'cod' | 'card';
  status: 'pending' | 'confirmed' | 'delivered';
  createdAt: Date;
}
export type OrderStatus = 'pending' | 'confirmed' | 'preparing' | 'out_for_delivery' | 'delivered' | 'cancelled';
export type PaymentMethod = 'cod' | 'card';
export type PaymentStatus = 'pending' | 'paid' | 'failed';

// An order as the confirmation page shows it, whichever way it was loaded (saved order or Stripe session)
export interface ConfirmedOrder {
  orderNumber: string;
  createdAt: string; // ISO date
  orderStatus: OrderStatus;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  items: { id?: string; name: string; quantity: number; price: number; category?: string; image?: string }[];
  totalAmount: number;
  deliveryInfo: DeliveryInfo;
  // True when the customer had no delivered orders before this one
  isNewCustomer: boolean;
}
