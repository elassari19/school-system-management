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
import { Badge } from '@/components/ui/badge';
import NoData from '@/components/no-data';
import useIntlTranslations from '@/hooks/use-intl-translations';
import { SheetDrawer } from '../ui/sheet';
import { Modal } from '../ui/dialog';
import DeleteModal from '../modals/delete-modal';
import { TbEdit } from 'react-icons/tb';
import { RiDeleteBin6Line } from 'react-icons/ri';
import toast from 'react-hot-toast';
import AddCourseForm from '../forms/course-form';
import { deleteCourseQuery } from '@/app/api/academic';

interface CourseRecord {
  id: string;
  title?: string;
  instructor?: string;
  level?: string;
  chapters?: unknown[];
  price?: number;
  createdAt?: string;
}

interface Props {
  courses: CourseRecord[];
  subjectId: string;
}

const formatDate = (date?: string) => {
  if (!date) return '-';
  return new Date(date).toLocaleDateString('en-GB', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

const CoursesTable = ({ courses, subjectId }: Props) => {
  const { g } = useIntlTranslations();

  const handleDelete = async (course: CourseRecord) => {
    try {
      const response = await deleteCourseQuery(course.id);
      if (response?.error) {
        return toast.error(`${course.title} ${g('deleted failed')}`);
      }
      return toast.success(`${course.title} ${g('deleted successfully')}`);
    } catch (error) {
      return toast.error(`${course.title} ${g('deleted failed')}`);
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex justify-end">
        <SheetDrawer
          sheetTrigger={`${g('Add')} ${g('Course')}`}
          sheetTitle={`${g('Add')} ${g('Course')}`}
          sheetContent={<AddCourseForm subjectId={subjectId} />}
        />
      </div>

      {courses.length === 0 ? (
        <NoData />
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>{g('Course Title')}</TableHead>
              <TableHead>{g('Instructor')}</TableHead>
              <TableHead>{g('Level')}</TableHead>
              <TableHead>{g('Chapters')}</TableHead>
              <TableHead>{g('Price')}</TableHead>
              <TableHead>{g('Created At')}</TableHead>
              <TableHead className="text-center">{g('More')}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {courses.map((course) => (
              <TableRow key={course.id}>
                <TableCell className="font-medium">{course.title || '-'}</TableCell>
                <TableCell>{course.instructor || '-'}</TableCell>
                <TableCell>
                  {course.level ? <Badge variant="secondary">{course.level}</Badge> : '-'}
                </TableCell>
                <TableCell>{course.chapters?.length ?? 0}</TableCell>
                <TableCell>{course.price ? `$${course.price}` : '-'}</TableCell>
                <TableCell>{formatDate(course.createdAt)}</TableCell>
                <TableCell className="text-sm flex items-center justify-center gap-4">
                  <SheetDrawer
                    sheetTrigger={<TbEdit size={14} />}
                    sheetTitle={`${g('Edit')} ${course.title}`}
                    sheetContent={<AddCourseForm user={course.id} subjectId={subjectId} />}
                  />
                  <Modal
                    modalTitle={`${g('Delete')} ${course.title}`}
                    modalTrigger={<RiDeleteBin6Line size={14} />}
                    modalContent={
                      <DeleteModal
                        itemName={course.title || ''}
                        handleSubmit={() => handleDelete(course)}
                      />
                    }
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  );
};

export default CoursesTable;