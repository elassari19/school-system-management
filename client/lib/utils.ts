import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { API_URL } from '@/lib/functions-helper';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const fetchData = async (target: string, method: string, query: any) => {
  const resp = await fetch(`${API_URL}/${target}`, {
    method,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      // manipulate the query object to select specific data
      query,
    }),
  });

  if (!resp.ok) {
    return { error: resp.statusText };
  }
  const data = await resp.json();
  return data;
};

export const updateData = async (target: string, method: string, query: any) => {
  const resp = await fetch(`${API_URL}/${target}`, {
    method,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(query),
  });
  if (!resp.ok) {
    return { error: resp.statusText };
  }
  const data = await resp.json();
  return data;
};
