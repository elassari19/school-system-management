"use server";

import { deleteCookie, setCookie } from "@/lib/cookies-handler";
import { API_URL } from "@/lib/functions-helper";
import { revalidatePath } from "next/cache";

interface UserCredentials {
  email: string;
  password: string;
}

interface SignUpCredentials extends UserCredentials {
  fullName: string;
  confirmPassword: string;
  role?: string;
}

export async function signInAction(credentials: UserCredentials) {
  try {
    const response = await fetch(`${API_URL}/auth/signin`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(credentials),
    });

    if (!response.ok) {
      return { failed: response.statusText };
    }

    const data = await response.json();
    await setCookie("token", data.accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
    });
    await setCookie("session", JSON.stringify(data.user));

    return data.user;
  } catch (error) {
    return { error };
  }
}

export async function signUpAction(credentials: SignUpCredentials) {
  const { fullName, role, ...rest } = credentials;
  const response = await fetch(`${API_URL}/auth/signup`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      ...rest,
      fullname: fullName,
      role: (role || "parent").toUpperCase(),
    }),
  });

  if (!response.ok) {
    throw new Error("Failed to sign up");
  }

  // Automatically sign in so the session/token cookies are set
  return signInAction({ email: credentials.email, password: credentials.password });
}

export async function signOut() {
  await deleteCookie("session");
  await deleteCookie("token");
  revalidatePath(`/`, "page");
  return { success: true };
}
