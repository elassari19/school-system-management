'use client';
import React from 'react';
import {
  ResponsiveContainer,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  Line,
  LineChart,
} from 'recharts';
import { cn } from '@/lib/utils';
import RootCard from '../cards/root-card';
import { colors } from '@/lib/dummy-data';
import { useTranslations } from 'next-intl';

interface IProps extends React.HTMLAttributes<HTMLDivElement> {
  monthlyExamsData: any;
}

const ExamsChart = ({ monthlyExamsData, className }: IProps) => {
  const t = useTranslations('academic');
  console.log('monthlyExamsData', monthlyExamsData);
  return (
    <RootCard
      className={cn('', className)}
      title={t('Monthly Exams')}
      cardContent={
        <ResponsiveContainer width="100%" height={400}>
          <LineChart data={monthlyExamsData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis domain={[0, 100]} />
            <Tooltip />
            <Legend verticalAlign="top" height={36} />
            <Line
              type="monotone"
              dataKey="femaleGrade"
              stroke="#FF69B4"
              name="Female Students"
            />
            <Line
              type="monotone"
              dataKey="averageGrade"
              stroke="#82ca9d"
              name="Average Grade"
            />
            <Line
              type="monotone"
              dataKey="maleGrade"
              stroke="#4169E1"
              name="Male Students"
            />
          </LineChart>
        </ResponsiveContainer>
      }
    />
  );
};

export default ExamsChart;
