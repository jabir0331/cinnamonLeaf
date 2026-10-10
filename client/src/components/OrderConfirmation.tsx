import React, { useState } from 'react';
import {
  ArrowLeft, ArrowRight, Banknote, Bell, Calendar, Check, CheckCircle, ChefHat, Clock, Copy, CreditCard, Home, Info,
  Mail, MapPin, PackageCheck, Phone, Receipt, RefreshCw, RotateCcw, ShieldCheck, ShoppingBag, StickyNote, Truck, User,
  Wallet, XCircle
} from 'lucide-react';
import SelectedLocationCard from './SelectedLocationCard';
import type { ConfirmedOrder, OrderStatus, PaymentStatus } from '../types/cart';
import { distanceFromRestaurantKm } from '../utils/deliveryZone';
import { getImageUrl } from '../utils/imageUrl';
import { ORDER_STATUS_LABELS, isActiveOrder, splitAddress } from '../utils/orderConfirmation';

interface OrderConfirmationProps {
  order: ConfirmedOrder;
  // confirmation = shown right after the order was placed; details = opened later from the order history
  mode: 'confirmation' | 'details';
  // When the status was last loaded, and a way to load it again
  lastUpdated?: Date | null;
  isRefreshing?: boolean;
  onRefresh?: () => void;
  onGoHome: () => void;
  onOrderMore: () => void;
  onViewOrders: () => void;
  onBackToHistory: () => void;
  onReorder: () => void;
}

type Tone = 'sage' | 'cream' | 'red';

const CHIP_STYLES: Record<Tone, string> = {
  sage: 'border-sage-green-200 bg-sage-green-100 text-sage-green-800',
  cream: 'border-cream-300 bg-cream-100 text-cream-800',
  red: 'border-red-200 bg-red-50 text-red-700',
};

const Chip: React.FC<{ tone: Tone; children: React.ReactNode }> = ({ tone, children }) => (
  <span className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-0.5 font-body text-xs font-medium ${CHIP_STYLES[tone]}`}>
    {children}
  </span>
);

const Cell: React.FC<{ icon: React.ReactNode; label: string; children: React.ReactNode }> = ({ icon, label, children }) => (
  <div className="min-w-0 px-4 py-3.5">
    <p className="mb-1 flex items-center gap-1.5 font-body text-[11px] text-warm-brown-500">
      {icon}
      {label}
    </p>
    {children}
  </div>
);

const Section: React.FC<{ icon: React.ReactNode; title: string; children: React.ReactNode }> = ({ icon, title, children }) => (
  <section className="mt-4 rounded-2xl border border-warm-brown-100 bg-white p-4 sm:p-5">
    <h2 className="mb-3 flex items-center gap-2 font-body text-sm font-semibold text-warm-brown-800">
      {icon}
      {title}
    </h2>
    {children}
  </section>
);

// The dish photo with its quantity on a small badge; a plain tile stands in when there is no photo
const ItemThumb: React.FC<{ image?: string; name: string; quantity: number }> = ({ image, name, quantity }) => {
  const [failed, setFailed] = useState(false);
  const src = getImageUrl(image);

  return (
    <div className="relative h-11 w-11 flex-shrink-0">
      {src && !failed ? (
        <img src={src} alt={name} onError={() => setFailed(true)} className="h-11 w-11 rounded-xl object-cover" />
      ) : (
        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-cream-100">
          <ShoppingBag className="h-5 w-5 text-warm-brown-500" />
        </div>
      )}
      <span className="absolute -right-1.5 -top-1.5 rounded-full bg-sage-green-600 px-1.5 py-px font-body text-[10px] font-semibold leading-tight text-white">
        {quantity}x
      </span>
    </div>
  );
};

const PAYMENT_STATUS: Record<PaymentStatus, { label: string; tone: Tone; icon: React.ReactNode }> = {
  paid: { label: 'Paid', tone: 'sage', icon: <Check className="h-3 w-3" /> },
  pending: { label: 'Pending', tone: 'cream', icon: <Clock className="h-3 w-3" /> },
  failed: { label: 'Failed', tone: 'red', icon: <XCircle className="h-3 w-3" /> },
};

const STATUS_ICONS: Record<OrderStatus, React.ReactNode> = {
  pending: <Clock className="h-7 w-7 text-sage-green-600" />,
  confirmed: <CheckCircle className="h-7 w-7 text-sage-green-600" />,
  preparing: <ChefHat className="h-7 w-7 text-sage-green-600" />,
  out_for_delivery: <Truck className="h-7 w-7 text-sage-green-600" />,
  delivered: <PackageCheck className="h-7 w-7 text-sage-green-600" />,
  cancelled: <XCircle className="h-7 w-7 text-red-600" />,
};

const DETAILS_SUBTITLES: Record<OrderStatus, string> = {
  pending: "We've received your order and will start on it shortly.",
  confirmed: 'Your order is confirmed.',
  preparing: 'Our kitchen is preparing your order.',
  out_for_delivery: 'Your order is on its way to you.',
  delivered: 'This order has been delivered.',
  cancelled: 'This order was cancelled and will not be prepared.',
};

const getHeading = (order: ConfirmedOrder, mode: OrderConfirmationProps['mode']) => {
  if (order.orderStatus === 'cancelled') {
    return { title: 'Order cancelled', subtitle: DETAILS_SUBTITLES.cancelled, icon: STATUS_ICONS.cancelled, box: 'border-red-200' };
  }
  if (order.paymentMethod === 'card' && order.paymentStatus !== 'paid') {
    return { title: 'Payment pending', subtitle: "We haven't received your payment for this order yet.", icon: <Clock className="h-7 w-7 text-cream-800" />, box: 'border-cream-300' };
  }
  if (mode === 'details') {
    return { title: 'Order details', subtitle: DETAILS_SUBTITLES[order.orderStatus], icon: STATUS_ICONS[order.orderStatus], box: 'border-sage-green-300' };
  }
  if (order.paymentMethod === 'card') {
    return { title: 'Payment successful', subtitle: 'Thank you for your order. Your payment has been received.', icon: STATUS_ICONS.confirmed, box: 'border-sage-green-300' };
  }
  return { title: 'Order confirmed', subtitle: 'Thank you for your order. It has gone to our kitchen.', icon: STATUS_ICONS.confirmed, box: 'border-sage-green-300' };
};

// One layout for every order, whatever its payment method or status. It is shown right after checkout
// (confirmation) and again from the order history (details). Only the payment-related parts, the wording
// that depends on the status, and the buttons differ.
const OrderConfirmation: React.FC<OrderConfirmationProps> = ({
  order, mode, lastUpdated, isRefreshing, onRefresh, onGoHome, onOrderMore, onViewOrders, onBackToHistory, onReorder
}) => {
  const [copied, setCopied] = useState(false);

  const isCash = order.paymentMethod === 'cod';
  const isActive = isActiveOrder(order.orderStatus);
  const heading = getHeading(order, mode);
  const payment = PAYMENT_STATUS[order.paymentStatus];
  const info = order.deliveryInfo;
  const placedAt = new Date(order.createdAt);
  const place = splitAddress(info.address);

  const copyReference = async () => {
    try {
      await navigator.clipboard.writeText(order.orderNumber);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard access can be blocked; the number is still on screen to copy by hand
    }
  };

  // What happens next follows the real status: the first-time cash call only while the order is still new,
  // and the kitchen step turns into "on its way" once the rider has it
  const steps = [
    ...(isCash && order.isNewCustomer && order.orderStatus === 'pending'
      ? [{ key: 'call', icon: <Phone className="h-[17px] w-[17px]" />, text: "We'll call you shortly to confirm your order details", action: false }]
      : []),
    order.orderStatus === 'out_for_delivery'
      ? { key: 'delivery', icon: <Truck className="h-[17px] w-[17px]" />, text: 'Your order is on its way to you', action: false }
      : { key: 'kitchen', icon: <ChefHat className="h-[17px] w-[17px]" />, text: 'Your order is being prepared by our kitchen team', action: false },
    { key: 'updates', icon: <Bell className="h-[17px] w-[17px]" />, text: "You'll receive updates about your delivery status", action: mode === 'confirmation' },
  ];

  return (
    <div className="overflow-hidden rounded-3xl bg-white shadow-2xl">
      <header className="flex items-center justify-between gap-4 border-b border-warm-brown-100 bg-gradient-to-r from-warm-brown-50 via-cream-50 to-sage-green-50 px-5 py-5 sm:px-7 sm:py-6">
        <div>
          <h1 className="font-display text-2xl font-bold text-warm-brown-800 sm:text-3xl">{heading.title}</h1>
          <p className="mt-1 font-body text-sm text-sage-green-600">{heading.subtitle}</p>
        </div>
        <div className={`flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-2xl border bg-white ${heading.box}`}>
          {heading.icon}
        </div>
      </header>

      <div className="px-4 pb-6 sm:px-6">
        <div className="mt-4 overflow-hidden rounded-2xl border border-warm-brown-200 bg-gradient-to-br from-cream-50 to-warm-brown-50">
          <div className="grid grid-cols-1 divide-y divide-warm-brown-100 sm:grid-cols-3 sm:divide-x sm:divide-y-0">
            <Cell icon={<Calendar className="h-3.5 w-3.5" />} label="Placed on">
              <p className="font-body text-sm font-medium text-warm-brown-800">
                {placedAt.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
              </p>
              <p className="font-body text-[11px] text-warm-brown-500">
                {placedAt.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}
              </p>
            </Cell>
            <Cell icon={<Receipt className="h-3.5 w-3.5" />} label="Reference number">
              <button
                type="button"
                onClick={copyReference}
                aria-label="Copy reference number"
                title="Copy reference number"
                className="inline-flex max-w-full items-center gap-1.5 font-body text-sm font-medium text-warm-brown-800 transition-colors hover:text-sage-green-700"
              >
                <span className="truncate">{order.orderNumber}</span>
                {copied ? <Check className="h-3.5 w-3.5 flex-shrink-0 text-sage-green-600" /> : <Copy className="h-3.5 w-3.5 flex-shrink-0 text-sage-green-500" />}
              </button>
              <span className="sr-only" aria-live="polite">{copied ? 'Reference number copied' : ''}</span>
            </Cell>
            <Cell icon={<PackageCheck className="h-3.5 w-3.5" />} label="Order status">
              <Chip tone={order.orderStatus === 'cancelled' ? 'red' : 'sage'}>{ORDER_STATUS_LABELS[order.orderStatus]}</Chip>
            </Cell>
          </div>
          <div className="grid grid-cols-1 divide-y divide-warm-brown-100 border-t border-warm-brown-100 sm:grid-cols-3 sm:divide-x sm:divide-y-0">
            <Cell icon={<Wallet className="h-3.5 w-3.5" />} label="Payment method">
              <p className="flex items-center gap-1.5 font-body text-sm font-medium text-warm-brown-800">
                {isCash ? <Banknote className="h-[17px] w-[17px] text-warm-brown-600" /> : <CreditCard className="h-[17px] w-[17px] text-warm-brown-600" />}
                {isCash ? 'Cash on delivery' : 'Card'}
              </p>
            </Cell>
            <Cell icon={<ShieldCheck className="h-3.5 w-3.5" />} label="Payment status">
              <Chip tone={payment.tone}>
                {payment.icon}
                {payment.label}
              </Chip>
            </Cell>
            <Cell icon={<Truck className="h-3.5 w-3.5" />} label="Estimated delivery">
              <p className="font-body text-sm font-medium text-warm-brown-800">30 - 45 minutes</p>
            </Cell>
          </div>
        </div>

        <Section icon={<User className="h-4 w-4 text-sage-green-600" />} title="Contact details">
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_minmax(0,1.5fr)] sm:gap-4">
            <div>
              <p className="mb-0.5 flex items-center gap-1.5 font-body text-[11px] text-warm-brown-500"><User className="h-3.5 w-3.5" />Name</p>
              <p className="break-words font-body text-sm font-medium text-warm-brown-800">{info.name || 'Not provided'}</p>
            </div>
            <div>
              <p className="mb-0.5 flex items-center gap-1.5 font-body text-[11px] text-warm-brown-500"><Phone className="h-3.5 w-3.5" />Phone</p>
              <p className="break-words font-body text-sm font-medium text-warm-brown-800">{info.phone || 'Not provided'}</p>
            </div>
            <div>
              <p className="mb-0.5 flex items-center gap-1.5 font-body text-[11px] text-warm-brown-500"><Mail className="h-3.5 w-3.5" />Email</p>
              <p className="break-words font-body text-sm font-medium text-warm-brown-800">{info.email || 'Not provided'}</p>
            </div>
          </div>
        </Section>

        {(info.address || info.location) && (
          <Section icon={<MapPin className="h-4 w-4 text-sage-green-600" />} title="Delivery location">
            <SelectedLocationCard
              title={place.title}
              subtitle={place.subtitle}
              distanceKm={info.location ? distanceFromRestaurantKm(info.location) : undefined}
              landmarks={info.landmarks ?? []}
            />
            {info.specialNotes && (
              <p className="mt-3 flex items-start gap-2 font-body text-xs text-warm-brown-700">
                <StickyNote className="mt-0.5 h-3.5 w-3.5 flex-shrink-0 text-warm-brown-500" />
                <span className="whitespace-pre-line"><span className="text-warm-brown-500">Notes: </span>{info.specialNotes}</span>
              </p>
            )}
          </Section>
        )}

        <Section icon={<ShoppingBag className="h-4 w-4 text-sage-green-600" />} title="Order items">
          <ul className="space-y-3">
            {order.items.map((item, index) => (
              <li key={`${item.id ?? item.name}-${index}`} className="flex items-center gap-3.5">
                <ItemThumb image={item.image} name={item.name} quantity={item.quantity} />
                <div className="min-w-0 flex-1">
                  <p className="truncate font-body text-sm font-medium text-warm-brown-800">{item.name}</p>
                  {item.category && (
                    <p className="font-body text-[11px] text-warm-brown-500">{item.category.charAt(0).toUpperCase() + item.category.slice(1)}</p>
                  )}
                </div>
                <span className="flex-shrink-0 font-body text-sm font-medium text-warm-brown-800">LKR {(item.price * item.quantity).toLocaleString()}</span>
              </li>
            ))}
          </ul>
          <div className="mt-4 flex items-baseline justify-between border-t border-warm-brown-100 pt-3">
            <span className="font-body text-sm font-semibold text-warm-brown-800">
              {order.paymentStatus === 'paid' ? 'Total paid' : isCash && isActive ? 'Total to pay on delivery' : 'Total'}
            </span>
            <span className="font-body text-xl font-semibold text-sage-green-600">LKR {order.totalAmount.toLocaleString()}</span>
          </div>
          {isCash && isActive && (
            <p className="mt-3 flex items-center gap-2 rounded-xl border border-cream-300 bg-cream-100 px-3 py-2.5 font-body text-xs text-cream-900">
              <Banknote className="h-[18px] w-[18px] flex-shrink-0" />
              Please keep LKR {order.totalAmount.toLocaleString()} ready in cash for the rider.
            </p>
          )}
        </Section>

        {isActive && (
          <section className="mt-4 rounded-2xl border border-sage-green-100 bg-gradient-to-br from-sage-green-50 to-cream-50 p-4 sm:p-5">
            <div className="mb-4 flex items-center justify-between gap-3">
              <h2 className="flex items-center gap-2 font-body text-sm font-semibold text-sage-green-900">
                <Info className="h-4 w-4 text-sage-green-600" />
                What's next
              </h2>
              {onRefresh && lastUpdated && (
                <button
                  type="button"
                  onClick={onRefresh}
                  disabled={isRefreshing}
                  aria-label="Refresh order status"
                  title="Refresh order status"
                  className="inline-flex items-center gap-1.5 font-body text-[11px] text-sage-green-700 transition-colors hover:text-sage-green-900 disabled:opacity-70"
                >
                  <RefreshCw className={`h-3.5 w-3.5 ${isRefreshing ? 'animate-spin' : ''}`} />
                  Updated {lastUpdated.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}
                </button>
              )}
            </div>
            <ol>
              {steps.map((step, index) => {
                const isLast = index === steps.length - 1;
                return (
                  <li key={step.key} className="flex gap-3">
                    <div className="flex flex-col items-center">
                      <span className="flex h-[34px] w-[34px] flex-shrink-0 items-center justify-center rounded-full border border-sage-green-300 bg-white text-sage-green-600">
                        {step.icon}
                      </span>
                      {!isLast && <span className="my-1 min-h-[14px] w-0.5 flex-1 bg-sage-green-200" />}
                    </div>
                    <div className={`flex min-h-[34px] flex-1 flex-wrap items-center justify-between gap-3 ${isLast ? '' : 'pb-3.5'}`}>
                      <p className="font-body text-sm text-sage-green-800">{step.text}</p>
                      {step.action && (
                        <button
                          type="button"
                          onClick={onViewOrders}
                          className="inline-flex items-center gap-1.5 rounded-xl border border-sage-green-300 bg-white px-3.5 py-1.5 font-body text-xs font-medium text-sage-green-700 transition-colors hover:bg-sage-green-50 focus:outline-none focus:ring-2 focus:ring-sage-green-100"
                        >
                          View my orders
                          <ArrowRight className="h-3.5 w-3.5" />
                        </button>
                      )}
                    </div>
                  </li>
                );
              })}
            </ol>
          </section>
        )}

        <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
          {mode === 'details' ? (
            <button
              type="button"
              onClick={onBackToHistory}
              className="inline-flex items-center gap-2 rounded-xl bg-warm-brown-100 px-5 py-2.5 font-body text-sm font-medium text-warm-brown-800 transition-colors hover:bg-warm-brown-200"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to order history
            </button>
          ) : (
            <button
              type="button"
              onClick={onGoHome}
              className="inline-flex items-center gap-2 rounded-xl bg-warm-brown-100 px-5 py-2.5 font-body text-sm font-medium text-warm-brown-800 transition-colors hover:bg-warm-brown-200"
            >
              <Home className="h-4 w-4" />
              Go to homepage
            </button>
          )}
          {mode === 'details' && order.orderStatus === 'delivered' ? (
            <button
              type="button"
              onClick={onReorder}
              className="inline-flex items-center gap-2 rounded-xl bg-sage-green-600 px-5 py-2.5 font-body text-sm font-medium text-white transition-colors hover:bg-sage-green-700"
            >
              <RotateCcw className="h-4 w-4" />
              Order again
            </button>
          ) : (
            <button
              type="button"
              onClick={onOrderMore}
              className="inline-flex items-center gap-2 rounded-xl bg-sage-green-600 px-5 py-2.5 font-body text-sm font-medium text-white transition-colors hover:bg-sage-green-700"
            >
              Order more items
              <ArrowRight className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default OrderConfirmation;
