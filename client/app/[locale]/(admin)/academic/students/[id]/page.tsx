import { getData, getFirstData } from '@/app/api/services';
import { Card, CardHeader } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { getTranslations } from 'next-intl/server';
import Image from 'next/image';
import WeeklySchedule from '@/components/calendar/weekly-schedule';
import { studentScheduleData } from '@/lib/dummy-data';
import SubjectProgressTable from '@/components/tables/subject-progress-table';
import AttendanceLineChart from '@/components/charts/attendance-line-chart';
import StudentGroups from '@/components/cards/student-groups';

interface IProps {
  params: Promise<{
    id: string;
  }>;
}

async function page(props: IProps) {
  const params = await props.params;
  const g = await getTranslations('global');

  const [user] = await Promise.all([
    await getFirstData({
      where: {
        id: params.id,
        role: 'STUDENT',
      },
      include: {
        student: {
          include: {
            class: true,
            grade: true,
            parent: true,
          },
        },
      },
    }),
  ]);

  console.log('user', user);

  if (!user.student) {
    return <div>{'No student found'}</div>;
  }

  // Generate attendance data for the past 12 months
  const attendanceData = Array.from({ length: 12 }, (_, i) => {
    const date = new Date();
    date.setMonth(date.getMonth() - (11 - i));
    return {
      month: date.toLocaleString('default', { month: 'short' }),
      attendance: Math.floor(Math.random() * (100 - 75) + 75), // Random attendance between 75-100%
    };
  });

  return (
    <div className="grid grid-cols-1 md:grid-cols-5 gap-4 h-full">
      <div className="col-span-full md:col-span-3 grid gap-4 h-full overflow-auto">
        {/* welcome card */}
        <Card className="bg-primary border-secondary">
          <CardHeader className="">
            <div className="flex items-center justify-between gap-2 md:px-4">
              <div>
                <Label className="font-bold">{g('Welcome')}</Label>
                <h2 className="text-xl font-semibold">{user.fullname}</h2>
                <h3 className="text-sm">{user.email}</h3>
              </div>

              <div>
                <Image
                  src={user.image || '/images/default-avatar.png'}
                  alt="avatar"
                  width={120}
                  height={120}
                  className="rounded-full"
                />
              </div>
            </div>
          </CardHeader>
        </Card>

        {/* schedule/calendar for this week */}
        <WeeklySchedule schedules={studentScheduleData} />

        <SubjectProgressTable
          data={[
            { name: 'Mathematics', totalCourses: 4, averageGrade: 85, status: 'good' },
            { name: 'Physics', totalCourses: 3, averageGrade: 92, status: 'excellent' },
            { name: 'Chemistry', totalCourses: 3, averageGrade: 78, status: 'average' },
          ]}
        />

        <AttendanceLineChart data={attendanceData} />
      </div>
      <div className="col-span-full md:col-span-2 grid gap-4 h-full overflow-auto">
        <StudentGroups
          groups={[
            {
              id: '1',
              name: 'Physics Study Group',
              subject: 'Physics',
              projectName: 'Wave Motion Analysis',
              deadline: '2024-03-15',
              members: [
                { id: '1', name: 'John Doe', role: 'leader' },
                { id: '2', name: 'Jane Smith', role: 'member' },
              ],
            },
          ]}
        />
      </div>
    </div>
  );
}

export default page;
