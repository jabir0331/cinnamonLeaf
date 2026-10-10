import React, { useEffect, useRef, useState } from 'react';
import { Circle, MapContainer, TileLayer, ZoomControl, useMap, useMapEvents } from 'react-leaflet';
import { LocateFixed, Search } from 'lucide-react';
import NearbyLandmarks from './NearbyLandmarks';
import { DELIVERY_RADIUS_KM, RESTAURANT_LOCATION } from '../config/restaurant';
import { TILE_SOURCES } from '../config/mapTiles';
import { isWithinDeliveryZone, outsideZoneMessage } from '../utils/deliveryZone';
import 'leaflet/dist/leaflet.css';
import { LatLng, PlaceResult, ResolvedAddress, lookupLocation, searchPlaces } from '../utils/geocoding';
import { Landmark } from '../types/cart';

// Fallback map centre (the restaurant's area) when the user's position is unavailable
const DEFAULT_CENTER: LatLng = RESTAURANT_LOCATION;
// A source is given up on after this many failed tiles with none loaded (a stray failure is normal)
const TILE_FAILURES_BEFORE_SWITCH = 3;
// The tile source that last worked, so reopening the map (until the page is reloaded) does not wait for
// a blocked source to fail all over again
let workingTileSourceIndex = 0;

// Keep the map within Sri Lanka - the restaurant only delivers locally
const SRI_LANKA_BOUNDS: [[number, number], [number, number]] = [[5.7, 79.4], [10.0, 82.1]];

interface LocationPickerProps {
  initialLocation?: LatLng;
  // true = always start from the device GPS; false = resume from `initialLocation` if there is one
  useCurrentLocation: boolean;
  // `place` is null when the street address couldn't be looked up
  onConfirm: (place: ResolvedAddress | null, location: LatLng, landmarks: Landmark[]) => void;
  // Leave the picker without choosing a location
  onCancel: () => void;
}

const roundCoord = (value: number) => Math.round(value * 1e6) / 1e6;

// Reports the map centre when a pan/zoom ends and whether the map is being dragged
const MapWatcher: React.FC<{
  onCenterChange: (center: LatLng) => void;
  onDraggingChange: (dragging: boolean) => void;
}> = ({ onCenterChange, onDraggingChange }) => {
  const map = useMapEvents({
    dragstart: () => onDraggingChange(true),
    dragend: () => onDraggingChange(false),
    moveend: () => {
      const { lat, lng } = map.getCenter();
      onCenterChange({ lat: roundCoord(lat), lng: roundCoord(lng) });
    },
  });
  return null;
};

// Lets the parent move the map (search result, current location)
const FlyTo: React.FC<{ target: LatLng | null }> = ({ target }) => {
  const map = useMap();
  useEffect(() => {
    if (target) map.flyTo([target.lat, target.lng], Math.max(map.getZoom(), 17), { duration: 0.8 });
  }, [target, map]);
  return null;
};

const PinIcon: React.FC = () => (
  <svg width="36" height="48" viewBox="0 0 32 44" className="drop-shadow-lg" aria-hidden="true">
    <path
      d="M16 0C7.16 0 0 7.16 0 16c0 11 16 28 16 28s16-17 16-28C32 7.16 24.84 0 16 0z"
      fill="#647349"
    />
    <circle cx="16" cy="16" r="6" fill="#ffffff" />
  </svg>
);

const LocationPicker: React.FC<LocationPickerProps> = ({ initialLocation, useCurrentLocation, onConfirm, onCancel }) => {
  const resumeLocation = !useCurrentLocation ? initialLocation : undefined;
  const startPoint = resumeLocation ?? DEFAULT_CENTER;

  const panelRef = useRef<HTMLDivElement>(null);
  const userMovedRef = useRef(false);

  const [center, setCenter] = useState<LatLng>(startPoint);
  const [flyTarget, setFlyTarget] = useState<LatLng | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [tileSourceIndex, setTileSourceIndex] = useState(workingTileSourceIndex);
  const [tilesUnavailable, setTilesUnavailable] = useState(false);
  const tileStats = useRef({ loaded: 0, failed: 0 });
  // The pin only counts as "set" once we have a real position (GPS, search, or
  // the user touching the map) - never for the untouched fallback centre
  const [isPinSet, setIsPinSet] = useState(!!resumeLocation);
  const [isLocating, setIsLocating] = useState(!resumeLocation);
  const [locateError, setLocateError] = useState('');

  const [resolved, setResolved] = useState<ResolvedAddress | null>(null);
  const [landmarks, setLandmarks] = useState<Landmark[]>([]);
  const [isResolving, setIsResolving] = useState(false);
  const [addressError, setAddressError] = useState('');

  const [query, setQuery] = useState('');
  const [results, setResults] = useState<PlaceResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [searchMessage, setSearchMessage] = useState('');

  const tileSource = TILE_SOURCES[tileSourceIndex];

  const handleTileLoad = () => {
    tileStats.current.loaded += 1;
    if (tilesUnavailable) setTilesUnavailable(false);
  };

  const handleTileError = () => {
    const stats = tileStats.current;
    stats.failed += 1;
    if (stats.loaded > 0 || stats.failed < TILE_FAILURES_BEFORE_SWITCH) return;

    tileStats.current = { loaded: 0, failed: 0 };
    if (tileSourceIndex + 1 < TILE_SOURCES.length) {
      workingTileSourceIndex = tileSourceIndex + 1;
      setTileSourceIndex(workingTileSourceIndex);
    } else {
      setTilesUnavailable(true);
    }
  };

  const moveTo = (point: LatLng) => {
    setCenter(point);
    setFlyTarget(point);
    setIsPinSet(true);
  };

  // Bring the picker into view inside the scrolling checkout modal
  useEffect(() => {
    panelRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }, []);

  // Start on the user's current position
  useEffect(() => {
    if (resumeLocation) return;

    if (!navigator.geolocation) {
      setIsLocating(false);
      setLocateError("Your browser doesn't support location access. Please search or drag the map instead.");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setIsLocating(false);
        // The user already moved the map or picked a place - don't yank it away
        if (userMovedRef.current) return;
        moveTo({ lat: roundCoord(position.coords.latitude), lng: roundCoord(position.coords.longitude) });
      },
      () => {
        setIsLocating(false);
        setLocateError("Couldn't get your location. Please search or drag the map to set it.");
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Look up the address and nearby landmarks for the pin whenever it settles (one request for both)
  useEffect(() => {
    if (!isPinSet) return;

    const controller = new AbortController();
    setIsResolving(true);
    setAddressError('');

    const timer = setTimeout(async () => {
      try {
        const details = await lookupLocation(center, controller.signal);
        if (controller.signal.aborted) return;
        setResolved(details.address);
        setLandmarks(details.landmarks);
        if (!details.address) setAddressError('No address found here. You can still confirm the pin.');
      } catch (err) {
        if (controller.signal.aborted || (err instanceof Error && err.name === 'AbortError')) return;
        setResolved(null);
        setLandmarks([]);
        setAddressError("Couldn't look up this address. You can still confirm the pin.");
      }
      setIsResolving(false);
    }, 400);

    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [center, isPinSet]);

  const handleSearch = async () => {
    const trimmed = query.trim();
    if (!trimmed) return;

    setIsSearching(true);
    setSearchMessage('');
    try {
      const places = await searchPlaces(trimmed);
      setResults(places);
      if (places.length === 0) setSearchMessage('No places found. Try a nearby town or landmark.');
    } catch {
      setResults([]);
      setSearchMessage('Search is unavailable right now. Please try again in a moment.');
    } finally {
      setIsSearching(false);
    }
  };

  const handlePickResult = (place: PlaceResult) => {
    userMovedRef.current = true;
    moveTo({ lat: roundCoord(place.lat), lng: roundCoord(place.lng) });
    setResults([]);
    setQuery(place.label.split(',')[0]);
  };

  const handleLocateMe = () => {
    if (!navigator.geolocation) {
      setLocateError("Your browser doesn't support location access.");
      return;
    }
    userMovedRef.current = true;
    setIsLocating(true);
    setLocateError('');
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setIsLocating(false);
        moveTo({ lat: roundCoord(position.coords.latitude), lng: roundCoord(position.coords.longitude) });
      },
      () => {
        setIsLocating(false);
        setLocateError("Couldn't get your location. Please allow location access or search instead.");
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  // What the "Delivering to" card shows
  let cardTitle: string;
  let cardSubtitle: string;
  if (!isPinSet) {
    cardTitle = isLocating ? 'Finding your location...' : 'Set your location';
    cardSubtitle = isLocating
      ? 'Allow location access if your browser asks.'
      : locateError || 'Search above or drag the map to place the pin.';
  } else if (isResolving) {
    cardTitle = 'Finding address...';
    cardSubtitle = '';
  } else if (!resolved) {
    cardTitle = 'Pin placed';
    cardSubtitle = addressError;
  } else {
    cardTitle = resolved.title;
    cardSubtitle = resolved.subtitle;
  }

  // Delivery is limited to a radius around the restaurant
  const isOutsideZone = isPinSet && !isWithinDeliveryZone(center);
  const canConfirm = isPinSet && !isResolving && !isOutsideZone;

  return (
    <div ref={panelRef}>
      {/* Search - a plain container, not a <form>, because this renders inside the checkout form */}
      <div className="relative">
        <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-warm-brown-400" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault();
              handleSearch();
            }
          }}
          placeholder="Search a street, area or landmark"
          className="w-full pl-11 pr-20 py-3.5 bg-white border border-cream-300 rounded-xl font-body focus:outline-none focus:ring-2 focus:ring-sage-green-500 focus:border-sage-green-500"
        />
        <button
          type="button"
          onClick={handleSearch}
          disabled={isSearching}
          className="absolute right-2 top-1/2 -translate-y-1/2 px-3 py-1.5 font-body text-sm font-medium text-sage-green-700 hover:bg-sage-green-50 rounded-lg transition-colors disabled:opacity-60"
        >
          {isSearching ? '...' : 'Search'}
        </button>
      </div>

      {results.length > 0 && (
        <ul className="mt-2 max-h-40 overflow-y-auto scrollbar-themed bg-white border border-cream-200 rounded-xl divide-y divide-cream-100">
          {results.map((place, index) => (
            <li key={`${place.lat}-${place.lng}-${index}`}>
              <button
                type="button"
                onClick={() => handlePickResult(place)}
                className="w-full text-left px-4 py-2.5 font-body text-sm text-warm-brown-700 hover:bg-cream-50 transition-colors"
              >
                {place.label}
              </button>
            </li>
          ))}
        </ul>
      )}
      {searchMessage && <p className="mt-2 font-body text-sm text-warm-brown-500">{searchMessage}</p>}

      {/* Map */}
      <div
        className="relative isolate mt-3 h-80 rounded-2xl overflow-hidden border border-cream-200"
        onPointerDown={() => {
          userMovedRef.current = true;
          setIsPinSet(true);
        }}
      >
        <MapContainer
          center={[startPoint.lat, startPoint.lng]}
          zoom={16}
          minZoom={8}
          maxBounds={SRI_LANKA_BOUNDS}
          maxBoundsViscosity={1}
          scrollWheelZoom={false}
          zoomControl={false}
          className="h-full w-full"
        >
          <TileLayer
            key={tileSource.url}
            url={tileSource.url}
            attribution={tileSource.attribution}
            subdomains={tileSource.subdomains ?? 'abc'}
            maxZoom={19}
            noWrap
            eventHandlers={{ tileload: handleTileLoad, tileerror: handleTileError }}
          />
          <Circle
            center={[RESTAURANT_LOCATION.lat, RESTAURANT_LOCATION.lng]}
            radius={DELIVERY_RADIUS_KM * 1000}
            pathOptions={{ color: '#647349', weight: 2, dashArray: '6 6', fillColor: '#647349', fillOpacity: 0.05, interactive: false }}
          />
          <ZoomControl position="topright" />
          <MapWatcher
            onCenterChange={(next) =>
              setCenter(prev => (prev.lat === next.lat && prev.lng === next.lng ? prev : next))
            }
            onDraggingChange={setIsDragging}
          />
          <FlyTo target={flyTarget} />
        </MapContainer>

        {tilesUnavailable && (
          <div className="pointer-events-none absolute bottom-7 left-3 right-16 z-[1000] rounded-xl bg-white/95 px-4 py-2.5 text-center font-body text-xs text-warm-brown-700 shadow-md">
            The map couldn&apos;t be loaded. You can still search for your address or tap the location button to set your pin.
          </div>
        )}

        {/* Fixed centre pin - the map moves underneath it */}
        <div className="pointer-events-none absolute left-1/2 top-1/2 z-[1000] flex -translate-x-1/2 -translate-y-full flex-col items-center">
          <div
            className={`relative mb-1.5 whitespace-nowrap rounded-full bg-warm-brown-900 px-4 py-1.5 font-body text-sm font-medium text-white shadow-lg transition-opacity duration-150 ${isDragging ? 'opacity-0' : 'opacity-100'}`}
          >
            Your order goes here
            <span className="absolute left-1/2 top-full h-2.5 w-2.5 -translate-x-1/2 -translate-y-1.5 rotate-45 bg-warm-brown-900" />
          </div>
          <div className={`transition-transform duration-150 ${isDragging ? '-translate-y-2' : ''}`}>
            <PinIcon />
          </div>
        </div>
        <div className="pointer-events-none absolute left-1/2 top-1/2 z-[999] h-1.5 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-black/30 blur-[1px]" />

        <button
          type="button"
          onClick={handleLocateMe}
          disabled={isLocating}
          aria-label="Use my current location"
          className="absolute bottom-4 right-3 z-[1000] flex h-11 w-11 items-center justify-center rounded-full bg-white shadow-md hover:bg-cream-50 transition-colors disabled:opacity-60"
        >
          <LocateFixed size={20} className={`text-sage-green-700 ${isLocating ? 'animate-pulse' : ''}`} />
        </button>
      </div>

      {/* Delivering to */}
      <div className="mt-3 overflow-hidden rounded-2xl border border-cream-200 bg-white">
        <div className="bg-gradient-to-br from-cream-50 to-sage-green-50 px-5 py-4">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <span className="relative flex h-3.5 w-3.5 items-center justify-center rounded-full border border-sage-green-300 bg-white">
                <span className={`h-1.5 w-1.5 rounded-full bg-sage-green-600 ${isResolving || (isLocating && !isPinSet) ? 'animate-pulse' : ''}`} />
              </span>
              <p className="font-body text-xs font-semibold uppercase tracking-widest text-warm-brown-500">Delivering to</p>
            </div>
            {isPinSet && <p className="font-body text-xs text-warm-brown-400">Drag map to adjust</p>}
          </div>
          <p className={`mt-2 truncate font-body text-xl font-bold text-warm-brown-800 ${isLocating && !isPinSet ? 'animate-pulse' : ''}`}>
            {cardTitle}
          </p>
          {cardSubtitle && <p className="mt-0.5 font-body text-sm text-warm-brown-500">{cardSubtitle}</p>}
          {isOutsideZone && (
            <p role="alert" className="mt-2 rounded-lg border border-red-200 bg-red-50 px-3 py-2 font-body text-sm text-red-600">
              {outsideZoneMessage(center)}
            </p>
          )}
          {isPinSet && resolved?.kind && (
            <span className="mt-2 inline-block rounded-full border border-sage-green-300 bg-white px-3 py-0.5 font-body text-xs font-medium text-sage-green-700">
              {resolved.kind}
            </span>
          )}
        </div>

        {isPinSet && !isResolving && <NearbyLandmarks landmarks={landmarks} />}
      </div>
      {isPinSet && locateError && <p className="mt-2 font-body text-xs text-red-500">{locateError}</p>}

      <button
        type="button"
        onClick={() => onConfirm(resolved, center, landmarks)}
        disabled={!canConfirm}
        className="mt-3 w-full rounded-xl border border-sage-green-300 bg-white py-3 font-body text-base font-semibold text-sage-green-700 transition-colors hover:bg-sage-green-50 disabled:cursor-not-allowed disabled:opacity-60"
      >
        Confirm this location
      </button>
      <button
        type="button"
        onClick={onCancel}
        className="mt-2 w-full rounded-xl border border-warm-brown-300 bg-white py-3 font-body text-base font-medium text-warm-brown-500 transition-colors hover:bg-warm-brown-50"
      >
        Cancel
      </button>
    </div>
  );
};

export default LocationPicker;
