import React from 'react';
import { getTranslations } from 'next-intl/server';
import PageTemplate, { OverviewSection } from '@/components/template/page-template';
import ResourceTable from '@/components/tables/resource-table';
import { eLearningColumns, eLearningSearchKeys } from '@/lib/resources-columns';
import { ELearningCourse, eLearningData } from '@/lib/resources-data';
import { FileClock, GraduationCap, PlayCircle, UsersRound } from 'lucide-react';

export default async function ELearningPage() {
  const g = await getTranslations('global');

  const enrolled = eLearningData.reduce((acc, course) => acc + course.enrolled, 0);
  const published = eLearningData.filter((course) => course.status === 'Published').length;
  const lessons = eLearningData.reduce((acc, course) => acc + course.lessons, 0);
  const withStudents = eLearningData.filter((course) => course.enrolled > 0);
  const avgCompletion = Math.round(
    withStudents.reduce((acc, course) => acc + course.completion, 0) /
      Math.max(1, withStudents.length)
  );

  return (
    <PageTemplate>
      <OverviewSection
        overviewData={[
          {
            icon: GraduationCap,
            title: `${g('Total')} ${g('Courses')}`,
            currentValue: `${eLearningData.length}`,
            pastValue: `${published} ${g('Published')}`,
          },
          {
            icon: UsersRound,
            title: `${g('Students')} ${g('Enrolled')}`,
            currentValue: `${enrolled}`,
            pastValue: `${g('active enrollments')}`,
          },
          {
            icon: PlayCircle,
            title: `${g('Total')} ${g('Lessons')}`,
            currentValue: `${lessons}`,
            pastValue: `${g('Lessons')}`,
          },
          {
            icon: FileClock,
            title: `${g('Completion')}`,
            currentValue: `${avgCompletion}%`,
            pastValue: `${g('avg. completion')}`,
          },
        ]}
      />

      <ResourceTable<ELearningCourse>
        columns={eLearningColumns}
        data={eLearningData}
        searchKeys={eLearningSearchKeys}
        searchPlaceholder={`${g('Search')} ${g('Course')}...`}
      />
    </PageTemplate>
  );
}
