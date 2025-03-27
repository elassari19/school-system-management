'use server';

import { API_URL } from '@/lib/functions-helper';
import { revalidatePath } from 'next/cache';

export async function getData(query: {}, target = 'user') {
  const res = await fetch(`${API_URL}/${target}/all`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(query),
  });
  const data = await res.json();
  return data;
}

export async function getFirstData(query: {}, target = 'user') {
  const res = await fetch(`${API_URL}/${target}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(query),
  });
  const data = await res.json();
  return data;
}

export async function updateData(query: {}, target = 'user') {
  const res = await fetch(`${API_URL}/${target}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(query),
  });

  revalidatePath(`/`, 'page');
  const data = await res.json();
  return data;
}

export async function createData(query: {}, target = 'user') {
  const res = await fetch(`${API_URL}/${target}/create`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(query),
  });

  revalidatePath(`/`, 'page');
  const data = await res.json();
  return data;
}

export async function deleteData(query: {}, target = 'user') {
  const res = await fetch(`${API_URL}/${target}`, {
    method: 'DELETE',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(query),
  });

  revalidatePath(`/`, 'page');
  const data = await res.json();
  return data;
}
