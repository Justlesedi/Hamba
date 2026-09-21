import { haversineKm, type MapCenter } from "../lib/geo";
import {
  getNearbyActivityById,
  searchNearbyActivities,
} from "./activities";
import { getStayById, quoteStay, searchNearbyStays } from "./stays";

function roundedKm(
  from: MapCenter,
  latitude: number,
  longitude: number,
) {
  return (
    Math.round(haversineKm(from.lat, from.lng, latitude, longitude) * 10) / 10
  );
}

export function listingsAround(options: {
  stayOrigin: MapCenter;
  activityOrigin: MapCenter;
  nights: number;
  units: number;
  travellers: number;
  keepStayId?: string | null;
  keepActivityIds?: string[];
}) {
  const stays = searchNearbyStays(options.stayOrigin.lat, options.stayOrigin.lng, {
    nights: options.nights,
    units: options.units,
    travellers: options.travellers,
  });

  if (
    options.keepStayId &&
    !stays.some((stay) => stay.id === options.keepStayId)
  ) {
    const stay = getStayById(options.keepStayId);
    if (stay) {
      stays.unshift(
        quoteStay(stay, {
          nights: options.nights,
          units: options.units,
          travellers: options.travellers,
          distanceKm: roundedKm(
            options.stayOrigin,
            stay.latitude,
            stay.longitude,
          ),
        }),
      );
    }
  }

  const activities = searchNearbyActivities(
    options.activityOrigin.lat,
    options.activityOrigin.lng,
  );
  const seen = new Set(activities.map((place) => place.id));

  for (const id of options.keepActivityIds ?? []) {
    if (seen.has(id)) {
      continue;
    }
    const place = getNearbyActivityById(id, options.activityOrigin);
    if (place) {
      activities.push(place);
    }
  }

  activities.sort((a, b) => a.distanceKm - b.distanceKm);

  return { stays, activities };
}
