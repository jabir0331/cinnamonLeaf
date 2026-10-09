// Address, place search and nearby landmark lookups for the delivery location picker.
// All of them use Photon (photon.komoot.io): a free OpenStreetMap-based geocoder that needs no API key
// and allows requests straight from the browser. Its public server is rate limited, so the picker only
// looks things up when the pin settles or a search is submitted, and one request serves both the
// address and the landmarks.
import type { Landmark } from '../types/cart';
import { LandmarkCandidate, distanceInMetres, selectLandmarks } from './landmarkSelection';

const PHOTON_URL = 'https://photon.komoot.io';
const LOOKUP_TIMEOUT_MS = 6000;
// Landmarks further than this from the pin are not worth showing a rider
const LANDMARK_MAX_DISTANCE_M = 100;
// A named place only becomes the headline when the pin is practically on it
const PLACE_TITLE_MAX_DISTANCE_M = 40;
// Search only within Sri Lanka (min lon, min lat, max lon, max lat) - the restaurant only delivers locally
const SRI_LANKA_BBOX = '79.4,5.7,82.1,10.0';

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
  // Short headline (place or street) and the area line beneath it, for display
  title: string;
  subtitle: string;
  // What kind of place the pin is on when it's a named place (e.g. 'Railway station', 'School')
  kind?: string;
}

export interface LocationDetails {
  // null when nothing usable was found for this spot
  address: ResolvedAddress | null;
  landmarks: Landmark[];
}

// The parts of a Photon feature that are used here
interface PhotonProperties {
  name?: string;
  housenumber?: string;
  street?: string;
  locality?: string;
  district?: string;
  city?: string;
  county?: string;
  state?: string;
  country?: string;
  postcode?: string;
  osm_key?: string;
  osm_value?: string;
}

interface PhotonFeature {
  properties?: PhotonProperties;
  geometry?: { coordinates?: number[] };
}

// Features whose name is just a street or an area, which the address fields already cover
const NON_PLACE_KEYS = ['highway', 'place', 'boundary'];

const humanize = (value: string) => {
  const text = value.replace(/_/g, ' ');
  return text.charAt(0).toUpperCase() + text.slice(1);
};

const describePlaceKind = (key?: string, value?: string): string | undefined => {
  if (!value || value === 'yes') return key ? humanize(key) : undefined;
  return key === 'railway' ? `Railway ${value.replace(/_/g, ' ')}` : humanize(value);
};

const unique = (parts: (string | undefined)[]): string[] =>
  parts.map(part => part?.trim() ?? '').filter((part, index, all) => part !== '' && all.indexOf(part) === index);

interface AddressParts {
  name?: string;
  housenumber?: string;
  street?: string;
  locality?: string;
  district?: string;
  city?: string;
  county?: string;
  state?: string;
  postcode?: string;
  country?: string;
}

const buildLabel = (parts: AddressParts): string =>
  unique([
    parts.name,
    [parts.housenumber, parts.street].filter(Boolean).join(' '),
    parts.locality,
    parts.district,
    parts.city,
    parts.county,
    parts.state,
    parts.postcode,
    parts.country,
  ]).join(', ');

const coordinatesOf = (feature: PhotonFeature): LatLng | null => {
  const coords = feature.geometry?.coordinates;
  return coords && coords.length >= 2 ? { lat: coords[1], lng: coords[0] } : null;
};

// Calls Photon, aborting on the caller's signal or after a timeout, whichever comes first
const fetchPhoton = async (path: string, params: Record<string, string>, signal?: AbortSignal): Promise<PhotonFeature[]> => {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), LOOKUP_TIMEOUT_MS);
  const forwardAbort = () => controller.abort();
  signal?.addEventListener('abort', forwardAbort);

  try {
    const response = await fetch(`${PHOTON_URL}${path}?${new URLSearchParams(params)}`, { signal: controller.signal });
    if (!response.ok) throw new Error('Location lookup failed');
    const data: { features?: PhotonFeature[] } = await response.json();
    return data.features ?? [];
  } finally {
    clearTimeout(timer);
    signal?.removeEventListener('abort', forwardAbort);
  }
};

interface Nearby {
  props: PhotonProperties;
  metres: number;
}

const sortByDistance = (point: LatLng, features: PhotonFeature[]): Nearby[] =>
  features
    .map(feature => {
      const at = coordinatesOf(feature);
      return { props: feature.properties ?? {}, metres: at ? distanceInMetres(point, at) : Infinity };
    })
    .sort((a, b) => a.metres - b.metres);

const isNamedPlace = (item: Nearby) => !!item.props.name?.trim() && !NON_PLACE_KEYS.includes(item.props.osm_key ?? '');

// Builds the address shown for a pin from the places Photon found around it. A pin on a school, station
// or shop is described by that place; otherwise by the street it is on. `areaOnly` is for results found
// far from the pin, where a street name would be misleading but the surrounding area still helps.
const resolveAddress = (nearby: Nearby[], areaOnly = false): ResolvedAddress | null => {
  if (nearby.length === 0) return null;

  const nearest = nearby[0];
  const place = !areaOnly && isNamedPlace(nearest) && nearest.metres <= PLACE_TITLE_MAX_DISTANCE_M ? nearest : null;
  // The feature that carries the best address details: the place itself, else the nearest one with any
  const source = place ?? nearby.find(item => item.props.street || item.props.district || item.props.city || item.props.locality) ?? nearest;
  const p = source.props;

  const streetName = areaOnly ? undefined : p.street ?? (p.osm_key === 'highway' ? p.name : undefined);
  const areaName = p.locality ?? p.district ?? p.city;
  const title = place ? (place.props.name ?? '').trim() : streetName ?? areaName ?? '';
  if (!title) return null;

  const label = buildLabel({
    name: place ? title : undefined,
    housenumber: areaOnly ? undefined : p.housenumber,
    street: streetName,
    locality: p.locality,
    district: p.district,
    city: p.city,
    county: p.county,
    state: p.state,
    postcode: p.postcode,
    country: p.country,
  });
  const subtitle = unique([place ? streetName : undefined, p.locality, p.district, p.city, p.postcode])
    .filter(part => part !== title)
    .slice(0, 3)
    .join(', ');

  return { label, title, subtitle, kind: place ? describePlaceKind(place.props.osm_key, place.props.osm_value) : undefined };
};

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

const findLandmarks = (point: LatLng, features: PhotonFeature[], excludeName?: string): Landmark[] => {
  const candidates: LandmarkCandidate[] = [];

  for (const feature of features) {
    const props = feature.properties ?? {};
    const name = props.name?.trim() ?? '';
    const rule = props.osm_key && props.osm_value ? LANDMARK_TAGS[props.osm_key]?.[props.osm_value] : undefined;
    const at = coordinatesOf(feature);
    if (!name || !rule || !at || NOISE_NAME.test(name)) continue;

    const metres = distanceInMetres(point, at);
    if (metres > LANDMARK_MAX_DISTANCE_M) continue;
    candidates.push({
      landmark: {
        name,
        kind: describeLandmarkKind(props.osm_key as string, props.osm_value as string),
        distance: Math.max(10, Math.round(metres / 10) * 10),
      },
      tier: rule[0],
      group: rule[1],
      lat: at.lat,
      lng: at.lng,
    });
  }

  // The place the pin is on is already the headline, so it is not also a landmark "nearby". It still takes
  // part in the selection, so near-duplicates of it ("Maha Vidyalaya" next to "Vidyalaya") and a second
  // landmark of the same type are dropped, and only then is it left out of the list.
  const isHeadline = (landmark: Landmark) => !!excludeName && landmark.name.toLowerCase() === excludeName.toLowerCase();
  const maxLandmarks = 3;
  return selectLandmarks(candidates, excludeName ? maxLandmarks + 1 : maxLandmarks)
    .filter(landmark => !isHeadline(landmark))
    .slice(0, maxLandmarks);
};

const lookupCache = new Map<string, LocationDetails>();

// The address and the nearby landmarks for a pin, from a single request when the pin has mapped
// places around it. Throws when the lookup service can't be reached.
export const lookupLocation = async (point: LatLng, signal?: AbortSignal): Promise<LocationDetails> => {
  const cacheKey = `${point.lat.toFixed(5)},${point.lng.toFixed(5)}`;
  const cached = lookupCache.get(cacheKey);
  if (cached) return cached;

  const features = await fetchPhoton(
    '/reverse',
    { lon: String(point.lng), lat: String(point.lat), radius: String(LANDMARK_MAX_DISTANCE_M / 1000), limit: '50', lang: 'en' },
    signal
  );
  const nearby = sortByDistance(point, features);
  let address = resolveAddress(nearby);

  if (!address) {
    // Nothing mapped right here (a quiet road, open land): fall back to the nearest area at any distance
    const wider = await fetchPhoton('/reverse', { lon: String(point.lng), lat: String(point.lat), limit: '1', lang: 'en' }, signal);
    address = resolveAddress(sortByDistance(point, wider), true);
  }

  const details: LocationDetails = {
    address,
    landmarks: findLandmarks(point, features, address?.kind ? address.title : undefined),
  };
  lookupCache.set(cacheKey, details);
  return details;
};

export const searchPlaces = async (query: string, signal?: AbortSignal): Promise<PlaceResult[]> => {
  const features = await fetchPhoton('/api/', { q: query, limit: '5', lang: 'en', bbox: SRI_LANKA_BBOX }, signal);

  return features.flatMap(feature => {
    const at = coordinatesOf(feature);
    const p = feature.properties ?? {};
    const label = buildLabel({
      name: p.name,
      housenumber: p.housenumber,
      street: p.street,
      locality: p.locality,
      district: p.district,
      city: p.city,
      county: p.county,
      state: p.state,
      postcode: p.postcode,
      country: p.country,
    });
    return at && label ? [{ label, lat: at.lat, lng: at.lng }] : [];
  });
};
