'use client';

import React, { useLayoutEffect, useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import useIntlTranslations from '@/hooks/use-intl-translations';
import { Button } from '../ui/button';
import { cn } from '@/lib/utils';
import useUrlPath from '@/hooks/use-urlPath';
import { Modal } from '../ui/dialog';
import { TbEdit } from 'react-icons/tb';
import { RiDeleteBin6Line } from 'react-icons/ri';
import { BiMessageDetail } from 'react-icons/bi';
import Image from 'next/image';
import { SheetDrawer } from '../ui/sheet';
import DeleteModal from '../modals/delete-modal';
import toast from 'react-hot-toast';
import NoData from '../no-data';
import Link from 'next/link';
import { MdExplore } from 'react-icons/md';
import { deleteData } from '@/app/api/services';

interface IProps extends React.HTMLAttributes<HTMLDivElement> {
  headCell: string[];
  bodyCell: any[];
  ModalForm: React.FC<{ user: string }>;
  pages: number;
}

const PageTable = ({ headCell, bodyCell, pages, ModalForm, className }: IProps) => {
  const { g } = useIntlTranslations();
  const [tableData, setTableData] = useState(bodyCell || []);

  const { setParams, param, pathname } = useUrlPath();
  const page = parseInt(param('page')) || 1;

  useLayoutEffect(() => {
    setTableData(bodyCell);
  }, [bodyCell]);

  const handlePage = (p: number) => {
    setParams('page', p.toString());
  };

  const handleDelete = async (item: any) => {
    try {
      const response = await deleteData({
        where: { id: item.id },
      });

      if (response.error) {
        console.error('Delete failed:', response.error);
        return toast.error(`${g('deleted failed')} ${item.fullname}`);
      } else {
        return toast.success(`${item.fullname} ${g('deleted successfully')}`);
      }
    } catch (error) {
      console.error('Delete error:', error);
      toast.error(`${g('deleted failed')} ${item.fullname}`);
    }
  };

  return (
    <div className="-mt-14">
      {/* pagination */}
      <div className="w-full flex justify-center items-center gap-2 py-2">
        <Button
          size={'sm'}
          onClick={() => handlePage(page > 0 ? page - 1 : page)}
          disabled={page === 1}
        >
          {'<'}
        </Button>
        <Button size={'sm'} onClick={() => handlePage(1)} disabled={page === 1}>
          1
        </Button>

        {page > 1 && page < pages && <Button disabled> {page} </Button>}

        {pages > 1 && (
          <Button size={'sm'} onClick={() => handlePage(pages)} disabled={page === pages}>
            {pages}
          </Button>
        )}

        <Button
          size={'sm'}
          onClick={() => handlePage(page < pages ? page + 1 : page)}
          disabled={page === pages}
        >
          {'>'}
        </Button>
      </div>

      {tableData.length === 0 ? (
        <NoData />
      ) : (
        <Table className={cn('gradient', className)}>
          <TableHeader>
            <TableRow>
              {headCell.map((item, index) => (
                <TableHead key={index}>{g(item)}</TableHead>
              ))}
              <TableHead className="text-center">{g('More')}</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {tableData &&
              tableData.map((item, index) => (
                <TableRow key={index}>
                  {headCell.map((cell, idx) => {
                    const key = cell.toLowerCase().replace(/\s+/g, '');
                    if (cell === 'Avatar') {
                      return (
                        <TableCell key={idx} className="max-w-16 overflow-scroll text-sm">
                          <Image src={item.avatar} alt="avatar" width={30} height={30} />
                        </TableCell>
                      );
                    }
                    return (
                      <TableCell key={idx} className="max-w-28 overflow-scroll text-sm">
                        {item[key]}
                      </TableCell>
                    );
                  })}

                  {/* more action */}
                  {headCell.length > 0 && (
                    <TableCell className="text-sm flex items-cneter justify-center gap-4">
                      <Link
                        href={`${pathname}/${item.id}`}
                        className="bg-secondary/80 hover:bg-secondary text-white text-sm p-2 rounded-md z-[1]"
                      >
                        <MdExplore size={14} />
                      </Link>
                      <SheetDrawer
                        sheetTrigger={<TbEdit size={14} />}
                        sheetTitle={`Edit ${item.fullname} Data`}
                        sheetContent={<ModalForm user={item.id} />}
                      />
                      <Modal
                        modalTitle={`Send Message to ${item.fullname}`}
                        modalTrigger={<BiMessageDetail size={14} />}
                        modalContent={<div className="flex flex-col gap-2"></div>}
                      />
                      <Modal
                        modalTitle={`${g('Delete')} ${item.fullname}`}
                        modalTrigger={<RiDeleteBin6Line size={14} />}
                        modalContent={
                          <DeleteModal
                            itemName={item.fullname}
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

      {/* pagination */}
      <div className="w-full flex justify-end items-center gap-2 py-2">
        <Button
          size={'sm'}
          onClick={() => handlePage(page > 0 ? page - 1 : page)}
          disabled={page === 1}
        >
          {'<'}
        </Button>
        <Button size={'sm'} onClick={() => handlePage(1)} disabled={page === 1}>
          1
        </Button>

        {page > 1 && page < pages && <Button disabled> {page} </Button>}

        {pages > 1 && (
          <Button size={'sm'} onClick={() => handlePage(pages)} disabled={page === pages}>
            {pages}
          </Button>
        )}

        <Button
          size={'sm'}
          onClick={() => handlePage(page < pages ? page + 1 : page)}
          disabled={page === pages}
        >
          {'>'}
        </Button>
      </div>
    </div>
  );
};

export default PageTable;
