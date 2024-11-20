export const colors = [
  "#13c4e9",
  "#f7b924",
  "#ff2442",
  "#1bc5bd",
  "#8950fc",
  "#00c8e3",
  "#0acf97",
  "#ff5c75",
  "#ff8d72",
  "#0acf97",
  "#f7b924",
  "#13c4e9",
];

export const months = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

export const parentData = [
  {
    id: 1,
    fullname: "John Doe",
    gender: "Male",
    avatar: "https://i.pravatar.cc/150?img=1",
    address: "123 Main St, Anytown, USA",
    expenses: 1500,
    children: [
      {
        id: 101,
        fullname: "Jane Doe",
        gender: "Female",
        avatar: "https://i.pravatar.cc/150?img=5",
        class: "5A",
        grade: "A",
        attendance: 95,
        status: "Active",
      },
      {
        id: 102,
        fullname: "Jack Doe",
        gender: "Male",
        avatar: "https://i.pravatar.cc/150?img=8",
        class: "3B",
        grade: "B+",
        attendance: 92,
        status: "Active",
      },
    ],
  },
  {
    id: 2,
    fullname: "Alice Smith",
    gender: "Female",
    avatar: "https://i.pravatar.cc/150?img=2",
    address: "456 Elm St, Springfield, USA",
    expenses: 1200,
    children: [
      {
        id: 201,
        fullname: "Bob Smith",
        gender: "Male",
        avatar: "https://i.pravatar.cc/150?img=6",
        class: "4C",
        grade: "A-",
        attendance: 98,
        status: "Active",
      },
    ],
  },
  {
    id: 3,
    fullname: "Emily Johnson",
    gender: "Female",
    avatar: "https://i.pravatar.cc/150?img=3",
    address: "789 Oak Rd, Lakeside, USA",
    expenses: 2000,
    children: [
      {
        id: 301,
        fullname: "Michael Johnson",
        gender: "Male",
        avatar: "https://i.pravatar.cc/150?img=7",
        class: "6A",
        grade: "B",
        attendance: 90,
        status: "Active",
      },
      {
        id: 302,
        fullname: "Sarah Johnson",
        gender: "Female",
        avatar: "https://i.pravatar.cc/150?img=9",
        class: "2B",
        grade: "A+",
        attendance: 99,
        status: "Active",
      },
      {
        id: 303,
        fullname: "David Johnson",
        gender: "Male",
        avatar: "https://i.pravatar.cc/150?img=10",
        class: "1A",
        grade: "A",
        attendance: 97,
        status: "Active",
      },
    ],
  },
  {
    id: 4,
    fullname: "Robert Brown",
    gender: "Male",
    avatar: "https://i.pravatar.cc/150?img=4",
    address: "101 Pine Lane, Hilltown, USA",
    expenses: 1800,
    children: [
      {
        id: 401,
        fullname: "Emma Brown",
        gender: "Female",
        avatar: "https://i.pravatar.cc/150?img=11",
        class: "5B",
        grade: "B+",
        attendance: 93,
        status: "Active",
      },
      {
        id: 402,
        fullname: "James Brown",
        gender: "Male",
        avatar: "https://i.pravatar.cc/150?img=12",
        class: "3A",
        grade: "A-",
        attendance: 91,
        status: "Active",
      },
    ],
  },
  {
    id: 5,
    fullname: "Sophia Lee",
    gender: "Female",
    avatar: "https://i.pravatar.cc/150?img=13",
    address: "202 Maple Ave, Riverside, USA",
    expenses: 1600,
    children: [
      {
        id: 501,
        fullname: "Olivia Lee",
        gender: "Female",
        avatar: "https://i.pravatar.cc/150?img=14",
        class: "4B",
        grade: "A",
        attendance: 96,
        status: "Active",
      },
      {
        id: 502,
        fullname: "Ethan Lee",
        gender: "Male",
        avatar: "https://i.pravatar.cc/150?img=15",
        class: "2C",
        grade: "B",
        attendance: 89,
        status: "Active",
      },
    ],
  },
];

export const genderData = [
  {
    name: "Total",
    count: 20344,
    fill: "#fff",
  },
  {
    name: "Male",
    count: 9342,
    fill: "#e6acd1",
  },
  {
    name: "Female",
    count: 11002,
    fill: "#13c4e9",
  },
];

export const attendanceData = [
  { name: "Jan", male: 90, female: 85, average: 87.5 },
  { name: "Feb", male: 95, female: 90, average: 92.5 },
  { name: "Mar", male: 85, female: 95, average: 90 },
  { name: "Apr", male: 90, female: 99, average: 94.5 },
  { name: "May", male: 92, female: 89, average: 90.5 },
  { name: "Jui", male: 90, female: 85, average: 87.5 },
  { name: "Jue", male: 95, female: 90, average: 92.5 },
  { name: "Aut", male: 85, female: 95, average: 90 },
  { name: "Sep", male: 90, female: 99, average: 94.5 },
  { name: "Oct", male: 90, female: 99, average: 94.5 },
  { name: "Nov", male: 92, female: 89, average: 90.5 },
  { name: "Dec", male: 92, female: 89, average: 90.5 },
];

export const financeData = [
  { month: "Jan", revenue: 1000 },
  { month: "Feb", revenue: 1500 },
  { month: "Mar", revenue: 1300 },
  { month: "Apr", revenue: 1800 },
  { month: "May", revenue: 2000 },
];

export const monthlyFinance = [
  { name: "Week 1", income: 4000, expenses: 2400 },
  { name: "Week 2", income: 3000, expenses: 1398 },
  { name: "Week 3", income: 2000, expenses: 9800 },
  { name: "Week 4", income: 2780, expenses: 3908 },
];

export const events = [
  {
    id: 1,
    title: "Team Meeting",
    description: "Weekly team sync-up",
    date: "2023-06-15",
    time: "10:00 AM",
    location: "Conference Room A",
    type: "meeting",
  },
  {
    id: 2,
    title: "Dentist Appointment",
    description: "Regular checkup",
    date: "2023-06-18",
    time: "2:30 PM",
    location: "Dental Clinic",
    type: "appointment",
  },
  {
    id: 3,
    title: "React Advanced Course",
    description: "Online workshop",
    date: "2023-06-20",
    time: "9:00 AM",
    location: "Virtual",
    type: "course",
  },
];

export const gradeData = [
  { grade: "A", count: 30 },
  { grade: "B", count: 45 },
  { grade: "C", count: 25 },
  { grade: "D", count: 15 },
  { grade: "F", count: 5 },
];

export const weeklyExams = [
  { name: "Week 1", week: "Week 1", math: 78, science: 72, english: 85 },
  { name: "Week 2", week: "Week 2", math: 82, science: 75, english: 88 },
  { name: "Week 3", week: "Week 3", math: 75, science: 85, english: 82 },
  { name: "Week 4", week: "Week 4", math: 85, science: 80, english: 90 },
  { name: "Week 5", week: "Week 5", math: 80, science: 88, english: 85 },
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
  "Historic",
  "Morocco",
  "Historic",
  "Morocco",
  "Historic",
  "Morocco",
  "Historic",
  "Morocco",
];
