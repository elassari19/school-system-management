import React from 'react';
import { UsersRound, GraduationCap, Users, BookOpen } from 'lucide-react';
import { getTranslations } from 'next-intl/server';
import OverviewCard from '@/components/cards/overview-card';
import Attendence from '@/components/charts/attendence';
import { attendanceData, gradeData, monthlyExamsData } from '@/lib/dummy-data';
import Grade from '@/components/charts/grade';
import ExamsChart from '@/components/charts/exams-chart';

const Page = async () => {
  const g = await getTranslations('global');
  const a = await getTranslations('academic');

  return (
    <div className="dashboard-page">
      {/* Stats Cards */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          {
            icon: <GraduationCap className="h-6 w-6 text-secondary" />,
            title: `${g('Total')} ${g('Students')}`,
            currentValue: '2,634',
            pastValue: `+22 ${a('new Students this year')}`,
          },
          {
            icon: <UsersRound className="h-6 w-6 text-secondary" />,
            title: `${g('Total')} ${g('Teachers')}`,
            currentValue: '89',
            pastValue: `+4 ${a('new Teachers this year')}`,
          },
          {
            icon: <Users className="h-6 w-6 text-secondary" />,
            title: `${g('Total')} ${g('Parents')}`,
            currentValue: '1,745',
            pastValue: `+12 ${a('new Parents this year')}`,
          },
          {
            icon: <BookOpen className="h-6 w-6 text-secondary" />,
            title: `${g('Total')} ${g('Classes')}`,
            currentValue: '45',
            pastValue: `+6 ${a('new Classes this year')}`,
          },
        ].map(({ icon, title, currentValue, pastValue }) => (
          <OverviewCard
            key={title}
            title={title}
            icon={icon}
            currentValue={currentValue}
            pastValue={pastValue}
          />
        ))}
      </section>

      {/* Charts */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Student AttendanceData Chart */}
        <Attendence attendanceData={attendanceData} className="col-span-full" />

        {/* Weekly Exams Chart */}
        <ExamsChart
          monthlyExamsData={monthlyExamsData}
          className="col-span-full"
        />
      </section>
    </div>
  );
};

export default Page;
