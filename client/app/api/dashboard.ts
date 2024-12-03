"use server";

import { API_URL } from "@/lib/functions-helper";

// fetch all users
export async function getAllUsers() {
  try {
    const response = await fetch(`${API_URL}/user/count`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        query: {
          where: {
            role: "TEACHER",
          },
        },
      }),
    });

    if (!response.ok) {
      throw new Error("Failed to fetch users");
    }
    const data = await response.json();
    console.log("data", data);
    return data;
  } catch (error) {
    console.log("error", error);
    return;
  }
}
// fetch all users
export async function getAllUsersByRole(role: string) {
  try {
    const response = await fetch(`${API_URL}/user/count`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        query: {
          where: {
            role: role,
          },
        },
      }),
    });

    if (!response.ok) {
      throw new Error("Failed to fetch users");
    }
    const data = await response.json();
    console.log("data", data);
    return data;
  } catch (error) {
    console.log("error", error);
    return;
  }
}
