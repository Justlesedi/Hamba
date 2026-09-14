// Stay search/booking provider (LiteAPI / partner) — Phase 2.

export type StaySearchQuery = {
  destination: string;
  checkIn: string;
  checkOut: string;
  guests: number;
};

export async function searchStays(_query: StaySearchQuery) {
  return [];
}
