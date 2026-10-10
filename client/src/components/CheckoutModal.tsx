import React, { useState, useEffect, Suspense, lazy } from 'react';
import { parsePhoneNumberFromString } from 'libphonenumber-js';   //This is to validate phone numbers
import { X, CreditCard, Banknote, MapPin, Map as MapIcon, LocateFixed, Phone, User, MessageSquare, Mail } from 'lucide-react';
import { DeliveryInfo, Landmark } from '../types/cart';
import type { ResolvedAddress } from '../utils/geocoding';
import SelectedLocationCard from './SelectedLocationCard';
import { getCurrentUser } from '../services/auth';
import { DELIVERY_RADIUS_KM } from '../config/restaurant';
import { COD_MAX_AMOUNT } from '../config/orderRules';
import { distanceFromRestaurantKm, isWithinDeliveryZone, outsideZoneMessage } from '../utils/deliveryZone';

// Leaflet is only loaded when the user opens the map picker
const LocationPicker = lazy(() => import('./LocationPicker'));

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
  const [paymentMethod, setPaymentMethod] = useState<'cod' | 'card'>('card');
  // Larger orders can't be paid in cash, so they have to go through card payment
  const isCodUnavailable = totalPrice > COD_MAX_AMOUNT;

  useEffect(() => {
    if (isCodUnavailable) setPaymentMethod('card');
  }, [isCodUnavailable]);
  const [errors, setErrors] = useState<Partial<DeliveryInfo>>({});
  const [locationError, setLocationError] = useState('');
  // idle = show the location options or the confirmed location; current/map = the map picker is open (current starts from GPS)
  const [addressMode, setAddressMode] = useState<'idle' | 'current' | 'map'>('idle');
  // How the confirmed location is described to the customer (the pin itself lives in deliveryInfo.location)
  const [place, setPlace] = useState<ResolvedAddress | null>(null);

  // Pre-fill name, phone and email from the user's saved profile each time the
  // modal opens, without overwriting anything they have already typed
  useEffect(() => {
    if (!isOpen) {
      setAddressMode('idle');
      return;
    }
    const token = localStorage.getItem('token');
    if (!token) return;

    let cancelled = false;
    getCurrentUser(token)
      .then((user) => {
        if (cancelled) return;
        setDeliveryInfo(prev => ({
          ...prev,
          name: prev.name || user.name || '',
          phone: prev.phone || user.phone || '',
          email: prev.email || user.email || ''
        }));
      })
      .catch((err) => console.error('Could not load profile for checkout pre-fill:', err));

    return () => { cancelled = true; };
  }, [isOpen]);

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

    // Delivery is limited to a radius around the restaurant, so the order needs a map pin inside it
    let nextLocationError = '';
    if (!deliveryInfo.location) {
      nextLocationError = 'Please pin your delivery location on the map so we can confirm you are within our delivery area.';
    } else if (!isWithinDeliveryZone(deliveryInfo.location)) {
      nextLocationError = outsideZoneMessage(deliveryInfo.location);
    }
    setLocationError(nextLocationError);

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0 && !nextLocationError;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      onConfirm(deliveryInfo, isCodUnavailable ? 'card' : paymentMethod);
    }
  };

  const handleInputChange = (field: keyof DeliveryInfo, value: string) => {
    setDeliveryInfo(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  // Confirming a map location saves the pin and its nearby landmarks, and uses its address as the
  // delivery address, then returns to the form
  const handleLocationConfirm = (
    resolvedPlace: ResolvedAddress | null,
    location: { lat: number; lng: number },
    landmarks: Landmark[]
  ) => {
    const coordinates = `${location.lat.toFixed(5)}, ${location.lng.toFixed(5)}`;
    // The street address can't always be looked up, but the pin is enough for the rider
    const confirmedPlace: ResolvedAddress = resolvedPlace ?? {
      label: `Pinned location (${coordinates})`,
      title: 'Pinned location',
      subtitle: coordinates
    };

    setPlace(confirmedPlace);
    setDeliveryInfo(prev => ({
      ...prev,
      address: confirmedPlace.label,
      location,
      landmarks
    }));
    setLocationError('');
    setAddressMode('idle');
  };

  const handleLocationRemove = () => {
    setPlace(null);
    setDeliveryInfo(prev => ({
      ...prev,
      address: '',
      location: undefined,
      landmarks: undefined
    }));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen p-4">
        <div className="absolute inset-0 bg-black bg-opacity-50" onClick={onClose} />

        <div className="relative bg-white rounded-3xl shadow-2xl max-w-xl w-full max-h-[90vh] overflow-hidden flex flex-col">
          {/* Header */}
          <div className="relative flex-shrink-0 bg-gradient-to-r from-warm-brown-50 via-cream-50 to-sage-green-50 px-8 py-6 border-b border-warm-brown-100">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-3xl font-display font-bold text-warm-brown-800 mb-1">Checkout</h2>
                <p className="text-sage-green-600 font-body">Confirm your delivery details and payment</p>
              </div>
              <button
                type="button"
                onClick={onClose}
                aria-label="Close checkout"
                className="group p-3 text-gray-400 hover:text-gray-600 hover:bg-white/80 rounded-2xl transition-all duration-200 hover:scale-110"
              >
                <X size={24} className="group-hover:rotate-90 transition-transform duration-200" />
              </button>
            </div>
          </div>

          <div className="p-6 overflow-y-auto scrollbar-themed">

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Delivery Information */}
              <div>
                <h3 className="font-body font-semibold text-warm-brown-700 mb-4">
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
                      className={`w-full px-4 py-3 border rounded-lg font-body focus:outline-none focus:ring-2 focus:ring-sage-green-100 focus:border-sage-green-200 transition-colors ${errors.name ? 'border-red-500' : 'border-cream-300'
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
                      className={`w-full px-4 py-3 border rounded-lg font-body focus:outline-none focus:ring-2 focus:ring-sage-green-100 focus:border-sage-green-200 transition-colors ${errors.phone ? 'border-red-500' : 'border-cream-300'
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
                      className={`w-full px-4 py-3 border rounded-lg font-body focus:outline-none focus:ring-2 focus:ring-sage-green-100 focus:border-sage-green-200 transition-colors ${errors.email ? 'border-red-500' : 'border-cream-300'
                        }`}
                      placeholder="Enter your email address"
                    />
                  </div>

                  <div>
                    <label className="block font-body text-sm font-medium text-warm-brown-600 mb-2 flex">
                      <MapPin size={16} className="inline mr-1" />
                      Delivery Location <span className="text-red-500 text-sm ml-2">*</span>
                    </label>
                    {addressMode !== 'idle' ? (
                      <Suspense fallback={<div className="h-80 rounded-2xl bg-cream-50 animate-pulse" />}>
                        <LocationPicker
                          initialLocation={deliveryInfo.location}
                          useCurrentLocation={addressMode === 'current'}
                          onConfirm={handleLocationConfirm}
                          onCancel={() => setAddressMode('idle')}
                        />
                      </Suspense>
                    ) : deliveryInfo.location && place ? (
                      <SelectedLocationCard
                        title={place.title}
                        subtitle={place.subtitle}
                        kind={place.kind}
                        distanceKm={distanceFromRestaurantKm(deliveryInfo.location)}
                        landmarks={deliveryInfo.landmarks ?? []}
                        onChange={() => setAddressMode('map')}
                        onRemove={handleLocationRemove}
                      />
                    ) : (
                      <>
                        <div className="overflow-hidden rounded-xl border border-cream-200 divide-y divide-cream-200">
                          <button
                            type="button"
                            onClick={() => setAddressMode('current')}
                            className="flex w-full items-center gap-4 bg-cream-50 px-4 py-3 text-left transition-colors hover:bg-cream-100"
                          >
                            <span className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl bg-warm-brown-100">
                              <LocateFixed size={20} className="text-sage-green-500" />
                            </span>
                            <span>
                              <span className="block font-body font-semibold text-warm-brown-800">Use my current location</span>
                              <span className="block font-body text-sm text-warm-brown-500">Most accurate, uses your device GPS</span>
                            </span>
                          </button>
                          <button
                            type="button"
                            onClick={() => setAddressMode('map')}
                            className="flex w-full items-center gap-4 bg-white px-4 py-3 text-left transition-colors hover:bg-cream-50"
                          >
                            <span className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl bg-warm-brown-100">
                              <MapIcon size={20} className="text-sage-green-500" />
                            </span>
                            <span>
                              <span className="block font-body font-semibold text-warm-brown-800">Choose on map</span>
                              <span className="block font-body text-sm text-warm-brown-500">Drag the map to place the pin</span>
                            </span>
                          </button>
                        </div>
                        <p className="mt-2 font-body text-xs text-warm-brown-500">
                          We deliver within {DELIVERY_RADIUS_KM} km of the restaurant.
                        </p>
                      </>
                    )}
                    {locationError && addressMode === 'idle' && (
                      <p role="alert" className="mt-2 font-body text-sm text-red-500">{locationError}</p>
                    )}
                  </div>

                  <div>
                    <label className="block font-body text-sm font-medium text-warm-brown-600 mt-6 mb-2">
                      <MessageSquare size={16} className="inline mr-1" />
                      Special Notes (Optional)
                    </label>
                    <textarea
                      value={deliveryInfo.specialNotes}
                      onChange={(e) => handleInputChange('specialNotes', e.target.value)}
                      rows={4}
                      className="w-full px-4 py-3 border border-cream-300 rounded-lg font-body focus:outline-none focus:ring-2 focus:ring-sage-green-100 focus:border-sage-green-200 transition-colors resize-none scrollbar-themed"
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

                  <label
                    className={`flex items-center p-4 border border-cream-300 rounded-lg transition-colors ${isCodUnavailable ? 'cursor-not-allowed bg-cream-50 opacity-60' : 'cursor-pointer hover:bg-cream-50'}`}
                  >
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="cod"
                      checked={paymentMethod === 'cod'}
                      disabled={isCodUnavailable}
                      onChange={(e) => setPaymentMethod(e.target.value as 'cod')}
                      className="mr-3 text-sage-green-600 focus:ring-sage-green-500"
                    />
                    <Banknote size={20} className="text-warm-brown-600 mr-3" />
                    <div>
                      <div className="font-body font-medium text-warm-brown-700">
                        Cash on Delivery
                      </div>
                      <div className="font-body text-sm text-warm-brown-500">
                        {isCodUnavailable
                          ? `COD available up to LKR ${COD_MAX_AMOUNT.toLocaleString()}. Please pay by card.`
                          : 'Pay in cash upon delivery.'}
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