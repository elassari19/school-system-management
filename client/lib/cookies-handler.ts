'use server';

import { cookies } from 'next/headers';

// Set a cookie
export async function setCookie(key: string, value: any, options = {}) {
  (await cookies()).set(key, value, {
    maxAge: 30 * 24 * 60 * 60, // 30 days by default
    path: '/',
    ...options,
  });
}

// Get a cookie
export async function getCookie(key: string) {
  const cookie = (await cookies()).get(key)?.value;
  console.log('cookie', cookie);
  return cookie;
}

// Delete a cookie
export async function deleteCookie(key: string) {
  return (await cookies()).delete(key);
}
