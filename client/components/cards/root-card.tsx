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
  cardContent: React.ReactNode;
  cardFooter?: React.ReactNode;
  className?: string;
}

const RootCard = ({
  title,
  description,
  cardContent,
  cardFooter,
  className,
}: IProps) => {
  return (
    <Card
      className={cn(
        'border-secondary/70 bg-gradient-to-b from-white to-secondary/10',
        className
      )}
    >
      <CardHeader>
        {title && <CardTitle className="text-xl">{title}</CardTitle>}
        {description && <CardDescription>{description}</CardDescription>}
      </CardHeader>
      <CardContent>{cardContent}</CardContent>
      {cardFooter && <CardFooter>{cardFooter}</CardFooter>}
    </Card>
  );
};

export default RootCard;
