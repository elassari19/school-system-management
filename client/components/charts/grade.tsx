'use client';

import React from 'react';
import {
  ResponsiveContainer,
  Tooltip,
  Legend,
  Bar,
  BarChart,
  CartesianGrid,
  XAxis,
  YAxis,
} from 'recharts';

interface IProps {
  gradeData: any;
}

const Grade = ({ gradeData }: IProps) => {
  return (
    <div>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={gradeData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="grade" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="count" fill="#8884d8" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default Grade;
