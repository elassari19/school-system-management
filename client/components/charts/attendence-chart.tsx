'use client';

import React from 'react';
import {
  Bar,
  BarChart,
  CartesianAxis,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import RootCard from '../cards/root-card';
import { cn } from '@/lib/utils';
import useIntlTranslations from '@/hooks/use-intl-translations';

interface IProps extends React.HTMLAttributes<HTMLDivElement> {
  data: any[];
  title: string;
}

const AttendenceChart = ({ data, title, className }: IProps) => {
  const { g } = useIntlTranslations();
  return (
    // <RootCard
    //   className={cn('', className)}
    //   title={title}
    //   cardContent={
    //     <ResponsiveContainer>
    //       <BarChart data={data}>
    //         <CartesianAxis strokeDasharray="3" />
    //         <XAxis dataKey="name" />
    //         <YAxis />
    //         <Legend verticalAlign="top" height={40} />
    //         <Tooltip />
    //         <Legend />
    //         <Bar dataKey="male" fill="#4169E1e1" name={g('Male')} />
    //         <Bar dataKey="average" fill="#82ca9d" name={g('Average')} />
    //         <Bar dataKey="female" fill="#FF69B4e1" name={g('Female')} />
    //       </BarChart>
    //     </ResponsiveContainer>
    //   }
    // />
    <RootCard
      className={cn('', className)}
      title={title}
      cardContent={
        <ResponsiveContainer width="100%" height={330}>
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend verticalAlign="top" height={50} />
            <Bar dataKey="male" fill="#4169E1e1" name={g('Male')} />
            <Bar dataKey="average" fill="#82ca9d" name={g('Average')} />
            <Bar dataKey="female" fill="#FF69B4e1" name={g('Female')} />
          </BarChart>
        </ResponsiveContainer>
      }
    />
  );
};

export default AttendenceChart;
