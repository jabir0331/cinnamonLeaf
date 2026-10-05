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