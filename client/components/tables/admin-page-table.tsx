'use client';

import React, { useLayoutEffect, useMemo, useState } from 'react';
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
import { SheetDrawer } from '../ui/sheet';
import { Modal } from '../ui/dialog';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { TbEdit } from 'react-icons/tb';
import { RiDeleteBin6Line } from 'react-icons/ri';
import { deleteData } from '@/app/api/services';
import useUrlPath from '@/hooks/use-urlPath';
import useIntlTranslations from '@/hooks/use-intl-translations';
import NoData from '../no-data';
import DeleteModal from '../modals/delete-modal';
import StaffForm from '../forms/staff-form';
import toast from 'react-hot-toast';

export interface ColumnConfig {
  header: string;
  key: string;
  type?: 'avatar' | 'status' | 'text';
  className?: string;
}

export interface AdminFormConfig {
  actionLabel: string;
  staffRole?: 'ADMIN' | 'PARENT';
}

export type TableRowData = {
  id?: string;
  fullname?: string;
} & Record<string, string | number | undefined>;

interface IProps extends React.HTMLAttributes<HTMLDivElement> {
  columns: ColumnConfig[];
  bodyCell: TableRowData[];
  pageSize?: number;
  target?: string;
  readOnly?: boolean;
  formConfig?: AdminFormConfig;
}

const initialsOf = (name: string) =>
  String(name || '')
    .split(' ')
    .map((part) => part[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();

const AdminPageTable = ({
  columns,
  bodyCell,
  pageSize = 5,
  target = 'user',
  readOnly = false,
  formConfig,
  className,
}: IProps) => {
  const { g } = useIntlTranslations();
  const [tableData, setTableData] = useState(bodyCell || []);
  const { setParams, param } = useUrlPath();

  const page = parseInt(param('page')) || 1;
  const q = param('q') || '';
  const isSearchActive = q.length > 2;

  useLayoutEffect(() => {
    setTableData(bodyCell);
  }, [bodyCell]);

  const filteredData = useMemo(() => {
    if (!isSearchActive) return tableData;
    const needle = q.toLowerCase();
    return tableData.filter((item) =>
      columns.some((column) =>
        String(item[column.key] ?? '')
          .toLowerCase()
          .includes(needle)
      )
    );
  }, [tableData, columns, isSearchActive, q]);

  const pages = Math.max(1, Math.ceil(filteredData.length / pageSize));
  const safePage = Math.min(page, pages);
  const pageData = filteredData.slice((safePage - 1) * pageSize, safePage * pageSize);

  const handlePage = (p: number) => {
    if (p >= 1 && p <= pages) setParams('page', p.toString());
  };

  const handleDelete = async (item: TableRowData) => {
    try {
      const response = await deleteData({ where: { id: item.id } }, target);
      if (response.error) {
        return toast.error(`${g('deleted failed')} ${item.fullname}`);
      }
      setTableData((prev) => prev.filter((row) => row.id !== item.id));
      toast.success(`${item.fullname} ${g('deleted successfully')}`);
    } catch (error) {
      toast.error(`${g('deleted failed')} ${item.fullname}`);
    }
  };

  const Pagination = ({ align }: { align: 'end' | 'center' }) => (
    <div
      className={cn(
        'w-full flex items-center gap-2 py-2',
        align === 'center' ? 'justify-center' : 'justify-end'
      )}
    >
      <Button size="sm" onClick={() => handlePage(safePage - 1)} disabled={safePage === 1}>
        {'<'}
      </Button>
      <Button size="sm" onClick={() => handlePage(1)} disabled={safePage === 1}>
        1
      </Button>
      {safePage > 1 && safePage < pages && <Button disabled>{safePage}</Button>}
      {pages > 1 && (
        <Button size="sm" onClick={() => handlePage(pages)} disabled={safePage === pages}>
          {pages}
        </Button>
      )}
      <Button size="sm" onClick={() => handlePage(safePage + 1)} disabled={safePage === pages}>
        {'>'}
      </Button>
    </div>
  );

  return (
    <div className={cn('-mt-14', className)}>
      <Pagination align="center" />

      {pageData.length === 0 ? (
        <NoData />
      ) : (
        <Table className="gradient">
          <TableHeader>
            <TableRow>
              {columns.map((column) => (
                <TableHead key={column.key}>{g(column.header)}</TableHead>
              ))}
              {!readOnly && <TableHead className="text-center">{g('More')}</TableHead>}
            </TableRow>
          </TableHeader>

          <TableBody>
            {pageData.map((item, index) => (
              <TableRow key={item.id ?? index}>
                {columns.map((column) => (
                  <TableCell key={column.key} className={cn('max-w-28 text-sm', column.className)}>
                    {column.type === 'avatar' ? (
                      <Avatar className="w-9 h-9">
                        <AvatarImage src={String(item[column.key] ?? '')} alt={item.fullname || ''} />
                        <AvatarFallback>{initialsOf(item.fullname || '')}</AvatarFallback>
                      </Avatar>
                    ) : column.type === 'status' ? (
                      <span
                        className={cn(
                          'px-2 py-1 rounded-full text-xs font-semibold whitespace-nowrap',
                          item[column.key] === g('Active')
                            ? 'bg-green-100 text-green-700'
                            : item[column.key] === g('On Leave')
                              ? 'bg-amber-100 text-amber-700'
                              : 'bg-red-100 text-red-700'
                        )}
                      >
                        {item[column.key]}
                      </span>
                    ) : (
                      String(item[column.key] ?? '')
                    )}
                  </TableCell>
                ))}

                {!readOnly && (
                  <TableCell className="text-sm flex items-center justify-center gap-4">
                    {formConfig && (
                      <SheetDrawer
                        sheetTrigger={<TbEdit size={14} />}
                        sheetTitle={`${g('Edit')} ${item.fullname}`}
                        sheetContent={
                          <StaffForm
                            user={item.id}
                            actionLabel={formConfig.actionLabel}
                            staffRole={formConfig.staffRole}
                          />
                        }
                      />
                    )}
                    <Modal
                      modalTitle={`${g('Delete')} ${item.fullname}`}
                      modalTrigger={<RiDeleteBin6Line size={14} />}
                      modalContent={
                        <DeleteModal
                          itemName={item.fullname ?? ""}
                          handleSubmit={() => handleDelete(item)}
                        />
                      }
                    />
                  </TableCell>
                )}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}

      <Pagination align="end" />
    </div>
  );
};

export default AdminPageTable;
