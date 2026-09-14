import bcrypt from "bcryptjs";
import { db } from "./db";
import type { PublicUser } from "../types/user";

type UserRow = {
  id: string;
  email: string;
  passwordHash: string;
  name: string;
  createdAt: string;
};

function toPublicUser(user: UserRow): PublicUser {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    createdAt: new Date(user.createdAt),
  };
}

export async function hashPassword(password: string) {
  return bcrypt.hash(password, 10);
}

export async function verifyPassword(password: string, passwordHash: string) {
  return bcrypt.compare(password, passwordHash);
}

export function findUserByEmail(email: string) {
  return db
    .prepare("SELECT id, email, passwordHash, name, createdAt FROM users WHERE email = ?")
    .get(email.toLowerCase()) as UserRow | undefined;
}

export function getUserById(id: string): PublicUser | null {
  const user = db
    .prepare("SELECT id, email, passwordHash, name, createdAt FROM users WHERE id = ?")
    .get(id) as UserRow | undefined;

  return user ? toPublicUser(user) : null;
}
