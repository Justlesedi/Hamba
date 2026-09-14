"use server";

import { redirect } from "next/navigation";
import { AuthError, authenticateUser, registerUser } from "@backend/server/users";
import {
  signInSchema,
  signUpSchema,
  type SignInFormState,
  type SignUpFormState,
} from "@backend/lib/validation";
import { createSession, deleteSession } from "@/lib/session";

export async function signUp(
  _state: SignUpFormState,
  formData: FormData,
): Promise<SignUpFormState> {
  const parsed = signUpSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    password: formData.get("password"),
  });

  if (!parsed.success) {
    return { errors: parsed.error.flatten().fieldErrors };
  }

  try {
    const user = await registerUser(parsed.data);
    await createSession(user.id);
  } catch (error) {
    if (error instanceof AuthError && error.code === "EMAIL_TAKEN") {
      return { errors: { email: [error.message] } };
    }
    return { message: "Could not create your account. Please try again." };
  }

  redirect("/trips");
}

export async function signIn(
  _state: SignInFormState,
  formData: FormData,
): Promise<SignInFormState> {
  const parsed = signInSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });

  if (!parsed.success) {
    return { errors: parsed.error.flatten().fieldErrors };
  }

  try {
    const user = await authenticateUser(parsed.data);
    await createSession(user.id);
  } catch (error) {
    if (error instanceof AuthError) {
      return { message: error.message };
    }
    return { message: "Could not sign you in. Please try again." };
  }

  redirect("/trips");
}

export async function signOut() {
  await deleteSession();
  redirect("/");
}
