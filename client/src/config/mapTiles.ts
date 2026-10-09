// Map tile servers for the delivery location picker, tried in order. Some networks and browser
// extensions block a server, which leaves the map blank grey, so when the current one fails to load
// anything the picker moves on to the next.
//
// The standard OpenStreetMap style comes first because it labels schools, shops and other places by name,
// which helps customers and riders recognise a delivery location. CARTO's Voyager style is cleaner but
// leaves most of those names out, so it is only the last resort. CARTO also only serves real tiles with an
// API key (without one every tile is an "API KEY REQUIRED" placeholder), so it is only included when
// VITE_CARTO_API_KEY is set in client/.env. Its free tier is meant for non-commercial use.
//
// TODO: Before launch, check the commercial terms of every source. The OpenStreetMap servers need no key
// but are for light use only (https://operations.osmfoundation.org/policies/tiles/). For CARTO, get written
// confirmation that this site's use is allowed (key at https://carto.com/basemaps/apikey/). Or switch to a
// paid tile provider and add it at the top of this list.

export interface TileSource {
  url: string;
  attribution: string;
  subdomains?: string;
}

const OSM_ATTRIBUTION = '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors';

const cartoKey = import.meta.env.VITE_CARTO_API_KEY as string | undefined;

const CARTO_VOYAGER: TileSource = {
  url: `https://basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png?key=${encodeURIComponent(cartoKey ?? '')}`,
  attribution: `${OSM_ATTRIBUTION}, &copy; <a href="https://carto.com/attributions">CARTO</a>`,
};

export const TILE_SOURCES: TileSource[] = [
  { url: 'https://tile.openstreetmap.org/{z}/{x}/{y}.png', attribution: OSM_ATTRIBUTION },
  {
    url: 'https://{s}.tile.openstreetmap.fr/osmfr/{z}/{x}/{y}.png',
    subdomains: 'abc',
    attribution: `${OSM_ATTRIBUTION}, tiles by OpenStreetMap France`,
  },
  ...(cartoKey ? [CARTO_VOYAGER] : []),
];
