import { z } from "zod";

export const signUpSchema = z.object({
  name: z.string().trim().min(2, "Name must be at least 2 characters."),
  email: z.string().trim().email("Enter a valid email address."),
  password: z.string().min(8, "Password must be at least 8 characters."),
});

export const signInSchema = z.object({
  email: z.string().trim().email("Enter a valid email address."),
  password: z.string().min(1, "Password is required."),
});

export const nearbyActivitiesSchema = z.object({
  lat: z
    .string()
    .trim()
    .min(1, "Latitude is required.")
    .transform(Number)
    .refine((value) => Number.isFinite(value) && value >= -90 && value <= 90, {
      message: "Latitude is invalid.",
    }),
  lng: z
    .string()
    .trim()
    .min(1, "Longitude is required.")
    .transform(Number)
    .refine(
      (value) => Number.isFinite(value) && value >= -180 && value <= 180,
      { message: "Longitude is invalid." },
    ),
});

export const createTripSchema = z
  .object({
    title: z.string().trim().min(2, "Give this trip a name."),
    destination: z.string().trim().min(2, "Enter a destination."),
    startDate: z.string().min(1, "Departure date is required."),
    endDate: z.string().min(1, "Return date is required."),
    travellers: z.preprocess(
      (value) => (value == null ? value : String(value).replace(/\D/g, "")),
      z.string().regex(/^[1-9]\d*$/, "Travellers must be a whole number.").transform(Number),
    ),
  })
  .refine((data) => data.endDate >= data.startDate, {
    message: "Return date must be on or after the departure date.",
    path: ["endDate"],
  });

export const budgetForecastSchema = z.object({
  budgetZar: z.preprocess((value) => {
    if (value == null || String(value).trim() === "") {
      return undefined;
    }
    return String(value).replace(/\D/g, "");
  }, z.union([
    z.undefined(),
    z.string().regex(/^[1-9]\d*$/, "Enter a whole number in rands.").transform(Number),
  ])),
});

export type SignUpFormState =
  | {
      errors?: {
        name?: string[];
        email?: string[];
        password?: string[];
      };
      message?: string;
    }
  | undefined;

export type SignInFormState =
  | {
      errors?: {
        email?: string[];
        password?: string[];
      };
      message?: string;
    }
  | undefined;

export type CreateTripFormState =
  | {
      errors?: {
        title?: string[];
        destination?: string[];
        startDate?: string[];
        endDate?: string[];
        travellers?: string[];
      };
      message?: string;
    }
  | undefined;

export const chooseStaySchema = z.object({
  tripId: z.string().trim().min(1, "Trip is missing."),
  stayId: z.string().trim(),
});

export type BudgetForecastFormState =
  | {
      errors?: {
        budgetZar?: string[];
      };
      message?: string;
      forecast?: import("../types/budget").BudgetForecast;
    }
  | undefined;

export type ChooseStayFormState =
  | {
      message?: string;
      selectedStayId?: string | null;
    }
  | undefined;

export const togglePlaceSchema = z.object({
  tripId: z.string().trim().min(1, "Trip is missing."),
  activityId: z.string().trim().min(1, "Place is missing."),
});

export const updatePlacesSchema = z.object({
  tripId: z.string().trim().min(1, "Trip is missing."),
  intent: z.enum(["add", "remove"]),
  activityIds: z
    .array(z.string().trim().min(1, "Place is missing."))
    .min(1, "Choose at least one place."),
});

export type TogglePlaceFormState =
  | {
      message?: string;
      selectedActivityIds?: string[];
    }
  | undefined;

export const createBookingSchema = z.object({
  tripId: z.string().trim().min(1, "Trip is missing."),
  stayId: z.string().trim().min(1, "Choose a stay to book."),
  activityIds: z.array(z.string().trim().min(1)).default([]),
});

export const chooseFlightsSchema = z.object({
  tripId: z.string().trim().min(1, "Trip is missing."),
  outboundFlightId: z.string().trim(),
  returnFlightId: z.string().trim(),
});

export type ChooseFlightsFormState =
  | {
      message?: string;
      outboundFlightId?: string | null;
      returnFlightId?: string | null;
    }
  | undefined;

export const cancelBookingSchema = z.object({
  bookingId: z.string().trim().min(1, "Booking is missing."),
});

export type CreateBookingFormState =
  | {
      errors?: {
        stayId?: string[];
        activityIds?: string[];
      };
      message?: string;
    }
  | undefined;

export type CancelBookingFormState =
  | {
      message?: string;
    }
  | undefined;
