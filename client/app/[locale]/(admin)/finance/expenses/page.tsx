import React from 'react';
import { getTranslations } from 'next-intl/server';
import { AlertCircle, CheckCircle2, Receipt, Wallet } from 'lucide-react';
import PageTemplate, {
  ChartSection,
  OverviewSection,
} from '@/components/template/page-template';
import ResourceTable from '@/components/tables/resource-table';
import BreakdownChart from '@/components/charts/breakdown-chart';
import ValueBarChart from '@/components/charts/value-bar-chart';
import { expensesColumns, expensesSearchKeys } from '@/lib/finance-columns';
import { ExpenseRecord, expenseData, groupByField, groupByMonth } from '@/lib/finance-data';

export default async function ExpensesPage() {
  const g = await getTranslations('global');

  const totalExpenses = expenseData.reduce((acc, expense) => acc + expense.amount, 0);
  const approved = expenseData.filter((expense) => expense.status === 'Approved');
  const pending = expenseData.filter((expense) => expense.status === 'Pending');
  const rejected = expenseData.filter((expense) => expense.status === 'Rejected');
  const approvedTotal = approved.reduce((acc, expense) => acc + expense.amount, 0);

  return (
    <PageTemplate>
      <OverviewSection
        overviewData={[
          {
            icon: Wallet,
            title: `${g('Total')} ${g('Expenses')}`,
            currentValue: `$${totalExpenses.toLocaleString()}`,
            pastValue: `${expenseData.length} ${g('Items')}`,
          },
          {
            icon: Receipt,
            title: `${g('Approved')}`,
            currentValue: `$${approvedTotal.toLocaleString()}`,
            pastValue: `${approved.length} ${g('Items')}`,
          },
          {
            icon: AlertCircle,
            title: `${g('Pending')}`,
            currentValue: `${pending.length}`,
            pastValue: `$${pending.reduce((acc, e) => acc + e.amount, 0).toLocaleString()}`,
          },
          {
            icon: CheckCircle2,
            title: `${g('Rejected')}`,
            currentValue: `${rejected.length}`,
            pastValue: `$${rejected.reduce((acc, e) => acc + e.amount, 0).toLocaleString()}`,
          },
        ]}
      />

      <ChartSection
        leftChart={
          <BreakdownChart
            title={`${g('Expenses')} (${g('Category')})`}
            data={groupByField(expenseData, 'category')}
            currency
          />
        }
        rightChart={
          <ValueBarChart
            title={`${g('Expenses')} (${g('Monthly')})`}
            data={groupByMonth(expenseData)}
            barName={g('Expenses')}
            barColor="#f8d7a9"
          />
        }
      />

      <ResourceTable<ExpenseRecord>
        columns={expensesColumns}
        data={expenseData}
        searchKeys={expensesSearchKeys}
        searchPlaceholder={`${g('Search')} ${g('Expense')}...`}
      />
    </PageTemplate>
  );
}
