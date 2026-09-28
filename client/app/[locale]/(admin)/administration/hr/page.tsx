import React from 'react';
import { getTranslations } from 'next-intl/server';
import { UserCog, Briefcase, Users, Wallet } from 'lucide-react';
import StaffPage from '@/components/template/staff-page';
import { hrData } from '@/lib/dummy-data';
import { calculateStaffStats } from '@/helpers/stats-function';

export default async function HRPage() {
  const g = await getTranslations('global');

  const { total, active, male, female, avgAge, totalSalary } = calculateStaffStats(hrData);

  return (
    <StaffPage
      staff={hrData}
      actionTarget="HR"
      searchPlaceholder={`${g('Search')} ${g('HR')}...`}
      readOnly
      overviewData={[
        {
          icon: UserCog,
          title: `HR ${g('Total')} ${g('Staff')}`,
          currentValue: `${total}`,
          pastValue: `${active} ${g('Active')}`,
        },
        {
          icon: Briefcase,
          title: `${g('Recruitment')}`,
          currentValue: '3',
          pastValue: `+2 ${g('Open Positions')}`,
        },
        {
          icon: Users,
          title: `${g('Average')} ${g('Age')}`,
          currentValue: avgAge.toFixed(1),
          pastValue: `${male} ${g('Male')} / ${female} ${g('Female')}`,
        },
        {
          icon: Wallet,
          title: `${g('Payroll')} ${g('Monthly')}`,
          currentValue: `$ ${Math.round(totalSalary / 12).toLocaleString()}`,
          pastValue: `+1.8% ${g('from last year')}`,
        },
      ]}
      headColumns={[
        { header: 'Avatar', key: 'avatar', type: 'avatar' },
        { header: 'Full Name', key: 'fullname' },
        { header: 'Position', key: 'position' },
        { header: 'Department', key: 'department' },
        { header: 'Phone', key: 'phone' },
        { header: 'Status', key: 'status', type: 'status' },
      ]}
    />
  );
}
