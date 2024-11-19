'use client';

import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  AreaChart,
  Area,
} from 'recharts';
import RootCard from '../cards/root-card';
import useIntlTranslations from '@/hooks/use-intl-translations';

const data = [
  { month: 'Jan', income: 5000, expenses: 3000 },
  { month: 'Feb', income: 5500, expenses: 3200 },
  { month: 'Mar', income: 6000, expenses: 3500 },
  { month: 'Apr', income: 7000, expenses: 4000 },
  { month: 'May', income: 8000, expenses: 4500 },
  { month: 'Jun', income: 9000, expenses: 5000 },
  { month: 'Jul', income: 9500, expenses: 5500 },
  { month: 'Aug', income: 10000, expenses: 6000 },
  { month: 'Sep', income: 10500, expenses: 6500 },
  { month: 'Oct', income: 11000, expenses: 7000 },
  { month: 'Nov', income: 11500, expenses: 7500 },
  { month: 'Dec', income: 12000, expenses: 8000 },
];

const YearsFinancialChart = () => {
  const { g } = useIntlTranslations();

  const totalIncome = data.reduce((sum, item) => sum + item.income, 0);
  const totalExpenses = data.reduce((sum, item) => sum + item.expenses, 0);
  const totalProfit = totalIncome - totalExpenses;

  return (
    <RootCard
      className="text-center"
      title={`${g('yearlyFinance')} (2022-2023)`}
      description={
        <div className="flex items-center justify-center gap-8 text-sm mt-2">
          <div>
            <p>${totalIncome}</p>
            <p className="text-sm font-semibold">
              {g('Total')} {g('Income')}
            </p>
          </div>
          <div>
            <p>${totalExpenses}</p>
            <p className="text-sm font-semibold">
              {g('Total')} {g('Expenses')}
            </p>
          </div>
          <div>
            <p>${totalProfit}</p>
            <p className="text-sm font-semibold">
              {g('Total')} {g('Profit')}
            </p>
          </div>
        </div>
      }
      cardContent={
        <ResponsiveContainer width="100%" height={250}>
          <AreaChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Area
              type="monotone"
              dataKey="income"
              stroke="#8884d8"
              fill="#d9a8d7"
              name={g('Income')}
            />
            <Area
              type="monotone"
              dataKey="expenses"
              stroke="#82ca9d"
              fill="#f8d7a9"
              name={g('Expenses')}
            />
          </AreaChart>
        </ResponsiveContainer>
      }
    />
    // <div className="bg-background p-2 rounded-sm flex flex-col items-center gap-6">
    // <div className="text-center">
    //   <h2 className="font-semibold">Financial Overview (2022-2023)</h2>
    //   <div className="flex items-center justify-center gap-8 text-sm mt-2">
    //     <div>
    //       <p>${totalIncome}</p>
    //       <p className="text-sm font-semibold">Total Income</p>
    //     </div>
    //     <div>
    //       <p>${totalExpenses}</p>
    //       <p className="text-sm font-semibold">Total Expenses</p>
    //     </div>
    //     <div>
    //       <p>${totalProfit}</p>
    //       <p className="text-sm font-semibold">Total Profit</p>
    //     </div>
    //   </div>
    // </div>

    //   <ResponsiveContainer width="100%" height={250}>
    //     <AreaChart data={data}>
    //       <CartesianGrid strokeDasharray="3 3" />
    //       <XAxis dataKey="month" />
    //       <YAxis />
    //       <Tooltip />
    //       <Legend />
    //       <Area
    //         type="monotone"
    //         dataKey="income"
    //         stroke="#8884d8"
    //         fill="#d9a8d7"
    //       />
    //       <Area
    //         type="monotone"
    //         dataKey="expenses"
    //         stroke="#82ca9d"
    //         fill="#f8d7a9"
    //       />
    //     </AreaChart>
    //   </ResponsiveContainer>
    // </div>
  );
};

export default YearsFinancialChart;
