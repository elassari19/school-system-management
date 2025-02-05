'use server';

import { revalidatePath } from 'next/cache';
import { deleteData } from '@/lib/utils';
import { headers } from 'next/headers';

export async function deleteUser(userId: string) {
  const headersList = headers();
  const pathname = (await headersList).get('x-pathname') || '/';
  console.log('pathname', pathname);
  const user = await deleteData(`user?id=${userId}`);
  if (user.error) {
    console.log(`delete`, user);
    return user;
  }
  revalidatePath(pathname, 'page');
  return user;
}
