import React from 'react';
import { CheckCircle, X, Package, Clock, MapPin } from 'lucide-react';

interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  orderNumber: string;
  estimatedDelivery: string;
}

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  isOpen,
  onClose,
  orderNumber,
  estimatedDelivery
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen p-4">
        <div className="absolute inset-0 bg-black bg-opacity-50" onClick={onClose} />
        
        <div className="relative bg-white rounded-2xl shadow-xl max-w-md w-full">
          <div className="p-8 text-center">
            {/* Success Icon */}
            <div className="mx-auto mb-6 w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
              <CheckCircle size={32} className="text-green-600" />
            </div>

            {/* Header */}
            <h2 className="font-display text-2xl font-bold text-warm-brown-700 mb-2">
              Order Confirmed!
            </h2>
            <p className="font-body text-warm-brown-600 mb-6">
              Thank you for your order. We'll prepare it with care!
            </p>

            {/* Order Details */}
            <div className="bg-cream-50 rounded-lg p-4 mb-6 text-left">
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <Package size={18} className="text-sage-green-600" />
                  <div>
                    <div className="font-body text-sm text-warm-brown-500">Order Number</div>
                    <div className="font-body font-semibold text-warm-brown-700">#{orderNumber}</div>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <Clock size={18} className="text-sage-green-600" />
                  <div>
                    <div className="font-body text-sm text-warm-brown-500">Estimated Delivery</div>
                    <div className="font-body font-semibold text-warm-brown-700">{estimatedDelivery}</div>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <MapPin size={18} className="text-sage-green-600" />
                  <div>
                    <div className="font-body text-sm text-warm-brown-500">Payment Method</div>
                    <div className="font-body font-semibold text-warm-brown-700">Cash on Delivery</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Additional Info */}
            <p className="font-body text-sm text-warm-brown-500 mb-6">
              We'll call you shortly to confirm your order details and delivery time.
            </p>

            {/* Close Button */}
            <button
              onClick={onClose}
              className="w-full bg-sage-green-600 hover:bg-sage-green-700 text-white font-body font-semibold py-3 px-6 rounded-lg transition-colors duration-200"
            >
              Continue Shopping
            </button>
          </div>

          {/* Close X Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 hover:bg-cream-100 rounded-full transition-colors"
          >
            <X size={20} className="text-warm-brown-600" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;