import React from 'react';
import { getTranslations } from 'next-intl/server';
import Link from 'next/link';
import {
  AlertCircle,
  BookOpenCheck,
  HandCoins,
  Timer,
  Wallet,
} from 'lucide-react';
import PageTemplate, {
  ChartSection,
  OverviewSection,
} from '@/components/template/page-template';
import MonthlyFinanceChart from '@/components/charts/month-finance';
import YearsFinancialChart from '@/components/charts/year-expenses';
import { Badge } from '@/components/ui/badge';
import { monthlyFinance } from '@/lib/dummy-data';
import { accountingData, expenseData, feeData } from '@/lib/finance-data';

export default async function FinancePage() {
  const g = await getTranslations('global');

  const credits = accountingData
    .filter((entry) => entry.type === 'Credit')
    .reduce((acc, entry) => acc + entry.amount, 0);
  const debits = accountingData
    .filter((entry) => entry.type === 'Debit')
    .reduce((acc, entry) => acc + entry.amount, 0);

  const totalBilled = feeData.reduce((acc, fee) => acc + fee.amount, 0);
  const totalCollected = feeData.reduce((acc, fee) => acc + fee.paid, 0);
  const collectionRate = Math.round((totalCollected / totalBilled) * 100);
  const overdueFees = feeData.filter((fee) => fee.status === 'Overdue').length;

  const totalExpenses = expenseData.reduce((acc, expense) => acc + expense.amount, 0);
  const pendingExpenses = expenseData.filter((expense) => expense.status === 'Pending').length;

  return (
    <PageTemplate>
      <OverviewSection
        overviewData={[
          {
            icon: HandCoins,
            title: `${g('Total')} ${g('Collected')}`,
            currentValue: `$${totalCollected.toLocaleString()}`,
            pastValue: `${g('Collection Rate')}: ${collectionRate}%`,
          },
          {
            icon: BookOpenCheck,
            title: `${g('Net')} ${g('Balance')}`,
            currentValue: `$${(credits - debits).toLocaleString()}`,
            pastValue: `${accountingData.length} ${g('Journal Entries')}`,
          },
          {
            icon: Wallet,
            title: `${g('Total')} ${g('Expenses')}`,
            currentValue: `$${totalExpenses.toLocaleString()}`,
            pastValue: `${pendingExpenses} ${g('Pending')}`,
          },
          {
            icon: Timer,
            title: `${g('Overdue')}`,
            currentValue: `${overdueFees}`,
            pastValue: `${g('Fees')} · ${g('This Month')}`,
          },
        ]}
      />

      <ChartSection
        leftChart={<MonthlyFinanceChart data={monthlyFinance} />}
        rightChart={<YearsFinancialChart />}
      />

      <div className="flex flex-wrap items-center gap-2">
        <Badge variant="outline" className="gap-2">
          <AlertCircle className="h-3.5 w-3.5" />
          {overdueFees} {g('Fees')} {g('Overdue')}
        </Badge>
        <Badge variant="outline">
          {pendingExpenses} / {expenseData.length} {g('Expenses')} {g('Pending')}
        </Badge>
        <Badge variant="outline">${totalBilled.toLocaleString()} {g('Total')} {g('Billed')}</Badge>
      </div>

      <section className="grid grid-cols-1 sm:grid-cols-3 gap-2">
        <Link
          href="accounting"
          className="gradient flex flex-col gap-1 rounded-md p-4 hover:bg-secondary/5 hover:text-secondary transition-colors"
        >
          <span className="font-semibold">{g('Accounting')}</span>
          <span className="text-sm text-muted-foreground">
            {accountingData.length} {g('Journal Entries')}
          </span>
        </Link>
        <Link
          href="fees-management"
          className="gradient flex flex-col gap-1 rounded-md p-4 hover:bg-secondary/5 hover:text-secondary transition-colors"
        >
          <span className="font-semibold">{g('Fees Management')}</span>
          <span className="text-sm text-muted-foreground">
            {feeData.length} {g('Fees')} · {collectionRate}% {g('Collected')}
          </span>
        </Link>
        <Link
          href="expenses"
          className="gradient flex flex-col gap-1 rounded-md p-4 hover:bg-secondary/5 hover:text-secondary transition-colors"
        >
          <span className="font-semibold">{g('Expenses')}</span>
          <span className="text-sm text-muted-foreground">
            ${totalExpenses.toLocaleString()} · {g('This Month')}
          </span>
        </Link>
      </section>
    </PageTemplate>
  );
}
