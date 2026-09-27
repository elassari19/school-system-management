import AddEventForm from '@/components/forms/event-form';
import PageTemplate, {
  ActionsSection,
  OverviewSection,
} from '@/components/template/page-template';
import { CalendarDays, CalendarClock, CalendarX2, CircleCheck } from 'lucide-react';
import { getTranslations } from 'next-intl/server';
import React from 'react';
import PageTable from '@/components/tables/page-table';
import { getEventsQuery, getSearchEventsQuery } from '@/app/api/events';

interface IProps {
  searchParams: Promise<{
    page: number;
    q?: string;
  }>;
}

export default async function page(props: IProps) {
  const { page = 0, q = '' } = await props.searchParams;
  const [g, events, searchEvents] = await Promise.all([
    getTranslations('global'),
    getEventsQuery(),
    getSearchEventsQuery(page, q),
  ]);

  interface EventRecord {
    id?: string;
    name?: string;
    date?: string;
    location?: string;
    type?: string;
    description?: string;
  }

  const eventList = events as EventRecord[];
  const searchList = searchEvents as EventRecord[];

  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59);

  const upcoming = eventList.filter((ev) => new Date(ev.date ?? 0) >= now);
  const past = eventList.filter((ev) => new Date(ev.date ?? 0) < now);
  const thisMonth = eventList.filter((ev) => {
    const date = new Date(ev.date ?? 0);
    return date >= startOfMonth && date <= endOfMonth;
  });

  const formatDate = (value?: string | Date) => {
    if (!value) return '';
    const date = new Date(value);
    if (isNaN(date.getTime())) return '';
    return date.toLocaleString(undefined, {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const handleTableData = searchList.map((ev) => ({
    id: ev?.id || '',
    fullname: ev?.name || '',
    name: ev?.name || '',
    date: formatDate(ev?.date),
    location: ev?.location || '',
    type: ev?.type || '',
    description: ev?.description || '',
  }));

  return (
    <PageTemplate>
      <OverviewSection
        overviewData={[
          {
            icon: CalendarDays,
            title: `${g('Total')} ${g('Events')}`,
            currentValue: `${eventList.length}`,
            pastValue: `+6% ${g('new this year')}`,
          },
          {
            icon: CalendarClock,
            title: `${g('Upcoming')} ${g('Events')}`,
            currentValue: `${upcoming.length}`,
            pastValue: `${g('scheduled ahead')}`,
          },
          {
            icon: CalendarX2,
            title: `${g('Past')} ${g('Events')}`,
            currentValue: `${past.length}`,
            pastValue: `${g('already happened')}`,
          },
          {
            icon: CircleCheck,
            title: `${g('This Month')} ${g('Events')}`,
            currentValue: `${thisMonth.length}`,
            pastValue: `${g('events this month')}`,
          },
        ]}
      />

      <ActionsSection
        placeholder={`${g('Search')} ${g('Event')}...`}
        actionTarget="Event"
        ModalForm={AddEventForm}
      />

      <PageTable
        headCell={['Name', 'Date', 'Location', 'Type', 'Description']}
        bodyCell={handleTableData}
        ModalForm={AddEventForm}
        target="event"
        pages={Math.ceil(q.length > 2 ? searchList.length / 5 : eventList.length / 5)}
      />
    </PageTemplate>
  );
}
