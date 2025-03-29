import AddStudentForm from '@/components/forms/student-form';
import PageTemplate, {
  ActionsSection,
  OverviewSection,
} from '@/components/template/page-template';
import { ChartLine, GraduationCap } from 'lucide-react';
import { getTranslations } from 'next-intl/server';
import React from 'react';
import { UserType } from '@/lib/zod-schema';
import PageTable from '@/components/tables/page-table';
import { getSearchStudentsQuery, getStudentsQuery } from '@/app/api/academic';
import { calculateStats } from '../../../../../helpers/stats-function';

interface IProps {
  searchParams: Promise<{
    page: number;
    q?: string;
  }>;
}

export default async function page(props: IProps) {
  const { page = 0, q = '' } = await props.searchParams;
  const [a, g, students, searchStudent] = await Promise.all([
    getTranslations('academic'),
    getTranslations('global'),
    getStudentsQuery(),
    getSearchStudentsQuery(page, q),
  ]);

  const { male, female, maleAverageAge, femaleAverageAge } = calculateStats(students);

  const handleTableData = searchStudent.map((std: any) => ({
    id: std?.id || '',
    avatar: std?.image || '',
    fullname: std?.fullname || '',
    age: std?.age || '',
    gender: std?.gender || '',
    class: std?.student[0]?.class?.name || '',
    attendance: std?.student?.attendence || '',
    parentId: std?.student[0]?.parentId || '',
    classId: std?.student[0]?.classId || '',
    gradeId: std?.student[0]?.gradeId || '',
  }));

  return (
    <PageTemplate>
      <OverviewSection
        overviewData={[
          {
            icon: GraduationCap,
            title: `${g('Male')} ${g('Students')}`,
            currentValue: `${male.length}`,
            pastValue: `+17% ${a('new Students this year')}`,
          },
          {
            icon: GraduationCap,
            title: `${g('Female')} ${g('Students')}`,
            currentValue: `${female.length}`,
            pastValue: `+13% ${a('new Students this year')}`,
          },
          {
            icon: ChartLine,
            title: `${g('Male')} ${g('Average')} ${g('Age')}`,
            currentValue: maleAverageAge.toFixed(4),
            pastValue: `+0.28% ${a('Students average age this year')}`,
          },
          {
            icon: ChartLine,
            title: `${g('Female')} ${g('Average')} ${g('Age')}`,
            currentValue: femaleAverageAge.toFixed(4),
            pastValue: `-0.03% ${a('Students average age this year')}`,
          },
        ]}
      />

      <ActionsSection
        placeholder={`${g('Search')} ${g('Student')}...`}
        actionTarget="Student"
        ModalForm={AddStudentForm}
      />

      <PageTable
        headCell={['Avatar', 'Full Name', 'Age', 'Gender', 'Class', 'Attendance']}
        bodyCell={handleTableData}
        ModalForm={AddStudentForm}
        pages={Math.ceil(q.length > 2 ? searchStudent.length / 5 : students.length / 5)}
      />
    </PageTemplate>
  );
}
