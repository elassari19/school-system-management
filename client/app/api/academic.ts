import { StudentFormType, TeacherFormType } from '../../lib/zod-schema';
import { countData, createData, getData, getFirstData, updateData } from './services';

// acadimic page
export async function getAcademicCounts() {
  const [totalFemale, totalMale, totalTeachers, totalParents, totalClasses] =
    await Promise.all([
      countData({
        where: {
          role: 'STUDENT',
          gender: 'female',
        },
      }),
      countData({
        where: {
          role: 'STUDENT',
          gender: 'male',
        },
      }),
      countData({
        where: { role: 'TEACHER' },
      }),
      countData({
        where: { role: 'PARENT' },
      }),
      countData({}, 'class'),
    ]);

  return {
    totalFemale,
    totalMale,
    totalTeachers,
    totalParents,
    totalClasses,
  };
}

// student page
export async function getStudentsQuery() {
  return await getData({
    where: { role: 'STUDENT' },
    select: {
      age: true,
      gender: true,
    },
  });
}

export async function getSearchStudentsQuery(page: number, q: string) {
  return await getData({
    where: { role: 'STUDENT', fullname: { contains: q, mode: 'insensitive' } },
    include: {
      student: {
        include: {
          class: true,
          parent: true,
          grade: true,
        },
      },
    },
    skip: page > 0 ? (page - 1) * 5 : 0,
    take: 5,
  });
}

export async function createUserQuery(data: StudentFormType) {
  return await createData({
    email: data.email,
    fullname: data.fullname,
    phone: data.phone,
    password: data.password,
    role: data.role,
    age: parseInt(data.age),
    gender: data.gender,
    address: data.address,
    image: data.image,
    student: {
      create: {
        parentId: data.parent,
        classId: data._class,
      },
    },
  });
}

export async function updateUserQuery(data: StudentFormType, user: string, studentId: string) {
  return await updateData({
    where: {
      id: user,
    },
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
      student: {
        update: {
          where: {
            id: studentId,
          },
          data: {
            parent: {
              connect: {
                id: data.parent,
              },
            },
            class: {
              connect: {
                id: data._class,
              },
            },
          },
        },
      },
    },
    include: {
      student: {
        include: {
          parent: true,
          class: true,
        },
      },
    },
  });
}

export async function getUserQuery(id: string) {
  return await getFirstData({
    where: { id: id },
    include: {
      student: {
        include: {
          parent: true,
          class: true,
        },
      },
    },
  });
}

export async function getParentsQuery() {
  return await getData({
    where: { role: 'PARENT' },
    include: {
      parent: true,
    },
  });
}

export async function getClassesQuery() {
  return await getData(
    {
      select: { id: true, name: true },
    },
    'class'
  );
}

// teacher page
export async function getTeachersQuery() {
  return await getData({
    where: { role: 'TEACHER' },
    select: {
      age: true,
      gender: true,
    },
  });
}

export async function getSearchTeachersQuery(page: number, q: string) {
  return await getData({
    where: { role: 'TEACHER', fullname: { contains: q, mode: 'insensitive' } },
    include: {
      teacher: {
        include: {
          subject: true,
          classes: true,
        },
      },
    },
    skip: page > 0 ? (page - 1) * 5 : 0,
    take: 5,
  });
}

// teacher form
export async function getTeacherSubjectsQuery() {
  return await getData({}, 'subject');
}

export async function getTeacherDetailsQuery(userId: string) {
  return await getFirstData({
    where: { id: userId },
    include: {
      teacher: {
        include: {
          subject: true,
          classes: true,
          education: true,
          experience: true,
        },
      },
    },
  });
}

export async function createTeacherQuery(data: TeacherFormType) {
  return await createData({
    email: data.email,
    fullname: data.fullname,
    phone: data.phone,
    password: data.password,
    role: data.role,
    age: parseInt(data.age),
    gender: data.gender,
    address: data.address,
    salary: parseFloat(data.salary),
    teacher: {
      create: {
        subject: {
          connect: {
            id: data.subject,
          },
        },
      },
    },
  });
}

export async function updateTeacherQuery(
  data: TeacherFormType,
  userId: string,
  teacherId: string
) {
  return await updateData({
    where: {
      id: userId,
    },
    data: {
      email: data.email,
      fullname: data.fullname,
      phone: data.phone,
      password: data.password,
      role: data.role,
      age: parseInt(data.age),
      gender: data.gender,
      address: data.address,
      salary: parseFloat(data.salary),
      teacher: {
        update: {
          where: {
            id: teacherId,
          },
          data: {
            subject: {
              connect: {
                id: data.subject,
              },
            },
          },
        },
      },
    },
    include: {
      teacher: {
        include: {
          subject: true,
        },
      },
    },
  });
}
