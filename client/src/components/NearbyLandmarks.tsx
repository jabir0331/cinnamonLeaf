import React from 'react';
import { getLandmarkIcon } from '../utils/landmarkIcons';
import type { Landmark } from '../types/cart';

// The "Nearby landmarks" block shown under a delivery location: an icon, name, type and distance per row
const NearbyLandmarks: React.FC<{ landmarks: Landmark[] }> = ({ landmarks }) => {
  if (landmarks.length === 0) return null;

  return (
    <div className="border-t border-dashed border-cream-300 px-5 py-4">
      <div className="flex items-baseline justify-between gap-3">
        <p className="font-body text-sm font-semibold text-warm-brown-700">Nearby landmarks</p>
        <p className="font-body text-xs text-warm-brown-400">Helps your rider find you</p>
      </div>
      <ul className="mt-3 space-y-3">
        {landmarks.map(landmark => {
          const Icon = getLandmarkIcon(landmark.kind);
          return (
            <li key={landmark.name} className="flex items-center gap-3">
              <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-cream-100">
                <Icon size={18} className="text-warm-brown-600" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate font-body text-sm font-semibold text-warm-brown-800">{landmark.name}</p>
                <p className="font-body text-xs text-warm-brown-500">{landmark.kind}</p>
              </div>
              <p className="flex-shrink-0 font-body text-sm font-semibold text-warm-brown-700">{landmark.distance} m</p>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default NearbyLandmarks;
