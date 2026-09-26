'use server';

import { API_URL } from '@/lib/functions-helper';
import { cookies } from 'next/headers';
import { transformPrismaToTypeORM, PrismaQuery, TypeORMQuery } from './query-transformer';

async function getAuthHeaders() {
  const cookieStore = await cookies();
  const token = cookieStore.get('token')?.value;
  const session = cookieStore.get('session')?.value;
  
  console.log('Auth cookies:', { token: !!token, session: !!session });
  
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

function buildQueryString(transformedQuery: TypeORMQuery) {
  const params = new URLSearchParams();
  if (transformedQuery.where) params.append('where', JSON.stringify(transformedQuery.where));
  if (transformedQuery.relations) params.append('relations', JSON.stringify(transformedQuery.relations));
  if (transformedQuery.select) params.append('select', JSON.stringify(transformedQuery.select));
  if (transformedQuery.skip) params.append('skip', String(transformedQuery.skip));
  if (transformedQuery.take) params.append('take', String(transformedQuery.take));
  if (transformedQuery.order) params.append('order', JSON.stringify(transformedQuery.order));
  return params.toString();
}

// fetch all users
export async function countAllUsers(query: Record<string, unknown>, target = 'user') {
  try {
    const headers = await getAuthHeaders();
    const transformedQuery = transformPrismaToTypeORM(query);
    const response = await fetch(`${API_URL}/${target}/count`, {
      method: 'POST',
      headers,
      body: JSON.stringify(transformedQuery),
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
    const transformedQuery = transformPrismaToTypeORM({ where: { role } });
    console.log('Fetching users by role:', role, 'with headers:', Object.keys(headers));
    const response = await fetch(`${API_URL}/user/count`, {
      method: 'POST',
      headers,
      body: JSON.stringify(transformedQuery),
    });

    console.log('Response status:', response.status, response.statusText);
    if (!response.ok) {
      const errorText = await response.text();
      console.error('Error response:', errorText);
      throw new Error(`Failed to fetch users: ${response.status} ${response.statusText}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching users:', error);
    return;
  }
}

export async function getParentsWithChildren(page: number) {
  const headers = await getAuthHeaders();
  const prismaQuery: PrismaQuery = {
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
  };
  
  const transformedQuery = transformPrismaToTypeORM(prismaQuery);
  const queryString = buildQueryString(transformedQuery);
  
  const res = await fetch(`${API_URL}/user/all?${queryString}`, {
    method: 'GET',
    headers,
  });
  const data = await res.json();
  return data;
}
