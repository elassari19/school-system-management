import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { getTeacherDetailsQuery } from '@/app/api/academic';
import RootCard from '@/components/cards/root-card';
import { getTranslations } from 'next-intl/server';
import { FaBookBookmark, FaBriefcase } from 'react-icons/fa6';
import ProfileTabs from '@/components/tabs/profile-tabs';

interface IProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function page(props: IProps) {
  const params = await props.params;

  const [g, teacher] = await Promise.all([
    getTranslations('global'),
    getTeacherDetailsQuery(params.id),
  ]);

  return (
    <div className="p-6 h-full overflow-auto">
      <RootCard
        className=" h-40 rounded-t-lg relative mb-16"
        cardContent={
          <>
            <div className="absolute -bottom-12 left-8 bg-secondary/50 rounded-full p-1 border-2 border-secondary/50 shadow-lg">
              <img
                src={teacher.image || '/images/placeholder-teacher.jpg'}
                alt={'user image'}
                className="w-32 h-32 rounded-full object-cover"
              />
            </div>
            <div className="absolute bottom-4 left-48">
              <h1 className="text-2xl font-bold">{teacher.fullname}</h1>
              <div className="flex items-center gap-4 text-sm">
                <span className="flex items-center gap-1">
                  <FaBriefcase className="text-lg" />
                  {teacher.teacher?.subject?.name || 'Teacher'}
                </span>
                <span className="flex items-center gap-1">
                  <FaBookBookmark className="text-lg" />
                  {teacher.address || 'No address'}
                </span>
              </div>
            </div>
          </>
        }
      />

      <ProfileTabs
        tabs={[
          { id: 'profile', label: g('Profile'), content: <div>Profile</div> },
          { id: 'classes', label: g('Classes'), content: <div>Classes</div> },
          { id: 'schedule', label: g('Schedule'), content: <div>Schedule</div> },
          { id: 'education', label: g('Education'), content: <div>Education</div> },
          { id: 'experience', label: g('Experience'), content: <div>Experience</div> },
        ]}
        defaultValue="profile"
      />
    </div>
  );
}
