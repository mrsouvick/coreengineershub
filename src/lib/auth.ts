import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';

const DEFAULT_SECRET = 'core_engineers_hub_super_secret_key_987654321!';
const JWT_SECRET = process.env.JWT_SECRET || DEFAULT_SECRET;

if (process.env.NODE_ENV === 'production' && JWT_SECRET === DEFAULT_SECRET) {
  console.warn(
    'SECURITY WARNING: Using default JWT secret in production. Make sure to define JWT_SECRET in environment configuration.'
  );
}

const COOKIE_NAME = 'admin_session';

export interface AdminSession {
  id: string;
  username: string;
}

export function signToken(payload: AdminSession): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' });
}

export function verifyToken(token: string): AdminSession | null {
  try {
    return jwt.verify(token, JWT_SECRET) as AdminSession;
  } catch (e) {
    return null;
  }
}

export async function getSession(): Promise<AdminSession | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;
  if (!token) return null;
  return verifyToken(token);
}

export async function setSession(token: string) {
  const cookieStore = await cookies();
  cookieStore.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 60 * 60 * 24 * 7, // 7 days
    path: '/',
  });
}

export async function clearSession() {
  const cookieStore = await cookies();
  cookieStore.delete(COOKIE_NAME);
}
