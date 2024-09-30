import { getTranslations } from 'next-intl/server';
import {
  PieChart,
  Pie,
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import StudentGender from '../../../../components/charts/students';

interface IProps {}

export default async function Page({}: IProps) {
  const t = await getTranslations('');

  // Sample data (replace with your actual data)
  const genderData = [
    {
      name: 'Total',
      count: 20344,
      fill: '#fff',
    },
    {
      name: 'Male',
      count: 9342,
      fill: '#e6acd1',
    },
    {
      name: 'Female',
      count: 11002,
      fill: '#13c4e9',
    },
  ];

  const attendanceData = [
    { name: 'Mon', male: 80, female: 75 },
    { name: 'Tue', male: 85, female: 80 },
    { name: 'Wed', male: 75, female: 85 },
    { name: 'Thu', male: 90, female: 88 },
    { name: 'Fri', male: 82, female: 79 },
  ];

  const financeData = [
    { month: 'Jan', revenue: 1000 },
    { month: 'Feb', revenue: 1500 },
    { month: 'Mar', revenue: 1300 },
    { month: 'Apr', revenue: 1800 },
    { month: 'May', revenue: 2000 },
  ];

  const gradeData = [
    { month: 'Jan', male: 75, female: 80 },
    { month: 'Feb', male: 78, female: 82 },
    { month: 'Mar', male: 80, female: 79 },
    { month: 'Apr', male: 82, female: 85 },
    { month: 'May', male: 85, female: 87 },
  ];

  return (
    <div className="h-full overflow-auto bg-white grid grid-cols-2 gap-4 p-4">
      {/* Students Card */}
      <div className="bg-foreground p-4 rounded-lg">
        <div className="flex items-center justify-between px-4">
          <h2 className="text-lg font-semibold mb-4">Students</h2>
          <h2 className="text-lg font-semibold mb-4">
            Total {genderData[0].count}
          </h2>
        </div>
        <StudentGender genderData={genderData} />
      </div>

      {/* Attendance Card */}
      {/* <div className="bg-white p-4 rounded-lg shadow">
        <h2 className="text-lg font-semibold mb-4">Student Attendance</h2>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={attendanceData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="male" fill="#8884d8" />
            <Bar dataKey="female" fill="#82ca9d" />
          </BarChart>
        </ResponsiveContainer>
      </div> */}

      {/* Finance Card */}
      {/* <div className="bg-white p-4 rounded-lg shadow">
        <h2 className="text-lg font-semibold mb-4">Finance</h2>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={financeData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="revenue" stroke="#8884d8" />
          </LineChart>
        </ResponsiveContainer>
      </div> */}

      {/* Grades Card */}
      {/* <div className="bg-white p-4 rounded-lg shadow">
        <h2 className="text-lg font-semibold mb-4">Student Grades</h2>
        <ResponsiveContainer width="100%" height={300}>
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
      </div> */}
    </div>
  );
}
