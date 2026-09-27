import AddClassForm from '@/components/forms/class-form';
import PageTemplate, {
  ActionsSection,
  OverviewSection,
} from '@/components/template/page-template';
import { BookOpen, GraduationCap, School, Users } from 'lucide-react';
import { getTranslations } from 'next-intl/server';
import React from 'react';
import PageTable from '@/components/tables/page-table';
import { getClassesStatsQuery, getSearchClassesQuery } from '@/app/api/academic';

interface IProps {
  searchParams: Promise<{
    page: number;
    q?: string;
  }>;
}

export default async function page(props: IProps) {
  const { page = 0, q = '' } = await props.searchParams;
  const [g, classes, searchClasses] = await Promise.all([
    getTranslations('global'),
    getClassesStatsQuery(),
    getSearchClassesQuery(page, q),
  ]);

  interface ClassRecord {
    id?: string;
    name?: string;
    createdAt?: string;
    students?: unknown[];
    teachers?: unknown[];
    subject?: unknown[];
  }

  const classList = classes as ClassRecord[];
  const searchList = searchClasses as ClassRecord[];

  const totalStudents = classList.reduce((total, cls) => total + (cls.students?.length || 0), 0);
  const totalTeachers = classList.reduce((total, cls) => total + (cls.teachers?.length || 0), 0);
  const totalSubjects = classList.reduce((total, cls) => total + (cls.subject?.length || 0), 0);

  const average = (value: number) => (classList.length ? (value / classList.length).toFixed(2) : '0');

  const handleTableData = searchList.map((cls) => ({
    id: cls?.id || '',
    fullname: cls?.name || '',
    name: cls?.name || '',
    students: `${cls?.students?.length || 0}`,
    teachers: `${cls?.teachers?.length || 0}`,
    subjects: `${cls?.subject?.length || 0}`,
    createdat: cls?.createdAt ? new Date(cls.createdAt).toLocaleDateString() : '',
  }));

  return (
    <PageTemplate>
      <OverviewSection
        overviewData={[
          {
            icon: School,
            title: `${g('Total')} ${g('Classes')}`,
            currentValue: `${classes.length}`,
            pastValue: `+8% ${g('new this year')}`,
          },
          {
            icon: GraduationCap,
            title: `${g('Students')} / ${g('Class')}`,
            currentValue: average(totalStudents),
            pastValue: `${totalStudents} ${g('Students')}`,
          },
          {
            icon: Users,
            title: `${g('Teachers')} / ${g('Class')}`,
            currentValue: average(totalTeachers),
            pastValue: `${totalTeachers} ${g('Teachers')}`,
          },
          {
            icon: BookOpen,
            title: `${g('Subjects')} / ${g('Class')}`,
            currentValue: average(totalSubjects),
            pastValue: `${totalSubjects} ${g('Subjects')}`,
          },
        ]}
      />

      <ActionsSection
        placeholder={`${g('Search')} ${g('Class')}...`}
        actionTarget="Class"
        ModalForm={AddClassForm}
      />

      <PageTable
        headCell={['Name', 'Students', 'Teachers', 'Subjects', 'Created At']}
        bodyCell={handleTableData}
        ModalForm={AddClassForm}
        target="class"
        pages={Math.ceil(q.length > 2 ? searchList.length / 5 : classList.length / 5)}
      />
    </PageTemplate>
  );
}
