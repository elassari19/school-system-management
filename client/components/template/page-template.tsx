import React from "react";
import { cn } from "@/lib/utils";
import OverviewCard from "../cards/overview-card";
import { Button } from "../ui/button";
import { getTranslations } from "next-intl/server";
import { Modal } from "../ui/dialog";
import SearchInput from "../inputs/search-input";

interface IProps extends React.HTMLAttributes<HTMLDivElement> {
  overviewData: any[];
  placeholder: string;
  actionTarget: string;
  modalForm: React.ReactNode;
}

const PageTemplate = async ({
  children,
  className,
  overviewData,
  placeholder,
  modalForm,
}: IProps) => {
  const g = await getTranslations("global");
  return (
    <div className={cn("h-full overflow-auto flex flex-col gap-4", className)}>
      {/* Overview */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2">
        {overviewData.map(({ icon, title, currentValue, pastValue }) => (
          <OverviewCard
            key={title}
            icon={icon}
            title={title}
            currentValue={currentValue}
            pastValue={pastValue}
          />
        ))}
      </section>

      {/* Action => search input, add button */}
      <section className="flex justify-between items-center">
        <SearchInput placeholder={placeholder} className="max-w-64" />

        <Modal
          modalTrigger={`${g("Add")} ${g("Student")}`}
          modalTitle={`${g("Create")} ${g("Student")}`}
          modalContent={modalForm}
        />
      </section>

      {/* Grops card */}
      <section>
        {/* 
          - Group card: Students
          - Group card: Teachers
          - Group card: Parents
          - Group card: Classes
         */}
      </section>
      {children}
    </div>
  );
};

export default PageTemplate;
