import { zarToCents } from "../money";
import { stayCapacity, type Stay, type StayKind } from "../../types/stay";

export function stay(
  id: string,
  name: string,
  latitude: number,
  longitude: number,
  company: string,
  area: string,
  kind: StayKind,
  sleeps: number,
  nightlyZar: number,
  note: string,
): Stay {
  const { beds, rooms } = stayCapacity(kind, sleeps);
  return {
    id,
    name,
    latitude,
    longitude,
    company,
    area,
    kind,
    sleeps,
    beds,
    rooms,
    nightlyCents: zarToCents(nightlyZar),
    note,
    operatingHours: "Open 24 hours",
  };
}
