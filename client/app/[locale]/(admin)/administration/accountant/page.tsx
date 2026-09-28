import React from 'react';
import { getTranslations } from 'next-intl/server';
import { Calculator, Coins, Users, Wallet } from 'lucide-react';
import StaffPage from '@/components/template/staff-page';
import { accountantData } from '@/lib/dummy-data';
import { calculateStaffStats } from '@/helpers/stats-function';

export default async function AccountantPage() {
  const g = await getTranslations('global');

  const { total, active, avgAge, totalSalary } = calculateStaffStats(accountantData);

  return (
    <StaffPage
      staff={accountantData}
      actionTarget="Accountant"
      searchPlaceholder={`${g('Search')} ${g('Accountant')}...`}
      readOnly
      overviewData={[
        {
          icon: Calculator,
          title: `${g('Total')} ${g('Accountants')}`,
          currentValue: `${total}`,
          pastValue: `${active} ${g('Active')}`,
        },
        {
          icon: Users,
          title: `${g('Average')} ${g('Age')}`,
          currentValue: avgAge.toFixed(1),
          pastValue: `+0.1% ${g('from last year')}`,
        },
        {
          icon: Wallet,
          title: `${g('Salary')} ${g('Average')}`,
          currentValue: total ? `$ ${Math.round(totalSalary / total).toLocaleString()}` : '$0',
          pastValue: `+4.0% ${g('from last year')}`,
        },
        {
          icon: Coins,
          title: `${g('Total')} ${g('Expenses')}`,
          currentValue: `$ ${totalSalary.toLocaleString()}`,
          pastValue: `${g('yearly')} ${g('Staff')} ${g('Salary')}`,
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
