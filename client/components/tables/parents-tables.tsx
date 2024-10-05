'use client';

import React, { useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { parentType } from '@/lib/types';
import { ChevronDown, ChevronRight } from 'lucide-react'; // Import icons
import { useTranslations } from 'next-intl';

interface IProps {
  data: parentType[];
}

const ParentChildTable = ({ data }: IProps) => {
  const t = useTranslations();
  const [expandedRows, setExpandedRows] = useState<Record<string, boolean>>({});

  const toggleRow = (id: string) => {
    setExpandedRows((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  return (
    <Table className="border">
      <TableHeader>
        <TableRow>
          <TableHead></TableHead>
          <TableHead>{t('Avatar')}</TableHead>
          <TableHead>{t('Full Name')}</TableHead>
          <TableHead>{t('Gender')}</TableHead>
          <TableHead>{t('Address')}</TableHead>
          <TableHead>{t('Children')}</TableHead>
          <TableHead>{t('Expenses')}</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {data.map((parent) => (
          <React.Fragment key={parent.id}>
            <TableRow>
              <TableCell>
                <button onClick={() => toggleRow(`${parent.id}`)}>
                  {expandedRows[parent.id] ? (
                    <ChevronDown size={20} />
                  ) : (
                    <ChevronRight size={20} />
                  )}
                </button>
              </TableCell>
              <TableCell>
                <Avatar>
                  <AvatarImage src={parent.avatar} />
                  <AvatarFallback>{parent.fullname[0]}</AvatarFallback>
                </Avatar>
              </TableCell>
              <TableCell>{parent.fullname}</TableCell>
              <TableCell>{parent.gender}</TableCell>
              <TableCell>{parent.address}</TableCell>
              <TableCell>{parent.children.length}</TableCell>
              <TableCell>${parent.expenses}</TableCell>
            </TableRow>
            {expandedRows[parent.id] && (
              <>
                <TableRow className="bg-background">
                  <TableHead>{t('Role')}</TableHead>
                  <TableHead>{t('Avatar')}</TableHead>
                  <TableHead>{t('Full Name')}</TableHead>
                  <TableHead>{t('Gender')}</TableHead>
                  <TableHead>{t('Class')}</TableHead>
                  <TableHead>{t('Grade')}</TableHead>
                  <TableHead>{t('Attendance')}</TableHead>
                  <TableHead>{t('Status')}</TableHead>
                </TableRow>
                {parent.children.map((child) => (
                  <TableRow className="p-2 [&>*]:py-1 bg-background">
                    <TableCell>{t('Student')}</TableCell>
                    <TableCell>
                      <Avatar className="w-8 h-8">
                        <AvatarImage src={child.avatar} />
                        <AvatarFallback>{child.fullname}</AvatarFallback>
                      </Avatar>
                    </TableCell>
                    <TableCell>{child.fullname}</TableCell>
                    <TableCell>{t(child.gender)}</TableCell>
                    <TableCell>{child.class}</TableCell>
                    <TableCell>{child.grade}</TableCell>
                    <TableCell>{child.attendance}%</TableCell>
                    <TableCell>{t(child.status)}</TableCell>
                  </TableRow>
                ))}
              </>
            )}
          </React.Fragment>
        ))}
      </TableBody>
    </Table>
  );
};

export default ParentChildTable;
