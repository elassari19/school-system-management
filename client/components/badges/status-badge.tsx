import React from 'react';
import { cn } from '@/lib/utils';
import { Badge } from '../ui/badge';

const toneStyles = {
  success: 'border-transparent bg-emerald-100 text-emerald-700',
  warning: 'border-transparent bg-amber-100 text-amber-700',
  destructive: 'border-transparent bg-destructive/10 text-destructive',
  info: 'border-transparent bg-secondary/10 text-secondary',
  muted: 'border-transparent bg-muted text-muted-foreground',
} as const;

const statusTone: Record<string, keyof typeof toneStyles> = {
  Available: 'success',
  'In Stock': 'success',
  Published: 'success',
  Active: 'success',
  Paid: 'success',
  Posted: 'success',
  Approved: 'success',
  Lent: 'info',
  Reconciled: 'info',
  'Low Stock': 'warning',
  Draft: 'warning',
  Partial: 'warning',
  Pending: 'warning',
  Overdue: 'destructive',
  'Out of Stock': 'destructive',
  Inactive: 'destructive',
  Rejected: 'destructive',
  Archived: 'muted',
};

interface IProps {
  status: string;
  className?: string;
}

const StatusBadge = ({ status, className }: IProps) => {
  const tone = statusTone[status] ?? 'muted';

  return (
    <Badge variant="outline" className={cn(toneStyles[tone], 'capitalize', className)}>
      {status}
    </Badge>
  );
};

export default StatusBadge;
