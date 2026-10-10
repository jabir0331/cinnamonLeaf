import type { ConfirmedOrder, DeliveryInfo, OrderStatus, PaymentMethod, PaymentStatus } from '../types/cart';

const ORDER_STATUSES: OrderStatus[] = ['pending', 'confirmed', 'preparing', 'out_for_delivery', 'delivered', 'cancelled'];
const PAYMENT_STATUSES: PaymentStatus[] = ['pending', 'paid', 'failed'];

const asOrderStatus = (value: unknown, fallback: OrderStatus): OrderStatus =>
  ORDER_STATUSES.includes(value as OrderStatus) ? (value as OrderStatus) : fallback;

const asPaymentStatus = (value: unknown, fallback: PaymentStatus): PaymentStatus =>
  PAYMENT_STATUSES.includes(value as PaymentStatus) ? (value as PaymentStatus) : fallback;

const asPaymentMethod = (value: unknown, fallback: PaymentMethod): PaymentMethod =>
  value === 'cod' || value === 'card' ? value : fallback;

// The parts of an order that both the orders API and the Stripe verification return
interface OrderLike {
  orderNumber?: string;
  createdAt?: string;
  orderStatus?: string;
  paymentMethod?: string;
  paymentStatus?: string;
  items?: { id?: string; name?: string; quantity?: number; price?: number; category?: string; image?: string }[];
  totalAmount?: number;
  deliveryInfo?: Partial<DeliveryInfo>;
  isNewCustomer?: boolean;
}

const toItems = (items: OrderLike['items']): ConfirmedOrder['items'] =>
  (Array.isArray(items) ? items : []).map(item => ({
    id: item.id,
    name: item.name ?? 'Item',
    quantity: Number(item.quantity) || 1,
    price: Number(item.price) || 0,
    category: item.category,
    image: item.image,
  }));

const toDeliveryInfo = (info: Partial<DeliveryInfo> | undefined): DeliveryInfo => ({
  name: info?.name ?? '',
  phone: info?.phone ?? '',
  email: info?.email ?? '',
  address: info?.address ?? '',
  location: info?.location,
  landmarks: info?.landmarks,
  specialNotes: info?.specialNotes,
});

// An order saved in the database, as returned by GET /orders/:orderNumber
export const orderFromApi = (order: OrderLike): ConfirmedOrder => {
  const orderStatus = asOrderStatus(order.orderStatus, 'pending');
  const paymentMethod = asPaymentMethod(order.paymentMethod, 'cod');
  const savedPaymentStatus = asPaymentStatus(order.paymentStatus, 'pending');

  return {
    orderNumber: order.orderNumber ?? '',
    createdAt: order.createdAt ?? new Date().toISOString(),
    orderStatus,
    paymentMethod,
    // The rider collects the cash on delivery, so a delivered cash order has been paid even if it was
    // delivered before the system recorded that
    paymentStatus: paymentMethod === 'cod' && orderStatus === 'delivered' ? 'paid' : savedPaymentStatus,
    items: toItems(order.items),
    totalAmount: Number(order.totalAmount) || 0,
    deliveryInfo: toDeliveryInfo(order.deliveryInfo),
    isNewCustomer: order.isNewCustomer !== false,
  };
};

// What GET /checkout/verify-session/:id returns for a paid Stripe session
export interface VerifySessionResult {
  orderDetails?: OrderLike;
  customerDetails?: { name?: string; email?: string; phone?: string };
  metadata?: {
    orderNumber?: string;
    customerName?: string;
    customerPhone?: string;
    deliveryAddress?: string;
    totalAmount?: string;
    orderItems?: string;
  };
}

// The saved order is preferred. If the server couldn't update it, fall back to what Stripe kept about the session.
export const orderFromVerifiedSession = (result: VerifySessionResult): ConfirmedOrder => {
  if (result.orderDetails) {
    // This session was verified as paid, so a missing method or status can only mean a paid card order
    return {
      ...orderFromApi({ paymentMethod: 'card', paymentStatus: 'paid', ...result.orderDetails }),
    };
  }

  const meta = result.metadata ?? {};
  let items: OrderLike['items'] = [];
  try {
    items = meta.orderItems ? JSON.parse(meta.orderItems) : [];
  } catch {
    items = [];
  }

  return orderFromApi({
    orderNumber: meta.orderNumber,
    orderStatus: 'confirmed',
    paymentMethod: 'card',
    paymentStatus: 'paid',
    items,
    totalAmount: parseFloat(meta.totalAmount ?? '') || 0,
    deliveryInfo: {
      name: result.customerDetails?.name ?? meta.customerName,
      phone: result.customerDetails?.phone ?? meta.customerPhone,
      email: result.customerDetails?.email,
      address: meta.deliveryAddress,
    },
  });
};

// Turns a saved address such as "Darus Salam Vidyalaya, Mihindu Mawatha, Elpitiya, Galle District, 80400, Sri Lanka"
// into a headline and an area line for the location card
export const splitAddress = (address: string): { title: string; subtitle: string } => {
  const pinned = address.match(/^Pinned location \((.+)\)$/);
  if (pinned) return { title: 'Pinned location', subtitle: pinned[1] };

  const parts = address.split(',').map(part => part.trim()).filter(Boolean);
  if (parts.length === 0) return { title: 'Delivery location', subtitle: '' };

  const withoutCountry = parts.length > 1 && parts[parts.length - 1] === 'Sri Lanka' ? parts.slice(0, -1) : parts;
  return { title: withoutCountry[0], subtitle: withoutCountry.slice(1, 4).join(', ') };
};

export const ORDER_STATUS_LABELS: Record<OrderStatus, string> = {
  pending: 'Received',
  confirmed: 'Confirmed',
  preparing: 'Preparing',
  out_for_delivery: 'Out for delivery',
  delivered: 'Delivered',
  cancelled: 'Cancelled',
};

// The order is still on its way to the customer, so "what's next" applies
export const isActiveOrder = (status: OrderStatus): boolean => status !== 'delivered' && status !== 'cancelled';
