export interface CartItem {
  id: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
  category: string;
}

export interface DeliveryInfo {
  name: string;
  phone: string;
  email: string;
  address: string;
  specialNotes?: string;
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