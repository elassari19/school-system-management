'use client';

import React from 'react';
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import RootCard from '../cards/root-card';
import { cn } from '@/lib/utils';
import { ChartSlice } from './breakdown-chart';

interface IProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string;
  data: ChartSlice[];
  barName?: string;
  barColor?: string;
}

const ValueBarChart = ({ title, data, barName, barColor = '#8884d8', className }: IProps) => {
  return (
    <RootCard
      className={cn('text-center', className)}
      title={title}
      cardContent={
        data.length === 0 ? (
          <p className="py-10 text-sm text-muted-foreground">—</p>
        ) : (
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip
                formatter={(value: number) => [`$${Number(value).toLocaleString()}`, barName]}
              />
              <Bar dataKey="value" name={barName} fill={barColor} radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        )
      }
    />
  );
};

export default ValueBarChart;
