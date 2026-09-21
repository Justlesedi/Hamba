"use client";

import { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { MAX_ACTIVITY_DISTANCE_KM } from "@backend/lib/geo";
import type { NearbyActivity } from "@backend/types/activity";
import type { QuotedStay } from "@backend/types/stay";

type MapCenter = { lat: number; lng: number };
export type PlanSelectionKind = "stay" | "activity";

type ItineraryMapProps = {
  center: MapCenter;
  hub: MapCenter;
  userLocation?: MapCenter | null;
  stays: QuotedStay[];
  activities: NearbyActivity[];
  selectedId: string | null;
  selectedKind: PlanSelectionKind | null;
  pickedActivityIds?: string[];
  locateRequest: number;
  onSelectStay: (stayId: string) => void;
  onSelectActivity: (activityId: string) => void;
  onCenterChange: (center: MapCenter) => void;
};

function pinIcon(
  selected: boolean,
  picked: boolean,
  closed: boolean,
  kind: "stay" | NearbyActivity["kind"],
) {
  const classes = ["hamba-pin"];
  if (kind === "stay") {
    classes.push("hamba-pin-stay");
  } else if (kind === "food") {
    classes.push("hamba-pin-food");
  }
  if (closed) {
    classes.push("hamba-pin-closed");
  }
  if (picked) {
    classes.push("hamba-pin-picked");
  }
  if (selected) {
    classes.push("hamba-pin-selected");
  }

  return L.divIcon({
    className: classes.join(" "),
    html: "<span></span>",
    iconSize: selected || picked ? [22, 28] : [18, 24],
    iconAnchor: selected || picked ? [11, 28] : [9, 24],
  });
}

export default function ItineraryMap({
  center,
  hub,
  userLocation = null,
  stays,
  activities,
  selectedId,
  selectedKind,
  pickedActivityIds = [],
  locateRequest,
  onSelectStay,
  onSelectActivity,
  onCenterChange,
}: ItineraryMapProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);
  const markersRef = useRef<L.LayerGroup | null>(null);
  const circleRef = useRef<L.Circle | null>(null);
  const youRef = useRef<L.Marker | null>(null);
  const onSelectStayRef = useRef(onSelectStay);
  const onSelectActivityRef = useRef(onSelectActivity);
  const onCenterChangeRef = useRef(onCenterChange);
  const skipMovesRef = useRef(0);
  const staysRef = useRef(stays);
  const activitiesRef = useRef(activities);

  onSelectStayRef.current = onSelectStay;
  onSelectActivityRef.current = onSelectActivity;
  onCenterChangeRef.current = onCenterChange;
  staysRef.current = stays;
  activitiesRef.current = activities;

  useEffect(() => {
    if (!containerRef.current || mapRef.current) {
      return;
    }

    const map = L.map(containerRef.current, {
      scrollWheelZoom: true,
    }).setView([center.lat, center.lng], 11);

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "&copy; OpenStreetMap contributors",
      maxZoom: 19,
    }).addTo(map);

    markersRef.current = L.layerGroup().addTo(map);
    circleRef.current = L.circle([hub.lat, hub.lng], {
      radius: MAX_ACTIVITY_DISTANCE_KM * 1000,
      color: "#c45c26",
      fillColor: "#c45c26",
      fillOpacity: 0.06,
      weight: 1.5,
    }).addTo(map);

    map.on("moveend", () => {
      if (skipMovesRef.current > 0) {
        skipMovesRef.current -= 1;
        return;
      }

      const next = map.getCenter();
      onCenterChangeRef.current({ lat: next.lat, lng: next.lng });
    });

    mapRef.current = map;
    requestAnimationFrame(() => map.invalidateSize());

    return () => {
      map.remove();
      mapRef.current = null;
      markersRef.current = null;
      circleRef.current = null;
      youRef.current = null;
    };
    // First mount only; later pans are handled by events and locateRequest.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    circleRef.current?.setLatLng([hub.lat, hub.lng]);
  }, [hub.lat, hub.lng]);

  useEffect(() => {
    const map = mapRef.current;
    if (!map) {
      return;
    }

    if (!userLocation) {
      youRef.current?.remove();
      youRef.current = null;
      return;
    }

    if (!youRef.current) {
      youRef.current = L.marker([userLocation.lat, userLocation.lng], {
        icon: L.divIcon({
          className: "hamba-pin-you",
          html: "<span></span>",
          iconSize: [18, 18],
          iconAnchor: [9, 9],
        }),
        title: "You",
        interactive: false,
        zIndexOffset: 600,
      }).addTo(map);
      return;
    }

    youRef.current.setLatLng([userLocation.lat, userLocation.lng]);
  }, [userLocation]);

  useEffect(() => {
    const map = mapRef.current;
    if (!map || locateRequest === 0) {
      return;
    }

    skipMovesRef.current += 1;
    map.flyTo([center.lat, center.lng], Math.max(map.getZoom(), 11), {
      duration: 0.5,
    });
    // Only fly when the user asks to use their location, not on every pan.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [locateRequest]);

  useEffect(() => {
    const group = markersRef.current;
    if (!group) {
      return;
    }

    group.clearLayers();

    for (const stay of stays) {
      const marker = L.marker([stay.latitude, stay.longitude], {
        icon: pinIcon(
          selectedKind === "stay" && stay.id === selectedId,
          false,
          stay.openStatus.state === "closed",
          "stay",
        ),
        title:
          stay.openStatus.state === "closed"
            ? `${stay.name} (closed)`
            : stay.name,
        interactive: stay.openStatus.state !== "closed",
        riseOnHover: stay.openStatus.state !== "closed",
      });

      marker.on("click", () => {
        if (stay.openStatus.state === "closed") {
          return;
        }
        onSelectStayRef.current(stay.id);
      });

      marker.addTo(group);
    }

    for (const activity of activities) {
      const marker = L.marker([activity.latitude, activity.longitude], {
        icon: pinIcon(
          selectedKind === "activity" && activity.id === selectedId,
          pickedActivityIds.includes(activity.id),
          activity.openStatus.state === "closed",
          activity.kind,
        ),
        title:
          activity.openStatus.state === "closed"
            ? `${activity.name} (closed)`
            : activity.name,
        interactive: activity.openStatus.state !== "closed",
        riseOnHover: activity.openStatus.state !== "closed",
      });

      marker.on("click", () => {
        if (activity.openStatus.state === "closed") {
          return;
        }
        onSelectActivityRef.current(activity.id);
      });

      marker.addTo(group);
    }
  }, [activities, pickedActivityIds, selectedId, selectedKind, stays]);

  useEffect(() => {
    const map = mapRef.current;
    if (!map || !selectedId || !selectedKind) {
      return;
    }

    const stay =
      selectedKind === "stay"
        ? staysRef.current.find((listing) => listing.id === selectedId)
        : null;
    const activity =
      selectedKind === "activity"
        ? activitiesRef.current.find((place) => place.id === selectedId)
        : null;
    const point = stay ?? activity;
    if (!point) {
      return;
    }

    skipMovesRef.current += 1;
    map.panTo([point.latitude, point.longitude]);
  }, [selectedId, selectedKind]);

  return (
    <div
      ref={containerRef}
      className="h-[min(32rem,70vh)] w-full overflow-hidden rounded-2xl border border-border"
    />
  );
}
