export type UserRole = "Student" | "Parent" | "Teacher";

export type userType = {
  id: string;
  email: string;
  fullname: string;
  phone: string;
  password: string;
  role: string;
  age: number;
  gender: string;
  image: string;
  address: string;
  salary: null;
  createdAt: string;
  updatedAt: string;
};

export type childType = {
  id: string;
  userId: string;
  parentId: string;
  classId: string;
  createdAt: string;
  updatedAt: string;
  class: any;
  user: userType;
};

export type parent = {
  id: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
  children: childType[];
};

export type parentType = {
  id: number;
  fullname: string;
  gender: string;
  avatar: string;
  address: string;
  salary: number;
  parent: parent[];
};
