"use server";

import { redirect } from "next/navigation";
import { AuthError, authenticateUser, registerUser } from "@backend/server/users";
import {
  requestPasswordReset,
  requestUsernameReminder,
  resetPasswordWithToken,
} from "@backend/server/recovery";
import {
  ACCOUNT_EXISTS_LOGIN_PATH,
  ACCOUNT_RECOVERED_LOGIN_PATH,
  RECOVERY,
} from "@backend/lib/security";
import {
  recoverEmailSchema,
  recoverPasswordSchema,
  resetPasswordSchema,
  signInSchema,
  signUpSchema,
  type RecoverEmailFormState,
  type RecoverPasswordFormState,
  type ResetPasswordFormState,
  type SignInFormState,
  type SignUpFormState,
} from "@backend/lib/validation";
import { requestIp, requestOrigin } from "@/lib/client-ip";
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
      redirect(ACCOUNT_EXISTS_LOGIN_PATH);
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
    const user = await authenticateUser(parsed.data, await requestIp());
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

export async function recoverPassword(
  _state: RecoverPasswordFormState,
  formData: FormData,
): Promise<RecoverPasswordFormState> {
  const parsed = recoverPasswordSchema.safeParse({
    email: formData.get("email"),
  });

  if (!parsed.success) {
    return { errors: parsed.error.flatten().fieldErrors };
  }

  try {
    await requestPasswordReset({
      email: parsed.data.email,
      origin: await requestOrigin(),
      ip: await requestIp(),
    });
  } catch (error) {
    if (error instanceof AuthError) {
      return { message: error.message };
    }
    return { message: "Could not start recovery. Please try again." };
  }

  redirect("/recover/sent?for=password");
}

export async function recoverEmail(
  _state: RecoverEmailFormState,
  formData: FormData,
): Promise<RecoverEmailFormState> {
  const parsed = recoverEmailSchema.safeParse({
    name: formData.get("name"),
  });

  if (!parsed.success) {
    return { errors: parsed.error.flatten().fieldErrors };
  }

  try {
    await requestUsernameReminder({
      name: parsed.data.name,
      ip: await requestIp(),
    });
  } catch (error) {
    if (error instanceof AuthError) {
      return { message: error.message };
    }
    return { message: "Could not start recovery. Please try again." };
  }

  redirect("/recover/sent?for=email");
}

export async function resetPassword(
  _state: ResetPasswordFormState,
  formData: FormData,
): Promise<ResetPasswordFormState> {
  const parsed = resetPasswordSchema.safeParse({
    token: formData.get("token"),
    password: formData.get("password"),
    confirm: formData.get("confirm"),
  });

  if (!parsed.success) {
    return { errors: parsed.error.flatten().fieldErrors };
  }

  try {
    await resetPasswordWithToken(parsed.data);
    await deleteSession();
  } catch (error) {
    if (error instanceof AuthError) {
      return { message: error.message };
    }
    return { message: RECOVERY.expiredMessage };
  }

  redirect(ACCOUNT_RECOVERED_LOGIN_PATH);
}
