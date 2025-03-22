import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { API_URL } from '@/lib/functions-helper';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Fetches data from the specified API endpoint using the provided HTTP method and query parameters.
 *
 * @param target - The target endpoint of the API to send the request to.
 * @param method - The HTTP method to use for the request (e.g., 'GET', 'POST').
 * @param query - An object representing the query parameters or request body data to be sent.
 *
 * @returns A promise that resolves to the response data if the request is successful, or an error object if the request fails.
 */
export const getData = async (target: string, method: string, query: any) => {
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

/**
 * Fetches data from the API endpoint
 * @param target - The API endpoint target path
 * @param method - The HTTP method to use (GET, POST, etc.)
 * @param query - The query parameters or body data to send
 * @returns Promise containing the response data or error object
 */
export const fetchData = async (target: string, method: string, query: any) => {
  // Make API request with provided parameters
  const resp = await fetch(`${API_URL}/${target}`, {
    method,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(query),
  });

  // Check if response was successful
  if (!resp.ok) {
    return { error: resp.statusText };
  }

  // Parse and return JSON response
  const data = await resp.json();
  return data;
};

/**
 * Deletes data from the specified API endpoint.
 * @param target - The target endpoint of the API to send the DELETE request to.
 * @returns A promise that resolves to the response data if the request is successful, or an error object if the request fails.
 */
export async function deleteData(target: string) {
  const response = await fetch(`${API_URL}/${target}`, {
    method: 'DELETE',
    headers: { 'Content-Type': 'application/json' },
  });

  if (!response.ok) {
    return { error: response.statusText };
  }
  const data = await response.json();
  return data;
}
