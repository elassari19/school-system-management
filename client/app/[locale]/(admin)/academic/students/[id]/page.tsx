import { getUsers } from '@/app/api/dashboard';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { getTranslations } from 'next-intl/server';
import Image from 'next/image';
import { getAllSubject } from '../../../../../api/academic';

interface IProps {
  params: Promise<{
    id: string;
  }>;
}

async function page(props: IProps) {
  const params = await props.params;
  const g = await getTranslations('global');

  const [user] = await getUsers({
    where: {
      id: params.id,
      role: 'STUDENT',
    },
    include: {
      student: {
        include: {
          class: true,
          grade: true,
          parent: true,
        },
      },
    },
  });
  const subject = await getAllSubject();
  console.log('student', subject);
  if (!user.student) {
    return <div>{'No student found'}</div>;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
      <div className="col-span-full md:col-span-3 grid gap-4">
        {/* welcome card */}
        <Card className="bg-primary">
          <CardHeader className="">
            <div className="flex items-center justify-between gap-2 md:px-4">
              <div>
                <Label className="font-bold">{g('Welcome')}</Label>
                <h2 className="text-xl font-semibold">{user.fullname}</h2>
                <h3 className="text-sm">{user.email}</h3>
              </div>

              <div>
                <Image
                  src={user.image || '/images/default-avatar.png'}
                  alt="avatar"
                  width={120}
                  height={120}
                  className="rounded-full"
                />
              </div>
            </div>
          </CardHeader>
        </Card>

        {/* subject progress table [subject name, total subject courses, grade average for each subject, ] */}

        {/* chart of attendence */}
      </div>
      <div className="col-span-full md:col-span-2 grid gap-4">
        {/* schedul/calder for this week */}
        {/* upcomming exams */}
        {/* list of joining groups */}
      </div>
    </div>
  );
}

export default page;
