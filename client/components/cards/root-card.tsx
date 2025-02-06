import React from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '../ui/card';
import { cn } from '../../lib/utils';

interface IProps {
  title?: React.ReactNode;
  description?: React.ReactNode;
  cardHeader: React.ReactNode;
  cardContent: React.ReactNode;
  cardFooter?: React.ReactNode;
  className?: string;
  flex?: boolean;
}

const RootCard = ({
  title,
  description,
  cardHeader,
  cardContent,
  cardFooter,
  className,
  flex,
}: IProps) => {
  return (
    <Card
      className={cn(
        'border-secondary/70 bg-gradient-to-b from-[#fef2eb] to-[#f3f3fc]',
        className
      )}
    >
      <CardHeader
        className={cn(flex && 'flex flex-row items-center justify-between space-y-0')}
      >
        {title && <CardTitle className="text-xl">{title}</CardTitle>}
        {description && <CardDescription>{description}</CardDescription>}
        {cardHeader && cardHeader}
      </CardHeader>
      <CardContent>{cardContent}</CardContent>
      {cardFooter && <CardFooter>{cardFooter}</CardFooter>}
    </Card>
  );
};

export default RootCard;
