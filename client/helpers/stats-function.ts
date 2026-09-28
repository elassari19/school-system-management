export function calculateStaffStats(
  staff: { status: string; age: number; salary: number; gender: string }[]
) {
  const active = staff.filter((s) => s.status === 'Active').length;
  const male = staff.filter((s) => s.gender === 'Male').length;
  const female = staff.filter((s) => s.gender === 'Female').length;
  const avgAge = staff.length
    ? staff.reduce((total, s) => total + (s.age || 0), 0) / staff.length
    : 0;
  const totalSalary = staff.reduce((total, s) => total + (s.salary || 0), 0);

  return { total: staff.length, active, male, female, avgAge, totalSalary };
}

export function calculateStats(teachers: any[]) {
  const male = teachers.filter((t) => t.gender === 'male');
  const female = teachers.filter((t) => t.gender === 'female');

  return {
    male,
    female,
    maleAverageAge: male.length
      ? male.reduce((total, teacher) => total + (teacher.age || 0), 0) / male.length
      : 0,
    femaleAverageAge: female.length
      ? female.reduce((total, teacher) => total + (teacher.age || 0), 0) / female.length
      : 0,
    total: teachers.length,
  };
}
