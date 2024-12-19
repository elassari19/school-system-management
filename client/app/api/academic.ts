"use server";

import { fetchData } from "@/lib/utils";
import { addStudentType } from "@/lib/zod-schema";

export async function createStudent(data: addStudentType) {
  const { _class, parent, image, age, ...rest } = data;

  // create user with role of student
  const user = await fetchData(`user/create`, "POST", {
    ...rest,
    age: parseInt(age),
  });

  if (user.error) {
    console.log("user/create", user.error);
    return user.error;
  }

  // create and connect user, parent, class to student
  const student = await fetchData(`student/create`, "POST", {
    classId: _class,
    parentId: parent,
    userId: user.id,
  });

  if (student.error) {
    console.log("student/create", student.error);
    return student.error;
  }

  return student;
}

export async function getAllStudent(page: number, query: any) {
  const student = await fetchData(`student/all`, "POST", {
    where: {
      user: {
        fullname: {
          contains: query,
          mode: "insensitive", // Case-insensitive search
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
    skip: page ? 5 * page : 0,
    take: 5,
  });

  if (student.error) {
    console.log("student/find", student.error);
    return student.error;
  }

  const count = await fetchData(`user/count`, "POST", {
    where: {
      role: "STUDENT",
      fullname: {
        contains: query,
        mode: "insensitive", // Case-insensitive search
      },
    },
  });

  if (count.error) {
    console.log("student/count", count.error);
    return count.error;
  }

  return { student, count };
}

export async function getStudentByGender(gender: "male" | "female") {
  const student = await fetchData(`student/all`, "POST", {
    where: { user: { gender: gender } },
    include: {
      user: {
        select: { age: true, gender: true },
      },
    },
  });

  if (student.error) {
    console.log("student/create", student.error);
    return student.error;
  }

  const totalAge = student.reduce((sum: number, std: any) => sum + std.user.age, 0);
  const averageAge = student.length ? totalAge / student.length : 0;
  return { length: student.length, average: averageAge };
}
