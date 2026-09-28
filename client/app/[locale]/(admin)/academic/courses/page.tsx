import AddCourseForm from '@/components/forms/course-form';
import PageTemplate, {
  ActionsSection,
  OverviewSection,
} from '@/components/template/page-template';
import { BookOpen, DollarSign, Layers, School, Wand2 } from 'lucide-react';
import { getTranslations } from 'next-intl/server';
import React from 'react';
import PageTable from '@/components/tables/page-table';
import { getCoursesStatsQuery, getSearchCoursesQuery } from '@/app/api/academic';
import { Button } from '@/components/ui/button';
import { Link } from '@/i18n/routing';

interface IProps {
  searchParams: Promise<{
    page: number;
    q?: string;
  }>;
}

interface CourseRecord {
  id?: string;
  title?: string;
  instructor?: string;
  level?: string;
  price?: number;
  createdAt?: string;
  subject?: { name?: string };
  chapters?: unknown[];
}

export default async function page(props: IProps) {
  const { page = 0, q = '' } = await props.searchParams;
  const [g, courses, searchCourses] = await Promise.all([
    getTranslations('global'),
    getCoursesStatsQuery(),
    getSearchCoursesQuery(page, q),
  ]);

  const courseList = courses as CourseRecord[];
  const searchList = searchCourses as CourseRecord[];

  const totalChapters = courseList.reduce(
    (total, course) => total + (course.chapters?.length || 0),
    0
  );
  const totalRevenue = courseList.reduce((total, course) => total + (course.price || 0), 0);

  const handleTableData = searchList.map((course) => ({
    id: course?.id || '',
    fullname: course?.title || '',
    coursetitle: course?.title || '',
    instructor: course?.instructor || '',
    subject: course?.subject?.name || '',
    level: course?.level || '',
    chapters: `${course?.chapters?.length || 0}`,
    price: course?.price ? `$${course.price}` : '',
    createdat: course?.createdAt ? new Date(course.createdAt).toLocaleDateString() : '',
  }));

  return (
    <PageTemplate>
      <OverviewSection
        overviewData={[
          {
            icon: BookOpen,
            title: `${g('Total')} ${g('Courses')}`,
            currentValue: `${courseList.length}`,
            pastValue: `+5% ${g('new this year')}`,
          },
          {
            icon: Layers,
            title: `${g('Total')} ${g('Chapters')}`,
            currentValue: `${totalChapters}`,
            pastValue: `${totalChapters} ${g('Chapters')}`,
          },
          {
            icon: School,
            title: `${g('Total')} ${g('Subjects')}`,
            currentValue: `${new Set(courseList.map((c) => c.subject?.name).filter(Boolean)).size}`,
            pastValue: `${g('Subjects')}`,
          },
          {
            icon: DollarSign,
            title: `${g('Total')} ${g('Revenue')}`,
            currentValue: `$${totalRevenue.toFixed(2)}`,
            pastValue: `${g('Course')} ${g('Price')}`,
          },
        ]}
      />

      <div className="flex items-center justify-between gap-2">
        <h2 className="text-lg font-semibold">{g('Courses')}</h2>
        <Button asChild size="sm">
          <Link href="/academic/courses/new">
            <Wand2 className="h-4 w-4" /> {g('Course Builder')}
          </Link>
        </Button>
      </div>

      <ActionsSection
        placeholder={`${g('Search')} ${g('Course')}...`}
        actionTarget="Course"
        ModalForm={AddCourseForm}
      />

      <PageTable
        headCell={['Course Title', 'Instructor', 'Subject', 'Level', 'Chapters', 'Price', 'Created At']}
        bodyCell={handleTableData}
        ModalForm={AddCourseForm}
        target="course"
        pages={Math.ceil(q.length > 2 ? searchList.length / 5 : courseList.length / 5)}
      />
    </PageTemplate>
  );
}