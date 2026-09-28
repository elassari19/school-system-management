import { getSubjectQuery } from '@/app/api/academic';
import RootCard from '@/components/cards/root-card';
import ProfileTabs from '@/components/tabs/profile-tabs';
import PageTemplate, { OverviewSection } from '@/components/template/page-template';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import NoData from '@/components/no-data';
import CoursesTable from '@/components/tables/courses-table';
import { getTranslations } from 'next-intl/server';
import { BookOpen, GraduationCap, Layers, School, Users } from 'lucide-react';

interface IProps {
  params: Promise<{
    id: string;
  }>;
}

interface UserRecord {
  fullname?: string;
  email?: string;
  gender?: string;
}

interface CourseRecord {
  id: string;
  title?: string;
  description?: string;
  instructor?: string;
  price?: number;
  level?: string;
  duration?: number;
  createdAt?: string;
  chapters?: unknown[];
}

interface TeacherRecord {
  id: string;
  user?: UserRecord;
}

interface ClassRecord {
  id: string;
  class?: {
    name?: string;
    students?: unknown[];
  };
}

interface SubjectRecord {
  id: string;
  name?: string;
  createdAt?: string;
  courses?: CourseRecord[];
  teacher?: TeacherRecord[];
  classes?: ClassRecord[];
}

const formatDate = (date: string | Date | undefined) => {
  if (!date) return '-';
  return new Date(date).toLocaleDateString('en-GB', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

export default async function page(props: IProps) {
  const params = await props.params;

  const [g, subjectData] = await Promise.all([
    getTranslations('global'),
    getSubjectQuery(params.id),
  ]);

  if (!subjectData) {
    return (
      <div className="p-6 h-full flex items-center justify-center">
        <p className="text-lg font-medium">{g('No subject found')}</p>
      </div>
    );
  }

  const subject = subjectData as SubjectRecord;
  const courses = subject.courses || [];
  const teachers = subject.teacher || [];
  const classes = subject.classes || [];
  const totalStudents = classes.reduce(
    (total, item) => total + (item.class?.students?.length || 0),
    0
  );

  const coursesContent = (
    <CoursesTable courses={courses} subjectId={subject.id} />
  );

  const teachersContent =
    teachers.length === 0 ? (
      <NoData />
    ) : (
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>{g('Teacher')}</TableHead>
            <TableHead>{g('Email')}</TableHead>
            <TableHead>{g('Gender')}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {teachers.map((teacher) => (
            <TableRow key={teacher.id}>
              <TableCell className="font-medium">{teacher.user?.fullname || '-'}</TableCell>
              <TableCell>{teacher.user?.email || '-'}</TableCell>
              <TableCell>{translateGender(g, teacher.user?.gender)}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    );

  const classesContent =
    classes.length === 0 ? (
      <NoData />
    ) : (
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>{g('Class Name')}</TableHead>
            <TableHead>{g('Students')}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {classes.map((item) => (
            <TableRow key={item.id}>
              <TableCell className="font-medium">{item.class?.name || '-'}</TableCell>
              <TableCell>{item.class?.students?.length ?? 0}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    );

  return (
    <PageTemplate>
      <RootCard
        className=" h-40 rounded-t-lg relative mb-16"
        cardContent={
          <>
            <div className="absolute bottom-4 left-8 flex h-16 w-16 items-center justify-center rounded-full border-2 border-secondary/50 bg-secondary/50 p-1 shadow-lg">
              <BookOpen className="h-8 w-8 text-secondary" />
            </div>
            <div className="absolute bottom-4 left-48">
              <h1 className="text-2xl font-bold">{subject.name}</h1>
              <div className="flex flex-wrap items-center gap-4 text-sm">
                <span className="flex items-center gap-1">
                  <School className="text-lg" />
                  {courses.length} {g('Courses')}
                </span>
                <span className="flex items-center gap-1">
                  <Users className="text-lg" />
                  {teachers.length} {g('Teachers')}
                </span>
                <span className="flex items-center gap-1">
                  <GraduationCap className="text-lg" />
                  {classes.length} {g('Classes')}
                </span>
                <span className="flex items-center gap-1">
                  {g('Created At')}: {formatDate(subject.createdAt)}
                </span>
              </div>
            </div>
          </>
        }
      />

      <OverviewSection
        overviewData={[
          {
            icon: School,
            title: g('Courses'),
            currentValue: `${courses.length}`,
            pastValue: g('Subject Details'),
          },
          {
            icon: Users,
            title: g('Teachers'),
            currentValue: `${teachers.length}`,
            pastValue: g('Subject Details'),
          },
          {
            icon: GraduationCap,
            title: g('Classes'),
            currentValue: `${classes.length}`,
            pastValue: g('Subject Details'),
          },
          {
            icon: Layers,
            title: g('Students'),
            currentValue: `${totalStudents}`,
            pastValue: g('Subject Details'),
          },
        ]}
      />

      <ProfileTabs
        tabs={[
          { id: 'courses', label: g('Courses'), content: coursesContent },
          { id: 'teachers', label: g('Teachers'), content: teachersContent },
          { id: 'classes', label: g('Classes'), content: classesContent },
        ]}
        defaultValue="courses"
      />
    </PageTemplate>
  );
}

function translateGender(g: (key: string) => string, gender?: string) {
  if (!gender) return '-';
  const normalized = gender.toLowerCase();
  if (normalized === 'male') return g('Male');
  if (normalized === 'female') return g('Female');
  return gender;
}