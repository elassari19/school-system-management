import React from 'react';
import { CalendarIcon, ClockIcon, MapPinIcon } from 'lucide-react';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from '../ui/card';
import { Badge } from '../ui/badge';
import { getTranslations } from 'next-intl/server';

interface IProps {
  event: {
    id: number;
    title: string;
    description: string;
    date: string;
    time: string;
    location: string;
    type: string;
  };
}

const EventsCard = async ({ event }: IProps) => {
  const g = await getTranslations('global');
  return (
    <Card className="border-secondary/70 bg-gradient-to-b from-white to-secondary/10">
      <CardHeader>
        <CardTitle className="text-xl">{event.title}</CardTitle>
        <CardDescription>{event.description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-center space-x-2 mb-2">
          <CalendarIcon className="h-4 w-4 opacity-70" />
          <span className="text-sm text-muted-foreground">{event.date}</span>
        </div>
        <div className="flex items-center space-x-2 mb-2">
          <ClockIcon className="h-4 w-4 opacity-70" />
          <span className="text-sm text-muted-foreground">{event.time}</span>
        </div>
        <div className="flex items-center space-x-2 mb-2">
          <MapPinIcon className="h-4 w-4 opacity-70" />
          <span className="text-sm text-muted-foreground">
            {event.location}
          </span>
        </div>
        <Badge
          variant="outline"
          className="mt-2 border-secondary/70 text-secondary/70"
        >
          {event.type}
        </Badge>
      </CardContent>
    </Card>
  );
};

export default EventsCard;
