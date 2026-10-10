import React, { useCallback, useEffect, useState } from 'react';
import { useLocation, useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { ArrowLeft, ArrowRight, Home, XCircle } from 'lucide-react';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import OrderConfirmation from '../components/OrderConfirmation';
import loginBackground from '../assets/images/loginBg.png';
import { useScrollToTop } from '../hooks/useScrollToTop';
import { verifyPaymentSession } from '../services/api';
import { getOrderByNumber } from '../services/order';
import type { ConfirmedOrder } from '../types/cart';
import { clearStoredCart } from '../utils/cartStorage';
import { apiErrorStatus } from '../utils/errors';
import { orderFromApi, orderFromVerifiedSession, isActiveOrder } from '../utils/orderConfirmation';
import { addOrderToCart } from '../utils/reorder';

// How often the status of an order that is still on its way is checked again
const REFRESH_INTERVAL_MS = 30 * 1000;

interface LoadError {
  title: string;
  message: string;
}

interface OrderSuccessProps {
  // confirmation = right after checkout (/order-success), details = opened from the order history (/orders/:orderNumber)
  mode?: 'confirmation' | 'details';
}

// The order page. Card orders arrive from Stripe with a session id that is checked before the order is shown.
// Everything else is loaded by order number for the signed-in customer.
const OrderSuccess: React.FC<OrderSuccessProps> = ({ mode = 'confirmation' }) => {
  const [searchParams] = useSearchParams();
  const { orderNumber: routeOrderNumber } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [order, setOrder] = useState<ConfirmedOrder | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<LoadError | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  useScrollToTop();

  useEffect(() => {
    // Clear any toasts left over from the menu page, including ones still waiting in line
    toast.clearWaitingQueue();
    toast.dismiss();

    const sessionId = searchParams.get('session_id');
    const orderNumber = routeOrderNumber ?? searchParams.get('order');
    let isCurrent = true;

    const load = async () => {
      try {
        if (sessionId) {
          const result = await verifyPaymentSession(sessionId);
          if (!(result.success && result.paymentStatus === 'paid')) {
            throw new Error(`We couldn't confirm your payment (${result.paymentStatus || 'unknown status'}). If you were charged, please contact us.`);
          }
          // The order is paid for, so the saved cart has done its job
          clearStoredCart();
          if (isCurrent) {
            setOrder(orderFromVerifiedSession(result));
            setLastUpdated(new Date());
          }
        } else if (orderNumber) {
          if (!localStorage.getItem('token')) {
            navigate('/login', { replace: true, state: { from: location.pathname + location.search } });
            return;
          }
          const data = await getOrderByNumber(orderNumber);
          if (isCurrent) {
            setOrder(orderFromApi(data.order));
            setLastUpdated(new Date());
          }
        } else if (isCurrent) {
          setLoadError({ title: 'Order not found', message: "We couldn't find an order to show. Check your link or open your orders." });
        }
      } catch (error) {
        console.error('Could not load the order:', error);
        if (!isCurrent) return;
        if (sessionId) {
          setLoadError({
            title: 'Payment verification failed',
            message: error instanceof Error ? error.message : "We couldn't verify your payment. Please contact us if you were charged.",
          });
        } else {
          setLoadError({
            title: 'Order not found',
            message: apiErrorStatus(error) === 404
              ? "We couldn't find this order on your account."
              : "We couldn't load your order. Please try again in a moment.",
          });
        }
      } finally {
        if (isCurrent) setIsLoading(false);
      }
    };

    load();
    return () => { isCurrent = false; };
  }, [searchParams, routeOrderNumber, navigate, location.pathname, location.search]);

  const orderNumber = order?.orderNumber;
  const isOnItsWay = order ? isActiveOrder(order.orderStatus) : false;

  // Loads the order again, so a status the kitchen has changed shows up. If it fails, the last known state stays on screen.
  const refresh = useCallback(async (isManual = false) => {
    if (!orderNumber || !localStorage.getItem('token')) return;
    if (isManual) setIsRefreshing(true);
    try {
      const data = await getOrderByNumber(orderNumber);
      setOrder(orderFromApi(data.order));
      setLastUpdated(new Date());
    } catch {
      // Keep showing what we have
    } finally {
      if (isManual) setIsRefreshing(false);
    }
  }, [orderNumber]);

  // While the order is still on its way, check it every 30 seconds and when the tab is opened again.
  // Delivered and cancelled orders no longer change, so they are not checked.
  useEffect(() => {
    if (!orderNumber || !isOnItsWay) return;

    const refreshIfVisible = () => {
      if (document.visibilityState === 'visible') refresh();
    };
    const timer = setInterval(refreshIfVisible, REFRESH_INTERVAL_MS);
    document.addEventListener('visibilitychange', refreshIfVisible);
    return () => {
      clearInterval(timer);
      document.removeEventListener('visibilitychange', refreshIfVisible);
    };
  }, [orderNumber, isOnItsWay, refresh]);

  const backTarget = (() => {
    const from = (location.state as { from?: string } | null)?.from;
    return typeof from === 'string' && from.startsWith('/') && !from.startsWith('//') ? from : '/orderHistory';
  })();

  const handleReorder = () => {
    if (!order) return;
    if (addOrderToCart(order.items) === 0) {
      toast.info('These items are no longer available to reorder.');
      return;
    }
    toast.success('Items from this order were added to your cart.');
    navigate('/menu', { state: { resumeCheckout: true } });
  };

  return (
    <div
      className="flex min-h-screen flex-col bg-cover bg-left-top bg-no-repeat px-4 py-8 sm:py-12"
      style={{ backgroundImage: `url(${loginBackground})` }}
    >
      {/* my-auto centres a short card (loading, error) in the page, while a long order stays top aligned */}
      <div className="mx-auto my-auto w-full max-w-3xl">
        {isLoading && (
          <div className="rounded-3xl bg-white p-10 text-center shadow-2xl sm:p-14">
            <div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-b-2 border-sage-green-600" />
            <p className="font-body text-warm-brown-600">Loading your order...</p>
          </div>
        )}

        {!isLoading && loadError && (
          <div className="rounded-3xl bg-white p-8 text-center shadow-2xl sm:p-12">
            <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-red-100">
              <XCircle className="h-8 w-8 text-red-600" />
            </div>
            <h1 className="mb-3 font-display text-3xl font-bold text-warm-brown-800">{loadError.title}</h1>
            <p className="mb-8 font-body text-warm-brown-600">{loadError.message}</p>
            <div className="flex flex-col justify-center gap-3 sm:flex-row">
              {mode === 'details' ? (
                <button
                  type="button"
                  onClick={() => navigate(backTarget)}
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-warm-brown-100 px-5 py-2.5 font-body text-sm font-medium text-warm-brown-800 transition-colors hover:bg-warm-brown-200"
                >
                  <ArrowLeft className="h-4 w-4" />
                  Back to order history
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => navigate('/')}
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-warm-brown-100 px-5 py-2.5 font-body text-sm font-medium text-warm-brown-800 transition-colors hover:bg-warm-brown-200"
                >
                  <Home className="h-4 w-4" />
                  Go to homepage
                </button>
              )}
              <button
                type="button"
                onClick={() => navigate('/menu')}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-sage-green-600 px-5 py-2.5 font-body text-sm font-medium text-white transition-colors hover:bg-sage-green-700"
              >
                View menu
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}

        {!isLoading && order && (
          <OrderConfirmation
            order={order}
            mode={mode}
            lastUpdated={lastUpdated}
            isRefreshing={isRefreshing}
            onRefresh={() => refresh(true)}
            onGoHome={() => navigate('/')}
            onOrderMore={() => navigate('/menu')}
            onViewOrders={() => navigate('/orderHistory')}
            onBackToHistory={() => navigate(backTarget)}
            onReorder={handleReorder}
          />
        )}
      </div>
    </div>
  );
};

export default OrderSuccess;
