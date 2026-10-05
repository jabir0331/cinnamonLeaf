import { DELIVERY_RADIUS_KM, RESTAURANT_LOCATION } from '../config/restaurant';
import { distanceInMetres } from './landmarkSelection';

export const distanceFromRestaurantKm = (point: { lat: number; lng: number }): number =>
  distanceInMetres(RESTAURANT_LOCATION, point) / 1000;

export const isWithinDeliveryZone = (point: { lat: number; lng: number }): boolean =>
  distanceFromRestaurantKm(point) <= DELIVERY_RADIUS_KM;

export const outsideZoneMessage = (point: { lat: number; lng: number }): string =>
  `Sorry, we only deliver within ${DELIVERY_RADIUS_KM} km of the restaurant. Your location is ${distanceFromRestaurantKm(point).toFixed(1)} km away.`;
