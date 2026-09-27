import { getEventQuery } from '@/app/api/events';
import RootCard from '@/components/cards/root-card';
import PageTemplate, { OverviewSection } from '@/components/template/page-template';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { getTranslations } from 'next-intl/server';
import type { ReactNode } from 'react';
import {
  CalendarClock,
  CalendarDays,
  CalendarX2,
  CircleCheck,
  MapPin,
  Tag,
  User,
} from 'lucide-react';

interface IProps {
  params: Promise<{
    id: string;
  }>;
}

interface EventRecord {
  id: string;
  name?: string;
  date?: string;
  location?: string;
  type?: string;
  description?: string;
  createdAt?: string;
  createdBy?: {
    fullname?: string;
    email?: string;
  };
}

const formatDate = (value: string | Date | undefined, withTime = false) => {
  if (!value) return '-';
  const date = new Date(value);
  if (isNaN(date.getTime())) return '-';
  return date.toLocaleString('en-GB', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    ...(withTime ? { hour: '2-digit', minute: '2-digit' } : {}),
  });
};

export default async function page(props: IProps) {
  const params = await props.params;

  const [g, eventData] = await Promise.all([getTranslations('global'), getEventQuery(params.id)]);

  if (!eventData) {
    return (
      <div className="p-6 h-full flex items-center justify-center">
        <p className="text-lg font-medium">{g('No event found')}</p>
      </div>
    );
  }

  const event = eventData as EventRecord;
  const eventDate = event.date ? new Date(event.date) : null;
  const now = new Date();
  const isUpcoming = eventDate ? eventDate >= now : false;

  const infoRow = (label: string, value: ReactNode) => (
    <div className="flex flex-col gap-1">
      <span className="text-xs font-medium text-muted-foreground">{g(label)}</span>
      <span className="text-sm font-semibold">{value || '-'}</span>
    </div>
  );

  return (
    <PageTemplate>
      <RootCard
        className=" h-40 rounded-t-lg relative mb-16"
        cardContent={
          <>
            <div className="absolute bottom-2 left-8 flex h-16 w-16 items-center justify-center rounded-full border-2 border-secondary/50 bg-secondary/50 p-1 shadow-lg">
              <CalendarDays className="h-8 w-8 text-secondary" />
            </div>
            <div className="absolute bottom-4 left-48">
              <h1 className="text-2xl font-bold">{event.name}</h1>
              <div className="flex flex-wrap items-center gap-4 text-sm">
                <span className="flex items-center gap-1">
                  <Tag className="text-lg" />
                  {event.type ? <Badge variant="secondary">{g(event.type)}</Badge> : '-'}
                </span>
                <span className="flex items-center gap-1">
                  <MapPin className="text-lg" />
                  {event.location || g('No Data')}
                </span>
                <span className="flex items-center gap-1">
                  <CalendarClock className="text-lg" />
                  {formatDate(event.date, true)}
                </span>
              </div>
            </div>
          </>
        }
      />

      <OverviewSection
        overviewData={[
          {
            icon: CalendarDays,
            title: g('Date'),
            currentValue: formatDate(event.date),
            pastValue: event.type ? g(event.type) : g('Event'),
          },
          {
            icon: isUpcoming ? CalendarClock : CalendarX2,
            title: isUpcoming ? g('Upcoming') : g('Past'),
            currentValue: g('Status'),
            pastValue: isUpcoming ? g('scheduled ahead') : g('already happened'),
          },
          {
            icon: MapPin,
            title: g('Location'),
            currentValue: event.location || '-',
            pastValue: g('Event Details'),
          },
          {
            icon: CircleCheck,
            title: g('Created At'),
            currentValue: formatDate(event.createdAt),
            pastValue: g('Event Details'),
          },
        ]}
      />

      <RootCard
        title={g('Event Details')}
        cardContent={
          <div className="space-y-6">
            <div>
              <h3 className="mb-4 text-lg font-semibold">{g('Event Details')}</h3>
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {infoRow('Event Name', event.name)}
                {infoRow('Type', event.type ? g(event.type) : '-')}
                {infoRow('Date', formatDate(event.date, true))}
                {infoRow('Location', event.location)}
                {infoRow('Created By', event.createdBy?.fullname)}
                {infoRow('Created At', formatDate(event.createdAt))}
              </div>
            </div>

            <Separator />

            <div>
              <h3 className="mb-2 flex items-center gap-2 text-lg font-semibold">
                <User className="h-4 w-4" />
                {g('Description')}
              </h3>
              <p className="text-sm text-muted-foreground">
                {event.description || g('No Data')}
              </p>
            </div>
          </div>
        }
      />
    </PageTemplate>
  );
}