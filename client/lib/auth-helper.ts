'use server';

import { cookies } from 'next/headers';

export interface SessionUser {
  id: string;
  email: string;
  fullname: string;
  role: string;
  phone?: string;
  image?: string;
}

export async function getSessionUser(): Promise<SessionUser | null> {
  const cookieStore = await cookies();
  const session = cookieStore.get('session')?.value;
  
  if (!session) return null;
  
  try {
    return JSON.parse(session) as SessionUser;
  } catch {
    return null;
  }
}

export async function requireAuth() {
  const user = await getSessionUser();
  if (!user) return null;
  return user;
}

export async function requireAdmin() {
  const user = await getSessionUser();
  if (!user || user.role !== 'ADMIN') return null;
  return user;
}

export async function hasRole(...roles: string[]) {
  const user = await getSessionUser();
  if (!user) return false;
  return roles.includes(user.role);
}