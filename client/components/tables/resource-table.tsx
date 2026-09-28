'use client';

import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import useIntlTranslations from '@/hooks/use-intl-translations';
import SearchInput from '@/components/inputs/search-input';
import StatusBadge from '@/components/badges/status-badge';
import NoData from '@/components/no-data';

export type ResourceColumnType = 'text' | 'status' | 'currency' | 'percent' | 'fraction' | 'date';

export interface ResourceColumn<T> {
  key: keyof T & string;
  header: string;
  type?: ResourceColumnType;
  /** used by the `fraction` type to build `value / total` */
  totalKey?: keyof T & string;
  className?: string;
}

interface IProps<T> extends React.HTMLAttributes<HTMLDivElement> {
  columns: ResourceColumn<T>[];
  data: T[];
  searchKeys: readonly (keyof T & string)[];
  searchPlaceholder: string;
  pageSize?: number;
}

const ResourceTable = <T extends object>({
  columns,
  data,
  searchKeys,
  searchPlaceholder,
  pageSize = 5,
  className,
}: IProps<T>) => {
  const { g } = useIntlTranslations();
  const [query, setQuery] = React.useState('');
  const [page, setPage] = React.useState(1);

  const filtered = React.useMemo(() => {
    const q = query.trim().toLowerCase();
    if (q.length < 2) return data;
    return data.filter((row) =>
      searchKeys.some((key) => String(row[key] ?? '').toLowerCase().includes(q))
    );
  }, [data, query, searchKeys]);

  const pages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const safePage = Math.min(page, pages);
  const rows = filtered.slice((safePage - 1) * pageSize, safePage * pageSize);

  const renderCell = (row: T, column: ResourceColumn<T>) => {
    const value = row[column.key];

    switch (column.type) {
      case 'status':
        return <StatusBadge status={String(value ?? '')} />;
      case 'currency':
        return `$${Number(value ?? 0).toFixed(2)}`;
      case 'percent':
        return (
          <div className="flex items-center gap-2">
            <div className="h-1.5 w-16 shrink-0 overflow-hidden rounded-full bg-secondary/15">
              <div
                className="h-full rounded-full bg-secondary"
                style={{ width: `${Number(value ?? 0)}%` }}
              />
            </div>
            <span className="text-xs">{Number(value ?? 0)}%</span>
          </div>
        );
      case 'fraction':
        return `${Number(value ?? 0)} / ${Number(column.totalKey ? row[column.totalKey] : 0) ?? 0}`;
      case 'date':
        return value ? new Date(String(value)).toLocaleDateString() : '';
      default:
        return String(value ?? '');
    }
  };

  return (
    <div className={cn('flex flex-col gap-4', className)}>
      <div className="flex flex-wrap items-center justify-between gap-2">
        <SearchInput
          placeholder={searchPlaceholder}
          className="max-w-64"
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
            setQuery(e.target.value);
            setPage(1);
          }}
        />
        <p className="text-sm text-muted-foreground">
          {filtered.length} {g('Items')}
        </p>
      </div>

      {filtered.length === 0 ? (
        <NoData />
      ) : (
        <Table className="gradient">
          <TableHeader>
            <TableRow>
              {columns.map((column) => (
                <TableHead key={column.key}>{g(column.header)}</TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.map((row, rowIndex) => (
              <TableRow key={rowIndex}>
                {columns.map((column) => (
                  <TableCell
                    key={column.key}
                    className={cn('max-w-40 truncate text-sm', column.className)}
                  >
                    {renderCell(row, column)}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}

      <div className="flex items-center justify-center gap-2">
        <Button size="sm" variant="outline" disabled={safePage === 1} onClick={() => setPage(1)}>
          {'<<'}
        </Button>
        <Button
          size="sm"
          variant="outline"
          disabled={safePage === 1}
          onClick={() => setPage(safePage - 1)}
        >
          {'<'}
        </Button>
        <span className="px-2 text-sm text-muted-foreground">
          {safePage} / {pages}
        </span>
        <Button
          size="sm"
          variant="outline"
          disabled={safePage === pages}
          onClick={() => setPage(safePage + 1)}
        >
          {'>'}
        </Button>
        <Button size="sm" variant="outline" disabled={safePage === pages} onClick={() => setPage(pages)}>
          {'>>'}
        </Button>
      </div>
    </div>
  );
};

export default ResourceTable;
