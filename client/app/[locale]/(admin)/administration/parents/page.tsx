import React from 'react';
import { getTranslations } from 'next-intl/server';
import { Baby, Users, Wallet } from 'lucide-react';
import StaffPage, { ApiParent } from '@/components/template/staff-page';
import { calculateStats } from '@/helpers/stats-function';
import { getParentsListQuery } from '@/app/api/administration';

export default async function ParentsAdminPage() {
  const g = await getTranslations('global');

  let parents: ApiParent[] = [];
  try {
    const data = await getParentsListQuery();
    if (Array.isArray(data)) parents = data;
  } catch (error) {
    console.error('Failed to load parents:', error);
  }

  const { male, female, total } = calculateStats(
    parents.map((p) => ({
      gender: (p.gender || '').toLowerCase(),
      age: p.age || 0,
    }))
  );

  const avgExpenses = total
    ? parents.reduce((sum: number, p) => sum + (p.salary || 0), 0) / total
    : 0;

  return (
    <StaffPage
      parents={parents}
      staffRole="PARENT"
      actionTarget="Parent"
      searchPlaceholder={`${g('Search')} ${g('Parent')}...`}
      overviewData={[
        {
          icon: Users,
          title: `${g('Total')} ${g('Parents')}`,
          currentValue: `${total}`,
          pastValue: `+12 ${g('from last year')}`,
        },
        {
          icon: Baby,
          title: `${g('Male')} ${g('Parents')}`,
          currentValue: `${male.length}`,
          pastValue: `${g('from last year')}: +6`,
        },
        {
          icon: Baby,
          title: `${g('Female')} ${g('Parents')}`,
          currentValue: `${female.length}`,
          pastValue: `${g('from last year')}: +6`,
        },
        {
          icon: Wallet,
          title: `${g('Average')} ${g('Expenses')}`,
          currentValue: `$ ${Math.round(avgExpenses).toLocaleString()}`,
          pastValue: `+2.4% ${g('from last year')}`,
        },
      ]}
      headColumns={[
        { header: 'Avatar', key: 'avatar', type: 'avatar' },
        { header: 'Full Name', key: 'fullname' },
        { header: 'Phone', key: 'phone' },
        { header: 'Gender', key: 'gender' },
        { header: 'Children', key: 'children' },
        { header: 'Expenses', key: 'expenses' },
        { header: 'Status', key: 'status', type: 'status' },
      ]}
    />
  );
}
