import { MdAssignmentTurnedIn, MdCallSplit } from 'react-icons/md';
import { IoCalendar, IoPersonCircleOutline } from 'react-icons/io5';
import { IoMdSettings } from 'react-icons/io';
import { RiLogoutCircleRLine, RiMessage2Fill } from 'react-icons/ri';
import { IoHome } from 'react-icons/io5';
import { GiTeacher } from 'react-icons/gi';
import {
  PiBuildingApartmentFill,
  PiExamFill,
  PiStudentFill,
} from 'react-icons/pi';
import { RiParentFill } from 'react-icons/ri';
import { IoIosSchool } from 'react-icons/io';
import { MdPlayLesson } from 'react-icons/md';
import { BsCalendarEventFill } from 'react-icons/bs';
import {
  FaBook,
  FaChartPie,
  FaPeopleCarryBox,
  FaSwatchbook,
  FaUserCheck,
} from 'react-icons/fa6';
import { AiFillNotification } from 'react-icons/ai';
import { GrTree } from 'react-icons/gr';
import { GrWorkshop } from 'react-icons/gr';
import { TbLayoutDashboardFilled } from 'react-icons/tb';
import { FaBusAlt } from 'react-icons/fa';

export const dashboardItems = [
  {
    label: 'Dashboard',
    href: '/',
    Icon: IoHome,
  },
  {
    label: 'Teachers',
    Icon: GiTeacher,
  },
  {
    label: 'Students',
    Icon: PiStudentFill,
  },
  {
    label: 'Parents',
    Icon: RiParentFill,
  },
];

export const reportsItems = [
  {
    label: 'Classes',
    Icon: IoIosSchool,
  },
  {
    label: 'Lessons',
    Icon: MdPlayLesson,
  },
  {
    label: 'Exams',
    Icon: PiExamFill,
  },
  {
    label: 'Assignments',
    Icon: MdAssignmentTurnedIn,
  },
  {
    label: 'Attendance',
    Icon: FaUserCheck,
  },
  {
    label: 'Events',
    Icon: BsCalendarEventFill,
  },
  {
    label: 'Messages',
    Icon: RiMessage2Fill,
  },
  {
    label: 'Announcements',
    Icon: AiFillNotification,
  },
];

export const activitiesItems = [
  {
    label: 'Profile',
    Icon: IoPersonCircleOutline,
  },
  {
    label: 'Setting',
    Icon: IoMdSettings,
  },
  {
    label: 'Logout',
    Icon: RiLogoutCircleRLine,
  },
];

export const tabs = [
  {
    id: 'tab1',
    label: 'Dashboard',
    Icon: FaSwatchbook,
    menu: dashboardItems,
  },
  {
    id: 'tab2',
    label: 'Reposts',
    Icon: PiBuildingApartmentFill,
    menu: reportsItems,
  },
  {
    id: 'tab3',
    label: 'Activities',
    Icon: GrWorkshop,
    menu: activitiesItems,
  },
];

export const menuList = [
  {
    title: 'Dashboard',
    icon: TbLayoutDashboardFilled,
    list: [],
  },
  {
    title: 'Academic',
    icon: GrTree,
    list: ['Students', 'Teachers', 'Parents', 'Classes', 'Subjects'],
  },
  {
    title: 'Attendance',
    icon: IoCalendar,
    list: ['Attendance', 'Schedule', 'Events'],
  },
  {
    title: 'Administration',
    icon: FaSwatchbook,
    list: ['Staff Management', 'Payroll', 'Recruitment'],
  },
  {
    title: 'Resources',
    icon: FaPeopleCarryBox,
    list: ['Library', 'E-Learning', 'Inventory'],
  },
  {
    title: 'Finance',
    icon: FaChartPie,
    list: ['Accounting', 'Fees Management', 'Expenses'],
  },
  {
    title: 'Transport',
    icon: FaBusAlt,
    list: ['Vehicles', 'Drivers'],
  },
  {
    title: 'Communication',
    icon: MdCallSplit,
    list: ['Announcements', 'Messaging'],
  },
  {
    title: 'Reports',
    icon: FaBook,
    list: ['Academic Reports', 'Financial Reports', 'HR Reports'],
  },
];
