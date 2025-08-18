import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { CheckCircle, Clock, ArrowLeft, XCircle, Home, Phone, ChefHat, Truck, DollarSign, ShoppingBag, Info } from 'lucide-react';
import { verifyPaymentSession } from '../services/api';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import logo from '../assets/images/cinnamonLeafLogo.png';

interface OrderDetails {
  success: boolean;
  paymentStatus: string;
  customerDetails?: {
    name: string;
    email: string;
    phone?: string;
  };
  metadata?: {
    customerName: string;
    customerPhone: string;
    deliveryAddress: string;
    totalAmount: string;
    orderItems: string;
  };
}

const OrderSuccess: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [isVerifying, setIsVerifying] = useState(true);
  const [orderDetails, setOrderDetails] = useState<OrderDetails | null>(null);
  const [orderNumber] = useState(Math.random().toString(36).substr(2, 8).toUpperCase());
  const [verificationError, setVerificationError] = useState<string | null>(null);

  useEffect(() => {
    // Clear any existing toasts when component mounts
    toast.dismiss();

    const sessionId = searchParams.get('session_id');
    const canceled = searchParams.get('canceled');

    // Check if payment was canceled
    if (canceled === 'true') {
      toast.info('Payment was canceled. Your cart items are still saved.');
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
          // The user can see the checkmark and "Payment Successful!" message
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

  // Parse order items if available
  let parsedOrderItems = [];
  if (orderDetails?.metadata?.orderItems) {
    try {
      parsedOrderItems = JSON.parse(orderDetails.metadata.orderItems);
    } catch (error) {
      console.error('Failed to parse order items:', error);
    }
  }

  return (
    <div className="min-h-screen bg-cream-50">
      {/* Toast Container */}
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
        limit={1} // Limit to 1 toast at a time
      />

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
              <div className="bg-cream-50 rounded-xl p-6 mb-0">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="text-left">
                    <span className="font-medium text-warm-brown-700">Order Number:</span>
                    <p className="font-body text-sage-green-600 font-semibold">#{orderNumber}</p>
                  </div>
                  
                  <div className="text-right">
                    <span className="font-medium text-warm-brown-700">Status:</span>
                    <p className="font-body text-green-600 font-semibold flex items-center justify-end gap-1">
                      <CheckCircle size={14} /> Confirmed
                    </p>
                  </div>
                  
                  {(orderDetails.customerDetails?.name || orderDetails.metadata?.customerName) && (
                    <div className="text-left">
                      <span className="font-medium text-warm-brown-700">Customer:</span>
                      <p className="font-body text-warm-brown-600">
                        {orderDetails.customerDetails?.name || orderDetails.metadata?.customerName}
                      </p>
                    </div>
                  )}
                  
                  {(orderDetails.customerDetails?.email) && (
                    <div className="text-right">
                      <span className="font-medium text-warm-brown-700">Email:</span>
                      <p className="font-body text-warm-brown-600">{orderDetails.customerDetails.email}</p>
                    </div>
                  )}


                </div>
              </div>

              {/* Order Items */}
              {parsedOrderItems.length > 0 && (
                <div className="bg-cream-50 rounded-xl p-6 mb-5">
                  <h3 className="font-body font-semibold text-warm-brown-700 text-m mb-5 flex items-center justify-center gap-2">
                    <ShoppingBag size={18} />
                    Order Items
                  </h3>
                  <div className="space-y-2 mb-4">
                    {parsedOrderItems.map((item: any, index: number) => (
                      <div key={index} className="flex justify-between items-center text-sm">
                        <span className="text-warm-brown-600">
                          {item.quantity}x {item.name}
                        </span>
                        <span className="font-medium text-warm-brown-700">
                          LKR {(item.price * item.quantity).toLocaleString()}
                        </span>
                      </div>
                    ))}
                  </div>
                  
                  {/* Total Amount */}
                  <div className="border-t border-cream-200 pt-3">
                    <div className="flex justify-between items-center">
                      <span className="font-body font-semibold text-warm-brown-700 text-base">
                        Total Amount
                      </span>
                      <span className="font-body font-bold text-sage-green-600 text-lg flex items-center gap-1">
                        LKR {orderDetails.metadata?.totalAmount ? parseInt(orderDetails.metadata.totalAmount).toLocaleString() : '0'}
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {/* Next Steps - Updated with theme colors */}
              <div className="bg-sage-green-50 rounded-xl p-6 mb-8">
                <h3 className="font-body font-semibold text-sage-green-900 mb-4 flex items-center justify-center gap-2">
                  <Info size={18} />
                  What's Next?
                </h3>
                <ul className="text-left text-sage-green-800 space-y-3 text-sm">
                  <li className="flex items-start gap-2">
                    <Phone size={16} className="text-sage-green-600 mt-0.5 flex-shrink-0" />
                    We'll call you shortly to confirm your order
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