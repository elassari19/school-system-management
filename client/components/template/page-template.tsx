import React from "react";
import { cn } from "@/lib/utils";
import OverviewCard from "../cards/overview-card";
import { getTranslations } from "next-intl/server";
import { Modal } from "../ui/dialog";
import SearchInput from "../inputs/search-input";
import PageTable from "../tables/page-table";

interface IProps extends React.HTMLAttributes<HTMLDivElement> {
  overviewData: any[];
  placeholder: string;
  actionTarget: string;
  modalForm: React.ReactNode;
  tableData: any[];
  pages: number;
}

const PageTemplate = async ({
  children,
  className,
  overviewData,
  placeholder,
  modalForm,
  tableData,
  pages,
}: IProps) => {
  const g = await getTranslations("global");

  const overviewCards = overviewData.map(({ icon, title, currentValue, pastValue }) => (
    <OverviewCard
      key={title}
      icon={icon}
      title={title}
      currentValue={currentValue}
      pastValue={pastValue}
    />
  ));

  const pageTableProps = {
    headCell: [
      "Avatar",
      "Full Name",
      "Age",
      "Gender",
      "Parents",
      "Email",
      "Phone",
      "Attendance",
      "Class",
      "Status",
    ],
    bodyCell: tableData,
    pages,
  };

  return (
    <div className={cn("h-full overflow-auto flex flex-col gap-6", className)}>
      {/* Overview */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2">
        {overviewCards}
      </section>

      {/* Action => search input, add button */}
      <section className="flex justify-between items-center">
        <SearchInput placeholder={placeholder} className="max-w-64 z-[1]" />

        <Modal
          modalTrigger={`${g("Add")} ${g("Student")}`}
          modalTitle={`${g("Create")} ${g("Student")}`}
          modalContent={modalForm}
          className="z-[1]"
        />
      </section>

      {/* Page table */}
      <PageTable {...pageTableProps} />

      {/* Grops card */}
      <section>{children}</section>
    </div>
  );
};

export default PageTemplate;
