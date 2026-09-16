"use client";

import dynamic from "next/dynamic";
import { useActionState, useEffect, useMemo, useState } from "react";
import { chooseStayAction, updatePlacesAction } from "@/app/actions/stays";
import { MAX_ACTIVITY_DISTANCE_KM } from "@backend/lib/geo";
import { formatZar } from "@backend/lib/money";
import type { NearbyActivity } from "@backend/types/activity";
import type { QuotedStay } from "@backend/types/stay";
import { OpenBadge } from "@/components/plan/open-badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import type { PlanSelectionKind } from "@/components/itinerary/itinerary-map";

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
  travellers: number;
  nights: number;
  initialCenter: MapCenter;
  initialStays: QuotedStay[];
  initialActivities: NearbyActivity[];
  initialSelectedStayId: string | null;
  initialSelectedActivityIds: string[];
};

function formatDistance(km: number) {
  if (km < 1) {
    return `${Math.round(km * 1000)} m away`;
  }

  return `${km.toFixed(1)} km away`;
}

function isClosed(status: { state: string }) {
  return status.state === "closed";
}

function firstOpenActivity(places: NearbyActivity[]) {
  return places.find((place) => !isClosed(place.openStatus));
}

export function ItineraryExplorer({
  tripId,
  destination,
  initialCenter,
  initialStays,
  initialActivities,
  initialSelectedStayId,
  initialSelectedActivityIds,
}: ItineraryExplorerProps) {
  const [center, setCenter] = useState(initialCenter);
  const [stays, setStays] = useState(initialStays);
  const [activities, setActivities] = useState(initialActivities);
  const [selectedKind, setSelectedKind] = useState<PlanSelectionKind | null>(
    initialSelectedStayId
      ? "stay"
      : firstOpenActivity(initialActivities)
        ? "activity"
        : initialStays[0]
          ? "stay"
          : null,
  );
  const [selectedId, setSelectedId] = useState<string | null>(
    initialSelectedStayId ??
      firstOpenActivity(initialActivities)?.id ??
      initialStays[0]?.id ??
      null,
  );
  const [locateRequest, setLocateRequest] = useState(0);
  const [locationMessage, setLocationMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [stayState, stayAction, stayPending] = useActionState(chooseStayAction, {
    selectedStayId: initialSelectedStayId,
  });
  const [placeState, placeAction, placePending] = useActionState(
    updatePlacesAction,
    { selectedActivityIds: initialSelectedActivityIds },
  );
  const [chosenStayId, setChosenStayId] = useState(initialSelectedStayId);
  const [selectedActivityIds, setSelectedActivityIds] = useState(
    initialSelectedActivityIds,
  );
  const [pickedIds, setPickedIds] = useState<string[]>([]);

  useEffect(() => {
    if (stayState?.selectedStayId !== undefined) {
      setChosenStayId(stayState.selectedStayId);
    }
  }, [stayState]);

  useEffect(() => {
    if (placeState?.selectedActivityIds !== undefined) {
      setSelectedActivityIds(placeState.selectedActivityIds);
      setPickedIds([]);
    }
  }, [placeState]);

  const chosenStay = useMemo(
    () => stays.find((stay) => stay.id === chosenStayId) ?? null,
    [chosenStayId, stays],
  );
  const nearbyActivities = activities.filter((place) => place.kind !== "food");
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
        const data = (await response.json()) as {
          stays: QuotedStay[];
          activities: NearbyActivity[];
        };
        setStays(data.stays);
        setActivities(data.activities);
      } finally {
        setLoading(false);
      }
    }, 250);

    return () => window.clearTimeout(handle);
  }, [center.lat, center.lng, tripId]);

  useEffect(() => {
    if (selectedKind === "stay") {
      if (selectedId && !stays.some((stay) => stay.id === selectedId)) {
        setSelectedId(stays[0]?.id ?? activities[0]?.id ?? null);
        setSelectedKind(stays[0] ? "stay" : activities[0] ? "activity" : null);
      }
      return;
    }

    if (selectedId && !activities.some((place) => place.id === selectedId)) {
      const nextActivity = firstOpenActivity(activities);
      setSelectedId(nextActivity?.id ?? stays[0]?.id ?? null);
      setSelectedKind(
        nextActivity ? "activity" : stays[0] ? "stay" : null,
      );
    }
  }, [activities, selectedId, selectedKind, stays]);

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

  function selectStay(id: string) {
    const stay = stays.find((listing) => listing.id === id);
    if (stay && isClosed(stay.openStatus) && stay.id !== chosenStayId) {
      return;
    }
    setSelectedKind("stay");
    setSelectedId(id);
  }

  function selectActivity(id: string) {
    const place = activities.find((activity) => activity.id === id);
    if (
      place &&
      isClosed(place.openStatus) &&
      !selectedActivityIds.includes(id) &&
      !pickedIds.includes(id)
    ) {
      return;
    }
    setSelectedKind("activity");
    setSelectedId(id);
    setPickedIds((current) =>
      current.includes(id) ? current : [...current, id],
    );
  }

  function togglePicked(id: string) {
    const place = activities.find((activity) => activity.id === id);
    const alreadyPicked = pickedIds.includes(id);
    if (
      place &&
      isClosed(place.openStatus) &&
      !alreadyPicked &&
      !selectedActivityIds.includes(id)
    ) {
      return;
    }
    setSelectedKind("activity");
    setSelectedId(id);
    setPickedIds((current) =>
      current.includes(id)
        ? current.filter((picked) => picked !== id)
        : [...current, id],
    );
  }

  function orderedChosenPlaces() {
    const pendingIds = pickedIds.filter(
      (id) => !selectedActivityIds.includes(id),
    );
    const byId = new Map(activities.map((place) => [place.id, place]));
    return [...selectedActivityIds, ...pendingIds]
      .map((id) => byId.get(id))
      .filter((place): place is NearbyActivity => place != null);
  }

  const pickedPlaces = activities.filter((place) => pickedIds.includes(place.id));
  const pickedToAdd = pickedIds.filter((id) => {
    if (selectedActivityIds.includes(id)) {
      return false;
    }
    const place = activities.find((activity) => activity.id === id);
    return !place || !isClosed(place.openStatus);
  });
  const pickedToRemove = pickedIds.filter((id) =>
    selectedActivityIds.includes(id),
  );
  const chosenPlaces = orderedChosenPlaces();
  const stayForSummary = chosenStay;

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <p className="max-w-xl text-sm text-muted">
          Choose a stay and tick every activity or food spot you want within{" "}
          {MAX_ACTIVITY_DISTANCE_KM} km. Blue pins are stays, orange pins are
          activities, green pins are food. Budget only costs what you add here.
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
        stays={stays}
        activities={activities}
        selectedId={selectedId}
        selectedKind={selectedKind}
        pickedActivityIds={pickedIds}
        locateRequest={locateRequest}
        onSelectStay={selectStay}
        onSelectActivity={selectActivity}
        onCenterChange={setCenter}
      />

      <div className="space-y-4">
          <StayList
            tripId={tripId}
            destination={destination}
            stays={stays}
            selectedId={selectedKind === "stay" ? selectedId : null}
            chosenStayId={chosenStayId}
            loading={loading}
            pending={stayPending}
            message={stayState?.message}
            action={stayAction}
            onSelect={selectStay}
          />
        <PlaceList
          title="Activities"
          emptyLabel={`No listed activities within ${MAX_ACTIVITY_DISTANCE_KM} km of ${destination} yet. Move the map if you are exploring nearby towns.`}
          places={nearbyActivities}
          selectedId={selectedKind === "activity" ? selectedId : null}
          pickedIds={pickedIds}
          selectedActivityIds={selectedActivityIds}
          loading={loading}
          onSelect={selectActivity}
          onTogglePick={togglePicked}
        />
        <PlaceList
          title="Food spots"
          emptyLabel={`No listed food spots within ${MAX_ACTIVITY_DISTANCE_KM} km of ${destination} yet. Move the map if you are exploring nearby towns.`}
          places={nearbyFood}
          selectedId={selectedKind === "activity" ? selectedId : null}
          pickedIds={pickedIds}
          selectedActivityIds={selectedActivityIds}
          loading={loading}
          onSelect={selectActivity}
          onTogglePick={togglePicked}
        />
      </div>

      <Card>
        <ChosenPlan
          tripId={tripId}
          stay={stayForSummary}
          chosenPlaces={chosenPlaces}
          pickedPlaces={pickedPlaces}
          pickedToAdd={pickedToAdd}
          pickedToRemove={pickedToRemove}
          placeMessage={placeState?.message}
          placePending={placePending}
          placeAction={placeAction}
          onClearPicks={() => setPickedIds([])}
        />
      </Card>
    </div>
  );
}

function ChosenPlan({
  tripId,
  stay,
  chosenPlaces,
  pickedPlaces,
  pickedToAdd,
  pickedToRemove,
  placeMessage,
  placePending,
  placeAction,
  onClearPicks,
}: {
  tripId: string;
  stay: QuotedStay | null;
  chosenPlaces: NearbyActivity[];
  pickedPlaces: NearbyActivity[];
  pickedToAdd: string[];
  pickedToRemove: string[];
  placeMessage?: string;
  placePending: boolean;
  placeAction: (formData: FormData) => void;
  onClearPicks: () => void;
}) {
  const chosenActivities = chosenPlaces.filter(
    (place) => place.kind !== "food",
  );
  const chosenFood = chosenPlaces.filter((place) => place.kind === "food");
  const hasChoices =
    stay != null || chosenPlaces.length > 0 || pickedPlaces.length > 0;

  if (!hasChoices) {
    return (
      <p className="text-sm text-muted">
        Tick the places you want. They will show up here.
      </p>
    );
  }

  return (
    <div className="space-y-5">
      <h2 className="text-lg font-semibold">Your choices</h2>

      <section>
        <h3 className="text-sm font-medium text-muted">Stay</h3>
        {stay ? (
          <p className="mt-2 font-medium">{stay.name}</p>
        ) : (
          <p className="mt-2 text-sm text-muted">No stay chosen yet.</p>
        )}
      </section>

      <section>
        <h3 className="text-sm font-medium text-muted">Activities</h3>
        {chosenActivities.length > 0 ? (
          <ol className="mt-2 list-decimal space-y-1 pl-5">
            {chosenActivities.map((place) => (
              <li key={place.id} className="font-medium">
                {place.name}
              </li>
            ))}
          </ol>
        ) : (
          <p className="mt-2 text-sm text-muted">No activities chosen yet.</p>
        )}
      </section>

      <section>
        <h3 className="text-sm font-medium text-muted">Food spots</h3>
        {chosenFood.length > 0 ? (
          <ul className="mt-2 list-disc space-y-1 pl-5">
            {chosenFood.map((place) => (
              <li key={place.id} className="font-medium">
                {place.name}
              </li>
            ))}
          </ul>
        ) : (
          <p className="mt-2 text-sm text-muted">No food spots chosen yet.</p>
        )}
      </section>

      {placeMessage ? (
        <p className="text-sm text-accent">{placeMessage}</p>
      ) : null}

      {pickedPlaces.length > 0 ? (
        <div className="flex flex-wrap gap-2">
          {pickedToAdd.length > 0 ? (
            <form action={placeAction}>
              <input type="hidden" name="tripId" value={tripId} />
              <input type="hidden" name="intent" value="add" />
              {pickedToAdd.map((id) => (
                <input key={id} type="hidden" name="activityId" value={id} />
              ))}
              <Button disabled={placePending}>
                {placePending ? "Saving…" : `Add ${pickedToAdd.length} to plan`}
              </Button>
            </form>
          ) : null}
          {pickedToRemove.length > 0 ? (
            <form action={placeAction}>
              <input type="hidden" name="tripId" value={tripId} />
              <input type="hidden" name="intent" value="remove" />
              {pickedToRemove.map((id) => (
                <input key={id} type="hidden" name="activityId" value={id} />
              ))}
              <Button variant="secondary" disabled={placePending}>
                {placePending
                  ? "Saving…"
                  : `Remove ${pickedToRemove.length} from plan`}
              </Button>
            </form>
          ) : null}
          <Button type="button" variant="ghost" onClick={onClearPicks}>
            Clear
          </Button>
        </div>
      ) : null}
    </div>
  );
}

function StayList({
  tripId,
  destination,
  stays,
  selectedId,
  chosenStayId,
  loading,
  pending,
  message,
  action,
  onSelect,
}: {
  tripId: string;
  destination: string;
  stays: QuotedStay[];
  selectedId: string | null;
  chosenStayId: string | null;
  loading: boolean;
  pending: boolean;
  message?: string;
  action: (formData: FormData) => void;
  onSelect: (id: string) => void;
}) {
  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-card">
      <div className="flex items-center justify-between border-b border-border px-6 py-4">
        <h2 className="font-medium">Accommodation</h2>
        <p className="text-sm text-muted">
          {loading
            ? "Updating…"
            : `${stays.length} within ${MAX_ACTIVITY_DISTANCE_KM} km`}
        </p>
      </div>
      {message ? (
        <p className="border-b border-border px-6 py-3 text-sm text-accent">
          {message}
        </p>
      ) : null}
      {stays.length === 0 ? (
        <p className="px-6 py-5 text-sm text-muted">
          No listed stays within {MAX_ACTIVITY_DISTANCE_KM} km of {destination}{" "}
          yet. Move the map if you are exploring nearby towns.
        </p>
      ) : (
        <ul className="divide-y divide-border">
          {stays.map((stay) => {
            const current = stay.id === selectedId;
            const chosen = stay.id === chosenStayId;
            const closed = isClosed(stay.openStatus);
            return (
              <li key={stay.id}>
                <div
                  className={`flex items-start justify-between gap-3 px-6 py-4 ${
                    closed
                      ? "opacity-60"
                      : current || chosen
                        ? "bg-background"
                        : "hover:bg-background/70"
                  }`}
                >
                  <button
                    type="button"
                    disabled={closed && !chosen}
                    onClick={() => onSelect(stay.id)}
                    className="min-w-0 flex-1 text-left disabled:cursor-not-allowed"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <p className="font-medium">{stay.name}</p>
                      <OpenBadge status={stay.openStatus} />
                    </div>
                    <p className="mt-1 text-sm text-muted">
                      {stay.area} · {formatDistance(stay.distanceKm)}
                    </p>
                    <p className="mt-1 text-sm">{formatZar(stay.totalCents)}</p>
                  </button>
                  {!closed && (current || chosen) ? (
                    <form action={action} className="shrink-0">
                      <input type="hidden" name="tripId" value={tripId} />
                      {chosen ? (
                        <>
                          <input type="hidden" name="stayId" value="" />
                          <Button variant="secondary" disabled={pending}>
                            {pending ? "Saving…" : "Clear"}
                          </Button>
                        </>
                      ) : (
                        <>
                          <input type="hidden" name="stayId" value={stay.id} />
                          <Button disabled={pending}>
                            {pending ? "Saving…" : "Choose"}
                          </Button>
                        </>
                      )}
                    </form>
                  ) : null}
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}

function PlaceList({
  title,
  emptyLabel,
  places,
  selectedId,
  pickedIds,
  selectedActivityIds,
  loading,
  onSelect,
  onTogglePick,
}: {
  title: string;
  emptyLabel: string;
  places: NearbyActivity[];
  selectedId: string | null;
  pickedIds: string[];
  selectedActivityIds: string[];
  loading: boolean;
  onSelect: (id: string) => void;
  onTogglePick: (id: string) => void;
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
            const picked = pickedIds.includes(place.id);
            const inPlan = selectedActivityIds.includes(place.id);
            const closed = isClosed(place.openStatus);
            const locked = closed && !picked && !inPlan;
            return (
              <li key={place.id}>
                <div
                  className={`flex items-start gap-3 px-6 py-4 ${
                    locked
                      ? "opacity-60"
                      : picked || current
                        ? "bg-background"
                        : "hover:bg-background/70"
                  }`}
                >
                  <input
                    type="checkbox"
                    className="mt-1 size-4 shrink-0 disabled:cursor-not-allowed"
                    checked={picked}
                    disabled={locked}
                    onChange={() => onTogglePick(place.id)}
                    aria-label={
                      locked
                        ? `${place.name} is closed`
                        : `Select ${place.name}`
                    }
                  />
                  <button
                    type="button"
                    disabled={locked}
                    onClick={() => onSelect(place.id)}
                    className="min-w-0 flex-1 text-left disabled:cursor-not-allowed"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <p className="font-medium">{place.name}</p>
                      <OpenBadge status={place.openStatus} />
                    </div>
                    <p className="mt-1 text-sm text-muted">
                      {place.area} · {formatDistance(place.distanceKm)}
                    </p>
                  </button>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
