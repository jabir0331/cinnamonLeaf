// Thin wrappers around OpenStreetMap's free Nominatim geocoder (no API key).
// Usage policy: max ~1 request/second, no autocomplete-per-keystroke - callers
// only invoke these on map-move end and on an explicit search submit.
import { Landmark } from '../types/cart';
import { LandmarkCandidate, distanceInMetres, selectLandmarks } from './landmarkSelection';

const NOMINATIM_URL = 'https://nominatim.openstreetmap.org';

export interface LatLng {
  lat: number;
  lng: number;
}

export interface PlaceResult extends LatLng {
  label: string;
}

export interface ResolvedAddress {
  // Full single-line address, stored on the order
  label: string;
  // Short headline (street/area) and the area line beneath it, for display
  title: string;
  subtitle: string;
  // What kind of place the pin is on when it's a named place (e.g. 'Railway station', 'School')
  kind?: string;
}

const TITLE_KEYS = ['road', 'neighbourhood', 'suburb', 'quarter', 'hamlet', 'village', 'town', 'city_district', 'city'];
// Features whose name is just a street or an area, which the address fields already cover
const NON_POI_CATEGORIES = ['highway', 'place', 'boundary'];
const AREA_KEYS = ['road', 'suburb', 'neighbourhood', 'village', 'town', 'city', 'municipality', 'postcode', 'state_district'];

const humanize = (value: string) => {
  const text = value.replace(/_/g, ' ');
  return text.charAt(0).toUpperCase() + text.slice(1);
};

const describePlaceKind = (category?: string, type?: string): string | undefined => {
  if (!type || type === 'yes') return category ? humanize(category) : undefined;
  return category === 'railway' ? `Railway ${type.replace(/_/g, ' ')}` : humanize(type);
};

// The parts of Nominatim's reverse-geocoding response that are used here
interface NominatimPlace {
  display_name?: string;
  name?: string;
  category?: string;
  type?: string;
  address?: Record<string, string | undefined>;
}

const toResolvedAddress = (data: NominatimPlace): ResolvedAddress => {
  const label: string = typeof data.display_name === 'string' ? data.display_name : '';
  const parts = data.address ?? {};

  // A pin on a school, station, shop etc. should say so rather than just naming the street
  const poiName: string = typeof data.name === 'string' ? data.name.trim() : '';
  const isPoi = !!poiName && !NON_POI_CATEGORIES.includes(data.category ?? '');

  const titleKey = TITLE_KEYS.find(key => parts[key]);
  const title: string = isPoi ? poiName : titleKey ? parts[titleKey] ?? '' : label.split(',')[0].trim();

  const subtitleParts: string[] = [];
  for (const key of AREA_KEYS) {
    const value = parts[key];
    if (value && value !== title && !subtitleParts.includes(value)) subtitleParts.push(value);
  }
  const subtitle = subtitleParts.length > 0
    ? subtitleParts.slice(0, 3).join(', ')
    : label.split(',').slice(1, 4).join(',').trim();

  return { label, title, subtitle, kind: isPoi ? describePlaceKind(data.category, data.type) : undefined };
};

export const reverseGeocode = async (point: LatLng, signal?: AbortSignal): Promise<ResolvedAddress | null> => {
  const params = new URLSearchParams({
    format: 'jsonv2',
    lat: String(point.lat),
    lon: String(point.lng),
    zoom: '18',
    addressdetails: '1',
    'accept-language': 'en',
  });

  const response = await fetch(`${NOMINATIM_URL}/reverse?${params}`, { signal });
  if (!response.ok) throw new Error('Reverse geocoding failed');

  const data = await response.json();
  return data.display_name ? toResolvedAddress(data) : null;
};

export const searchPlaces = async (query: string, signal?: AbortSignal): Promise<PlaceResult[]> => {
  const params = new URLSearchParams({
    format: 'jsonv2',
    q: query,
    countrycodes: 'lk',
    limit: '5',
    'accept-language': 'en',
  });

  const response = await fetch(`${NOMINATIM_URL}/search?${params}`, { signal });
  if (!response.ok) throw new Error('Place search failed');

  const data = await response.json();
  return (data as { display_name: string; lat: string; lon: string }[]).map(place => ({
    label: place.display_name,
    lat: parseFloat(place.lat),
    lng: parseFloat(place.lon),
  }));
};

// --- Nearby landmarks (Photon: free OpenStreetMap-based geocoder, no API key) ---
const PHOTON_URL = 'https://photon.komoot.io';
const LANDMARK_MAX_DISTANCE_M = 100;
const LANDMARK_RADIUS_KM = LANDMARK_MAX_DISTANCE_M / 1000;
const LANDMARK_TIMEOUT_MS = 5000;

// Which OpenStreetMap tags count as a landmark a rider would recognise, as [tier, group].
// Tier 1 (schools, stations, hospitals...) outranks tier 2 (shops, banks...). Places in the
// same group do the same job for a rider, so only the nearest of a group is shown.
const LANDMARK_TAGS: Record<string, Record<string, [1 | 2, string]>> = {
  amenity: {
    school: [1, 'education'], college: [1, 'education'], university: [1, 'education'], kindergarten: [1, 'education'],
    hospital: [1, 'health'], clinic: [2, 'health'], pharmacy: [2, 'health'],
    place_of_worship: [1, 'worship'],
    townhall: [1, 'civic'], police: [1, 'civic'], library: [2, 'civic'],
    bus_station: [1, 'transport'],
    bank: [2, 'finance'], post_office: [2, 'finance'],
    restaurant: [2, 'food'], cafe: [2, 'food'],
    fuel: [2, 'fuel'],
    marketplace: [2, 'shopping'],
  },
  railway: { station: [1, 'transport'], halt: [1, 'transport'] },
  public_transport: { station: [1, 'transport'] },
  shop: { mall: [1, 'shopping'], supermarket: [2, 'shopping'], department_store: [2, 'shopping'] },
  tourism: { attraction: [1, 'sights'], museum: [1, 'sights'], hotel: [2, 'lodging'] },
  leisure: { stadium: [1, 'leisure'], sports_centre: [1, 'leisure'], park: [1, 'leisure'] },
  historic: { monument: [2, 'sights'], memorial: [2, 'sights'] },
};

// Sub-features mapped inside a campus ("Grade 12", "Main Hall") are noise, not landmarks
const NOISE_NAME = /^(grade|class|main hall|west wing|east wing|north wing|south wing|block|hall|room|ground floor|floor)\b/i;

const describeLandmarkKind = (key: string, value: string) =>
  key === 'railway' ? 'Railway station' : humanize(value);

export const findNearbyLandmarks = async (point: LatLng, signal?: AbortSignal): Promise<Landmark[]> => {
  const params = new URLSearchParams({
    lon: String(point.lng),
    lat: String(point.lat),
    radius: String(LANDMARK_RADIUS_KM),
    limit: '50',
    lang: 'en',
  });

  // Abort on the caller's signal or after a timeout, whichever comes first
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), LANDMARK_TIMEOUT_MS);
  const forwardAbort = () => controller.abort();
  signal?.addEventListener('abort', forwardAbort);

  try {
    const response = await fetch(`${PHOTON_URL}/reverse?${params}`, { signal: controller.signal });
    if (!response.ok) throw new Error('Landmark lookup failed');

    const data = await response.json();
    const candidates: LandmarkCandidate[] = [];

    for (const feature of data.features ?? []) {
      const props = feature.properties ?? {};
      const name: string = typeof props.name === 'string' ? props.name.trim() : '';
      const rule = LANDMARK_TAGS[props.osm_key]?.[props.osm_value];
      const coords = feature.geometry?.coordinates;
      if (!name || !rule || !coords || NOISE_NAME.test(name)) continue;

      const [lng, lat] = coords;
      const metres = distanceInMetres(point, { lat, lng });
      if (metres > LANDMARK_MAX_DISTANCE_M) continue;
      candidates.push({
        landmark: {
          name,
          kind: describeLandmarkKind(props.osm_key, props.osm_value),
          distance: Math.max(10, Math.round(metres / 10) * 10),
        },
        tier: rule[0],
        group: rule[1],
        lat,
        lng,
      });
    }

    return selectLandmarks(candidates);
  } finally {
    clearTimeout(timer);
    signal?.removeEventListener('abort', forwardAbort);
  }
};
