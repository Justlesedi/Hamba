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
    startDate: z.string().min(1, "Start date is required."),
    endDate: z.string().min(1, "End date is required."),
    travellers: z.coerce.number().int().min(1, "At least one traveller."),
    budgetZar: z.preprocess(
      (value) => {
        if (value === "" || value == null) {
          return undefined;
        }
        return value;
      },
      z.coerce.number().min(0, "Budget cannot be negative.").optional(),
    ),
  })
  .refine((data) => data.endDate >= data.startDate, {
    message: "End date must be on or after the start date.",
    path: ["endDate"],
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
        budgetZar?: string[];
      };
      message?: string;
    }
  | undefined;
