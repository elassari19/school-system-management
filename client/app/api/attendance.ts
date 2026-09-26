'use server';

import { API_URL } from '@/lib/functions-helper';
import { transformPrismaToTypeORM, PrismaQuery } from './query-transformer';

function transformQueryForCustomEndpoint(query: PrismaQuery) {
  const transformed = transformPrismaToTypeORM(query);
  return { query: transformed };
}

// Get attendance records for a specific date range
export async function getAttendanceRecords(
  startDate: string,
  endDate: string,
  classId?: string
) {
  try {
    const prismaQuery = {
      where: {
        date: {
          gte: new Date(startDate),
          lte: new Date(endDate),
        },
        ...(classId && { classId }),
      },
      include: {
        student: {
          include: {
            user: true,
            class: true,
          },
        },
      },
    };

    const response = await fetch(`${API_URL}/attendance/records`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(transformQueryForCustomEndpoint(prismaQuery)),
    });

    if (!response.ok) {
      throw new Error('Failed to fetch attendance records');
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching attendance records:', error);
    throw error;
  }
}

// Mark student attendance
export async function markAttendance(data: {
  studentId: string;
  date: string;
  status: 'PRESENT' | 'ABSENT' | 'LATE';
  note?: string;
}) {
  try {
    const response = await fetch(`${API_URL}/attendance/mark`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        data: {
          studentId: data.studentId,
          date: new Date(data.date),
          status: data.status,
          note: data.note,
        },
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to mark attendance');
    }
    return await response.json();
  } catch (error) {
    console.error('Error marking attendance:', error);
    throw error;
  }
}

// Get attendance statistics
export async function getAttendanceStats(classId: string, month?: number, year?: number) {
  try {
    const prismaQuery = {
      where: {
        classId,
        ...(month &&
          year && {
            date: {
              gte: new Date(year, month - 1, 1),
              lt: new Date(year, month, 0),
            },
          }),
      },
      include: {
        student: {
          include: {
            user: true,
          },
        },
      },
    };

    const response = await fetch(`${API_URL}/attendance/stats`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(transformQueryForCustomEndpoint(prismaQuery)),
    });

    if (!response.ok) {
      throw new Error('Failed to fetch attendance statistics');
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching attendance statistics:', error);
    throw error;
  }
}
