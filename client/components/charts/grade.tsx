'use client';

import React from 'react';
import {
  ResponsiveContainer,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  Line,
  LineChart,
} from 'recharts';

interface IProps {
  gradeData: any;
}

const Grade = ({ gradeData }: IProps) => {
  return (
    <div>
      <ResponsiveContainer width="100%" height={250}>
        <LineChart data={gradeData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="month" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="male" stroke="#8884d8" />
          <Line type="monotone" dataKey="female" stroke="#82ca9d" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default Grade;
