"use client";

import dynamic from "next/dynamic";
import { useEffect, useMemo, useState } from "react";
import { MAX_ACTIVITY_DISTANCE_KM } from "@backend/lib/geo";
import { formatZar } from "@backend/lib/money";
import type { NearbyActivity } from "@backend/types/activity";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

const ItineraryMap = dynamic(() => import("@/components/itinerary/itinerary-map"), {
  ssr: false,
  loading: () => (
    <div className="flex h-[min(32rem,70vh)] items-center justify-center rounded-2xl border border-border bg-card text-sm text-muted">
      Loading map…
    </div>
  ),
});

type MapCenter = { lat: number; lng: number };

type ItineraryExplorerProps = {
  tripId: string;
  destination: string;
  initialCenter: MapCenter;
  initialActivities: NearbyActivity[];
};

function formatDistance(km: number) {
  if (km < 1) {
    return `${Math.round(km * 1000)} m away`;
  }

  return `${km.toFixed(1)} km away`;
}

export function ItineraryExplorer({
  tripId,
  destination,
  initialCenter,
  initialActivities,
}: ItineraryExplorerProps) {
  const [center, setCenter] = useState(initialCenter);
  const [activities, setActivities] = useState(initialActivities);
  const [selectedId, setSelectedId] = useState<string | null>(
    initialActivities[0]?.id ?? null,
  );
  const [locateRequest, setLocateRequest] = useState(0);
  const [locationMessage, setLocationMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const selected = useMemo(
    () => activities.find((activity) => activity.id === selectedId) ?? null,
    [activities, selectedId],
  );
  const nearbyActivities = activities.filter(
    (place) => place.kind !== "food",
  );
  const nearbyFood = activities.filter((place) => place.kind === "food");

  useEffect(() => {
    const handle = window.setTimeout(async () => {
      setLoading(true);
      try {
        const params = new URLSearchParams({
          lat: String(center.lat),
          lng: String(center.lng),
        });
        const response = await fetch(
          `/api/trips/${tripId}/itinerary?${params.toString()}`,
        );
        if (!response.ok) {
          return;
        }
        const data = (await response.json()) as { activities: NearbyActivity[] };
        setActivities(data.activities);
      } finally {
        setLoading(false);
      }
    }, 250);

    return () => window.clearTimeout(handle);
  }, [center.lat, center.lng, tripId]);

  useEffect(() => {
    if (selectedId && !activities.some((activity) => activity.id === selectedId)) {
      setSelectedId(activities[0]?.id ?? null);
    }
  }, [activities, selectedId]);

  function useMyLocation() {
    if (!navigator.geolocation) {
      setLocationMessage("Location is not available in this browser.");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocationMessage(null);
        setCenter({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
        setLocateRequest((value) => value + 1);
      },
      () => {
        setLocationMessage(
          `Could not read your location. Move the map or we will keep using ${destination}.`,
        );
      },
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <p className="max-w-xl text-sm text-muted">
          Activities and food spots within {MAX_ACTIVITY_DISTANCE_KM} km of the
          map centre. Orange pins are activities, green pins are food. Move the
          map to another area, or use your location.
        </p>
        <Button type="button" variant="secondary" onClick={useMyLocation}>
          Use my location
        </Button>
      </div>
      {locationMessage ? (
        <p className="text-sm text-accent">{locationMessage}</p>
      ) : null}

      <ItineraryMap
        key={tripId}
        center={center}
        activities={activities}
        selectedId={selectedId}
        locateRequest={locateRequest}
        onSelect={setSelectedId}
        onCenterChange={setCenter}
      />

      <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_20rem]">
        <div className="space-y-4">
          <PlaceList
            title="Nearby activities"
            emptyLabel={`No listed activities within ${MAX_ACTIVITY_DISTANCE_KM} km of ${destination} yet. Move the map if you are exploring nearby towns.`}
            places={nearbyActivities}
            selectedId={selectedId}
            loading={loading}
            onSelect={setSelectedId}
          />
          <PlaceList
            title="Nearby food spots"
            emptyLabel={`No listed food spots within ${MAX_ACTIVITY_DISTANCE_KM} km of ${destination} yet. Move the map if you are exploring nearby towns.`}
            places={nearbyFood}
            selectedId={selectedId}
            loading={loading}
            onSelect={setSelectedId}
          />
        </div>

        <Card className="h-fit lg:sticky lg:top-6">
          {selected ? (
            <div className="space-y-4">
              <div>
                <p className="text-sm text-muted">
                  {selected.kind === "food"
                    ? "Selected food spot"
                    : "Selected activity"}
                </p>
                <h2 className="mt-1 text-lg font-semibold">{selected.name}</h2>
              </div>
              <div>
                <p className="text-sm text-muted">Where</p>
                <p className="mt-1 font-medium">{selected.area}</p>
              </div>
              {selected.kind === "food" ? (
                <div>
                  <p className="text-sm text-muted">Typical meal</p>
                  <p className="mt-1 font-medium">
                    {formatZar(selected.estimatedCostCents)} a person
                  </p>
                </div>
              ) : null}
              <div>
                <p className="text-sm text-muted">Company</p>
                <p className="mt-1 font-medium">{selected.company}</p>
              </div>
              <div>
                <p className="text-sm text-muted">Operating hours</p>
                <p className="mt-1 font-medium">{selected.operatingHours}</p>
              </div>
              <p className="text-sm text-muted">
                {formatDistance(selected.distanceKm)}
              </p>
            </div>
          ) : (
            <p className="text-sm text-muted">
              Click a pin on the map to see who runs it and when it is open.
            </p>
          )}
        </Card>
      </div>
    </div>
  );
}

function PlaceList({
  title,
  emptyLabel,
  places,
  selectedId,
  loading,
  onSelect,
}: {
  title: string;
  emptyLabel: string;
  places: NearbyActivity[];
  selectedId: string | null;
  loading: boolean;
  onSelect: (id: string) => void;
}) {
  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-card">
      <div className="flex items-center justify-between border-b border-border px-6 py-4">
        <h2 className="font-medium">{title}</h2>
        <p className="text-sm text-muted">
          {loading
            ? "Updating…"
            : `${places.length} within ${MAX_ACTIVITY_DISTANCE_KM} km`}
        </p>
      </div>
      {places.length === 0 ? (
        <p className="px-6 py-5 text-sm text-muted">{emptyLabel}</p>
      ) : (
        <ul className="divide-y divide-border">
          {places.map((place) => {
            const current = place.id === selectedId;
            return (
              <li key={place.id}>
                <button
                  type="button"
                  onClick={() => onSelect(place.id)}
                  className={`w-full px-6 py-4 text-left ${
                    current ? "bg-background" : "hover:bg-background/70"
                  }`}
                >
                  <p className="font-medium">{place.name}</p>
                  <p className="mt-1 text-sm text-muted">
                    {place.area} · {formatDistance(place.distanceKm)}
                  </p>
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
