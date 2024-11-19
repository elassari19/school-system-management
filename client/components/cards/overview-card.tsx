import { title } from 'process';
import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/card';
import RootCard from './root-card';

interface IProps {
  title: string;
  icon: React.JSXElementConstructor<any>;
  currentValue: string;
  pastValue: string;
}

const OverviewCard = ({ title, currentValue, pastValue, ...props }: IProps) => {
  return (
    <RootCard
      flex
      title={title}
      description={<props.icon className="h-6 w-6 text-secondary" />}
      cardContent={
        <>
          <div className="text-2xl font-bold">{currentValue}</div>
          <p className="text-xs text-muted-foreground">{pastValue}</p>
        </>
      }
    />
  );
};

export default OverviewCard;
