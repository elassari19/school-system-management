import { Card, CardContent, CardHeader } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { useTranslations } from 'next-intl';
import RootCard from '../cards/root-card';

interface SubjectProgress {
  name: string;
  totalCourses: number;
  averageGrade: number;
  status: 'excellent' | 'good' | 'average' | 'poor';
}

interface Props {
  data: SubjectProgress[];
}

export default function SubjectProgressTable({ data }: Props) {
  const g = useTranslations('global');
  const a = useTranslations('academic');

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'excellent':
        return 'text-green-600';
      case 'good':
        return 'text-blue-600';
      case 'average':
        return 'text-yellow-600';
      case 'poor':
        return 'text-red-600';
      default:
        return '';
    }
  };

  return (
    <RootCard
      title={a('Subject Progress')}
      cardContent={
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>{g('Subject')}</TableHead>
              <TableHead>
                {g('Total')} {g('Courses')}
              </TableHead>
              <TableHead>
                {g('Average')} {g('Grade')}
              </TableHead>
              <TableHead>{g('Status')}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((subject, index) => (
              <TableRow key={index}>
                <TableCell>{subject.name}</TableCell>
                <TableCell>{subject.totalCourses}</TableCell>
                <TableCell>{subject.averageGrade}%</TableCell>
                <TableCell className={getStatusColor(subject.status)}>
                  {g(subject.status)}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      }
    />
  );
}
