'use server';

import { API_URL } from '@/lib/functions-helper';

// Get class schedule
export async function getClassSchedule(classId: string) {
  try {
    const response = await fetch(`${API_URL}/schedule/class`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        query: {
          where: {
            classId,
          },
          include: {
            subject: true,
            teacher: {
              include: {
                user: true,
              },
            },
          },
        },
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to fetch class schedule');
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching class schedule:', error);
    throw error;
  }
}

// Create or update schedule
export async function updateSchedule(data: {
  classId: string;
  subjectId: string;
  teacherId: string;
  dayOfWeek: number;
  startTime: string;
  endTime: string;
  room?: string;
}) {
  try {
    const response = await fetch(`${API_URL}/schedule/update`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        data: {
          classId: data.classId,
          subjectId: data.subjectId,
          teacherId: data.teacherId,
          dayOfWeek: data.dayOfWeek,
          startTime: data.startTime,
          endTime: data.endTime,
          room: data.room,
        },
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to update schedule');
    }
    return await response.json();
  } catch (error) {
    console.error('Error updating schedule:', error);
    throw error;
  }
}

// Get teacher schedule
export async function getTeacherSchedule(teacherId: string) {
  try {
    const response = await fetch(`${API_URL}/schedule/teacher`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        query: {
          where: {
            teacherId,
          },
          include: {
            subject: true,
            class: true,
          },
        },
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to fetch teacher schedule');
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching teacher schedule:', error);
    throw error;
  }
}

// Delete schedule entry
export async function deleteScheduleEntry(scheduleId: string) {
  try {
    const response = await fetch(`${API_URL}/schedule/delete`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        where: {
          id: scheduleId,
        },
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to delete schedule entry');
    }
    return await response.json();
  } catch (error) {
    console.error('Error deleting schedule entry:', error);
    throw error;
  }
}
