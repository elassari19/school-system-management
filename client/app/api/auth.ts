'use server';

import { deleteCookie, setCookie } from '@/lib/cookies-handler';
import { revalidatePath } from 'next/cache';

interface UserCredentials {
  email: string;
  password: string;
}

interface SignUpCredentials extends UserCredentials {
  fullname: string;
}

const API_URL =
  process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/v1/api';

export async function signInAction(credentials: UserCredentials) {
  try {
    const response = await fetch(`${API_URL}/auth/passport/sign-in`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials),
    });

    if (!response.ok) {
      return { faield: response.statusText };
      throw new Error('Failed to sign in');
    }

    const data = await response.json();
    setCookie('session', data.user);

    return data.user;
  } catch (error) {
    return { error };
  }
}

export async function signUp(credentials: SignUpCredentials) {
  const response = await fetch(`${API_URL}/auth/sign-up`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(credentials),
  });

  if (!response.ok) {
    throw new Error('Failed to sign up');
  }

  const data = await response.json();
  setCookie('token', data.token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
  });

  return data.user;
}

export async function signOut() {
  try {
    const response = await fetch(`${API_URL}/auth/sign-out`, {
      method: 'GET',
    });

    if (!response.ok) {
      console.log('signOut', response.statusText);
    }
    const data = await response.json();
    console.log('signOut', data);

    deleteCookie('session');
    revalidatePath(`/`, 'page');
    return data;
  } catch (error) {
    return 'error';
  }
}
