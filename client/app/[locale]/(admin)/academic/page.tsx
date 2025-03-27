import React from 'react';
import { UsersRound, GraduationCap, Users, BookOpen } from 'lucide-react';
import { getTranslations } from 'next-intl/server';
import { attendanceData, monthlyExamsData, tags } from '@/lib/dummy-data';
import AttendenceChart from '@/components/charts/attendence-chart';
import GradeChart from '@/components/charts/grade-chart';
import GroupCard from '@/components/cards/group-card';
import userAvatar from '@/app/public/assets/user.png';
import { getCookie } from '@/lib/cookies-handler';
import { DashboardCarousel } from '@/components/ui/carousel';
import RootCard from '@/components/cards/root-card';
import { countAllUsers } from '@/app/api/dashboard';
import PageTemplate, {
  ChartSection,
  OverviewSection,
} from '@/components/template/page-template';

const members = [
  { id: '1', name: 'John Doe', avatar: userAvatar, role: 'TEACHER' },
  { id: '2', name: 'Jane Smith', avatar: userAvatar, role: 'STUDENT' },
  { id: '2', name: 'Jane Smith', avatar: userAvatar, role: 'ADMIN' },
  { id: '2', name: 'Jane Smith', avatar: userAvatar, role: 'PARENT' },
];

const Page = async () => {
  const user = await getCookie('session');
  const g = await getTranslations('global');
  const a = await getTranslations('academic');

  const totalFemal = await countAllUsers({
    role: 'STUDENT',
    gender: 'female',
  });

  const totalMale = await countAllUsers({
    role: 'STUDENT',
    gender: 'male',
  });

  const totalTeachers = await countAllUsers({
    role: 'TEACHER',
  });

  const totalParents = await countAllUsers({
    role: 'PARENT',
  });

  const totalClasses = await countAllUsers({}, 'class');

  return (
    <PageTemplate>
      <OverviewSection
        overviewData={[
          {
            icon: GraduationCap,
            title: `${g('Total')} ${g('Students')}`,
            currentValue: totalFemal + totalMale,
            pastValue: `+17 ${a('new Students this year')}`,
          },
          {
            icon: UsersRound,
            title: `${g('Total')} ${g('Teachers')}`,
            currentValue: totalTeachers,
            pastValue: `+4 ${a('new Teachers this year')}`,
          },
          {
            icon: Users,
            title: `${g('Total')} ${g('Parents')}`,
            currentValue: totalParents,
            pastValue: `+12 ${a('new Parents this year')}`,
          },
          {
            icon: BookOpen,
            title: `${g('Total')} ${g('Classes')}`,
            currentValue: totalClasses,
            pastValue: `+6 ${a('new Classes this year')}`,
          },
        ]}
      />

      <ChartSection
        leftChart={<AttendenceChart data={attendanceData} title={a('Monthly Attendance')} />}
        rightChart={<GradeChart data={monthlyExamsData} title={a('Monthly Exams')} />}
      />

      {/* students groups */}
      <RootCard
        className="w-full"
        title="Student Groups"
        cardContent={
          <DashboardCarousel
            carousel={Array(10)
              .fill(
                <GroupCard
                  groupName="Pixel Crafters"
                  members={members}
                  admin={members.find((u) => u.role === 'ADMIN')}
                  user={user}
                  subjectTags={tags}
                />
              )
              .map((item) => item)}
          />
        }
      />
      {/* classes groups */}
      <RootCard
        className="w-full"
        title="Classes Groups"
        cardContent={
          <DashboardCarousel
            carousel={Array(10)
              .fill(
                <GroupCard
                  groupName="Pixel Crafters"
                  members={members}
                  admin={members.find((u) => u.role === 'ADMIN')}
                  user={user}
                  subjectTags={tags}
                />
              )
              .map((item) => item)}
          />
        }
      />
      {/* parents groups */}
      <RootCard
        className="w-full"
        title="Teachers and Parents Groups"
        cardContent={
          <DashboardCarousel
            carousel={Array(10)
              .fill(
                <GroupCard
                  groupName="Pixel Crafters"
                  members={members}
                  admin={members.find((u) => u.role === 'ADMIN')}
                  user={user}
                  subjectTags={tags}
                />
              )
              .map((item) => item)}
          />
        }
      />
    </PageTemplate>
  );
};

export default Page;
