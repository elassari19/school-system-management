import React from 'react';
import { getTranslations } from 'next-intl/server';
import { BadgeDollarSign, CircleDollarSign, HandCoins, Timer } from 'lucide-react';
import PageTemplate, {
  ChartSection,
  OverviewSection,
} from '@/components/template/page-template';
import ResourceTable from '@/components/tables/resource-table';
import BreakdownChart from '@/components/charts/breakdown-chart';
import ValueBarChart from '@/components/charts/value-bar-chart';
import { feesColumns, feesSearchKeys } from '@/lib/finance-columns';
import { FeeRecord, feeData, monthlyCollections } from '@/lib/finance-data';

export default async function FeesManagementPage() {
  const g = await getTranslations('global');

  const totalBilled = feeData.reduce((acc, fee) => acc + fee.amount, 0);
  const totalCollected = feeData.reduce((acc, fee) => acc + fee.paid, 0);
  const totalOutstanding = totalBilled - totalCollected;
  const collectionRate = Math.round((totalCollected / totalBilled) * 100);
  const overdue = feeData.filter((fee) => fee.status === 'Overdue').length;

  return (
    <PageTemplate>
      <OverviewSection
        overviewData={[
          {
            icon: BadgeDollarSign,
            title: `${g('Total')} ${g('Billed')}`,
            currentValue: `$${totalBilled.toLocaleString()}`,
            pastValue: `${feeData.length} ${g('Items')}`,
          },
          {
            icon: HandCoins,
            title: `${g('Total')} ${g('Collected')}`,
            currentValue: `$${totalCollected.toLocaleString()}`,
            pastValue: `${g('This Month')}`,
          },
          {
            icon: CircleDollarSign,
            title: `${g('Total')} ${g('Outstanding')}`,
            currentValue: `$${totalOutstanding.toLocaleString()}`,
            pastValue: `${g('Awaiting payment')}`,
          },
          {
            icon: Timer,
            title: `${g('Collection Rate')}`,
            currentValue: `${collectionRate}%`,
            pastValue: `${overdue} ${g('Overdue')}`,
          },
        ]}
      />

      <ChartSection
        leftChart={
          <BreakdownChart
            title={`${g('Collected')} / ${g('Outstanding')}`}
            data={[
              { name: g('Collected'), value: totalCollected },
              { name: g('Outstanding'), value: totalOutstanding },
            ]}
            currency
          />
        }
        rightChart={
          <ValueBarChart
            title={`${g('Collected')} (${g('Monthly')})`}
            data={monthlyCollections}
            barName={g('Collected')}
          />
        }
      />

      <ResourceTable<FeeRecord>
        columns={feesColumns}
        data={feeData}
        searchKeys={feesSearchKeys}
        searchPlaceholder={`${g('Search')} ${g('Fee')}...`}
      />
    </PageTemplate>
  );
}
