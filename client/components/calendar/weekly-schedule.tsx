'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import useIntlTranslations from '@/hooks/use-intl-translations';
import { addDays, format, startOfWeek, subDays } from 'date-fns';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useState } from 'react';
import RootCard from '../cards/root-card';

interface Schedule {
  id: string;
  subject: string;
  startTime: string;
  endTime: string;
  day: string;
  room?: string;
}

interface WeeklyScheduleProps {
  schedules: Schedule[];
}

export default function WeeklySchedule({ schedules }: WeeklyScheduleProps) {
  const { g } = useIntlTranslations();
  const [currentDate, setCurrentDate] = useState(new Date());

  const weekStart = startOfWeek(currentDate);
  const weekDays = [...Array(7)].map((_, i) => addDays(weekStart, i));

  const navigateWeek = (direction: 'prev' | 'next') => {
    setCurrentDate((prev) => {
      return direction === 'next' ? addDays(prev, 7) : subDays(prev, 7);
    });
  };

  const getSchedulesForDay = (date: Date) => {
    const dayName = format(date, 'EEEE').toLowerCase();
    return schedules.filter((schedule) => schedule.day.toLowerCase() === dayName);
  };

  return (
    <RootCard
      cardHeader={
        <div className="flex items-center justify-between">
          <h4 className="text-lg font-semibold">{g('Weekly Schedule')}</h4>
          <div className="flex gap-2">
            <Button
              variant="outline"
              className="border-secondary/40"
              size="icon"
              onClick={() => navigateWeek('prev')}
            >
              <ChevronLeft className="h-4 w-4 text-secondary" />
            </Button>
            <Button
              variant="outline"
              className="border-secondary/40"
              size="icon"
              onClick={() => navigateWeek('next')}
            >
              <ChevronRight className="h-4 w-4 text-secondary" />
            </Button>
          </div>
        </div>
      }
      cardContent={
        <div className="grid grid-cols-7 gap-2">
          {weekDays.map((day) => (
            <div key={day.toString()} className="space-y-2">
              <div className="text-center font-medium">
                {format(day, 'EEE')}
                <div className="text-sm text-muted-foreground">{format(day, 'd')}</div>
              </div>
              <div className="space-y-2">
                {getSchedulesForDay(day).map((schedule) => (
                  <div key={schedule.id} className="rounded-md bg-primary p-2 text-xs">
                    <div className="font-medium">{schedule.subject}</div>
                    <div className="text-muted-foreground">
                      {schedule.startTime} - {schedule.endTime}
                    </div>
                    {schedule.room && (
                      <div className="text-muted-foreground">
                        {/* {g('Room')}: {schedule.room} */}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      }
    />
  );
}
