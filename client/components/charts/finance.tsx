'use client';

import React from 'react';
import {
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  Line,
  ResponsiveContainer,
  LineChart,
} from 'recharts';

interface IProps {
  financeData: any;
}

const Finance = ({ financeData }: IProps) => {
  return (
    <div>
      <ResponsiveContainer width="100%" height={250}>
        <LineChart data={financeData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="month" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="revenue" stroke="#8884d8" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default Finance;
