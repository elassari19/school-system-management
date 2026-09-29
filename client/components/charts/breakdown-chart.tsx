'use client';

import React from 'react';
import { Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts';
import RootCard from '../cards/root-card';
import { cn } from '@/lib/utils';

export const CHART_COLORS = [
  '#8884d8',
  '#d9a8d7',
  '#82ca9d',
  '#f8d7a9',
  '#6bc5e8',
  '#f0849b',
  '#b1c94e',
  '#e8a06b',
];

export interface ChartSlice {
  name: string;
  value: number;
}

interface IProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string;
  data: ChartSlice[];
  /** shows values as currency in the tooltip */
  currency?: boolean;
}

const BreakdownChart = ({ title, data, currency = false, className }: IProps) => {
  const total = data.reduce((acc, slice) => acc + slice.value, 0);

  return (
    <RootCard
      className={cn('text-center', className)}
      title={title}
      cardContent={
        data.length === 0 ? (
          <p className="py-10 text-sm text-muted-foreground">—</p>
        ) : (
          <>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Tooltip
                  formatter={(value: number, name: string) => [
                    currency ? `$${Number(value).toLocaleString()}` : Number(value).toLocaleString(),
                    name,
                  ]}
                />
                <Legend verticalAlign="bottom" height={36} />
                <Pie
                  data={data}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={90}
                  paddingAngle={2}
                >
                  {data.map((slice, index) => (
                    <Cell key={slice.name} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            <p className="text-xs text-muted-foreground">
              {currency ? `$${total.toLocaleString()}` : total.toLocaleString()}
            </p>
          </>
        )
      }
    />
  );
};

export default BreakdownChart;
