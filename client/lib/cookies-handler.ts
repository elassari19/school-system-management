'use server';

import { cookies } from 'next/headers';

// Set a cookie
export async function setCookie(key: string, value: any, options = {}) {
  const cookieStore = await cookies();
  cookieStore.set(key, value, {
    maxAge: 30 * 24 * 60 * 60, // 30 days by default
    path: '/',
    ...options,
  });
}

// Get a cookie
export async function getCookie(key: string) {
  const cookieStore = await cookies();
  const cookie = cookieStore.get(key)?.value;
  console.log('cookie', cookie);
  return cookie;
}

// Delete a cookie
export async function deleteCookie(key: string) {
  const cookieStore = await cookies();
  return cookieStore.delete(key);
}
