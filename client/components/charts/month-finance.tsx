'use client';

import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import RootCard from '../cards/root-card';
import { useTranslations } from 'next-intl';

interface IProps {
  data: { name: string; income: number; expenses: number }[];
}

const MonthlyFinanceChart = ({ data }: IProps) => {
  const t = useTranslations();
  const totalIncome = data.reduce((sum, item) => sum + item.income, 0);
  const totalExpenses = data.reduce((sum, item) => sum + item.expenses, 0);
  const totalProfit = totalIncome - totalExpenses;
  const tTotal = t('Total');

  return (
    <RootCard
      className="text-center"
      title={t('monthlyFinance')}
      description={
        <div className="flex items-center justify-center gap-8 text-sm mt-2">
          <div>
            <p>${totalIncome}</p>
            <p className="text-sm font-semibold">
              {tTotal} {t('Income')}
            </p>
          </div>
          <div>
            <p>${totalExpenses}</p>
            <p className="text-sm font-semibold">
              {tTotal} {t('Expenses')}
            </p>
          </div>
          <div>
            <p>${totalProfit}</p>
            <p className="text-sm font-semibold">
              {tTotal} {t('Profit')}
            </p>
          </div>
        </div>
      }
      cardContent={
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="income" fill="#d9a8d7" name="Income" />
            <Bar dataKey="expenses" fill="#f8d7a9" name="Expenses" />
          </BarChart>
        </ResponsiveContainer>
      }
    />
  );
};

export default MonthlyFinanceChart;
