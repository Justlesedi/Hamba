import type { PlaceKind } from "./activity";

export type TransportMode = "uber" | "bus" | "fuel" | "none";
export type BookingStatus = "confirmed" | "cancelled";

export type BookingPlace = {
  activityId: string;
  name: string;
  kind: PlaceKind;
  company: string;
  area: string;
  amountCents: number;
  sortOrder: number;
};

export type Booking = {
  id: string;
  userId: string;
  tripId: string;
  tripTitle: string;
  destination: string;
  startDate: Date;
  endDate: Date;
  travellers: number;
  stayId: string | null;
  stayName: string;
  stayArea: string;
  stayTotalCents: number;
  outbound: {
    id: string;
    label: string;
    amountCents: number;
  } | null;
  inbound: {
    id: string;
    label: string;
    amountCents: number;
  } | null;
  flightTotalCents: number;
  transportMode: TransportMode;
  transportCents: number;
  placesTotalCents: number;
  commissionCents: number;
  totalCents: number;
  status: BookingStatus;
  places: BookingPlace[];
  createdAt: Date;
  updatedAt: Date;
};
