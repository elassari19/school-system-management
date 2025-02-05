'use server';

import { getData, fetchData, deleteData } from '@/lib/utils';
import { studentType } from '@/lib/zod-schema';
import { revalidatePath } from 'next/cache';

export async function getAllStudent(page: number = 1, query: any) {
  const student = await getData(`student/all`, 'POST', {
    where: {
      user: {
        fullname: {
          contains: query,
          mode: 'insensitive', // Case-insensitive search
        },
      },
    },
    include: {
      user: true,
      parent: {
        include: { user: { select: { fullname: true, id: true } } },
      },
      class: true,
    },
    skip: page > 0 ? (page - 1) * 5 : 0,
    take: 5,
  });

  if (student.error) {
    console.log('student/find', student);
    return student;
  }

  const count = await getData(`user/count`, 'POST', {
    where: {
      role: 'STUDENT',
      fullname: {
        contains: query,
        mode: 'insensitive', // Case-insensitive search
      },
    },
  });

  if (count.error) {
    console.log('student/count', count);
    return count;
  }

  return { student, count };
}

export async function getStudentByGender(gender: 'male' | 'female') {
  const student = await getData(`student/all`, 'POST', {
    where: { user: { gender: gender } },
    include: {
      user: {
        select: { age: true, gender: true },
      },
    },
  });

  if (student.error) {
    console.log('student/create', student);
    return student;
  }

  const totalAge = student.reduce((sum: number, std: any) => sum + std.user.age, 0);
  const averageAge = student.length ? totalAge / student.length : 0;
  return { length: student.length, average: averageAge };
}

export async function createStudent(data: Omit<studentType, 'id'>) {
  const { _class, parent, image, age, ...rest } = data;

  // create user with role of student
  const user = await fetchData(`user/create`, 'POST', {
    ...rest,
    age: parseInt(age),
  });

  if (user.error) {
    console.log('user/create', user);
    return user;
  }

  revalidatePath('/students', 'page');
  // create and connect user, parent, class to student
  const student = await fetchData(`student/create`, 'POST', {
    classId: _class,
    parentId: parent,
    userId: user.id,
  });

  if (student.error) {
    console.log('student/create', student.error);
    return student;
  }
  console.log('student', student);
  revalidatePath('/students', 'page');
  return student;
}

export async function updateStudent(data: studentType) {
  const { _class, parent, image, age, userId, id, ...rest } = data;

  // update user with role of student
  const user = await fetchData(`user?id=${userId}`, 'PUT', {
    ...rest,
    age: parseInt(age),
  });

  if (user.error) {
    console.log('user/update', user);
    return user;
  }

  // update and connect user, parent, class to student
  const student = await fetchData(`student?id=${id}`, 'PUT', {
    classId: _class,
    parentId: parent,
    userId: userId,
  });

  if (student.error) {
    console.log('student/update', student);
    return student;
  }

  revalidatePath('/students', 'page');
  return student;
}

export async function getAllSubject() {
  const subject = await getData(`subject/all`, 'POST', {
    include: {
      courses: true,
    },
  });

  if (subject.error) {
    console.log('subject/find', subject);
    return subject;
  }
  return subject;
}
