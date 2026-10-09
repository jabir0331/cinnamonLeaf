import React from 'react';
import { CheckCircle2, MapPin, Pencil, X } from 'lucide-react';
import NearbyLandmarks from './NearbyLandmarks';
import type { Landmark } from '../types/cart';

interface SelectedLocationCardProps {
  title: string;
  subtitle: string;
  // What kind of place the pin is on (School, Railway station...), when it is a named place
  kind?: string;
  distanceKm: number;
  landmarks: Landmark[];
  onChange: () => void;
  onRemove: () => void;
}

// The delivery location the customer confirmed on the map, shown in the checkout form
const SelectedLocationCard: React.FC<SelectedLocationCardProps> = ({
  title,
  subtitle,
  kind,
  distanceKm,
  landmarks,
  onChange,
  onRemove
}) => (
  <div className="overflow-hidden rounded-2xl border border-sage-green-200 bg-white shadow-sm">
    <div className="bg-gradient-to-br from-cream-50 to-sage-green-50 px-5 py-4">
      <div className="flex items-start justify-between gap-3">
        <div className="flex min-w-0 items-start gap-3">
          <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl border border-sage-green-300 bg-white">
            <MapPin className="h-5 w-5 text-sage-green-700" />
          </div>
          <div className="min-w-0">
            <p className="font-body text-lg font-bold leading-snug text-warm-brown-800">{title}</p>
            {subtitle && <p className="font-body text-sm text-warm-brown-500">{subtitle}</p>}
          </div>
        </div>

        <div className="flex flex-shrink-0 items-center gap-2">
          <button
            type="button"
            onClick={onChange}
            className="inline-flex items-center gap-1 rounded-full border border-sage-green-300 bg-white px-3 py-1.5 font-body text-xs font-medium text-sage-green-700 transition-colors hover:bg-sage-green-50 focus:outline-none focus:ring-2 focus:ring-sage-green-100"
          >
            <Pencil className="h-3 w-3" />
            Change
          </button>
          <button
            type="button"
            onClick={onRemove}
            aria-label="Remove delivery location"
            className="inline-flex items-center justify-center rounded-full border border-cream-300 bg-white p-1.5 text-warm-brown-600 transition-colors hover:border-red-200 hover:bg-red-50 hover:text-red-600 focus:outline-none focus:ring-2 focus:ring-red-100"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      <div className="mt-3 flex flex-wrap gap-2">
        {kind && (
          <span className="rounded-full border border-sage-green-300 bg-white px-3 py-0.5 font-body text-xs font-medium text-sage-green-700">
            {kind}
          </span>
        )}
        <span className="inline-flex items-center gap-1 rounded-full border border-cream-300 bg-white px-3 py-0.5 font-body text-xs text-warm-brown-700">
          <CheckCircle2 className="h-3 w-3 text-sage-green-600" />
          {distanceKm.toFixed(1)} km from the restaurant
        </span>
      </div>
    </div>

    <NearbyLandmarks landmarks={landmarks} />
  </div>
);

export default SelectedLocationCard;
