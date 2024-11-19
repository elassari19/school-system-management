import React from "react";
import logo from "@/app/public/assets/logo.png";
import Image from "next/image";
import MenuTabs from "@/components/menu/menu-items";
import useIntlTranslations from "@/hooks/use-intl-translations";

const MenuNav: React.FC = () => {
  const { g } = useIntlTranslations();

  return (
    <nav className="w-full h-screen flex flex-col gap-3">
      {/* logo */}
      <div className="w-full flex gap-4 items-center p-4 pt-6">
        <div>
          <Image
            src={logo}
            alt="logo"
            className="w-10 h-10 border border-primary p-2 rounded-full"
            width={40}
            height={40}
          />
        </div>
        <p className="font-bold font-serif">{g("School Anoul")}</p>
      </div>
      <div className="flex-1 overflow-auto flex flex-col gap-4 justify-start items-start">
        <MenuTabs />
      </div>
    </nav>
  );
};

export default MenuNav;
