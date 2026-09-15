"use client";

import { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { MAX_ACTIVITY_DISTANCE_KM } from "@backend/lib/geo";
import type { NearbyActivity } from "@backend/types/activity";

type MapCenter = { lat: number; lng: number };

type ItineraryMapProps = {
  center: MapCenter;
  activities: NearbyActivity[];
  selectedId: string | null;
  locateRequest: number;
  onSelect: (activityId: string) => void;
  onCenterChange: (center: MapCenter) => void;
};

function pinIcon(selected: boolean, kind: NearbyActivity["kind"]) {
  const classes = ["hamba-pin"];
  if (kind === "food") {
    classes.push("hamba-pin-food");
  }
  if (selected) {
    classes.push("hamba-pin-selected");
  }

  return L.divIcon({
    className: classes.join(" "),
    html: "<span></span>",
    iconSize: selected ? [22, 28] : [18, 24],
    iconAnchor: selected ? [11, 28] : [9, 24],
  });
}

export default function ItineraryMap({
  center,
  activities,
  selectedId,
  locateRequest,
  onSelect,
  onCenterChange,
}: ItineraryMapProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);
  const markersRef = useRef<L.LayerGroup | null>(null);
  const circleRef = useRef<L.Circle | null>(null);
  const onSelectRef = useRef(onSelect);
  const onCenterChangeRef = useRef(onCenterChange);
  const skipMovesRef = useRef(0);
  const activitiesRef = useRef(activities);

  onSelectRef.current = onSelect;
  onCenterChangeRef.current = onCenterChange;
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
    circleRef.current = L.circle([center.lat, center.lng], {
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
    };
    // First mount only; later pans are handled by events and locateRequest.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    circleRef.current?.setLatLng([center.lat, center.lng]);
  }, [center.lat, center.lng]);

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

    for (const activity of activities) {
      const marker = L.marker([activity.latitude, activity.longitude], {
        icon: pinIcon(activity.id === selectedId, activity.kind),
        title: activity.name,
        riseOnHover: true,
      });

      marker.on("click", () => {
        onSelectRef.current(activity.id);
      });

      marker.addTo(group);
    }
  }, [activities, selectedId]);

  useEffect(() => {
    const map = mapRef.current;
    const selected = activitiesRef.current.find(
      (activity) => activity.id === selectedId,
    );
    if (!map || !selected) {
      return;
    }

    skipMovesRef.current += 1;
    map.panTo([selected.latitude, selected.longitude]);
  }, [selectedId]);

  return (
    <div
      ref={containerRef}
      className="h-[min(32rem,70vh)] w-full overflow-hidden rounded-2xl border border-border"
    />
  );
}
