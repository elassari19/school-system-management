'use client';

import { RadialBarChart, RadialBar, Legend, ResponsiveContainer } from 'recharts';

interface IProps {
  genderData: {
    name: string;
    count: number;
    fill: string;
  }[];
}

const StudentGender = ({ genderData }: IProps) => {
  return (
    <div>
      <ResponsiveContainer width="100%" height={250}>
        <RadialBarChart
          cx="50%"
          cy="50%"
          innerRadius="40%"
          outerRadius="100%"
          barSize={32}
          data={genderData}
        >
          <Legend />
          <RadialBar background dataKey="count" />
        </RadialBarChart>
      </ResponsiveContainer>
      {/* <Image
          src="/maleFemale.png"
          alt=""
          width={50}
          height={50}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
        /> */}
    </div>
  );
};

export default StudentGender;
