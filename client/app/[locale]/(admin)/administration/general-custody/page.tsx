import React from 'react';
import { getTranslations } from 'next-intl/server';
import { Building2, ShieldCheck, Users, Wallet } from 'lucide-react';
import StaffPage from '@/components/template/staff-page';
import { custodyData } from '@/lib/dummy-data';
import { calculateStaffStats } from '@/helpers/stats-function';

export default async function GeneralCustodyPage() {
  const g = await getTranslations('global');

  const { total, active, avgAge, totalSalary } = calculateStaffStats(custodyData);

  return (
    <StaffPage
      staff={custodyData}
      actionTarget="General Custody"
      searchPlaceholder={`${g('Search')} ${g('General Custody')}...`}
      readOnly
      overviewData={[
        {
          icon: Building2,
          title: `${g('Total')} ${g('Custodians')}`,
          currentValue: `${total}`,
          pastValue: `${active} ${g('Active')}`,
        },
        {
          icon: ShieldCheck,
          title: `${g('Active')} ${g('Staff')}`,
          currentValue: `${active}`,
          pastValue: `${total - active} ${g('Inactive')}`,
        },
        {
          icon: Users,
          title: `${g('Average')} ${g('Age')}`,
          currentValue: avgAge.toFixed(1),
          pastValue: `+0.2% ${g('from last year')}`,
        },
        {
          icon: Wallet,
          title: `${g('Salary')} ${g('Average')}`,
          currentValue: total ? `$ ${Math.round(totalSalary / total).toLocaleString()}` : '$0',
          pastValue: `+2.1% ${g('from last year')}`,
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
