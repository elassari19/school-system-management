"use server";

import { API_URL } from "@/lib/functions-helper";
import { addStudentType } from "@/lib/zod-schema";

export async function createStudent(data: addStudentType) {
  const { _class, parent, image, age, ...rest } = data;

  // create user with role of student
  const res = await fetch(`${API_URL}/user/create`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      ...rest,
      age: parseInt(age),
    }),
  });

  // check if user was created
  if (!res.ok) {
    console.log("error", res);
    return { error: res.statusText };
  }
  const user = await res.json();

  // create and connect user, parent, class to student
  const student = await fetch(`${API_URL}/student/create`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      classId: _class,
      parentId: parent,
      userId: user.id,
    }),
  });

  // check if student was created
  if (!student.ok) {
    return { error: res.statusText };
  }
  const result = await student.json();

  return result;
}
