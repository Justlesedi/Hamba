"use client";

import dynamic from "next/dynamic";
import { useActionState, useEffect, useMemo, useState } from "react";
import { chooseStayAction } from "@/app/actions/stays";
import { MAX_STAY_DISTANCE_KM } from "@backend/lib/geo";
import { formatZar } from "@backend/lib/money";
import type { QuotedStay, StayKind } from "@backend/types/stay";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

const StayMap = dynamic(() => import("@/components/stay/stay-map"), {
  ssr: false,
  loading: () => (
    <div className="flex h-[min(32rem,70vh)] items-center justify-center rounded-2xl border border-border bg-card text-sm text-muted">
      Loading map…
    </div>
  ),
});

type MapCenter = { lat: number; lng: number };

const KIND_LABEL: Record<StayKind, string> = {
  hotel: "Hotel",
  guesthouse: "Guesthouse",
  lodge: "Lodge",
  camp: "Rest camp",
  apartment: "Apartment",
};

function formatDistance(km: number) {
  if (km < 1) {
    return `${Math.round(km * 1000)} m away`;
  }

  return `${km.toFixed(1)} km away`;
}

export function StayExplorer({
  tripId,
  destination,
  travellers,
  nights,
  budgetCents,
  initialCenter,
  initialStays,
  initialSelectedStayId,
}: {
  tripId: string;
  destination: string;
  travellers: number;
  nights: number;
  budgetCents: number | null;
  initialCenter: MapCenter;
  initialStays: QuotedStay[];
  initialSelectedStayId: string | null;
}) {
  const [center, setCenter] = useState(initialCenter);
  const [stays, setStays] = useState(initialStays);
  const [selectedId, setSelectedId] = useState<string | null>(
    initialSelectedStayId ?? initialStays[0]?.id ?? null,
  );
  const [locateRequest, setLocateRequest] = useState(0);
  const [locationMessage, setLocationMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [state, action, pending] = useActionState(chooseStayAction, {
    selectedStayId: initialSelectedStayId,
  });
  const chosenStayId = state?.selectedStayId ?? initialSelectedStayId;

  const selected = useMemo(
    () => stays.find((stay) => stay.id === selectedId) ?? null,
    [stays, selectedId],
  );

  useEffect(() => {
    const handle = window.setTimeout(async () => {
      setLoading(true);
      try {
        const params = new URLSearchParams({
          lat: String(center.lat),
          lng: String(center.lng),
        });
        const response = await fetch(
          `/api/trips/${tripId}/stays?${params.toString()}`,
        );
        if (!response.ok) {
          return;
        }
        const data = (await response.json()) as { stays: QuotedStay[] };
        setStays(data.stays);
      } finally {
        setLoading(false);
      }
    }, 250);

    return () => window.clearTimeout(handle);
  }, [center.lat, center.lng, tripId]);

  useEffect(() => {
    if (selectedId && !stays.some((stay) => stay.id === selectedId)) {
      setSelectedId(stays[0]?.id ?? null);
    }
  }, [stays, selectedId]);

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
          Stays within {MAX_STAY_DISTANCE_KM} km of the map centre, priced for{" "}
          {travellers} {travellers === 1 ? "traveller" : "travellers"} and{" "}
          {nights} {nights === 1 ? "night" : "nights"}. Blue pins are listings.
        </p>
        <Button type="button" variant="secondary" onClick={useMyLocation}>
          Use my location
        </Button>
      </div>
      {locationMessage ? (
        <p className="text-sm text-accent">{locationMessage}</p>
      ) : null}

      <StayMap
        key={tripId}
        center={center}
        stays={stays}
        selectedId={selectedId}
        locateRequest={locateRequest}
        onSelect={setSelectedId}
        onCenterChange={setCenter}
      />

      <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_20rem]">
        <div className="overflow-hidden rounded-2xl border border-border bg-card">
          <div className="flex items-center justify-between border-b border-border px-6 py-4">
            <h2 className="font-medium">Nearby stays</h2>
            <p className="text-sm text-muted">
              {loading
                ? "Updating…"
                : `${stays.length} within ${MAX_STAY_DISTANCE_KM} km`}
            </p>
          </div>
          {stays.length === 0 ? (
            <p className="px-6 py-5 text-sm text-muted">
              No listed stays within {MAX_STAY_DISTANCE_KM} km of {destination}{" "}
              yet. Move the map if you are exploring nearby towns.
            </p>
          ) : (
            <ul className="divide-y divide-border">
              {stays.map((stay) => {
                const current = stay.id === selectedId;
                const chosen = stay.id === chosenStayId;
                const fits =
                  budgetCents == null || stay.totalCents <= budgetCents;
                return (
                  <li key={stay.id}>
                    <button
                      type="button"
                      onClick={() => setSelectedId(stay.id)}
                      className={`w-full px-6 py-4 text-left ${
                        current ? "bg-background" : "hover:bg-background/70"
                      }`}
                    >
                      <p className="font-medium">
                        {stay.name}
                        {chosen ? " · chosen" : ""}
                      </p>
                      <p className="mt-1 text-sm text-muted">
                        {stay.area} · {formatDistance(stay.distanceKm)}
                      </p>
                      <p className="mt-1 text-sm">
                        {formatZar(stay.totalCents)}
                        {budgetCents != null
                          ? fits
                            ? " · fits budget"
                            : " · over budget"
                          : ""}
                      </p>
                    </button>
                  </li>
                );
              })}
            </ul>
          )}
        </div>

        <Card className="h-fit lg:sticky lg:top-6">
          {selected ? (
            <div className="space-y-4">
              <div>
                <p className="text-sm text-muted">
                  {KIND_LABEL[selected.kind]}
                </p>
                <h2 className="mt-1 text-lg font-semibold">{selected.name}</h2>
              </div>
              <div>
                <p className="text-sm text-muted">Where</p>
                <p className="mt-1 font-medium">{selected.area}</p>
              </div>
              <div>
                <p className="text-sm text-muted">Run by</p>
                <p className="mt-1 font-medium">{selected.company}</p>
              </div>
              <div>
                <p className="text-sm text-muted">For this trip</p>
                <p className="mt-1 font-medium">
                  {formatZar(selected.nightlyCents)} per unit · {selected.units}{" "}
                  {selected.units === 1 ? "unit" : "units"} · {selected.nights}{" "}
                  {selected.nights === 1 ? "night" : "nights"}
                </p>
                <p className="mt-1 text-lg font-semibold">
                  {formatZar(selected.totalCents)}
                </p>
              </div>
              <p className="text-sm text-muted">{selected.note}</p>
              <p className="text-sm text-muted">
                Sleeps {selected.sleeps} per unit ·{" "}
                {formatDistance(selected.distanceKm)}
              </p>
              {state?.message ? (
                <p className="text-sm text-accent">{state.message}</p>
              ) : null}
              <form action={action} className="space-y-2">
                <input type="hidden" name="tripId" value={tripId} />
                {selected.id === chosenStayId ? (
                  <>
                    <input type="hidden" name="stayId" value="" />
                    <Button variant="secondary" disabled={pending}>
                      {pending ? "Saving…" : "Clear this stay"}
                    </Button>
                  </>
                ) : (
                  <>
                    <input type="hidden" name="stayId" value={selected.id} />
                    <Button disabled={pending}>
                      {pending ? "Saving…" : "Choose this stay"}
                    </Button>
                  </>
                )}
              </form>
            </div>
          ) : (
            <p className="text-sm text-muted">
              Click a pin on the map to see nightly rates and choose a stay.
            </p>
          )}
        </Card>
      </div>
    </div>
  );
}
