'use server';

import { API_URL } from '@/lib/functions-helper';
import { cookies } from 'next/headers';

async function getAuthHeaders() {
  const cookieStore = await cookies();
  const token = cookieStore.get('token')?.value;
  const session = cookieStore.get('session')?.value;
  
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };
  
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  } else if (session) {
    headers['Cookie'] = `session=${session}`;
  }
  
  return headers;
}

// fetch all users
export async function countAllUsers(query: {}, target = 'user') {
  try {
    const headers = await getAuthHeaders();
    const response = await fetch(`${API_URL}/${target}/count`, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        query: {
          where: {
            ...query,
          },
        },
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to fetch users');
    }
    const data = await response.json();
    console.log('data', data);
    return data;
  } catch (error) {
    console.log('error', error);
    return;
  }
}
// fetch all users
export async function getAllUsersByRole(role: string) {
  try {
    const headers = await getAuthHeaders();
    const response = await fetch(`${API_URL}/user/count`, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        query: {
          where: {
            role: role,
          },
        },
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to fetch users');
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.log('error', error);
    return;
  }
}

export async function getParentsWithChidren(page: number) {
  const headers = await getAuthHeaders();
  const res = await fetch(`${API_URL}/user/all`, {
    method: 'POST',
    headers,
    body: JSON.stringify({
      query: {
        where: {
          role: 'PARENT',
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
      }
    })
  })
  const data = await res.json();
  return data;
}
