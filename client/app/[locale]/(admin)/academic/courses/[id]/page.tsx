import { getCourseQuery } from '@/app/api/academic';
import RootCard from '@/components/cards/root-card';
import PageTemplate, { OverviewSection } from '@/components/template/page-template';
import ModulesCollapsible from '@/components/course-modules-collapsible';
import { Badge } from '@/components/ui/badge';
import NoData from '@/components/no-data';
import { getTranslations } from 'next-intl/server';
import { BookOpen, DollarSign, Layers, School, User, Wand2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from '@/i18n/routing';

interface IProps {
  params: Promise<{
    id: string;
  }>;
}

interface ModuleRecord {
  id: string;
  title?: string;
  description?: string;
  duration?: number;
  order?: number;
}

interface CourseRecord {
  id: string;
  title?: string;
  description?: string;
  instructor?: string;
  price?: number;
  level?: string;
  duration?: number;
  tags?: string[];
  thumbnail?: string;
  createdAt?: string;
  chapters?: ModuleRecord[];
  subject?: {
    id?: string;
    name?: string;
  };
  user?: {
    fullname?: string;
    email?: string;
  };
}

const formatDate = (date: string | Date | undefined) => {
  if (!date) return '-';
  return new Date(date).toLocaleDateString('en-GB', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

export default async function page(props: IProps) {
  const params = await props.params;

  const [g, courseData] = await Promise.all([getTranslations('global'), getCourseQuery(params.id)]);

  if (!courseData) {
    return (
      <div className="p-6 h-full flex items-center justify-center">
        <p className="text-lg font-medium">{g('No course found')}</p>
      </div>
    );
  }

  const course = courseData as CourseRecord;
  const modules = [...(course.chapters || [])].sort((a, b) => (a.order ?? 0) - (b.order ?? 0));

  const modulesContent =
    modules.length === 0 ? (
      <NoData />
    ) : (
      <ModulesCollapsible
        modules={modules}
        labels={{
          description: g('Description'),
          duration: g('Duration'),
          min: g('min'),
        }}
      />
    );

  return (
    <PageTemplate>
      <div className="flex justify-end">
        <Button asChild size="sm">
          <Link href={`/academic/courses/${course.id}/edit`}>
            <Wand2 className="h-4 w-4" /> {g('Edit in Course Builder')}
          </Link>
        </Button>
      </div>

      <RootCard
        className="h-40 rounded-t-lg relative mb-16"
        cardContent={
          <>
            <div className="absolute bottom-4 left-8 flex h-16 w-16 items-center justify-center rounded-full border-2 border-secondary/50 bg-secondary/50 p-1 shadow-lg">
              <BookOpen className="h-8 w-8 text-secondary" />
            </div>
            <div className="absolute bottom-4 left-48">
              <h1 className="text-2xl font-bold">{course.title}</h1>
              <div className="flex flex-wrap items-center gap-4 text-sm">
                <span className="flex items-center gap-1">
                  <User className="text-lg" />
                  {course.instructor || '-'}
                </span>
                <span className="flex items-center gap-1">
                  <Layers className="text-lg" />
                  {modules.length} {g('Modules')}
                </span>
                <span className="flex items-center gap-1">
                  <School className="text-lg" />
                  {course.subject?.name || '-'}
                </span>
                <span className="flex items-center gap-1">
                  {g('Created At')}: {formatDate(course.createdAt)}
                </span>
              </div>
            </div>
          </>
        }
      />

      <OverviewSection
        overviewData={[
          {
            icon: Layers,
            title: g('Modules'),
            currentValue: `${modules.length}`,
            pastValue: g('Course Details'),
          },
          {
            icon: DollarSign,
            title: g('Price'),
            currentValue: course.price ? `$${course.price}` : '-',
            pastValue: g('Course Details'),
          },
          {
            icon: BookOpen,
            title: g('Level'),
            currentValue: course.level || '-',
            pastValue: g('Course Details'),
          },
          {
            icon: User,
            title: g('Instructor'),
            currentValue: course.instructor || '-',
            pastValue: g('Course Details'),
          },
        ]}
      />

      <RootCard
        title={g('Course Details')}
        cardContent={
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="flex flex-col gap-1">
              <span className="text-xs font-medium text-muted-foreground">{g('Description')}</span>
              <span className="text-sm font-semibold">{course.description || '-'}</span>
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-xs font-medium text-muted-foreground">{g('Subject')}</span>
              <span className="text-sm font-semibold">{course.subject?.name || '-'}</span>
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-xs font-medium text-muted-foreground">{g('Duration')}</span>
              <span className="text-sm font-semibold">{course.duration || '-'}</span>
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-xs font-medium text-muted-foreground">{g('Created By')}</span>
              <span className="text-sm font-semibold">{course.user?.fullname || '-'}</span>
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-xs font-medium text-muted-foreground">{g('Tags')}</span>
              <div className="flex flex-wrap gap-1">
                {course.tags?.length
                  ? course.tags.map((tag) => (
                      <Badge key={tag} variant="secondary">
                        {tag}
                      </Badge>
                    ))
                  : '-'}
              </div>
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-xs font-medium text-muted-foreground">{g('Thumbnail')}</span>
              <span className="text-sm font-semibold break-all">{course.thumbnail || '-'}</span>
            </div>
          </div>
        }
      />

      <RootCard title={g('Modules')} cardContent={modulesContent} />
    </PageTemplate>
  );
}