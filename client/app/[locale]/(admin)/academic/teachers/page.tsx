import React from 'react';
import TeacherForm from '@/components/forms/teacher-form';
import { getTranslations } from 'next-intl/server';
import PageTemplate, {
  ActionsSection,
  OverviewSection,
} from '@/components/template/page-template';
import { ChartLine, GraduationCap } from 'lucide-react';
import PageTable from '@/components/tables/page-table';
import { calculateStats } from '@/helpers/stats-function';
import { getTeachersQuery, getSearchTeachersQuery } from '@/app/api/academic';

interface IProps {
  searchParams: Promise<{
    page: number;
    q?: string;
  }>;
}
export default async function page(props: IProps) {
  const { page = 0, q = '' } = await props.searchParams;

  try {
    const [g, teachers, searchTeachers] = await Promise.all([
      getTranslations('global'),
      getTeachersQuery(),
      getSearchTeachersQuery(page, q),
    ]);

    if (!teachers || teachers.length === 0) {
      return <div>No teachers found</div>;
    }

    const { male, female, maleAverageAge, femaleAverageAge } = calculateStats(teachers);

    const tableHeaders = [
      g('Avatar'),
      g('Full Name'),
      g('Age'),
      g('Gender'),
      g('Subjects'),
      g('Attendance'),
      g('Salary'),
    ];

    const handleTableData = searchTeachers.map((teacher: any) => ({
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
              currentValue: `${male.length}`,
              pastValue: `+17% ${g('new Teachers this year')}`,
            },
            {
              icon: GraduationCap,
              title: `${g('Female')} ${g('Teachers')}`,
              currentValue: `${female.length}`,
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
          pages={Math.ceil(q.length > 2 ? searchTeachers.length / 5 : teachers.length / 5)}
        />
      </PageTemplate>
    );
  } catch (error) {
    console.error('Error fetching teachers:', error);
    return <div>Error loading teachers</div>;
  }
}
