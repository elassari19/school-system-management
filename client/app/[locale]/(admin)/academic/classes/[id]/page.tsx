import { getClassQuery } from '@/app/api/academic';
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
import { Badge } from '@/components/ui/badge';
import NoData from '@/components/no-data';
import { getTranslations } from 'next-intl/server';
import { BookOpen, CalendarCheck, GraduationCap, Users } from 'lucide-react';

interface IProps {
  params: Promise<{
    id: string;
  }>;
}

interface UserRecord {
  fullname?: string;
  email?: string;
  image?: string;
  gender?: string;
}

interface StudentRecord {
  id: string;
  attendence?: number;
  status?: string;
  user?: UserRecord;
  parent?: {
    user?: UserRecord;
  };
}

interface TeacherRecord {
  id: string;
  teacher?: {
    user?: UserRecord;
    subject?: {
      name?: string;
    };
  };
}

interface SubjectRecord {
  id: string;
  subject?: {
    name?: string;
  };
}

interface ClassRecord {
  id: string;
  name?: string;
  createdAt?: string;
  students?: StudentRecord[];
  teachers?: TeacherRecord[];
  subject?: SubjectRecord[];
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

  const [g, classData] = await Promise.all([getTranslations('global'), getClassQuery(params.id)]);

  if (!classData) {
    return (
      <div className="p-6 h-full flex items-center justify-center">
        <p className="text-lg font-medium">{g('No class found')}</p>
      </div>
    );
  }

  const cls = classData as ClassRecord;
  const students = cls.students || [];
  const teachers = cls.teachers || [];
  const subjects = cls.subject || [];

  const averageAttendance = students.length
    ? (
        students.reduce((total, student) => total + (student.attendence || 0), 0) / students.length
      ).toFixed(1)
    : '0';

  const studentsContent =
    students.length === 0 ? (
      <NoData />
    ) : (
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>{g('Student')}</TableHead>
            <TableHead>{g('Email')}</TableHead>
            <TableHead>{g('Parent')}</TableHead>
            <TableHead>{g('Attendance')}</TableHead>
            <TableHead>{g('Status')}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {students.map((student) => (
            <TableRow key={student.id}>
              <TableCell className="font-medium">{student.user?.fullname || '-'}</TableCell>
              <TableCell>{student.user?.email || '-'}</TableCell>
              <TableCell>{student.parent?.user?.fullname || '-'}</TableCell>
              <TableCell>{student.attendence ? `${student.attendence}%` : '-'}</TableCell>
              <TableCell>
                <Badge variant="secondary">{student.status || g('Active')}</Badge>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
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
            <TableHead>{g('Subject')}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {teachers.map((teacher) => (
            <TableRow key={teacher.id}>
              <TableCell className="font-medium">
                {teacher.teacher?.user?.fullname || '-'}
              </TableCell>
              <TableCell>{teacher.teacher?.user?.email || '-'}</TableCell>
              <TableCell>{translateGender(g, teacher.teacher?.user?.gender)}</TableCell>
              <TableCell>{teacher.teacher?.subject?.name || '-'}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    );

  const subjectsContent =
    subjects.length === 0 ? (
      <NoData />
    ) : (
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>{g('Subject Name')}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {subjects.map((item) => (
            <TableRow key={item.id}>
              <TableCell className="font-medium">{item.subject?.name || '-'}</TableCell>
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
            <div className="absolute top-0 left-8 flex h-12 w-12 items-center justify-center rounded-full border-2 border-secondary/50 bg-secondary/50 p-1 shadow-lg">
              <GraduationCap className="h-8 w-8 text-secondary" />
            </div>
            <div className="absolute bottom-4 left-48">
              <h1 className="text-2xl font-bold">{cls.name}</h1>
              <div className="flex flex-wrap items-center gap-4 text-sm">
                <span className="flex items-center gap-1">
                  <Users className="text-lg" />
                  {students.length} {g('Students')}
                </span>
                <span className="flex items-center gap-1">
                  <GraduationCap className="text-lg" />
                  {teachers.length} {g('Teachers')}
                </span>
                <span className="flex items-center gap-1">
                  <BookOpen className="text-lg" />
                  {subjects.length} {g('Subjects')}
                </span>
                <span className="flex items-center gap-1">
                  {g('Created At')}: {formatDate(cls.createdAt)}
                </span>
              </div>
            </div>
          </>
        }
      />

      <OverviewSection
        overviewData={[
          {
            icon: Users,
            title: g('Students'),
            currentValue: `${students.length}`,
            pastValue: g('Class Details'),
          },
          {
            icon: GraduationCap,
            title: g('Teachers'),
            currentValue: `${teachers.length}`,
            pastValue: g('Class Details'),
          },
          {
            icon: BookOpen,
            title: g('Subjects'),
            currentValue: `${subjects.length}`,
            pastValue: g('Class Details'),
          },
          {
            icon: CalendarCheck,
            title: g('Attendance'),
            currentValue: `${averageAttendance}%`,
            pastValue: `${g('Average')} ${g('Attendance')}`,
          },
        ]}
      />

      <ProfileTabs
        tabs={[
          { id: 'students', label: g('Students'), content: studentsContent },
          { id: 'teachers', label: g('Teachers'), content: teachersContent },
          { id: 'subjects', label: g('Subjects'), content: subjectsContent },
        ]}
        defaultValue="students"
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