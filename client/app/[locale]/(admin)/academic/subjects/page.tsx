import AddSubjectForm from '@/components/forms/subject-form';
import PageTemplate, {
  ActionsSection,
  OverviewSection,
} from '@/components/template/page-template';
import { BookOpen, GraduationCap, School, Users } from 'lucide-react';
import { getTranslations } from 'next-intl/server';
import React from 'react';
import PageTable from '@/components/tables/page-table';
import { getSearchSubjectsQuery, getSubjectsStatsQuery } from '@/app/api/academic';

interface IProps {
  searchParams: Promise<{
    page: number;
    q?: string;
  }>;
}

export default async function page(props: IProps) {
  const { page = 0, q = '' } = await props.searchParams;
  const [g, subjects, searchSubjects] = await Promise.all([
    getTranslations('global'),
    getSubjectsStatsQuery(),
    getSearchSubjectsQuery(page, q),
  ]);

  interface SubjectRecord {
    id?: string;
    name?: string;
    createdAt?: string;
    courses?: unknown[];
    teacher?: unknown[];
    classes?: unknown[];
  }

  const subjectList = subjects as SubjectRecord[];
  const searchList = searchSubjects as SubjectRecord[];

  const totalCourses = subjectList.reduce((total, subject) => total + (subject.courses?.length || 0), 0);
  const totalTeachers = subjectList.reduce((total, subject) => total + (subject.teacher?.length || 0), 0);
  const totalClasses = subjectList.reduce((total, subject) => total + (subject.classes?.length || 0), 0);

  const handleTableData = searchList.map((subject) => ({
    id: subject?.id || '',
    fullname: subject?.name || '',
    name: subject?.name || '',
    teachers: `${subject?.teacher?.length || 0}`,
    classes: `${subject?.classes?.length || 0}`,
    courses: `${subject?.courses?.length || 0}`,
    createdat: subject?.createdAt ? new Date(subject.createdAt).toLocaleDateString() : '',
  }));

  return (
    <PageTemplate>
      <OverviewSection
        overviewData={[
          {
            icon: BookOpen,
            title: `${g('Total')} ${g('Subjects')}`,
            currentValue: `${subjects.length}`,
            pastValue: `+5% ${g('new this year')}`,
          },
          {
            icon: School,
            title: `${g('Total')} ${g('Courses')}`,
            currentValue: `${totalCourses}`,
            pastValue: `${totalCourses} ${g('Courses')}`,
          },
          {
            icon: Users,
            title: `${g('Total')} ${g('Teachers')}`,
            currentValue: `${totalTeachers}`,
            pastValue: `${totalTeachers} ${g('Teachers')}`,
          },
          {
            icon: GraduationCap,
            title: `${g('Total')} ${g('Classes')}`,
            currentValue: `${totalClasses}`,
            pastValue: `${totalClasses} ${g('Classes')}`,
          },
        ]}
      />

      <ActionsSection
        placeholder={`${g('Search')} ${g('Subject')}...`}
        actionTarget="Subject"
        ModalForm={AddSubjectForm}
      />

      <PageTable
        headCell={['Name', 'Teachers', 'Classes', 'Courses', 'Created At']}
        bodyCell={handleTableData}
        ModalForm={AddSubjectForm}
        target="subject"
        pages={Math.ceil(q.length > 2 ? searchList.length / 5 : subjectList.length / 5)}
      />
    </PageTemplate>
  );
}
