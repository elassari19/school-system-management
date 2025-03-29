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
