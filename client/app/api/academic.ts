import {
  ClassFormType,
  StudentFormType,
  SubjectFormType,
  TeacherFormType,
  CourseFormType,
} from '../../lib/zod-schema';
import { getSessionUser } from '../../lib/auth-helper';
import { countData, createData, getData, getFirstData, updateData, deleteData, getMyStudent } from './services';

// acadimic page
export async function getAcademicCounts() {
  const [totalFemale, totalMale, totalTeachers, totalParents, totalClasses] =
    await Promise.all([
      countData({
        where: {
          role: 'STUDENT',
          gender: 'female',
        },
      }),
      countData({
        where: {
          role: 'STUDENT',
          gender: 'male',
        },
      }),
      countData({
        where: { role: 'TEACHER' },
      }),
      countData({
        where: { role: 'PARENT' },
      }),
      countData({}, 'class'),
    ]);

  return {
    totalFemale,
    totalMale,
    totalTeachers,
    totalParents,
    totalClasses,
  };
}

// student page
export async function getStudentsQuery() {
  return await getData({
    where: { role: 'STUDENT' },
    select: {
      age: true,
      gender: true,
    },
  });
}

export async function getSearchStudentsQuery(page: number, q: string) {
  return await getData({
    where: { role: 'STUDENT', fullname: { contains: q, mode: 'insensitive' } },
    include: {
      student: {
        include: {
          class: true,
          parent: true,
          grade: true,
        },
      },
    },
    skip: page > 0 ? (page - 1) * 5 : 0,
    take: 5,
  });
}

export async function createUserQuery(data: StudentFormType) {
  return await createData({
    data: {
      email: data.email,
      fullname: data.fullname,
      phone: data.phone,
      password: data.password,
      role: data.role,
      age: parseInt(data.age),
      gender: data.gender,
      address: data.address,
      image: data.image,
      student: {
        create: {
          parentId: data.parent,
          classId: data._class,
        },
      },
    },
  });
}

export async function updateUserQuery(data: StudentFormType, user: string, studentId: string) {
  return await updateData({
    where: {
      id: user,
    },
    data: {
      email: data.email,
      fullname: data.fullname,
      phone: data.phone,
      password: data.password,
      role: data.role,
      age: parseInt(data.age),
      gender: data.gender,
      address: data.address,
      image: data.image,
      student: {
        update: {
          where: {
            id: studentId,
          },
          data: {
            parent: {
              connect: {
                id: data.parent,
              },
            },
            class: {
              connect: {
                id: data._class,
              },
            },
          },
        },
      },
    },
    include: {
      student: {
        include: {
          parent: true,
          class: true,
        },
      },
    },
  });
}

export async function getUserQuery(id: string) {
  return await getFirstData({
    where: { id: id },
    include: {
      student: {
        include: {
          parent: true,
          class: true,
        },
      },
    },
  });
}

export async function getParentsQuery() {
  return await getData({
    where: { role: 'PARENT' },
    include: {
      parent: true,
    },
  });
}

export async function getClassesQuery() {
  return await getData(
    {
      select: { id: true, name: true },
    },
    'class'
  );
}

// teacher page
export async function getTeachersQuery() {
  return await getData({
    where: { role: 'TEACHER' },
    select: {
      age: true,
      gender: true,
    },
  });
}

export async function getSearchTeachersQuery(page: number, q: string) {
  return await getData({
    where: { role: 'TEACHER', fullname: { contains: q, mode: 'insensitive' } },
    include: {
      teacher: {
        include: {
          subject: true,
          classes: true,
        },
      },
    },
    skip: page > 0 ? (page - 1) * 5 : 0,
    take: 5,
  });
}

// teacher form
export async function getTeacherSubjectsQuery() {
  return await getData({}, 'subject');
}

export async function getTeacherDetailsQuery(userId: string) {
  return await getFirstData({
    where: { id: userId },
    include: {
      teacher: {
        include: {
          subject: true,
          classes: {
            include: {
              class: {
                include: {
                  students: true,
                },
              },
            },
          },
          education: true,
          experience: true,
        },
      },
    },
  });
}

export async function createTeacherQuery(data: TeacherFormType) {
  return await createData({
    data: {
      email: data.email,
      fullname: data.fullname,
      phone: data.phone,
      password: data.password,
      role: data.role,
      age: parseInt(data.age),
      gender: data.gender,
      address: data.address,
      salary: parseFloat(data.salary),
      teacher: {
        create: {
          subject: {
            connect: {
              id: data.subject,
            },
          },
        },
      },
    },
  });
}

export async function updateTeacherQuery(
  data: TeacherFormType,
  userId: string,
  teacherId: string
) {
  return await updateData({
    where: {
      id: userId,
    },
    data: {
      email: data.email,
      fullname: data.fullname,
      phone: data.phone,
      password: data.password,
      role: data.role,
      age: parseInt(data.age),
      gender: data.gender,
      address: data.address,
      salary: parseFloat(data.salary),
      teacher: {
        update: {
          where: {
            id: teacherId,
          },
          data: {
            subject: {
              connect: {
                id: data.subject,
              },
            },
          },
        },
      },
    },
    include: {
      teacher: {
        include: {
          subject: true,
        },
      },
    },
  });
}

// class page
export async function getClassesStatsQuery() {
  return await getData(
    {
      include: {
        students: true,
        teachers: true,
        subject: true,
      },
    },
    'class'
  );
}

export async function getSearchClassesQuery(page: number, q: string) {
  return await getData(
    {
      where: { name: { contains: q, mode: 'insensitive' } },
      include: {
        students: true,
        teachers: true,
        subject: true,
      },
      skip: page > 0 ? (page - 1) * 5 : 0,
      take: 5,
      orderBy: { createdAt: 'asc' },
    },
    'class'
  );
}

export async function getClassQuery(id: string) {
  return await getFirstData(
    {
      where: { id },
      include: {
        students: {
          include: {
            user: true,
            parent: {
              include: {
                user: true,
              },
            },
          },
        },
        teachers: {
          include: {
            teacher: {
              include: {
                user: true,
                subject: true,
              },
            },
          },
        },
        subject: {
          include: {
            subject: true,
          },
        },
      },
    },
    'class'
  );
}

export async function createClassQuery(data: ClassFormType) {
  return await createData({ data: { name: data.name } }, 'class');
}

export async function updateClassQuery(data: ClassFormType, id: string) {
  return await updateData({ where: { id }, data: { name: data.name } }, 'class');
}

// subject page
export async function getSubjectsStatsQuery() {
  return await getData(
    {
      include: {
        courses: true,
        teacher: true,
        classes: true,
      },
    },
    'subject'
  );
}

export async function getSearchSubjectsQuery(page: number, q: string) {
  return await getData(
    {
      where: { name: { contains: q, mode: 'insensitive' } },
      include: {
        courses: true,
        teacher: true,
        classes: true,
      },
      skip: page > 0 ? (page - 1) * 5 : 0,
      take: 5,
      orderBy: { createdAt: 'asc' },
    },
    'subject'
  );
}

export async function getSubjectQuery(id: string) {
  return await getFirstData(
    {
      where: { id },
      include: {
        courses: {
          include: {
            chapters: true,
          },
        },
        teacher: {
          include: {
            user: true,
          },
        },
        classes: {
          include: {
            class: {
              include: {
                students: true,
              },
            },
          },
        },
      },
    },
    'subject'
  );
}

export async function createSubjectQuery(data: SubjectFormType) {
  return await createData({ data: { name: data.name } }, 'subject');
}

export async function updateSubjectQuery(data: SubjectFormType, id: string) {
  return await updateData({ where: { id }, data: { name: data.name } }, 'subject');
}

// course page
export async function getCoursesStatsQuery() {
  return await getData(
    {
      include: {
        subject: true,
        chapters: true,
        user: true,
      },
    },
    'course'
  );
}

export async function getSearchCoursesQuery(page: number, q: string) {
  return await getData(
    {
      where: { title: { contains: q, mode: 'insensitive' } },
      include: {
        subject: true,
        chapters: true,
        user: true,
      },
      skip: page > 0 ? (page - 1) * 5 : 0,
      take: 5,
      orderBy: { createdAt: 'asc' },
    },
    'course'
  );
}

export async function getCourseQuery(id: string) {
  return await getFirstData(
    {
      where: { id },
      include: {
        subject: true,
        chapters: true,
        user: true,
      },
    },
    'course'
  );
}

export async function getCourseSubjectsQuery() {
  return await getData({ select: { id: true, name: true } }, 'subject');
}

const parseCoursePayload = (data: CourseFormType) => ({
  title: data.title,
  description: data.description,
  instructor: data.instructor,
  duration: data.duration ? parseInt(data.duration) : undefined,
  level: data.level,
  tags: data.tags
    ? data.tags
        .split(',')
        .map((tag) => tag.trim())
        .filter(Boolean)
    : undefined,
  thumbnail: data.thumbnail || undefined,
  price: data.price ? parseFloat(data.price) : 0,
});

export async function createCourseQuery(data: CourseFormType) {
  const user = await getSessionUser();
  return await createData(
    {
      data: {
        ...parseCoursePayload(data),
        subjectId: data.subjectId,
        userId: user?.id,
      },
    },
    'course'
  );
}

export async function updateCourseQuery(data: CourseFormType, id: string) {
  return await updateData(
    {
      where: { id },
      data: {
        ...parseCoursePayload(data),
        subjectId: data.subjectId,
      },
    },
    'course'
  );
}

export async function deleteCourseQuery(id: string) {
  return await deleteData({ where: { id } }, 'course');
}

export async function updateCourseBasicsQuery(id: string, data: Partial<CourseFormType> & { published?: boolean }) {
  const user = await getSessionUser();
  return await updateData(
    {
      where: { id },
      data: {
        ...parseCoursePayload(data as CourseFormType),
        subjectId: data.subjectId,
        published: data.published,
        userId: user?.id,
      },
    },
    'course'
  );
}

export async function publishCourseQuery(id: string, published: boolean) {
  return await updateData({ where: { id }, data: { published } }, 'course');
}

export interface CourseDraftUpdate {
  title?: string;
  description?: string;
  instructor?: string;
  level?: CourseFormType['level'];
  duration?: number;
  tags?: string[];
}

// partial update used by the AI assistant (avoids parseCoursePayload defaults)
export async function updateCourseDraftQuery(id: string, data: CourseDraftUpdate) {
  return await updateData(
    {
      where: { id },
      data: {
        ...(data.title ? { title: data.title } : {}),
        ...(data.description ? { description: data.description } : {}),
        ...(data.instructor ? { instructor: data.instructor } : {}),
        ...(data.level ? { level: data.level } : {}),
        ...(data.duration != null ? { duration: data.duration } : {}),
        ...(data.tags?.length ? { tags: data.tags } : {}),
      },
    },
    'course'
  );
}

// course builder
export async function getCourseBuilderQuery(id: string) {
  return await getFirstData({
    where: { id },
    include: {
      subject: true,
      user: true,
      chapters: {
        include: {
          content: true,
        },
      },
    },
  }, 'course');
}

export interface ChapterPayload {
  title: string;
  description?: string;
  duration?: number;
  order?: number;
}

export async function createChapterQuery(courseId: string, data: ChapterPayload) {
  return await createData(
    {
      data: {
        title: data.title,
        description: data.description || undefined,
        duration: data.duration,
        order: data.order ?? 0,
        courseId,
      },
    },
    'chapter'
  );
}

export async function updateChapterQuery(id: string, data: Partial<ChapterPayload>) {
  return await updateData({ where: { id }, data }, 'chapter');
}

export async function deleteChapterQuery(id: string) {
  return await deleteData({ where: { id } }, 'chapter');
}

export interface ContentPayload {
  type: 'video' | 'text' | 'quiz' | 'image';
  title: string;
  data: unknown;
  order?: number;
}

export async function createContentQuery(chapterId: string, data: ContentPayload) {
  return await createData(
    {
      data: {
        type: data.type,
        title: data.title,
        data: data.data,
        order: data.order ?? 0,
        chapterId,
      },
    },
    'content'
  );
}

export async function updateContentQuery(id: string, data: Partial<ContentPayload>) {
  return await updateData({ where: { id }, data }, 'content');
}

export async function deleteContentQuery(id: string) {
  return await deleteData({ where: { id } }, 'content');
}

// student experience
export async function getStudentCoursesQuery(_userId: string) {
  const student = await getMyStudent();
  if (!student?.classId) return [];

  const subjectIds = Array.isArray(student.subjects)
    ? student.subjects.map((sc) => sc.subjectId).filter(Boolean)
    : [];

  if (subjectIds.length === 0) return [];

  const courses = await getData(
    {
      where: { subjectId: { in: subjectIds }, published: true },
      include: {
        subject: true,
        chapters: {
          include: {
            content: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    },
    'course'
  );

  return courses;
}

export async function getCourseForStudentQuery(id: string) {
  return await getFirstData(
    {
      where: { id },
      include: {
        subject: true,
        chapters: {
          include: {
            content: true,
          },
        },
      },
    },
    'course'
  );
}
