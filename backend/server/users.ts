import { randomUUID } from "node:crypto";
import { db } from "../lib/db";
import { findUserByEmail, getUserById, hashPassword, verifyPassword } from "../lib/auth";
import type { PublicUser, SignInInput, SignUpInput } from "../types/user";

export { getUserById };

export class AuthError extends Error {
  constructor(
    message: string,
    readonly code: "EMAIL_TAKEN" | "INVALID_CREDENTIALS",
  ) {
    super(message);
    this.name = "AuthError";
  }
}

export async function registerUser(input: SignUpInput): Promise<PublicUser> {
  const email = input.email.toLowerCase();

  if (findUserByEmail(email)) {
    throw new AuthError("An account with this email already exists.", "EMAIL_TAKEN");
  }

  const now = new Date().toISOString();
  const id = randomUUID();

  db.prepare(
    `INSERT INTO users (id, email, passwordHash, name, createdAt, updatedAt)
     VALUES (?, ?, ?, ?, ?, ?)`,
  ).run(id, email, await hashPassword(input.password), input.name.trim(), now, now);

  return {
    id,
    name: input.name.trim(),
    email,
    createdAt: new Date(now),
  };
}

export async function authenticateUser(input: SignInInput): Promise<PublicUser> {
  const user = findUserByEmail(input.email);

  if (!user || !(await verifyPassword(input.password, user.passwordHash))) {
    throw new AuthError("Incorrect email or password.", "INVALID_CREDENTIALS");
  }

  return {
    id: user.id,
    name: user.name,
    email: user.email,
    createdAt: new Date(user.createdAt),
  };
}
