import { title } from 'process';
import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/card';

interface IProps {
  title: string;
  icon: React.ReactNode;
  currentValue: string;
  pastValue: string;
}

const OverviewCard = ({ title, icon, currentValue, pastValue }: IProps) => {
  return (
    <Card className="flex-1 border-secondary/70 bg-gradient-to-b from-white to-secondary/10">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 p-4">
        <CardTitle className="text-sm font-semibold">{title}</CardTitle>
        {icon}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{currentValue}</div>
        <p className="text-xs text-muted-foreground">{pastValue}</p>
      </CardContent>
    </Card>
  );
};

export default OverviewCard;
