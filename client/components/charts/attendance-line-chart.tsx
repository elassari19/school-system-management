'use client';
import { useTranslations } from 'next-intl';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import RootCard from '../cards/root-card';

interface AttendanceData {
  month: string;
  attendance: number;
}

interface Props {
  data: AttendanceData[];
}

export default function AttendanceLineChart({ data }: Props) {
  const g = useTranslations('global');
  const a = useTranslations('academic');

  if (!data || data.length === 0) {
    return (
      <RootCard
        title={a('Attendance Overview')}
        cardContent={<div className="h-[400px] flex items-center justify-center">No data available</div>}
      />
    );
  }

  return (
    <RootCard
      title={a('Attendance Overview')}
      cardContent={
        <div style={{ width: '100%', height: 400 }}>
          <ResponsiveContainer>
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="month"
                tick={{ fill: '#888888' }}
              />
              <YAxis 
                domain={[0, 100]}
                tickFormatter={(value) => `${value}%`}
                tick={{ fill: '#888888' }}
              />
              <Tooltip 
                formatter={(value) => [`${value}%`, g('Attendance')]}
                contentStyle={{ background: '#fff', border: '1px solid #ccc' }}
              />
              <Legend />
              <Line
                type="monotone"
                dataKey="attendance"
                name={g('Attendance')}
                stroke="#4bc0c0"
                strokeWidth={2}
                dot={{ fill: '#4bc0c0' }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      }
    />
  );
}
