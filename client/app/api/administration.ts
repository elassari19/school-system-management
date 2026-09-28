import { StaffFormType } from '@/lib/zod-schema';
import { createData, getData, getFirstData, updateData } from './services';

// parents page (real data)
export async function getParentsListQuery() {
  return await getData({
    where: { role: 'PARENT' },
    include: {
      parent: {
        include: {
          children: true,
        },
      },
    },
  });
}

// staff / parent creation & update through the existing user endpoints
export async function getStaffDetailsQuery(id: string) {
  return await getFirstData({
    where: { id },
  });
}

export async function createStaffQuery(data: StaffFormType) {
  return await createData({
    data: {
      email: data.email,
      fullname: data.fullname,
      phone: data.phone,
      password: data.password,
      role: data.role,
      age: parseInt(data.age),
      gender: data.gender,
      address: data.address,
      image: data.image,
      salary: data.salary ? parseFloat(data.salary) : undefined,
    },
  });
}

export async function updateStaffQuery(data: StaffFormType, id: string) {
  return await updateData({
    where: { id },
    data: {
      email: data.email,
      fullname: data.fullname,
      phone: data.phone,
      password: data.password || undefined,
      age: parseInt(data.age),
      gender: data.gender,
      address: data.address,
      image: data.image,
      salary: data.salary ? parseFloat(data.salary) : undefined,
    },
  });
}
