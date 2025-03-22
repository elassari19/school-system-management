import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { useTranslations } from 'next-intl';
import RootCard from './root-card';

interface GroupMember {
  id: string;
  name: string;
  role: 'leader' | 'member';
}

interface Group {
  id: string;
  name: string;
  subject: string;
  members: GroupMember[];
  projectName: string;
  deadline: string;
}

interface Props {
  groups: Group[];
}

export default function StudentGroups({ groups }: Props) {
  const g = useTranslations('global');
  const a = useTranslations('academic');

  return (
    <RootCard
      title={a('Student Groups')}
      cardContent={
        <div className="space-y-4">
          {groups.map((group) => (
            <div key={group.id} className="p-4 border rounded-lg space-y-3">
              <div className="flex justify-between items-center">
                <h4 className="font-medium">{group.name}</h4>
                <span className="text-sm text-muted-foreground">{group.subject}</span>
              </div>
              <div className="text-sm">
                <p className="text-muted-foreground">
                  {g('Project')}: {group.projectName}
                </p>
                <p className="text-muted-foreground">
                  {g('Deadline')}: {group.deadline}
                </p>
              </div>
              <div className="space-y-2">
                <p className="text-sm font-medium">{g('Members')}:</p>
                <div className="grid grid-cols-2 gap-2">
                  {group.members.map((member) => (
                    <div key={member.id} className="flex items-center space-x-2">
                      <span className="text-sm">{member.name}</span>
                      <span className="text-xs text-muted-foreground">({g(member.role)})</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      }
    />
  );
}
