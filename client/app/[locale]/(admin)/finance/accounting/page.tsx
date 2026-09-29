import React from 'react';
import { getTranslations } from 'next-intl/server';
import { ArrowDownRight, ArrowUpRight, BookOpenCheck, Scale } from 'lucide-react';
import PageTemplate, {
  ChartSection,
  OverviewSection,
} from '@/components/template/page-template';
import ResourceTable from '@/components/tables/resource-table';
import BreakdownChart from '@/components/charts/breakdown-chart';
import ValueBarChart from '@/components/charts/value-bar-chart';
import { accountingColumns, accountingSearchKeys } from '@/lib/finance-columns';
import { AccountingEntry, accountingData, groupByMonth } from '@/lib/finance-data';

export default async function AccountingPage() {
  const g = await getTranslations('global');

  const credits = accountingData
    .filter((entry) => entry.type === 'Credit')
    .reduce((acc, entry) => acc + entry.amount, 0);
  const debits = accountingData
    .filter((entry) => entry.type === 'Debit')
    .reduce((acc, entry) => acc + entry.amount, 0);
  const netBalance = credits - debits;
  const posted = accountingData.filter((entry) => entry.status === 'Posted').length;
  const reconciled = accountingData.filter((entry) => entry.status === 'Reconciled').length;

  return (
    <PageTemplate>
      <OverviewSection
        overviewData={[
          {
            icon: BookOpenCheck,
            title: `${g('Journal Entries')}`,
            currentValue: `${accountingData.length}`,
            pastValue: `${posted} ${g('Posted')}`,
          },
          {
            icon: ArrowUpRight,
            title: `${g('Total')} ${g('Credit')}`,
            currentValue: `$${credits.toLocaleString()}`,
            pastValue: `${g('This Month')}`,
          },
          {
            icon: ArrowDownRight,
            title: `${g('Total')} ${g('Debit')}`,
            currentValue: `$${debits.toLocaleString()}`,
            pastValue: `${g('This Month')}`,
          },
          {
            icon: Scale,
            title: `${g('Net')} ${g('Balance')}`,
            currentValue: `$${netBalance.toLocaleString()}`,
            pastValue: `${reconciled} ${g('Reconciled')}`,
          },
        ]}
      />

      <ChartSection
        leftChart={
          <BreakdownChart
            title={`${g('Credit')} / ${g('Debit')}`}
            data={[
              { name: g('Credit'), value: credits },
              { name: g('Debit'), value: debits },
            ]}
            currency
          />
        }
        rightChart={
          <ValueBarChart
            title={`${g('Amount')} (${g('Monthly')})`}
            data={groupByMonth(accountingData)}
            barName={g('Amount')}
          />
        }
      />

      <ResourceTable<AccountingEntry>
        columns={accountingColumns}
        data={accountingData}
        searchKeys={accountingSearchKeys}
        searchPlaceholder={`${g('Search')} ${g('Journal Entry')}...`}
      />
    </PageTemplate>
  );
}
