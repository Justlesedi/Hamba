"use client";

import { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { MAX_STAY_DISTANCE_KM } from "@backend/lib/geo";
import type { QuotedStay } from "@backend/types/stay";

type MapCenter = { lat: number; lng: number };

type StayMapProps = {
  center: MapCenter;
  stays: QuotedStay[];
  selectedId: string | null;
  locateRequest: number;
  onSelect: (stayId: string) => void;
  onCenterChange: (center: MapCenter) => void;
};

function pinIcon(selected: boolean) {
  const classes = ["hamba-pin", "hamba-pin-stay"];
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

export default function StayMap({
  center,
  stays,
  selectedId,
  locateRequest,
  onSelect,
  onCenterChange,
}: StayMapProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);
  const markersRef = useRef<L.LayerGroup | null>(null);
  const circleRef = useRef<L.Circle | null>(null);
  const onSelectRef = useRef(onSelect);
  const onCenterChangeRef = useRef(onCenterChange);
  const skipMovesRef = useRef(0);
  const staysRef = useRef(stays);

  onSelectRef.current = onSelect;
  onCenterChangeRef.current = onCenterChange;
  staysRef.current = stays;

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
      radius: MAX_STAY_DISTANCE_KM * 1000,
      color: "#3d5a80",
      fillColor: "#3d5a80",
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
        icon: pinIcon(stay.id === selectedId),
        title: stay.name,
        riseOnHover: true,
      });

      marker.on("click", () => {
        onSelectRef.current(stay.id);
      });

      marker.addTo(group);
    }
  }, [stays, selectedId]);

  useEffect(() => {
    const map = mapRef.current;
    const selected = staysRef.current.find((stay) => stay.id === selectedId);
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
