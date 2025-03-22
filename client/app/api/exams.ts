'use server';

import { API_URL } from '@/lib/functions-helper';

// Get upcoming exams
export async function getUpcomingExams(classId?: string, subjectId?: string) {
  try {
    const response = await fetch(`${API_URL}/exams/upcoming`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        query: {
          where: {
            date: {
              gte: new Date(),
            },
            ...(classId && { classId }),
            ...(subjectId && { subjectId }),
          },
          include: {
            subject: true,
            class: true,
            teacher: {
              include: {
                user: true,
              },
            },
          },
          orderBy: {
            date: 'asc',
          },
        },
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to fetch upcoming exams');
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching upcoming exams:', error);
    throw error;
  }
}

// Schedule new exam
export async function scheduleExam(data: {
  classId: string;
  subjectId: string;
  teacherId: string;
  title: string;
  description?: string;
  date: string;
  duration: number;
  totalMarks: number;
  examType: 'MIDTERM' | 'FINAL' | 'QUIZ' | 'TEST';
}) {
  try {
    const response = await fetch(`${API_URL}/exams/schedule`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        data: {
          classId: data.classId,
          subjectId: data.subjectId,
          teacherId: data.teacherId,
          title: data.title,
          description: data.description,
          date: new Date(data.date),
          duration: data.duration,
          totalMarks: data.totalMarks,
          examType: data.examType,
        },
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to schedule exam');
    }
    return await response.json();
  } catch (error) {
    console.error('Error scheduling exam:', error);
    throw error;
  }
}

// Get exam results
export async function getExamResults(examId: string) {
  try {
    const response = await fetch(`${API_URL}/exams/results`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        query: {
          where: {
            examId,
          },
          include: {
            student: {
              include: {
                user: true,
              },
            },
            exam: {
              include: {
                subject: true,
              },
            },
          },
        },
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to fetch exam results');
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching exam results:', error);
    throw error;
  }
}

// Record exam result
export async function recordExamResult(data: {
  examId: string;
  studentId: string;
  marksObtained: number;
  remarks?: string;
}) {
  try {
    const response = await fetch(`${API_URL}/exams/record-result`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        data: {
          examId: data.examId,
          studentId: data.studentId,
          marksObtained: data.marksObtained,
          remarks: data.remarks,
        },
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to record exam result');
    }
    return await response.json();
  } catch (error) {
    console.error('Error recording exam result:', error);
    throw error;
  }
}
