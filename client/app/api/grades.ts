'use server';

import { API_URL } from '@/lib/functions-helper';

// Get student grades
export async function getStudentGrades(studentId: string, subjectId?: string, term?: string) {
  try {
    const response = await fetch(`${API_URL}/grades/student`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        query: {
          where: {
            studentId,
            ...(subjectId && { subjectId }),
            ...(term && { term }),
          },
          include: {
            subject: true,
            student: {
              include: {
                user: true,
                class: true,
              },
            },
          },
        },
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to fetch student grades');
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching student grades:', error);
    throw error;
  }
}

// Record or update student grade
export async function recordGrade(data: {
  studentId: string;
  subjectId: string;
  grade: number;
  term: string;
  assessmentType: 'EXAM' | 'QUIZ' | 'ASSIGNMENT';
  date: string;
  comments?: string;
}) {
  try {
    const response = await fetch(`${API_URL}/grades/record`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        data: {
          studentId: data.studentId,
          subjectId: data.subjectId,
          grade: data.grade,
          term: data.term,
          assessmentType: data.assessmentType,
          date: new Date(data.date),
          comments: data.comments,
        },
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to record grade');
    }
    return await response.json();
  } catch (error) {
    console.error('Error recording grade:', error);
    throw error;
  }
}

// Get class performance statistics
export async function getClassPerformance(classId: string, subjectId?: string, term?: string) {
  try {
    const response = await fetch(`${API_URL}/grades/class-stats`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        query: {
          where: {
            student: {
              classId,
            },
            ...(subjectId && { subjectId }),
            ...(term && { term }),
          },
          include: {
            subject: true,
            student: {
              include: {
                user: true,
              },
            },
          },
        },
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to fetch class performance statistics');
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching class performance:', error);
    throw error;
  }
}
