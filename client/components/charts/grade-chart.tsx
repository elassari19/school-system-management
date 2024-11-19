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
  CartesianAxis,
} from 'recharts';
import { cn } from '@/lib/utils';
import RootCard from '../cards/root-card';
import useIntlTranslations from '@/hooks/use-intl-translations';

interface IProps extends React.HTMLAttributes<HTMLDivElement> {
  data: any;
  title: string;
}

const GradeChart = ({ data, title, className }: IProps) => {
  const { g } = useIntlTranslations();

  return (
    <RootCard
      className={cn('', className)}
      title={title}
      cardContent={
        <ResponsiveContainer height={320}>
          <LineChart data={data}>
            <CartesianAxis />
            <XAxis dataKey="month" />
            <YAxis domain={[60, 100]} />
            <Tooltip />
            <Legend verticalAlign="top" height={60} />
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

export default GradeChart;
