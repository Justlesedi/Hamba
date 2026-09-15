export type Trip = {
  id: string;
  userId: string;
  title: string;
  destination: string;
  startDate: Date;
  endDate: Date;
  currency: "ZAR" | string;
  budgetCents: number | null;
  travellers: number;
  createdAt: Date;
  updatedAt: Date;
};

export type CreateTripInput = {
  title: string;
  destination: string;
  startDate: string;
  endDate: string;
  travellers: number;
};
