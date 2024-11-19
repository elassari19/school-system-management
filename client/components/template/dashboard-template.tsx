import React from 'react';
import { cn } from '@/lib/utils';
import OverviewCard from '../cards/overview-card';

interface IProps extends React.HTMLAttributes<HTMLDivElement> {
  overviewData: any[];
  LeftSideChart: React.ReactNode;
  RithSideChart: React.ReactNode;
}

const DashboardTemplate = ({
  children,
  className,
  overviewData,
  LeftSideChart,
  RithSideChart,
}: IProps) => {
  return (
    <div className={cn('h-full overflow-auto flex flex-col gap-4', className)}>
      {/* Overview */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2">
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

      {/* Charts */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {LeftSideChart}
        {RithSideChart}
      </section>

      {/* Grops card */}
      <section>
        {/* 
          - Group card: Students
          - Group card: Teachers
          - Group card: Parents
          - Group card: Classes
         */}
      </section>
      {children}
    </div>
  );
};

export default DashboardTemplate;
