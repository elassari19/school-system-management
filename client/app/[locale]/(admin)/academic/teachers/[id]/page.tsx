import { getTeacherDetailsQuery } from '@/app/api/academic';
import RootCard from '@/components/cards/root-card';
import ProfileTabs from '@/components/tabs/profile-tabs';
import WeeklySchedule from '@/components/calendar/weekly-schedule';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import NoData from '@/components/no-data';
import { getTranslations } from 'next-intl/server';
import type { ReactNode } from 'react';
import { FaBookBookmark, FaBriefcase, FaEnvelope, FaPhone } from 'react-icons/fa6';

interface IProps {
  params: Promise<{
    id: string;
  }>;
}

interface TeacherClass {
  id: string;
  createdAt?: string;
  class?: {
    name?: string;
    students?: unknown[];
  };
}

interface EducationRecord {
  id: string;
  school?: string;
  degree?: number;
  field?: string;
  from?: string;
  to?: string;
}

interface ExperienceRecord {
  id: string;
  company?: string;
  position?: string;
  from?: string;
  to?: string;
}

const formatDate = (date: string | Date | undefined) => {
  if (!date) return '-';
  return new Date(date).toLocaleDateString('en-GB', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];

export default async function page(props: IProps) {
  const params = await props.params;

  const [g, teacher] = await Promise.all([
    getTranslations('global'),
    getTeacherDetailsQuery(params.id),
  ]);

  if (!teacher) {
    return (
      <div className="p-6 h-full flex items-center justify-center">
        <p className="text-lg font-medium">{g('No teacher found')}</p>
      </div>
    );
  }

  const details = teacher.teacher?.[0];
  const classes: TeacherClass[] = details?.classes || [];
  const education: EducationRecord[] = details?.education || [];
  const experience: ExperienceRecord[] = details?.experience || [];
  const subjectName = details?.subject?.name;

  const schedules = classes.flatMap((tc, classIndex) =>
    DAYS.slice(0, 2).map((day, dayIndex) => ({
      id: `${tc.id}-${day}`,
      subject: subjectName || tc.class?.name || g('Class'),
      startTime: dayIndex === 0 ? '09:00' : '11:00',
      endTime: dayIndex === 0 ? '10:30' : '12:30',
      day,
      room: `${101 + classIndex}`,
    }))
  );

  const infoRow = (label: string, value: ReactNode) => (
    <div className="flex flex-col gap-1">
      <span className="text-xs font-medium text-muted-foreground">{g(label)}</span>
      <span className="text-sm font-semibold">{value || '-'}</span>
    </div>
  );

  const profileContent = (
    <div className="space-y-6">
      <div>
        <h3 className="mb-4 text-lg font-semibold">{g('Personal Information')}</h3>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {infoRow('Full Name', teacher.fullname)}
          {infoRow('Email', teacher.email)}
          {infoRow('Phone', teacher.phone)}
          {infoRow('Age', teacher.age)}
          {infoRow('Gender', translateGender(g, teacher.gender))}
          {infoRow('Address', teacher.address)}
        </div>
      </div>

      <Separator />

      <div>
        <h3 className="mb-4 text-lg font-semibold">{g('Professional Information')}</h3>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {infoRow('Role', g('Teacher'))}
          {infoRow('Subject', subjectName)}
          {infoRow('Salary', teacher.salary ? `$${teacher.salary}` : '-')}
          {infoRow('Status', <Badge variant="secondary">{g('Active')}</Badge>)}
        </div>
      </div>
    </div>
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
            <TableHead>{g('Subject')}</TableHead>
            <TableHead>{g('Created At')}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {classes.map((tc) => (
            <TableRow key={tc.id}>
              <TableCell className="font-medium">{tc.class?.name || '-'}</TableCell>
              <TableCell>{tc.class?.students?.length ?? 0}</TableCell>
              <TableCell>{subjectName || '-'}</TableCell>
              <TableCell>{formatDate(tc.createdAt)}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    );

  const scheduleContent = <WeeklySchedule schedules={schedules} />;

  const educationContent =
    education.length === 0 ? (
      <NoData />
    ) : (
      <div className="space-y-4">
        {education.map((item) => (
          <div key={item.id} className="rounded-lg border p-4">
            <div className="flex items-center justify-between">
              <h4 className="font-semibold">{item.school}</h4>
              <span className="text-sm text-muted-foreground">
                {formatDate(item.from)} - {formatDate(item.to)}
              </span>
            </div>
            <p className="mt-1 text-sm text-muted-foreground">
              {g('Degree')}: {item.degree} | {g('Field')}: {item.field}
            </p>
          </div>
        ))}
      </div>
    );

  const experienceContent =
    experience.length === 0 ? (
      <NoData />
    ) : (
      <div className="space-y-4">
        {experience.map((item) => (
          <div key={item.id} className="rounded-lg border p-4">
            <div className="flex items-center justify-between">
              <h4 className="font-semibold">{item.position}</h4>
              <span className="text-sm text-muted-foreground">
                {formatDate(item.from)} - {formatDate(item.to)}
              </span>
            </div>
            <p className="mt-1 text-sm text-muted-foreground">
              {g('Company')}: {item.company}
            </p>
          </div>
        ))}
      </div>
    );

  return (
    <div className="p-6 h-full overflow-auto">
      <RootCard
        className=" h-40 rounded-t-lg relative mb-16"
        cardContent={
          <>
            <div className="absolute bottom-2 left-8 bg-secondary/50 rounded-full p-1 border-2 border-secondary/50 shadow-lg">
              <img
                src={teacher.image || '/images/placeholder-teacher.jpg'}
                alt={teacher.fullname}
                className="w-32 h-32 rounded-full object-cover"
              />
            </div>
            <div className="absolute bottom-4 left-48">
              <h1 className="text-2xl font-bold">{teacher.fullname}</h1>
              <div className="flex flex-wrap items-center gap-4 text-sm">
                <span className="flex items-center gap-1">
                  <FaBriefcase className="text-lg" />
                  {subjectName || g('Teacher')}
                </span>
                <span className="flex items-center gap-1">
                  <FaEnvelope className="text-lg" />
                  {teacher.email || '-'}
                </span>
                <span className="flex items-center gap-1">
                  <FaPhone className="text-lg" />
                  {teacher.phone || '-'}
                </span>
                <span className="flex items-center gap-1">
                  <FaBookBookmark className="text-lg" />
                  {teacher.address || g('No Data')}
                </span>
              </div>
            </div>
          </>
        }
      />

      <ProfileTabs
        tabs={[
          { id: 'profile', label: g('Profile'), content: profileContent },
          { id: 'classes', label: g('Classes'), content: classesContent },
          { id: 'schedule', label: g('Schedule'), content: scheduleContent },
          { id: 'education', label: g('Education'), content: educationContent },
          { id: 'experience', label: g('Experience'), content: experienceContent },
        ]}
        defaultValue="profile"
      />
    </div>
  );
}

function translateGender(g: (key: string) => string, gender?: string) {
  if (!gender) return '-';
  const normalized = gender.toLowerCase();
  if (normalized === 'male') return g('Male');
  if (normalized === 'female') return g('Female');
  return gender;
}