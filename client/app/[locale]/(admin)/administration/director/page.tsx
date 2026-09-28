import React from 'react';
import { getTranslations } from 'next-intl/server';
import { Briefcase, ShieldCheck, Users, Wallet } from 'lucide-react';
import StaffPage from '@/components/template/staff-page';
import { directorData } from '@/lib/dummy-data';
import { calculateStaffStats } from '@/helpers/stats-function';

export default async function DirectorPage() {
  const g = await getTranslations('global');

  const { total, active, avgAge, totalSalary } = calculateStaffStats(directorData);

  return (
    <StaffPage
      staff={directorData}
      actionTarget="Director"
      searchPlaceholder={`${g('Search')} ${g('Director')}...`}
      readOnly
      overviewData={[
        {
          icon: Briefcase,
          title: `${g('Total')} ${g('Directors')}`,
          currentValue: `${total}`,
          pastValue: `${active} ${g('Active')}`,
        },
        {
          icon: ShieldCheck,
          title: `${g('Active')} ${g('Staff')}`,
          currentValue: `${active}`,
          pastValue: `${total - active} ${g('On Leave')}`,
        },
        {
          icon: Users,
          title: `${g('Average')} ${g('Age')}`,
          currentValue: avgAge.toFixed(1),
          pastValue: `+0.4% ${g('from last year')}`,
        },
        {
          icon: Wallet,
          title: `${g('Salary')} ${g('Average')}`,
          currentValue: total ? `$ ${Math.round(totalSalary / total).toLocaleString()}` : '$0',
          pastValue: `+3.2% ${g('from last year')}`,
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
