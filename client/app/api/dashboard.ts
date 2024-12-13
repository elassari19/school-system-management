"use server";

import { API_URL } from "@/lib/functions-helper";

// fetch all users
export async function countAllUsers(query: {}, target = "user") {
  try {
    const response = await fetch(`${API_URL}/${target}/count`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        query: {
          where: {
            ...query,
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
    return data;
  } catch (error) {
    console.log("error", error);
    return;
  }
}

export async function getParentsWithChidren(page: number) {
  const res = await fetch(`${API_URL}/user/all`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      query: {
        where: {
          role: "PARENT",
        },
        include: {
          parent: {
            include: {
              children: {
                include: {
                  class: {
                    select: {
                      name: true,
                    },
                  },
                  user: true,
                },
              },
            },
          },
        },
        skip: page * 5,
        take: 5,
      },
    }),
  });
  const data = await res.json();
  return data;
}

export async function getUsers(query: {}, target = "user") {
  const res = await fetch(`${API_URL}/${target}/all`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      query,
    }),
  });
  const data = await res.json();
  return data;
}
