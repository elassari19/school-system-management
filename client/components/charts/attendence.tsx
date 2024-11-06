'use client';

import React from 'react';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import RootCard from '../cards/root-card';
import { cn } from '../../lib/utils';
import { useTranslations } from 'next-intl';

interface IProps extends React.HTMLAttributes<HTMLDivElement> {
  attendanceData: any;
}

const Attendence = ({ attendanceData, className }: IProps) => {
  const t = useTranslations('academic');
  return (
    <RootCard
      className={cn('', className)}
      title={t('Monthly Attendance')}
      cardContent={
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={attendanceData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="male" fill="#8884d8" />
            <Bar dataKey="female" fill="#82ca9d" />
          </BarChart>
        </ResponsiveContainer>
      }
    />
  );
};

export default Attendence;
