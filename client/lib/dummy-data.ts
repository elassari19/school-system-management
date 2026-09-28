export const colors = [
  '#13c4e9',
  '#f7b924',
  '#ff2442',
  '#1bc5bd',
  '#8950fc',
  '#00c8e3',
  '#0acf97',
  '#ff5c75',
  '#ff8d72',
  '#0acf97',
  '#f7b924',
  '#13c4e9',
];

export const months = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec',
];

export const parentData = [
  {
    id: 1,
    fullname: 'John Doe',
    gender: 'Male',
    avatar: 'https://i.pravatar.cc/150?img=1',
    address: '123 Main St, Anytown, USA',
    expenses: 1500,
    children: [
      {
        id: 101,
        fullname: 'Jane Doe',
        gender: 'Female',
        avatar: 'https://i.pravatar.cc/150?img=5',
        class: '5A',
        grade: 'A',
        attendance: 95,
        status: 'Active',
      },
      {
        id: 102,
        fullname: 'Jack Doe',
        gender: 'Male',
        avatar: 'https://i.pravatar.cc/150?img=8',
        class: '3B',
        grade: 'B+',
        attendance: 92,
        status: 'Active',
      },
    ],
  },
  {
    id: 2,
    fullname: 'Alice Smith',
    gender: 'Female',
    avatar: 'https://i.pravatar.cc/150?img=2',
    address: '456 Elm St, Springfield, USA',
    expenses: 1200,
    children: [
      {
        id: 201,
        fullname: 'Bob Smith',
        gender: 'Male',
        avatar: 'https://i.pravatar.cc/150?img=6',
        class: '4C',
        grade: 'A-',
        attendance: 98,
        status: 'Active',
      },
    ],
  },
  {
    id: 3,
    fullname: 'Emily Johnson',
    gender: 'Female',
    avatar: 'https://i.pravatar.cc/150?img=3',
    address: '789 Oak Rd, Lakeside, USA',
    expenses: 2000,
    children: [
      {
        id: 301,
        fullname: 'Michael Johnson',
        gender: 'Male',
        avatar: 'https://i.pravatar.cc/150?img=7',
        class: '6A',
        grade: 'B',
        attendance: 90,
        status: 'Active',
      },
      {
        id: 302,
        fullname: 'Sarah Johnson',
        gender: 'Female',
        avatar: 'https://i.pravatar.cc/150?img=9',
        class: '2B',
        grade: 'A+',
        attendance: 99,
        status: 'Active',
      },
      {
        id: 303,
        fullname: 'David Johnson',
        gender: 'Male',
        avatar: 'https://i.pravatar.cc/150?img=10',
        class: '1A',
        grade: 'A',
        attendance: 97,
        status: 'Active',
      },
    ],
  },
  {
    id: 4,
    fullname: 'Robert Brown',
    gender: 'Male',
    avatar: 'https://i.pravatar.cc/150?img=4',
    address: '101 Pine Lane, Hilltown, USA',
    expenses: 1800,
    children: [
      {
        id: 401,
        fullname: 'Emma Brown',
        gender: 'Female',
        avatar: 'https://i.pravatar.cc/150?img=11',
        class: '5B',
        grade: 'B+',
        attendance: 93,
        status: 'Active',
      },
      {
        id: 402,
        fullname: 'James Brown',
        gender: 'Male',
        avatar: 'https://i.pravatar.cc/150?img=12',
        class: '3A',
        grade: 'A-',
        attendance: 91,
        status: 'Active',
      },
    ],
  },
  {
    id: 5,
    fullname: 'Sophia Lee',
    gender: 'Female',
    avatar: 'https://i.pravatar.cc/150?img=13',
    address: '202 Maple Ave, Riverside, USA',
    expenses: 1600,
    children: [
      {
        id: 501,
        fullname: 'Olivia Lee',
        gender: 'Female',
        avatar: 'https://i.pravatar.cc/150?img=14',
        class: '4B',
        grade: 'A',
        attendance: 96,
        status: 'Active',
      },
      {
        id: 502,
        fullname: 'Ethan Lee',
        gender: 'Male',
        avatar: 'https://i.pravatar.cc/150?img=15',
        class: '2C',
        grade: 'B',
        attendance: 89,
        status: 'Active',
      },
    ],
  },
];

export interface StaffMember {
  id: string;
  avatar: string;
  fullname: string;
  email: string;
  phone: string;
  position: string;
  department: string;
  hiredate: string;
  salary: number;
  gender: 'Male' | 'Female';
  age: number;
  status: 'Active' | 'On Leave' | 'Inactive';
}

const staffOf = (members: Omit<StaffMember, 'id'>[], prefix: string): StaffMember[] =>
  members.map((member, index) => ({ id: `${prefix}-${index + 1}`, ...member }));

export const directorData: StaffMember[] = staffOf(
  [
    {
      avatar: 'https://i.pravatar.cc/150?img=12',
      fullname: 'Amadou Diallo',
      email: 'director@schoolanoul.edu',
      phone: '+221 77 123 45 67',
      position: 'School Director',
      department: 'Administration',
      hiredate: '2015-09-01',
      salary: 850000,
      gender: 'Male',
      age: 52,
      status: 'Active',
    },
    {
      avatar: 'https://i.pravatar.cc/150?img=20',
      fullname: 'Fatou Ndiaye',
      email: 'deputy.director@schoolanoul.edu',
      phone: '+221 78 234 56 78',
      position: 'Deputy Director',
      department: 'Administration',
      hiredate: '2018-01-15',
      salary: 620000,
      gender: 'Female',
      age: 44,
      status: 'Active',
    },
    {
      avatar: 'https://i.pravatar.cc/150?img=33',
      fullname: 'Moussa Kane',
      email: 'pedagoogy@schoolanoul.edu',
      phone: '+221 77 345 67 89',
      position: 'Director of Studies',
      department: 'Academic Affairs',
      hiredate: '2019-10-05',
      salary: 540000,
      gender: 'Male',
      age: 47,
      status: 'On Leave',
    },
  ],
  'dir'
);

export const custodyData: StaffMember[] = staffOf(
  [
    {
      avatar: 'https://i.pravatar.cc/150?img=15',
      fullname: 'Ibrahima Sow',
      email: 'head.custody@schoolanoul.edu',
      phone: '+221 77 456 78 90',
      position: 'Head Custodian',
      department: 'General Custody',
      hiredate: '2016-03-01',
      salary: 280000,
      gender: 'Male',
      age: 49,
      status: 'Active',
    },
    {
      avatar: 'https://i.pravatar.cc/150?img=25',
      fullname: 'Aminata Ba',
      email: 'custody.north@schoolanoul.edu',
      phone: '+221 78 567 89 01',
      position: 'Custody Supervisor',
      department: 'North Wing',
      hiredate: '2020-09-12',
      salary: 220000,
      gender: 'Female',
      age: 38,
      status: 'Active',
    },
    {
      avatar: 'https://i.pravatar.cc/150?img=51',
      fullname: 'Cheikh Fall',
      email: 'custody.grounds@schoolanoul.edu',
      phone: '+221 77 678 90 12',
      position: 'Grounds Keeper',
      department: 'Outdoor Areas',
      hiredate: '2021-06-20',
      salary: 190000,
      gender: 'Male',
      age: 35,
      status: 'Inactive',
    },
    {
      avatar: 'https://i.pravatar.cc/150?img=47',
      fullname: 'Mariama Sy',
      email: 'custody.classrooms@schoolanoul.edu',
      phone: '+221 78 789 01 23',
      position: 'Classroom Attendant',
      department: 'Main Building',
      hiredate: '2022-01-10',
      salary: 180000,
      gender: 'Female',
      age: 29,
      status: 'Active',
    },
  ],
  'cust'
);

export const hrData: StaffMember[] = staffOf(
  [
    {
      avatar: 'https://i.pravatar.cc/150?img=9',
      fullname: 'Ndeye Diop',
      email: 'hr.manager@schoolanoul.edu',
      phone: '+221 77 890 12 34',
      position: 'HR Manager',
      department: 'Human Resources',
      hiredate: '2017-04-03',
      salary: 560000,
      gender: 'Female',
      age: 41,
      status: 'Active',
    },
    {
      avatar: 'https://i.pravatar.cc/150?img=68',
      fullname: 'Ousmane Gueye',
      email: 'hr.recruit@schoolanoul.edu',
      phone: '+221 78 901 23 45',
      position: 'Recruitment Officer',
      department: 'Talent Acquisition',
      hiredate: '2021-11-08',
      salary: 340000,
      gender: 'Male',
      age: 33,
      status: 'Active',
    },
    {
      avatar: 'https://i.pravatar.cc/150?img=44',
      fullname: 'Awa Sarr',
      email: 'hr.payroll@schoolanoul.edu',
      phone: '+221 77 012 34 56',
      position: 'Payroll Specialist',
      department: 'Compensation',
      hiredate: '2022-07-19',
      salary: 310000,
      gender: 'Female',
      age: 30,
      status: 'On Leave',
    },
  ],
  'hr'
);

export const accountantData: StaffMember[] = staffOf(
  [
    {
      avatar: 'https://i.pravatar.cc/150?img=60',
      fullname: 'Modou Faye',
      email: 'chief.accountant@schoolanoul.edu',
      phone: '+221 77 111 22 33',
      position: 'Chief Accountant',
      department: 'Finance',
      hiredate: '2016-02-14',
      salary: 520000,
      gender: 'Male',
      age: 45,
      status: 'Active',
    },
    {
      avatar: 'https://i.pravatar.cc/150?img=32',
      fullname: 'Djeynabou Cisse',
      email: 'bursar@schoolanoul.edu',
      phone: '+221 78 222 33 44',
      position: 'Bursar',
      department: 'Fees Management',
      hiredate: '2019-08-26',
      salary: 380000,
      gender: 'Female',
      age: 36,
      status: 'Active',
    },
    {
      avatar: 'https://i.pravatar.cc/150?img=57',
      fullname: 'Abdou Mbaye',
      email: 'audit@schoolanoul.edu',
      phone: '+221 77 333 44 55',
      position: 'Audit Clerk',
      department: 'Finance',
      hiredate: '2023-02-01',
      salary: 260000,
      gender: 'Male',
      age: 28,
      status: 'Active',
    },
  ],
  'acc'
);

export const genderData = [
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

export const attendanceData = [
  { name: 'Jan', male: 90, female: 85, average: 87.5 },
  { name: 'Feb', male: 95, female: 90, average: 92.5 },
  { name: 'Mar', male: 85, female: 95, average: 90 },
  { name: 'Apr', male: 90, female: 99, average: 94.5 },
  { name: 'May', male: 92, female: 89, average: 90.5 },
  { name: 'Jui', male: 90, female: 85, average: 87.5 },
  { name: 'Jue', male: 95, female: 90, average: 92.5 },
  { name: 'Aut', male: 85, female: 95, average: 90 },
  { name: 'Sep', male: 90, female: 99, average: 94.5 },
  { name: 'Oct', male: 90, female: 99, average: 94.5 },
  { name: 'Nov', male: 92, female: 89, average: 90.5 },
  { name: 'Dec', male: 92, female: 89, average: 90.5 },
];

export const financeData = [
  { month: 'Jan', revenue: 1000 },
  { month: 'Feb', revenue: 1500 },
  { month: 'Mar', revenue: 1300 },
  { month: 'Apr', revenue: 1800 },
  { month: 'May', revenue: 2000 },
];

export const monthlyFinance = [
  { name: 'Week 1', income: 4000, expenses: 2400 },
  { name: 'Week 2', income: 3000, expenses: 1398 },
  { name: 'Week 3', income: 2000, expenses: 9800 },
  { name: 'Week 4', income: 2780, expenses: 3908 },
];

export const events = [
  {
    id: 1,
    title: 'Team Meeting',
    description: 'Weekly team sync-up',
    date: '2023-06-15',
    time: '10:00 AM',
    location: 'Conference Room A',
    type: 'meeting',
  },
  {
    id: 2,
    title: 'Dentist Appointment',
    description: 'Regular checkup',
    date: '2023-06-18',
    time: '2:30 PM',
    location: 'Dental Clinic',
    type: 'appointment',
  },
  {
    id: 3,
    title: 'React Advanced Course',
    description: 'Online workshop',
    date: '2023-06-20',
    time: '9:00 AM',
    location: 'Virtual',
    type: 'course',
  },
];

export const gradeData = [
  { grade: 'A', count: 30 },
  { grade: 'B', count: 45 },
  { grade: 'C', count: 25 },
  { grade: 'D', count: 15 },
  { grade: 'F', count: 5 },
];

export const weeklyExams = [
  { name: 'Week 1', week: 'Week 1', math: 78, science: 72, english: 85 },
  { name: 'Week 2', week: 'Week 2', math: 82, science: 75, english: 88 },
  { name: 'Week 3', week: 'Week 3', math: 75, science: 85, english: 82 },
  { name: 'Week 4', week: 'Week 4', math: 85, science: 80, english: 90 },
  { name: 'Week 5', week: 'Week 5', math: 80, science: 88, english: 85 },
];

export const monthlyExamsData = months.map((month) => {
  const femaleGrade = Math.floor(Math.random() * (95 - 80) + 80);
  const maleGrade = Math.floor(Math.random() * (90 - 75) + 75);
  const averageGrade = Math.floor((femaleGrade + maleGrade) / 2);

  return {
    month,
    averageGrade,
    femaleGrade,
    maleGrade,
  };
});

export const tags = [
  'Historic',
  'Morocco',
  'Historic',
  'Morocco',
  'Historic',
  'Morocco',
  'Historic',
  'Morocco',
];

export const studentScheduleData = [
  {
    id: '1',
    subject: 'Mathematics',
    startTime: '09:00',
    endTime: '10:30',
    day: 'Monday',
    room: '101',
  },
  {
    id: '2',
    subject: 'Physics',
    startTime: '10:45',
    endTime: '12:15',
    day: 'Monday',
    room: '203',
  },
  {
    id: '3',
    subject: 'Chemistry',
    startTime: '13:00',
    endTime: '14:30',
    day: 'Tuesday',
    room: '305',
  },
  {
    id: '4',
    subject: 'Biology',
    startTime: '09:00',
    endTime: '10:30',
    day: 'Wednesday',
    room: '102',
  },
  {
    id: '5',
    subject: 'English Literature',
    startTime: '10:45',
    endTime: '12:15',
    day: 'Wednesday',
    room: '201',
  },
  {
    id: '6',
    subject: 'History',
    startTime: '13:00',
    endTime: '14:30',
    day: 'Thursday',
    room: '204',
  },
  {
    id: '7',
    subject: 'Computer Science',
    startTime: '09:00',
    endTime: '10:30',
    day: 'Friday',
    room: '301',
  },
  {
    id: '8',
    subject: 'Art',
    startTime: '10:45',
    endTime: '12:15',
    day: 'Friday',
    room: '401',
  },
];
