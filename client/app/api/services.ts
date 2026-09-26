'use server';

import { API_URL } from '@/lib/functions-helper';
import { revalidatePath } from 'next/cache';
import {
  transformPrismaToTypeORM,
  transformUpdateQuery,
  transformCreateQuery,
  transformDeleteQuery,
  PrismaQuery,
} from './query-transformer';

const WHERE_BASED_TARGETS = ['user', 'class'];
const ID_BASED_TARGETS = ['student', 'teacher'];

function buildUpdateBody(query: PrismaQuery, target: string) {
  if (!query.where) {
    throw new Error('Update query must include a where clause');
  }
  const updateQuery = { ...query, where: query.where } as PrismaQuery & { where: Record<string, unknown> };
  const transformed = transformUpdateQuery(updateQuery);
  if (WHERE_BASED_TARGETS.includes(target)) {
    return { where: transformed.where, ...transformed.data };
  }
  return { id: transformed.where?.id, ...transformed.data };
}

function buildDeleteBody(query: PrismaQuery, target: string) {
  const transformed = transformDeleteQuery(query);
  if (WHERE_BASED_TARGETS.includes(target)) {
    return { where: transformed.where };
  }
  return { id: transformed.where?.id };
}

export async function countData(query: Record<string, unknown>, target = 'user') {
  const transformedQuery = transformPrismaToTypeORM(query);
  const res = await fetch(`${API_URL}/${target}/count`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(transformedQuery),
  });
  const data = await res.json();
  return data;
}

export async function getData(query: Record<string, unknown>, target = 'user') {
  const transformedQuery = transformPrismaToTypeORM(query);
  const params = new URLSearchParams();
  if (transformedQuery.where) params.append('where', JSON.stringify(transformedQuery.where));
  if (transformedQuery.relations) params.append('relations', JSON.stringify(transformedQuery.relations));
  if (transformedQuery.select) params.append('select', JSON.stringify(transformedQuery.select));
  if (transformedQuery.skip) params.append('skip', String(transformedQuery.skip));
  if (transformedQuery.take) params.append('take', String(transformedQuery.take));
  if (transformedQuery.order) params.append('order', JSON.stringify(transformedQuery.order));
  
  const res = await fetch(`${API_URL}/${target}/all?${params.toString()}`, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
  });
  const data = await res.json();
  return data;
}

export async function getFirstData(query: Record<string, unknown>, target = 'user') {
  const transformedQuery = transformPrismaToTypeORM(query);
  const params = new URLSearchParams();
  if (transformedQuery.where) params.append('where', JSON.stringify(transformedQuery.where));
  if (transformedQuery.relations) params.append('relations', JSON.stringify(transformedQuery.relations));
  if (transformedQuery.select) params.append('select', JSON.stringify(transformedQuery.select));
  
  const res = await fetch(`${API_URL}/${target}?${params.toString()}`, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
  });
  const data = await res.json();
  return data;
}

export async function updateData(query: PrismaQuery, target = 'user') {
  const body = buildUpdateBody(query, target);
  const res = await fetch(`${API_URL}/${target}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });

  revalidatePath(`/`, 'page');
  const data = await res.json();
  return data;
}

export async function createData(query: PrismaQuery, target = 'user') {
  const transformedQuery = transformCreateQuery(query);
  const res = await fetch(`${API_URL}/${target}/create`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(transformedQuery.data),
  });

  revalidatePath(`/`, 'page');
  const data = await res.json();
  return data;
}

export async function deleteData(query: PrismaQuery, target = 'user') {
  const body = buildDeleteBody(query, target);
  const res = await fetch(`${API_URL}/${target}`, {
    method: 'DELETE',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });

  revalidatePath(`/`, 'page');
  const data = await res.json();
  return data;
}
