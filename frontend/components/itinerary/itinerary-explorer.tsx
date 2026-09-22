"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { useActionState, useEffect, useMemo, useRef, useState } from "react";
import { chooseStayAction, updatePlacesAction } from "@/app/actions/stays";
import { stayTotalCents } from "@backend/lib/budget/estimates";
import { formatTravelAway, movedAtLeastKm } from "@backend/lib/geo";
import { formatZar } from "@backend/lib/money";
import { filterByPriceBand, type PriceBand } from "@backend/lib/price-band";
import {
  busiestLevel,
  nudgeBusyLevel,
  type BusyLevel,
} from "@backend/lib/calendar/busy";
import { monthEnd, monthStart } from "@backend/lib/calendar/dates";
import { ticketChannelLabel } from "@backend/lib/activities/tickets";
import type { NearbyActivity } from "@backend/types/activity";
import { stayKindLabel, stayLayoutLabel, type QuotedStay } from "@backend/types/stay";
import { BusyBadge } from "@/components/calendar/busy-badge";
import { BusyCalendar } from "@/components/calendar/busy-calendar";
import { useBusyDays } from "@/components/calendar/use-busy-days";
import { useLiveLocation } from "@/components/location/use-live-location";
import { OpenBadge } from "@/components/plan/open-badge";
import { PriceFilter } from "@/components/plan/price-filter";
import { StayUnitsSelect } from "@/components/stay/stay-units-select";
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
  startDate: string;
  endDate: string;
  initialCenter: MapCenter;
  initialStays: QuotedStay[];
  initialActivities: NearbyActivity[];
  initialSelectedStayId: string | null;
  initialStayUnits: number;
  initialSelectedActivityIds: string[];
};

function isClosed(status: { state: string }) {
  return status.state === "closed";
}

function firstOpenActivity(places: NearbyActivity[]) {
  return places.find((place) => !isClosed(place.openStatus));
}

type StayHub = {
  id: string;
  name: string;
  area: string;
  lat: number;
  lng: number;
};

function hubFromStay(
  stay: {
    id: string;
    name: string;
    area: string;
    latitude: number;
    longitude: number;
  } | null | undefined,
): StayHub | null {
  if (!stay) {
    return null;
  }
  return {
    id: stay.id,
    name: stay.name,
    area: stay.area,
    lat: stay.latitude,
    lng: stay.longitude,
  };
}

export function ItineraryExplorer({
  tripId,
  destination,
  travellers,
  startDate,
  endDate,
  initialCenter,
  initialStays,
  initialActivities,
  initialSelectedStayId,
  initialStayUnits,
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
    selectedStayUnits: initialStayUnits,
  });
  const [placeState, placeAction, placePending] = useActionState(
    updatePlacesAction,
    { selectedActivityIds: initialSelectedActivityIds },
  );
  const [chosenStayId, setChosenStayId] = useState(initialSelectedStayId);
  const [unitCount, setUnitCount] = useState(initialStayUnits);
  const [selectedActivityIds, setSelectedActivityIds] = useState(
    initialSelectedActivityIds,
  );
  const [pickedIds, setPickedIds] = useState<string[]>([]);
  const [stayBand, setStayBand] = useState<PriceBand>("all");
  const [activityBand, setActivityBand] = useState<PriceBand>("all");
  const [foodBand, setFoodBand] = useState<PriceBand>("all");
  const [month, setMonth] = useState(startDate.slice(0, 7));
  const [stayHub, setStayHub] = useState<StayHub | null>(() =>
    hubFromStay(
      initialStays.find((stay) => stay.id === initialSelectedStayId),
    ),
  );
  const live = useLiveLocation(initialCenter);
  const lastGps = useRef<MapCenter | null>(null);
  const didFlyToGps = useRef(false);
  const keepPlaceIds = useRef<string[]>([]);
  const staysRef = useRef(stays);
  staysRef.current = stays;

  useEffect(() => {
    if (stayState?.selectedStayId !== undefined) {
      setChosenStayId(stayState.selectedStayId);
      if (stayState.selectedStayId === null) {
        setStayHub(null);
      } else {
        const stay = staysRef.current.find(
          (listing) => listing.id === stayState.selectedStayId,
        );
        if (stay) {
          setStayHub(hubFromStay(stay));
        }
      }
    }
    if (stayState?.selectedStayUnits != null) {
      setUnitCount(stayState.selectedStayUnits);
    }
  }, [stayState]);

  useEffect(() => {
    if (placeState?.selectedActivityIds !== undefined) {
      setSelectedActivityIds(placeState.selectedActivityIds);
      setPickedIds([]);
    }
  }, [placeState]);

  useEffect(() => {
    setPickedIds((current) =>
      current.filter((id) => {
        const place = activities.find((activity) => activity.id === id);
        return !place || !isClosed(place.openStatus);
      }),
    );
  }, [activities]);

  const chosenStay = useMemo(
    () => stays.find((stay) => stay.id === chosenStayId) ?? null,
    [chosenStayId, stays],
  );
  const nearbyActivities = activities.filter((place) => place.kind !== "food");
  const nearbyFood = activities.filter((place) => place.kind === "food");
  const visibleStays = useMemo(
    () =>
      filterByPriceBand(
        stays,
        stayBand,
        (stay) => stay.nightlyCents,
        (stay) => stay.id === chosenStayId || stay.id === selectedId,
      ),
    [chosenStayId, selectedId, stayBand, stays],
  );
  const visibleActivities = useMemo(
    () =>
      filterByPriceBand(
        nearbyActivities,
        activityBand,
        (place) => place.estimatedCostCents,
        (place) =>
          place.id === selectedId ||
          pickedIds.includes(place.id) ||
          selectedActivityIds.includes(place.id),
      ),
    [
      activityBand,
      nearbyActivities,
      pickedIds,
      selectedActivityIds,
      selectedId,
    ],
  );
  const visibleFood = useMemo(
    () =>
      filterByPriceBand(
        nearbyFood,
        foodBand,
        (place) => place.estimatedCostCents,
        (place) =>
          place.id === selectedId ||
          pickedIds.includes(place.id) ||
          selectedActivityIds.includes(place.id),
      ),
    [foodBand, nearbyFood, pickedIds, selectedActivityIds, selectedId],
  );
  const mapActivities = useMemo(
    () => [...visibleActivities, ...visibleFood],
    [visibleActivities, visibleFood],
  );

  const activityCenter = stayHub
    ? { lat: stayHub.lat, lng: stayHub.lng }
    : live.nearDestination && live.location
      ? live.location
      : center;

  keepPlaceIds.current = [...pickedIds, ...selectedActivityIds];

  useEffect(() => {
    if (!live.location || !live.nearDestination || stayHub) {
      return;
    }
    const previous = lastGps.current;
    if (previous && !movedAtLeastKm(previous, live.location, 0.35)) {
      return;
    }
    lastGps.current = live.location;
    setCenter(live.location);
    if (!didFlyToGps.current) {
      didFlyToGps.current = true;
      setLocateRequest((value) => value + 1);
    }
  }, [live.location, live.nearDestination, stayHub?.id]);

  useEffect(() => {
    const handle = window.setTimeout(async () => {
      setLoading(true);
      try {
        const params = new URLSearchParams({
          lat: String(center.lat),
          lng: String(center.lng),
          activityLat: String(activityCenter.lat),
          activityLng: String(activityCenter.lng),
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
        const keep = new Set(keepPlaceIds.current);
        setStays(data.stays);
        setActivities((current) => {
          const extras = current.filter(
            (place) =>
              keep.has(place.id) &&
              !data.activities.some((next) => next.id === place.id),
          );
          return extras.length
            ? [...data.activities, ...extras]
            : data.activities;
        });
      } finally {
        setLoading(false);
      }
    }, 250);

    return () => window.clearTimeout(handle);
  }, [
    activityCenter.lat,
    activityCenter.lng,
    center.lat,
    center.lng,
    tripId,
  ]);

  useEffect(() => {
    const nextStay = stays.find((listing) => !isClosed(listing.openStatus));
    const nextActivity = firstOpenActivity(activities);

    if (selectedKind === "stay") {
      const stay = stays.find((listing) => listing.id === selectedId);
      if (stay && !isClosed(stay.openStatus)) {
        return;
      }
    } else if (selectedKind === "activity") {
      const place = activities.find((activity) => activity.id === selectedId);
      if (place && !isClosed(place.openStatus)) {
        return;
      }
    }

    const nextId =
      selectedKind === "stay"
        ? (nextStay?.id ?? nextActivity?.id ?? null)
        : (nextActivity?.id ?? nextStay?.id ?? null);
    const nextKind = nextId
      ? nextStay && nextId === nextStay.id
        ? "stay"
        : nextActivity && nextId === nextActivity.id
          ? "activity"
          : nextStay
            ? "stay"
            : "activity"
      : null;

    if (nextId === selectedId && nextKind === selectedKind) {
      return;
    }

    setSelectedId(nextId);
    setSelectedKind(nextKind);
  }, [activities, selectedId, selectedKind, stays]);

  function useMyLocation() {
    if (!navigator.geolocation) {
      setLocationMessage("Location is not available in this browser.");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const next = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        };
        lastGps.current = next;
        didFlyToGps.current = true;
        setLocationMessage(null);
        setCenter(next);
        setLocateRequest((value) => value + 1);
      },
      () => {
        setLocationMessage(
          `Could not read your location. Move the map or we will keep using ${destination}.`,
        );
      },
      { enableHighAccuracy: true, timeout: 8000, maximumAge: 15000 },
    );
  }

  function selectStay(id: string) {
    const stay = stays.find((listing) => listing.id === id);
    if (!stay || isClosed(stay.openStatus)) {
      return;
    }
    setSelectedKind("stay");
    setSelectedId(id);
    setStayHub(hubFromStay(stay));
  }

  function selectActivity(id: string) {
    const place = activities.find((activity) => activity.id === id);
    if (!place || isClosed(place.openStatus)) {
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
    if (!place || isClosed(place.openStatus)) {
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
  const selectedStay = stays.find((stay) => stay.id === selectedId);
  const calendarStay =
    (selectedKind === "stay" ? selectedStay : null) ??
    chosenStay ??
    stays.find((stay) => stay.id === stayHub?.id) ??
    null;
  const calendarDays = useBusyDays({
    destination,
    start: monthStart(`${month}-01`),
    end: monthEnd(`${month}-01`),
    name: calendarStay?.name,
    kind: "stay",
    stayKind: calendarStay?.kind,
  });
  const tripDays = useBusyDays({
    destination,
    start: startDate,
    end: endDate,
  });

  function listingBusy(id: string): BusyLevel | null {
    const levels = tripDays
      .filter((day) => day.date >= startDate && day.date <= endDate)
      .map((day) => nudgeBusyLevel(day.level, id));
    return levels.length ? busiestLevel(levels) : null;
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="max-w-xl text-sm text-muted">
          <p>
            {stayHub
              ? `Activities and food are around ${stayHub.name} in ${stayHub.area}.`
              : `Confirm a stay so activities and food use that area in ${destination}.`}
          </p>
        </div>
        <Button type="button" variant="secondary" onClick={useMyLocation}>
          Use my location
        </Button>
      </div>
      {locationMessage ? (
        <p className="text-sm text-accent">{locationMessage}</p>
      ) : null}

      <Card>
        <BusyCalendar
          month={month}
          days={calendarDays}
          rangeStart={startDate}
          rangeEnd={endDate}
          onMonthChange={setMonth}
          title={
            calendarStay
              ? `How busy ${calendarStay.name} looks`
              : "How busy stays look"
          }
        />
      </Card>

      <ItineraryMap
        key={tripId}
        center={center}
        hub={activityCenter}
        userLocation={live.location}
        stays={visibleStays}
        activities={mapActivities}
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
            stays={visibleStays}
            emptyLabel={
              stays.length === 0
                ? "No stays nearby."
                : "No stays in this price range."
            }
            priceBand={stayBand}
            onPriceBandChange={setStayBand}
            selectedId={selectedKind === "stay" ? selectedId : null}
            chosenStayId={chosenStayId}
            travellers={travellers}
            unitCount={unitCount}
            loading={loading}
            pending={stayPending}
            message={stayState?.message}
            action={stayAction}
            onSelect={selectStay}
            onUnitsChange={setUnitCount}
            busyFor={listingBusy}
          />
        <PlaceList
          title="Activities"
          emptyLabel={
            nearbyActivities.length === 0
              ? stayHub
                ? `No activities near ${stayHub.name}.`
                : "No activities nearby."
              : "No activities in this price range."
          }
          places={visibleActivities}
          priceBand={activityBand}
          onPriceBandChange={setActivityBand}
          selectedId={selectedKind === "activity" ? selectedId : null}
          pickedIds={pickedIds}
          selectedActivityIds={selectedActivityIds}
          loading={loading}
          onSelect={selectActivity}
          onTogglePick={togglePicked}
        />
        <PlaceList
          title="Food spots"
          emptyLabel={
            nearbyFood.length === 0
              ? stayHub
                ? `No food spots near ${stayHub.name}.`
                : "No food spots nearby."
              : "No food spots in this price range."
          }
          places={visibleFood}
          priceBand={foodBand}
          onPriceBandChange={setFoodBand}
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
          unitCount={unitCount}
          chosenPlaces={chosenPlaces}
          pickedPlaces={pickedPlaces}
          pickedToAdd={pickedToAdd}
          pickedToRemove={pickedToRemove}
          selectedActivityIds={selectedActivityIds}
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
  unitCount,
  chosenPlaces,
  pickedPlaces,
  pickedToAdd,
  pickedToRemove,
  selectedActivityIds,
  placeMessage,
  placePending,
  placeAction,
  onClearPicks,
}: {
  tripId: string;
  stay: QuotedStay | null;
  unitCount: number;
  chosenPlaces: NearbyActivity[];
  pickedPlaces: NearbyActivity[];
  pickedToAdd: string[];
  pickedToRemove: string[];
  selectedActivityIds: string[];
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
          <div className="mt-2">
            <p className="font-medium">{stay.name}</p>
            <p className="mt-1 text-sm text-muted">
              {stayKindLabel(stay.kind)} ·{" "}
              {stay.kind === "house"
                ? unitCount > 1
                  ? `${unitCount} houses · ${stayLayoutLabel(stay)} each`
                  : stayLayoutLabel(stay)
                : `${unitCount} ${unitCount === 1 ? "room" : "rooms"} · ${stayLayoutLabel(stay)}`}{" "}
              · {formatZar(stay.nightlyCents)} per night
            </p>
            <p className="mt-1 text-sm font-medium">
              {formatZar(stayTotalCents(stay.nightlyCents, unitCount, stay.nights))}
            </p>
          </div>
        ) : (
          <p className="mt-2 text-sm text-muted">No stay chosen yet.</p>
        )}
      </section>

      <section>
        <h3 className="text-sm font-medium text-muted">Activities</h3>
        {chosenActivities.length > 0 ? (
          <ol className="mt-2 list-decimal space-y-2 pl-5">
            {chosenActivities.map((place) => (
              <li key={place.id} className="font-medium">
                <div className="flex items-start justify-between gap-3">
                  <span>{place.name}</span>
                  {selectedActivityIds.includes(place.id) ? (
                    <form action={placeAction}>
                      <input type="hidden" name="tripId" value={tripId} />
                      <input type="hidden" name="intent" value="remove" />
                      <input type="hidden" name="activityId" value={place.id} />
                      <Button
                        variant="ghost"
                        className="px-0 py-0"
                        disabled={placePending}
                      >
                        Remove
                      </Button>
                    </form>
                  ) : null}
                </div>
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
          <ul className="mt-2 list-disc space-y-2 pl-5">
            {chosenFood.map((place) => (
              <li key={place.id} className="font-medium">
                <div className="flex items-start justify-between gap-3">
                  <span>{place.name}</span>
                  {selectedActivityIds.includes(place.id) ? (
                    <form action={placeAction}>
                      <input type="hidden" name="tripId" value={tripId} />
                      <input type="hidden" name="intent" value="remove" />
                      <input type="hidden" name="activityId" value={place.id} />
                      <Button
                        variant="ghost"
                        className="px-0 py-0"
                        disabled={placePending}
                      >
                        Remove
                      </Button>
                    </form>
                  ) : null}
                </div>
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
                {placePending ? "Saving…" : "Confirm"}
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

      {stay && pickedToAdd.length === 0 ? (
        <p className="pt-1">
          <Link
            href={`/bookings/trip/${tripId}`}
            className="inline-flex items-center justify-center rounded-full bg-accent px-5 py-2.5 text-sm font-medium text-white hover:bg-accent-hover"
          >
            Advance
          </Link>
        </p>
      ) : stay ? (
        <p className="text-sm text-muted">
          Confirm the ticked places first, then Advance to Bookings.
        </p>
      ) : (
        <p className="text-sm text-muted">
          Confirm a stay first, then Advance to Bookings.
        </p>
      )}
    </div>
  );
}

function StayList({
  tripId,
  stays,
  emptyLabel,
  priceBand,
  onPriceBandChange,
  selectedId,
  chosenStayId,
  travellers,
  unitCount,
  loading,
  pending,
  message,
  action,
  onSelect,
  onUnitsChange,
  busyFor,
}: {
  tripId: string;
  stays: QuotedStay[];
  emptyLabel: string;
  priceBand: PriceBand;
  onPriceBandChange: (band: PriceBand) => void;
  selectedId: string | null;
  chosenStayId: string | null;
  travellers: number;
  unitCount: number;
  loading: boolean;
  pending: boolean;
  message?: string;
  action: (formData: FormData) => void;
  onSelect: (id: string) => void;
  onUnitsChange: (units: number) => void;
  busyFor: (id: string) => BusyLevel | null;
}) {
  const [showBusy, setShowBusy] = useState(false);

  useEffect(() => {
    setShowBusy(true);
  }, []);

  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-card">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border px-6 py-4">
        <h2 className="font-medium">Accommodation</h2>
        <div className="flex flex-wrap items-center gap-3">
          {loading ? <p className="text-sm text-muted">Updating…</p> : null}
          {chosenStayId ? (
            <form action={action}>
              <input type="hidden" name="tripId" value={tripId} />
              <input type="hidden" name="stayId" value={chosenStayId} />
              <StayUnitsSelect
                travellers={travellers}
                value={unitCount}
                onChange={onUnitsChange}
                submitOnChange
              />
            </form>
          ) : (
            <StayUnitsSelect
              travellers={travellers}
              value={unitCount}
              onChange={onUnitsChange}
            />
          )}
        </div>
      </div>
      <div className="border-b border-border px-6 py-3">
        <PriceFilter
          label="Stay price"
          value={priceBand}
          onChange={onPriceBandChange}
        />
      </div>
      {message ? (
        <p className="border-b border-border px-6 py-3 text-sm text-accent">
          {message}
        </p>
      ) : null}
      {stays.length === 0 ? (
        <p className="px-6 py-5 text-sm text-muted">{emptyLabel}</p>
      ) : (
        <ul className="divide-y divide-border">
          {stays.map((stay) => {
            const current = stay.id === selectedId;
            const chosen = stay.id === chosenStayId;
            const closed = isClosed(stay.openStatus);
            const busy = busyFor(stay.id);
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
                    disabled={closed}
                    onClick={() => onSelect(stay.id)}
                    className="min-w-0 flex-1 text-left disabled:cursor-not-allowed"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <p suppressHydrationWarning className="font-medium">
                        {stay.name}
                      </p>
                      <span className="flex shrink-0 items-center gap-2">
                        {showBusy && busy ? <BusyBadge level={busy} /> : null}
                        <OpenBadge status={stay.openStatus} />
                      </span>
                    </div>
                    <p className="mt-1 text-sm text-muted">
                      {stayKindLabel(stay.kind)} · {stay.area} ·{" "}
                      {formatTravelAway(stay.distanceKm)} ·{" "}
                      {stayLayoutLabel(stay)}
                    </p>
                    <p className="mt-1 text-sm">
                      {formatZar(
                        stayTotalCents(stay.nightlyCents, unitCount, stay.nights),
                      )}
                    </p>
                  </button>
                  {chosen || (!closed && current) ? (
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
                          <input type="hidden" name="stayUnits" value={unitCount} />
                          <Button disabled={pending || closed}>
                            {pending ? "Saving…" : "Confirm"}
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
  priceBand,
  onPriceBandChange,
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
  priceBand: PriceBand;
  onPriceBandChange: (band: PriceBand) => void;
  selectedId: string | null;
  pickedIds: string[];
  selectedActivityIds: string[];
  loading: boolean;
  onSelect: (id: string) => void;
  onTogglePick: (id: string) => void;
}) {
  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-card">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border px-6 py-4">
        <h2 className="font-medium">{title}</h2>
        {loading ? <p className="text-sm text-muted">Updating…</p> : null}
      </div>
      <div className="border-b border-border px-6 py-3">
        <PriceFilter
          label={`${title} price`}
          value={priceBand}
          onChange={onPriceBandChange}
        />
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
            const locked = closed;
            return (
              <li key={place.id}>
                <div
                  className={`flex items-start gap-3 px-6 py-4 ${
                    locked
                      ? "opacity-60"
                      : picked || current || inPlan
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
                      {place.area} · {formatTravelAway(place.distanceKm)}
                    </p>
                    {place.kind === "activity" ? (
                      <p className="mt-1 text-sm text-muted">
                        {place.company} · {ticketChannelLabel(place.ticketChannel)}
                      </p>
                    ) : null}
                    <p className="mt-1 text-sm">
                      {place.estimatedCostCents === 0
                        ? "Free"
                        : formatZar(place.estimatedCostCents)}
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
