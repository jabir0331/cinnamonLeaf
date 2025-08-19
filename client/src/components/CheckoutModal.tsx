import React, { useState } from 'react';
import { parsePhoneNumberFromString } from 'libphonenumber-js';   //This is to validate phone numbers
import { X, CreditCard, Banknote, MapPin, Phone, User, MessageSquare, Mail } from 'lucide-react';
import { DeliveryInfo } from '../types/cart';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (deliveryInfo: DeliveryInfo, paymentMethod: 'cod' | 'card') => void;
  totalPrice: number;
}

const CheckoutModal: React.FC<CheckoutModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  totalPrice
}) => {
  const [deliveryInfo, setDeliveryInfo] = useState<DeliveryInfo>({
    name: '',
    phone: '',
    email: '',
    address: '',
    specialNotes: ''
  });
  const [paymentMethod, setPaymentMethod] = useState<'cod' | 'card'>('cod');
  const [errors, setErrors] = useState<Partial<DeliveryInfo>>({});

  const validateForm = () => {
    const newErrors: Partial<DeliveryInfo> = {};

    // Name validation
    if (!deliveryInfo.name.trim()) {
      newErrors.name = 'Name is required';
    }

    // Phone validation
    if (!deliveryInfo.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    } else {
      const phoneNumber = parsePhoneNumberFromString(deliveryInfo.phone.trim(), 'LK');
      if (!phoneNumber || !phoneNumber.isValid()) {
        newErrors.phone = 'Invalid phone number';
      }
    }

    // Email validation
    if (!deliveryInfo.email.trim()) {
      newErrors.email = 'Email address is required';
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(deliveryInfo.email.trim())) {
        newErrors.email = 'Invalid email address';
      }
    }

    // Address validation
    if (!deliveryInfo.address.trim()) {
      newErrors.address = 'Delivery address is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      onConfirm(deliveryInfo, paymentMethod);
    }
  };

  const handleInputChange = (field: keyof DeliveryInfo, value: string) => {
    setDeliveryInfo(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen p-4">
        <div className="absolute inset-0 bg-black bg-opacity-50" onClick={onClose} />

        <div className="relative bg-white rounded-2xl shadow-xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
          <div className="p-6">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-display text-2xl font-bold text-warm-brown-700">
                Checkout
              </h2>
              <button
                onClick={onClose}
                className="p-2 hover:bg-cream-100 rounded-full transition-colors"
              >
                <X size={20} className="text-warm-brown-600" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Delivery Information */}
              <div>
                <h3 className="font-body font-semibold text-warm-brown-700 mb-4 flex items-center gap-2">
                  <MapPin size={18} />
                  Delivery Information
                </h3>

                <div className="space-y-4">
                  <div>
                    <label className="block font-body text-sm font-medium text-warm-brown-600 mb-2 flex">
                      <User size={16} className="inline mr-1" />
                      Full Name <span className="text-red-500 text-sm ml-2">*</span>
                      {errors.name && (
                        <p className="text-red-500 text-sm ml-1">{errors.name}</p>
                      )}
                    </label>
                    <input
                      type="text"
                      value={deliveryInfo.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      className={`w-full px-4 py-3 border rounded-lg font-body focus:ring-2 focus:ring-sage-green-500 focus:border-sage-green-500 transition-colors ${errors.name ? 'border-red-500' : 'border-cream-300'
                        }`}
                      placeholder="Enter your full name"
                    />
                  </div>

                  <div>
                    <label className="block font-body text-sm font-medium text-warm-brown-600 mb-2 flex">
                      <Phone size={16} className="inline mr-1" />
                      Phone Number <span className="text-red-500 text-sm ml-2">*</span>
                      {errors.phone && (
                        <p className="text-red-500 text-sm ml-1">{errors.phone}</p>
                      )}
                    </label>
                    <input
                      type="tel"
                      value={deliveryInfo.phone}
                      onChange={(e) => handleInputChange('phone', e.target.value)}
                      className={`w-full px-4 py-3 border rounded-lg font-body focus:ring-2 focus:ring-sage-green-500 focus:border-sage-green-500 transition-colors ${errors.phone ? 'border-red-500' : 'border-cream-300'
                        }`}
                      placeholder="Enter your phone number"
                    />
                  </div>

                  <div>
                    <label className="block font-body text-sm font-medium text-warm-brown-600 mb-2 flex">
                      <Mail size={16} className="inline mr-1" />
                      Email Address <span className="text-red-500 text-sm ml-2">*</span>
                      {errors.email && (
                        <p className="text-red-500 text-sm ml-1">{errors.email}</p>
                      )}
                    </label>
                    <input
                      type="email"
                      value={deliveryInfo.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      className={`w-full px-4 py-3 border rounded-lg font-body focus:ring-2 focus:ring-sage-green-500 focus:border-sage-green-500 transition-colors ${errors.email ? 'border-red-500' : 'border-cream-300'
                        }`}
                      placeholder="Enter your email address"
                    />
                  </div>

                  <div>
                    <label className="block font-body text-sm font-medium text-warm-brown-600 mb-2 flex">
                      <MapPin size={16} className="inline mr-1" />
                      Delivery Address <span className="text-red-500 text-sm ml-2">*</span>
                      {errors.address && (
                        <p className="text-red-500 text-sm ml-1">{errors.address}</p>
                      )}
                    </label>
                    <textarea
                      value={deliveryInfo.address}
                      onChange={(e) => handleInputChange('address', e.target.value)}
                      rows={3}
                      className={`w-full px-4 py-3 border rounded-lg font-body focus:ring-1 focus:ring-sage-green-100 focus:border-sage-green-200 transition-colors resize-none ${errors.address ? 'border-red-500' : 'border-cream-300'
                        }`}
                      placeholder="Enter your complete delivery address"
                    />
                  </div>

                  <div>
                    <label className="block font-body text-sm font-medium text-warm-brown-600 mb-2">
                      <MessageSquare size={16} className="inline mr-1" />
                      Special Notes (Optional)
                    </label>
                    <textarea
                      value={deliveryInfo.specialNotes}
                      onChange={(e) => handleInputChange('specialNotes', e.target.value)}
                      rows={2}
                      className="w-full px-4 py-3 border border-cream-300 rounded-lg font-body focus:ring-2 focus:ring-sage-green-500 focus:border-sage-green-500 transition-colors resize-none"
                      placeholder="Any special instructions for delivery..."
                    />
                  </div>
                </div>
              </div>

              {/* Payment Method */}
              <div>
                <h3 className="font-body font-semibold text-warm-brown-700 mb-4">
                  Payment Method
                </h3>

                <div className="space-y-3">
                  <label className="flex items-center p-4 border border-cream-300 rounded-lg cursor-pointer hover:bg-cream-50 transition-colors">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="cod"
                      checked={paymentMethod === 'cod'}
                      onChange={(e) => setPaymentMethod(e.target.value as 'cod')}
                      className="mr-3 text-sage-green-600 focus:ring-sage-green-500"
                    />
                    <Banknote size={20} className="text-warm-brown-600 mr-3" />
                    <div>
                      <div className="font-body font-medium text-warm-brown-700">
                        Cash on Delivery
                      </div>
                      <div className="font-body text-sm text-warm-brown-500">
                        Pay when your order arrives
                      </div>
                    </div>
                  </label>

                  <label className="flex items-center p-4 border border-cream-300 rounded-lg cursor-pointer hover:bg-cream-50 transition-colors">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="card"
                      checked={paymentMethod === 'card'}
                      onChange={(e) => setPaymentMethod(e.target.value as 'card')}
                      className="mr-3 text-sage-green-600 focus:ring-sage-green-500"
                    />
                    <CreditCard size={20} className="text-warm-brown-600 mr-3" />
                    <div>
                      <div className="font-body font-medium text-warm-brown-700">
                        Card Payment
                      </div>
                      <div className="font-body text-sm text-warm-brown-500">
                        Pay securely with your card
                      </div>
                    </div>
                  </label>
                </div>
              </div>

              {/* Order Summary */}
              <div className="bg-cream-50 rounded-lg p-4">
                <div className="flex justify-between items-center">
                  <span className="font-body font-semibold text-warm-brown-700">
                    Total Amount:
                  </span>
                  <span className="font-body text-xl font-bold text-sage-green-600">
                    LKR {totalPrice.toLocaleString()}
                  </span>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full bg-sage-green-600 hover:bg-sage-green-700 text-white font-body font-semibold py-3 px-6 rounded-lg transition-colors duration-200"
              >
                {paymentMethod === 'cod' ? 'Confirm Order' : 'Proceed to Payment'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutModal;