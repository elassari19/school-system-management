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
import useIntlTranslations from '@/hooks/use-intl-translations';

interface IProps extends React.HTMLAttributes<HTMLDivElement> {
  monthlyExamsData: any;
}

const ExamsChart = ({ monthlyExamsData, className }: IProps) => {
  const { a, g } = useIntlTranslations();

  return (
    <RootCard
      className={cn('', className)}
      title={a('Monthly Exams')}
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
              name={`${g('Female')} ${g('Grade')}`}
            />
            <Line
              type="monotone"
              dataKey="averageGrade"
              stroke="#82ca9d"
              name={`${g('Average')} ${g('Grade')}`}
            />
            <Line
              type="monotone"
              dataKey="maleGrade"
              stroke="#4169E1"
              name={`${g('Male')} ${g('Grade')}`}
            />
          </LineChart>
        </ResponsiveContainer>
      }
    />
  );
};

export default ExamsChart;
