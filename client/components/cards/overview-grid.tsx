import React from 'react';
import { cn } from '@/lib/utils';
import OverviewCard from './overview-card';

export interface OverviewItem {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  currentValue: string;
  pastValue: string;
}

interface IProps {
  overviewData: OverviewItem[];
  className?: string;
}

const OverviewGrid = ({ overviewData, className }: IProps) => (
  <section className={cn('grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2', className)}>
    {overviewData.map(({ icon, title, currentValue, pastValue }) => (
      <OverviewCard
        key={title}
        icon={icon}
        title={title}
        currentValue={currentValue}
        pastValue={pastValue}
      />
    ))}
  </section>
);

export default OverviewGrid;
