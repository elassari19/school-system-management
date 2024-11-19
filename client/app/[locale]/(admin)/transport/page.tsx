import React from 'react';
import { UsersRound, GraduationCap, Users, BookOpen } from 'lucide-react';
import { getTranslations } from 'next-intl/server';
import { attendanceData, monthlyExamsData } from '@/lib/dummy-data';
import DashboardTemplate from '@/components/template/dashboard-template';
import AttendenceChart from '@/components/charts/attendence-chart';
import GradeChart from '@/components/charts/grade-chart';

const Page = async () => {
  const g = await getTranslations('global');
  const a = await getTranslations('academic');

  return (
    <DashboardTemplate
      overviewData={[
        {
          icon: GraduationCap,
          title: `${g('Total')} ${g('Students')}`,
          currentValue: '2,634',
          pastValue: `+22 ${a('new Students this year')}`,
        },
        {
          icon: UsersRound,
          title: `${g('Total')} ${g('Teachers')}`,
          currentValue: '89',
          pastValue: `+4 ${a('new Teachers this year')}`,
        },
        {
          icon: Users,
          title: `${g('Total')} ${g('Parents')}`,
          currentValue: '1,745',
          pastValue: `+12 ${a('new Parents this year')}`,
        },
        {
          icon: BookOpen,
          title: `${g('Total')} ${g('Classes')}`,
          currentValue: '45',
          pastValue: `+6 ${a('new Classes this year')}`,
        },
      ]}
      RithSideChart={
        <GradeChart data={monthlyExamsData} title={a('Monthly Exams')} />
      }
      LeftSideChart={
        <AttendenceChart
          data={attendanceData}
          title={a('Monthly Attendance')}
        />
      }
    ></DashboardTemplate>
  );
};

export default Page;
