import React from 'react';
import TeacherForm from '@/components/forms/teacher-form';
import { getTranslations } from 'next-intl/server';
import { getData } from '@/app/api/services';
import PageTemplate, {
  ActionsSection,
  OverviewSection,
} from '@/components/template/page-template';
import { ChartLine, GraduationCap } from 'lucide-react';
import { UserType } from '@/lib/zod-schema';
import PageTable from '@/components/tables/page-table';

interface IProps {
  searchParams: Promise<{
    page: number;
    q?: string;
  }>;
}
export default async function page(props: IProps) {
  const { page = 0, q = '' } = await props.searchParams;
  const g = await getTranslations('global');

  try {
    const [teachers, SearchTeachers] = await Promise.all([
      await getData({
        where: { role: 'TEACHER' },
        select: {
          age: true,
          gender: true,
        },
      }),
      await getData({
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
      }),
    ]);

    if (!teachers || teachers.length === 0) {
      return <div>No teachers found</div>;
    }

    const maleTeachers = teachers.filter((t: UserType) => t.gender === 'male');
    const femaleTeachers = teachers.filter((t: UserType) => t.gender === 'female');
    const maleAverageAge =
      maleTeachers.reduce((total: number, teacher: UserType) => total + teacher.age!, 0) /
      maleTeachers.length;
    const femaleAverageAge =
      femaleTeachers.reduce((total: number, teacher: UserType) => total + teacher.age!, 0) /
      femaleTeachers.length;

    const tableHeaders = [
      g('Avatar'),
      g('Full Name'),
      g('Age'),
      g('Gender'),
      g('Subjects'),
      g('Attendance'),
      g('Salary'),
    ];

    const handleTableData = SearchTeachers.map((teacher: any) => ({
      id: teacher.id,
      avatar: teacher.image || '',
      fullname: teacher.fullname,
      age: teacher.age || '-',
      gender: teacher.gender || '-',
      subjects: teacher.teacher[0]?.subject?.name || '-',
      attendance: teacher.teacher[0]?.attendance || '98.48',
      salary: teacher.salary || '4382.00',
    }));

    return (
      <PageTemplate>
        <OverviewSection
          overviewData={[
            {
              icon: GraduationCap,
              title: `${g('Male')} ${g('Teachers')}`,
              currentValue: maleTeachers.length,
              pastValue: `+17% ${g('new Teachers this year')}`,
            },
            {
              icon: GraduationCap,
              title: `${g('Female')} ${g('Teachers')}`,
              currentValue: femaleTeachers.length,
              pastValue: `+13% ${g('new Teachers this year')}`,
            },
            {
              icon: ChartLine,
              title: `${g('Male')} ${g('Average')} ${g('Age')}`,
              currentValue: maleAverageAge.toFixed(4),
              pastValue: `+0.28% ${g('Students average age this year')}`,
            },
            {
              icon: ChartLine,
              title: `${g('Female')} ${g('Average')} ${g('Age')}`,
              currentValue: femaleAverageAge.toFixed(4),
              pastValue: `-0.03% ${g('Students average age this year')}`,
            },
          ]}
        />

        <ActionsSection
          placeholder={`${g('Search')} ${g('Teacher')}...`}
          actionTarget="Teacher"
          ModalForm={TeacherForm}
        />

        <PageTable
          headCell={tableHeaders}
          bodyCell={handleTableData}
          ModalForm={TeacherForm}
          pages={Math.ceil(teachers.length / 5)}
        />
      </PageTemplate>
    );
  } catch (error) {
    console.error('Error fetching teachers:', error);
    return <div>Error loading teachers</div>;
  }
}
