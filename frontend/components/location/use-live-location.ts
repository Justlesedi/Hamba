"use client";

import { useEffect, useState } from "react";
import { haversineKm, isWithinAnHour } from "@backend/lib/geo";

export type MapCenter = { lat: number; lng: number };

const WATCH_OPTIONS: PositionOptions = {
  enableHighAccuracy: true,
  maximumAge: 15000,
  timeout: 8000,
};

export function useLiveLocation(destination: MapCenter) {
  const [location, setLocation] = useState<MapCenter | null>(null);
  const [denied, setDenied] = useState(false);

  useEffect(() => {
    if (!navigator.geolocation) {
      return;
    }

    const watchId = navigator.geolocation.watchPosition(
      (position) => {
        setDenied(false);
        setLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
      },
      () => {
        setDenied(true);
      },
      WATCH_OPTIONS,
    );

    return () => navigator.geolocation.clearWatch(watchId);
  }, []);

  const nearDestination =
    location != null &&
    isWithinAnHour(
      haversineKm(
        location.lat,
        location.lng,
        destination.lat,
        destination.lng,
      ),
    );

  return { location, denied, nearDestination };
}
