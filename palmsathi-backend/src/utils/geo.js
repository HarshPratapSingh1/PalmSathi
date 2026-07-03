/**
 * Haversine distance between two lat/lng points, in kilometers.
 */
export function distanceKm(a, b) {
  const R = 6371;
  const dLat = toRad(b.lat - a.lat);
  const dLng = toRad(b.lng - a.lng);
  const lat1 = toRad(a.lat);
  const lat2 = toRad(b.lat);

  const h =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLng / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(h), Math.sqrt(1 - h));

  return R * c;
}

function toRad(deg) {
  return (deg * Math.PI) / 180;
}

/**
 * Rough travel time estimate assuming rural transport speed (~25 km/h
 * average, accounting for unpaved roads typical near plantations).
 */
export function estimateTravelMinutes(a, b, avgSpeedKmh = 25) {
  const km = distanceKm(a, b);
  return Math.round((km / avgSpeedKmh) * 60);
}
