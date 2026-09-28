import React from 'react';
import { getTranslations } from 'next-intl/server';
import { LucideIcon } from 'lucide-react';
import { StaffMember } from '@/lib/dummy-data';
import { parent } from '@/lib/types';
import PageTemplate, { OverviewSection } from '@/components/template/page-template';
import SearchInput from '@/components/inputs/search-input';
import { SheetDrawer } from '@/components/ui/sheet';
import AdminPageTable, { ColumnConfig } from '@/components/tables/admin-page-table';
import StaffForm from '@/components/forms/staff-form';

export type ApiParent = {
  id: string;
  email: string;
  fullname: string;
  phone: string;
  gender: string;
  age?: number;
  image: string;
  address: string;
  salary?: number | null;
  parent?: parent[];
};

export interface StaffOverviewItem {
  icon: LucideIcon;
  title: string;
  currentValue: string;
  pastValue: string;
}

interface IProps {
  overviewData: StaffOverviewItem[];
  staff?: StaffMember[];
  parents?: ApiParent[];
  headColumns: ColumnConfig[];
  actionTarget: string;
  searchPlaceholder: string;
  staffRole?: 'ADMIN' | 'PARENT';
  readOnly?: boolean;
  pageSize?: number;
}

const StaffPage = async ({
  overviewData,
  staff = [],
  parents = [],
  headColumns,
  actionTarget,
  searchPlaceholder,
  staffRole = 'ADMIN',
  readOnly = false,
  pageSize = 5,
}: IProps) => {
  const g = await getTranslations('global');

  const bodyCell = staff.length
    ? staff.map((member) => ({ ...member, status: g(member.status) }))
    : (parents || []).map((member) => ({
        id: member.id,
        avatar: member.image || '',
        fullname: member.fullname || '',
        email: member.email || '',
        phone: member.phone || '',
        gender: member.gender
          ? g(`${member.gender[0].toUpperCase()}${member.gender.slice(1)}`)
          : '',
        address: member.address || '',
        children: `${member.parent?.[0]?.children?.length ?? 0}`,
        expenses: `$ ${(member.salary || 0).toLocaleString()}`,
        status: g('Active'),
      }));

  return (
    <PageTemplate>
      <OverviewSection overviewData={overviewData} />

      <section className="flex justify-between items-center">
        <SearchInput placeholder={searchPlaceholder} className="max-w-64 z-[1]" />

        {!readOnly && (
          <SheetDrawer
            sheetTrigger={`${g('Add')} ${g(actionTarget)}`}
            sheetTitle={`${g('Add')} ${g(actionTarget)}`}
            sheetContent={<StaffForm actionLabel={actionTarget} staffRole={staffRole} />}
          />
        )}
      </section>

      <AdminPageTable
        columns={headColumns}
        bodyCell={bodyCell}
        pageSize={pageSize}
        readOnly={readOnly}
        formConfig={{ actionLabel: actionTarget, staffRole }}
      />
    </PageTemplate>
  );
};

export default StaffPage;
