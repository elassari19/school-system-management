export type UserRole = 'Student' | 'Parent' | 'Teacher';

export type childType = {
  id: number;
  fullname: string;
  gender: string;
  avatar: string;
  class: string;
  grade: string;
  attendance: number;
  status: string;
};

export type parentType = {
  id: number;
  fullname: string;
  gender: string;
  avatar: string;
  address: string;
  expenses: number;
  children: childType[];
};
