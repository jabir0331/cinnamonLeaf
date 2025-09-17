import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { CheckCircle, Clock, ArrowLeft, XCircle, Home, Phone, ChefHat, Truck, ShoppingBag, Info } from 'lucide-react';
import { verifyPaymentSession } from '../services/api';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

interface OrderItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  category: string;
}

interface OrderDetails {
  success: boolean;
  paymentStatus: string;
  customerDetails?: {
    name: string;
    email: string;
    phone?: string;
  };
  metadata?: {
    orderNumber: string;
    customerName: string;
    customerPhone: string;
    deliveryAddress: string;
    totalAmount: string;
    orderItems: string;
  };
  orderDetails?: {
    orderNumber: string;
    items: OrderItem[];
    deliveryInfo: {
      name: string;
      phone: string;
      email?: string;
      address: string;
    };
    totalAmount: number;
    orderStatus: string;
    createdAt: string;
  };
}

const OrderSuccess: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [isVerifying, setIsVerifying] = useState(true);
  const [orderDetails, setOrderDetails] = useState<OrderDetails | null>(null);
  const [verificationError, setVerificationError] = useState<string | null>(null);

  useEffect(() => {
    // Clear any existing toasts when component mounts
    toast.dismiss();

    const sessionId = searchParams.get('session_id');
    const canceled = searchParams.get('canceled');

    // Check if payment was canceled
    if (canceled === 'true') {
      toast.info('Payment was canceled');
      navigate('/menu');
      return;
    }
    
    if (!sessionId) {
      setVerificationError('Invalid payment session');
      setIsVerifying(false);
      return;
    }

    const verifyPayment = async () => {
      try {
        console.log('Verifying payment for session:', sessionId);
        const result = await verifyPaymentSession(sessionId);
        
        console.log('Verification result:', result);
        
        if (result.success && result.paymentStatus === 'paid') {
          setOrderDetails(result);
          // Don't show success toast here - the visual success state is enough
        } else {
          setVerificationError(`Payment verification failed: ${result.paymentStatus || 'Unknown status'}`);
        }
      } catch (error) {
        console.error('Payment verification error:', error);
        const errorMessage = error instanceof Error ? error.message : 'Failed to verify payment';
        setVerificationError(errorMessage);
        // Only show error toasts
        toast.error(errorMessage);
      } finally {
        setIsVerifying(false);
      }
    };

    verifyPayment();
  }, [searchParams, navigate]);

  // Get order number from either orderDetails or metadata
  const getOrderNumber = (): string => {
    if (orderDetails?.orderDetails?.orderNumber) {
      return orderDetails.orderDetails.orderNumber;
    }
    if (orderDetails?.metadata?.orderNumber) {
      return orderDetails.metadata.orderNumber;
    }
    return 'N/A';
  };

  // Get customer name
  const getCustomerName = (): string => {
    if (orderDetails?.orderDetails?.deliveryInfo?.name) {
      return orderDetails.orderDetails.deliveryInfo.name;
    }
    if (orderDetails?.customerDetails?.name) {
      return orderDetails.customerDetails.name;
    }
    if (orderDetails?.metadata?.customerName) {
      return orderDetails.metadata.customerName;
    }
    return 'N/A';
  };

  // Get customer email
  const getCustomerEmail = (): string => {
    if (orderDetails?.orderDetails?.deliveryInfo?.email) {
      return orderDetails.orderDetails.deliveryInfo.email;
    }
    if (orderDetails?.customerDetails?.email) {
      return orderDetails.customerDetails.email;
    }
    return '';
  };

  // Get customer phone
  const getCustomerPhone = (): string => {
    if (orderDetails?.orderDetails?.deliveryInfo?.phone) {
      return orderDetails.orderDetails.deliveryInfo.phone;
    }
    if (orderDetails?.metadata?.customerPhone) {
      return orderDetails.metadata.customerPhone;
    }
    return '';
  };

  // Get delivery address
  const getDeliveryAddress = (): string => {
    if (orderDetails?.orderDetails?.deliveryInfo?.address) {
      return orderDetails.orderDetails.deliveryInfo.address;
    }
    if (orderDetails?.metadata?.deliveryAddress) {
      return orderDetails.metadata.deliveryAddress;
    }
    return '';
  };

  // Get order items
  const getOrderItems = (): OrderItem[] => {
    // First try to get from orderDetails (database)
    if (orderDetails?.orderDetails?.items && Array.isArray(orderDetails.orderDetails.items)) {
      return orderDetails.orderDetails.items;
    }

    // Fallback to metadata (Stripe session)
    if (orderDetails?.metadata?.orderItems) {
      try {
        const parsedItems = JSON.parse(orderDetails.metadata.orderItems);
        return Array.isArray(parsedItems) ? parsedItems : [];
      } catch (error) {
        console.error('Failed to parse order items from metadata:', error);
        return [];
      }
    }

    return [];
  };

  // Get total amount
  const getTotalAmount = (): number => {
    if (orderDetails?.orderDetails?.totalAmount) {
      return orderDetails.orderDetails.totalAmount;
    }
    if (orderDetails?.metadata?.totalAmount) {
      return parseFloat(orderDetails.metadata.totalAmount);
    }
    return 0;
  };

  // Format order creation date
  const getOrderDate = (): string => {
    if (orderDetails?.orderDetails?.createdAt) {
      return new Date(orderDetails.orderDetails.createdAt).toLocaleString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    }
    return new Date().toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const orderItems = getOrderItems();
  const totalAmount = getTotalAmount();
  const customerName = getCustomerName();
  const customerEmail = getCustomerEmail();
  const customerPhone = getCustomerPhone();
  const deliveryAddress = getDeliveryAddress();
  const orderNumber = getOrderNumber();

  return (
    <div className="min-h-screen bg-cream-50">

      {/* Main Content */}
      <div className="py-16">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Loading State */}
          {isVerifying && (
            <div className="bg-white rounded-2xl shadow-lg p-8 md:p-12 text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-sage-green-600 mx-auto mb-4"></div>
              <p className="text-warm-brown-600 font-body">Verifying your payment...</p>
            </div>
          )}

          {/* Error State */}
          {!isVerifying && (verificationError || !orderDetails) && (
            <div className="bg-white rounded-2xl shadow-lg p-8 md:p-12 text-center">
              {/* Error Icon */}
              <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-red-100 mb-6">
                <XCircle className="h-8 w-8 text-red-600" />
              </div>

              {/* Error Message */}
              <h1 className="font-display text-3xl font-bold text-warm-brown-700 mb-4">
                Payment Verification Failed
              </h1>
              
              <p className="font-body text-lg text-warm-brown-600 mb-8">
                {verificationError || 'We couldn\'t verify your payment. Please contact support if you were charged.'}
              </p>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button
                  onClick={() => navigate('/menu')}
                  className="flex items-center justify-center gap-2 bg-sage-green-600 hover:bg-sage-green-700 text-white font-body font-medium py-3 px-6 rounded-lg transition-colors duration-200"
                >
                  <ArrowLeft size={16} />
                  Back to Menu
                </button>
                
                <button
                  onClick={() => navigate('/')}
                  className="flex items-center justify-center gap-2 bg-warm-brown-100 hover:bg-warm-brown-200 text-warm-brown-700 font-body font-medium py-3 px-6 rounded-lg transition-colors duration-200"
                >
                  <Home size={16} />
                  Go to Homepage
                </button>
              </div>
            </div>
          )}

          {/* Success State */}
          {!isVerifying && orderDetails && (
            <div className="bg-white rounded-2xl shadow-lg p-8 md:p-12 text-center">
              {/* Success Icon with subtle animation */}
              <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 mb-6 animate-pulse">
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>

              {/* Success Message */}
              <div className="mb-8">
                <h1 className="font-display text-3xl font-bold text-warm-brown-700 mb-2">
                  Payment Successful!
                </h1>
                <p className="font-body text-m text-warm-brown-600">
                  Thank you for your order. Your payment has been processed successfully.
                </p>
              </div>

              {/* Order Details */}
              <div className="bg-cream-50 rounded-xl p-6 mb-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div className="text-left">
                    <span className="font-medium text-warm-brown-700">Order Number:</span>
                    <p className="font-body text-sage-green-600 font-semibold">{orderNumber}</p>
                  </div>
                  
                  <div className="text-left md:text-right">
                    <span className="font-medium text-warm-brown-700">Status:</span>
                    <p className="font-body text-green-600 font-semibold flex items-center gap-1 md:justify-end">
                      <CheckCircle size={14} /> Confirmed
                    </p>
                  </div>
                  
                  {customerName && customerName !== 'N/A' && (
                    <div className="text-left">
                      <span className="font-medium text-warm-brown-700">Customer:</span>
                      <p className="font-body text-warm-brown-600">{customerName}</p>
                    </div>
                  )}
                  
                  {customerEmail && (
                    <div className="text-left md:text-right">
                      <span className="font-medium text-warm-brown-700">Email:</span>
                      <p className="font-body text-warm-brown-600">{customerEmail}</p>
                    </div>
                  )}

                  {customerPhone && (
                    <div className="text-left">
                      <span className="font-medium text-warm-brown-700">Phone:</span>
                      <p className="font-body text-warm-brown-600">{customerPhone}</p>
                    </div>
                  )}

                  <div className="text-left md:text-right">
                    <span className="font-medium text-warm-brown-700">Order Date:</span>
                    <p className="font-body text-warm-brown-600">{getOrderDate()}</p>
                  </div>

                  {deliveryAddress && (
                    <div className="text-left md:col-span-2">
                      <span className="font-medium text-warm-brown-700">Delivery Address:</span>
                      <p className="font-body text-warm-brown-600">{deliveryAddress}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Order Items */}
              {orderItems.length > 0 && (
                <div className="bg-cream-50 rounded-xl p-6 mb-8">
                  <h3 className="font-body font-semibold text-warm-brown-700 text-lg mb-5 flex items-center justify-center gap-2">
                    <ShoppingBag size={18} />
                    Order Items
                  </h3>
                  <div className="space-y-3 mb-4">
                    {orderItems.map((item: OrderItem, index: number) => (
                      <div key={index} className="flex justify-between items-center text-sm border-b border-cream-200 pb-2 last:border-b-0">
                        <div className="text-left">
                          <span className="text-warm-brown-700 font-medium">
                            {item.quantity}x {item.name}
                          </span>
                          {item.category && (
                            <p className="text-xs text-warm-brown-500 mt-1">
                              {item.category.charAt(0).toUpperCase() + item.category.slice(1)}
                            </p>
                          )}
                        </div>
                        <span className="font-medium text-warm-brown-700">
                          LKR {(item.price * item.quantity).toLocaleString()}
                        </span>
                      </div>
                    ))}
                  </div>
                  
                  {/* Total Amount */}
                  <div className="border-t border-cream-200 pt-4">
                    <div className="flex justify-between items-center">
                      <span className="font-body font-semibold text-warm-brown-700 text-base">
                        Total Amount
                      </span>
                      <span className="font-body font-bold text-sage-green-600 text-xl">
                        LKR {totalAmount.toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {/* Next Steps */}
              <div className="bg-sage-green-50 rounded-xl p-6 mb-8">
                <h3 className="font-body font-semibold text-sage-green-900 mb-4 flex items-center justify-center gap-2">
                  <Info size={18} />
                  What's Next?
                </h3>
                <ul className="text-left text-sage-green-800 space-y-3 text-sm">
                  <li className="flex items-start gap-2">
                    <Phone size={16} className="text-sage-green-600 mt-0.5 flex-shrink-0" />
                    We'll call you shortly to confirm your order details
                  </li>
                  <li className="flex items-start gap-2">
                    <ChefHat size={16} className="text-sage-green-600 mt-0.5 flex-shrink-0" />
                    Your order is being prepared by our kitchen team
                  </li>
                  <li className="flex items-start gap-2">
                    <Clock size={16} className="text-sage-green-600 mt-0.5 flex-shrink-0" />
                    You'll receive updates about your delivery status
                  </li>
                </ul>
              </div>

              {/* Delivery Info */}
              <div className="flex items-center justify-center gap-2 text-sage-green-600 mb-8 bg-sage-green-50 rounded-lg p-4">
                <Truck size={20} />
                <span className="font-body font-medium">Estimated Delivery: 30-45 minutes</span>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button
                  onClick={() => navigate('/menu')}
                  className="flex items-center justify-center gap-2 bg-sage-green-600 hover:bg-sage-green-700 text-white font-body font-medium py-3 px-6 rounded-lg transition-colors duration-200"
                >
                  <ArrowLeft size={16} />
                  Order More Items
                </button>
                
                <button
                  onClick={() => navigate('/')}
                  className="flex items-center justify-center gap-2 bg-warm-brown-100 hover:bg-warm-brown-200 text-warm-brown-700 font-body font-medium py-3 px-6 rounded-lg transition-colors duration-200"
                >
                  <Home size={16} />
                  Go to Homepage
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default OrderSuccess;