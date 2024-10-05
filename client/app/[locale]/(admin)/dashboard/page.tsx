import { getTranslations } from 'next-intl/server';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Users, User } from 'lucide-react';
import MonthlyFinanceChart from '@/components/charts/month-finance';
import YearsFinancialChart from '@/components/charts/year-expenses';
import { GiTeacher } from 'react-icons/gi';
import { PiExam } from 'react-icons/pi';
import ParentChildTable from '@/components/tables/parents-tables';
import { events, monthlyFinance, parentData } from '@/lib/dummy-data';
import EventsCard from '@/components/cards/events-card';

interface IProps {}

export default async function Page({}: IProps) {
  const t = await getTranslations('');

  return (
    <div className="h-full overflow-auto flex flex-col gap-4">
      {/* cards */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2">
        {[
          {
            icon: <GiTeacher className="h-6 w-6 text-secondary" />,
            title: `${t('Teachers')} ${t('Courses')}`,
            currentValue: '89',
            pastValue: `+20.1% ${t('from last year')}`,
          },
          {
            icon: <PiExam className="h-6 w-6 text-secondary" />,
            title: t('Exams'),
            currentValue: '12',
            pastValue: `+5.4% ${t('from last year')}`,
          },
          {
            icon: <Users className="h-6 w-6 text-secondary" />,
            title: t('Students'),
            currentValue: '1,234',
            pastValue: `+180 ${t('new students this year')}`,
          },
          {
            icon: <User className="h-6 w-6 text-secondary" />,
            title: t('Parents'),
            currentValue: '2,345',
            pastValue: `+210 ${t('new parents this year')}`,
          },
        ].map(({ icon, title, currentValue, pastValue }) => (
          <Card
            key={title}
            className="flex-1 border-secondary/70 bg-gradient-to-b from-white to-secondary/10"
          >
            <CardHeader className="flex flex-row items-center justify-between space-y-0 p-4">
              <CardTitle className="text-sm font-semibold">{title}</CardTitle>
              {icon}
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{currentValue}</div>
              <p className="text-xs text-muted-foreground">{pastValue}</p>
            </CardContent>
          </Card>
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
