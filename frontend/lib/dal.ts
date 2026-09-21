import { cache } from "react";
import { connection } from "next/server";
import { redirect } from "next/navigation";
import { getUserById } from "@backend/server/users";
import { readSession } from "./session";

export const verifySession = cache(async () => {
  await connection();
  const session = await readSession();

  if (!session?.userId) {
    redirect("/sign-in");
  }

  return { userId: session.userId };
});

export const getCurrentUser = cache(async () => {
  const { userId } = await verifySession();
  const user = await getUserById(userId);

  if (!user) {
    redirect("/sign-in");
  }

  return user;
});

export const getOptionalUser = cache(async () => {
  await connection();
  const session = await readSession();
  if (!session?.userId) {
    return null;
  }

  return getUserById(session.userId);
});
