'use client';

import Image from 'next/image';
import {
  RadialBarChart,
  RadialBar,
  Legend,
  ResponsiveContainer,
} from 'recharts';

interface IProps {
  genderData: {
    name: string;
    count: number;
    fill: string;
  }[];
}

const StudentGender = ({ genderData }: IProps) => {
  return (
    <>
      <div className="relative w-full h-[65%]">
        <ResponsiveContainer>
          <RadialBarChart
            cx="50%"
            cy="50%"
            innerRadius="40%"
            outerRadius="100%"
            barSize={32}
            data={genderData}
          >
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
      <div className="flex justify-center gap-16">
        <div className="flex flex-col gap-1">
          <div className="w-5 h-5 bg-red-40 rounded-full" />
          <h1 className="font-bold">1,234</h1>
          <h2 className="text-xs text-gray-300">Males (55%)</h2>
        </div>
        <div className="flex flex-col gap-1">
          <div className="w-5 h-5 bg-yellow-40 rounded-full" />
          <h1 className="font-bold">1,234</h1>
          <h2 className="text-xs text-gray-300">Females (45%)</h2>
        </div>
      </div>
    </>
  );
};

export default StudentGender;
