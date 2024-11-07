import { getTranslations } from 'next-intl/server';
import { Users, User } from 'lucide-react';
import MonthlyFinanceChart from '@/components/charts/month-finance';
import YearsFinancialChart from '@/components/charts/year-expenses';
import { GiTeacher } from 'react-icons/gi';
import { PiExam } from 'react-icons/pi';
import ParentChildTable from '@/components/tables/parents-tables';
import { events, monthlyFinance, parentData } from '@/lib/dummy-data';
import EventsCard from '@/components/cards/events-card';
import OverviewCard from '@/components/cards/overview-card';

interface IProps {}

export default async function Page({}: IProps) {
  const g = await getTranslations('global');
  const d = await getTranslations('dashboard');

  return (
    <div className="dashboard-page">
      {/* cards */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2">
        {[
          {
            icon: <GiTeacher className="h-6 w-6 text-secondary" />,
            title: `${g('Teachers')} ${g('Courses')}`,
            currentValue: '89',
            pastValue: `+20.1% ${d('from last year')}`,
          },
          {
            icon: <PiExam className="h-6 w-6 text-secondary" />,
            title: g('Exams'),
            currentValue: '12',
            pastValue: `+5.4% ${d('from last year')}`,
          },
          {
            icon: <Users className="h-6 w-6 text-secondary" />,
            title: g('Students'),
            currentValue: '1,234',
            pastValue: `+180 ${g('new students this year')}`,
          },
          {
            icon: <User className="h-6 w-6 text-secondary" />,
            title: g('Parents'),
            currentValue: '2,345',
            pastValue: `+210 ${g('new parents this year')}`,
          },
        ].map(({ icon, title, currentValue, pastValue }) => (
          <OverviewCard
            key={title}
            icon={icon}
            title={title}
            currentValue={currentValue}
            pastValue={pastValue}
          />
        ))}
      </section>

      {/* charts */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-2">
        {/* monthly */}
        <MonthlyFinanceChart data={monthlyFinance} />
        {/* yearly */}
        <YearsFinancialChart />
      </section>

      <section className="w-full grid grid-cols-1 lg:grid-cols-4 gap-4 h-40">
        {/* parend child general info */}
        <div className="lg:col-span-3">
          <ParentChildTable data={parentData} />
        </div>
        {/* coming events */}
        <div className="lg:col-span-1 h-full overflow-auto grid grid-cols-1 gap-4">
          {events.map((event) => (
            <EventsCard key={event.id} event={event} />
          ))}
        </div>
      </section>
    </div>
  );
}
