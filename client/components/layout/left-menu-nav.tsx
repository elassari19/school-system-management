import React from 'react';
import { MdAssignmentTurnedIn, MdOutlineDashboard } from 'react-icons/md';
import logo from '@/app/public/assets/logo.png';
import Image from 'next/image';
import MenuItems from '@/components/menu/menu-items';
import { IoPersonCircleOutline } from 'react-icons/io5';
import { IoMdSettings } from 'react-icons/io';
import { RiLogoutCircleRLine, RiMessage2Fill } from 'react-icons/ri';
import { useTranslations } from 'next-intl';
import { IoHome } from 'react-icons/io5';
import { GiTeacher } from 'react-icons/gi';
import { PiExamFill, PiStudentFill } from 'react-icons/pi';
import { RiParentFill } from 'react-icons/ri';
import { IoIosSchool } from 'react-icons/io';
import { MdPlayLesson } from 'react-icons/md';
import { BsCalendarEventFill } from 'react-icons/bs';
import { FaUserCheck } from 'react-icons/fa6';
import { AiFillNotification } from 'react-icons/ai';

interface MenuItem {
  label: string;
  href?: string;
  icon: React.ReactNode;
}

const menuItems: MenuItem[] = [
  {
    label: 'Home',
    href: '/',
    icon: <IoHome />,
  },
  {
    label: 'Teachers',
    icon: <GiTeacher />,
  },
  {
    label: 'Students',
    icon: <PiStudentFill />,
  },
  {
    label: 'Parents',
    icon: <RiParentFill />,
  },
  {
    label: 'Classes',
    icon: <IoIosSchool />,
  },
  {
    label: 'Lessons',
    icon: <MdPlayLesson />,
  },
  {
    label: 'Exams',
    icon: <PiExamFill />,
  },
  {
    label: 'Assignments',
    icon: <MdAssignmentTurnedIn />,
  },
  {
    label: 'Attendance',
    icon: <FaUserCheck />,
  },
  {
    label: 'Events',
    icon: <BsCalendarEventFill />,
  },
  {
    label: 'Messages',
    icon: <RiMessage2Fill />,
  },
  {
    label: 'Announcements',
    icon: <AiFillNotification />,
  },
];

const otherMenu: MenuItem[] = [
  {
    label: 'Profile',
    icon: <IoPersonCircleOutline />,
  },
  {
    label: 'Setting',
    icon: <IoMdSettings />,
  },
  {
    label: 'Logout',
    icon: <RiLogoutCircleRLine />,
  },
];

const MenuNav: React.FC = () => {
  const t = useTranslations('');

  return (
    <nav className="w-full bg-gray-100 h-screen sticky top-0">
      <div className="border-b flex justify-center items-center gap-2 h-20">
        <Image
          src={logo}
          alt="logo"
          className="w-10 h-10"
          width={40}
          height={40}
        />
        <p className="font-bold text-xl">School Anoul</p>
      </div>
      <p className="text-gray-400 pt-2 px-8">{t('Menu')}</p>
      <ul className=" text-gray-400 px-2">
        {menuItems.map((item, index) => (
          <MenuItems
            key={index}
            href={item?.href || `/${item.label.toLocaleLowerCase()}`}
            icon={item.icon}
            label={t(item.label)}
          />
        ))}
      </ul>
      <p className="text-gray-400 pt-2 px-8">{t('Other')}</p>
      <ul className=" text-gray-400 px-2">
        {otherMenu.map((item, index) => (
          <MenuItems
            key={index}
            href={item?.href || `/${item.label.toLocaleLowerCase()}`}
            icon={item.icon}
            label={t(item.label)}
          />
        ))}
      </ul>
    </nav>
  );
};

export default MenuNav;
