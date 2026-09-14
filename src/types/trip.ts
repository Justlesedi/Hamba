export type ItemType = "STAY" | "FLIGHT" | "ACTIVITY" | "TRANSPORT" | "NOTE";
export type ItemStatus = "PLANNED" | "BOOKED" | "PAID" | "CANCELLED";
export type BudgetCategory = "STAY" | "TRANSPORT" | "ACTIVITY" | "MISC";

export type Trip = {
  id: string;
  title: string;
  destination: string;
  startDate: string;
  endDate: string;
  currency: "ZAR";
  budgetCents: number | null;
  travellers: number;
};

export type ItineraryItem = {
  id: string;
  tripId: string;
  type: ItemType;
  status: ItemStatus;
  title: string;
  startsAt: string | null;
  endsAt: string | null;
  location: string | null;
  plannedCents: number;
  actualCents: number | null;
};
