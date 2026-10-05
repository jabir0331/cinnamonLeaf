const { RESTAURANT_LOCATION, DELIVERY_RADIUS_KM } = require("../config/restaurant");

const toRad = (deg) => (deg * Math.PI) / 180;

// Great-circle distance in kilometres (haversine)
const distanceInKm = (a, b) => {
  const dLat = toRad(b.lat - a.lat);
  const dLng = toRad(b.lng - a.lng);
  const h = Math.sin(dLat / 2) ** 2 + Math.cos(toRad(a.lat)) * Math.cos(toRad(b.lat)) * Math.sin(dLng / 2) ** 2;
  return 2 * 6371 * Math.asin(Math.sqrt(h));
};

// Delivery is limited to a radius around the restaurant, so every order needs a map pin
// the server can measure. Throws a customer-facing Error when the order can't be delivered.
const assertWithinDeliveryZone = (deliveryInfo) => {
  const location = deliveryInfo && deliveryInfo.location;
  const lat = location && Number(location.lat);
  const lng = location && Number(location.lng);

  if (!location || !Number.isFinite(lat) || !Number.isFinite(lng)) {
    throw new Error("Please pin your delivery location on the map so we can confirm you are within our delivery area.");
  }

  const km = distanceInKm(RESTAURANT_LOCATION, { lat, lng });
  if (km > DELIVERY_RADIUS_KM) {
    throw new Error(`Sorry, we only deliver within ${DELIVERY_RADIUS_KM} km of the restaurant. Your location is ${km.toFixed(1)} km away.`);
  }
};

module.exports = { distanceInKm, assertWithinDeliveryZone };
