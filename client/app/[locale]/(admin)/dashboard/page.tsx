import { getTranslations } from "next-intl/server";
import { Users, User } from "lucide-react";
import MonthlyFinanceChart from "@/components/charts/month-finance";
import YearsFinancialChart from "@/components/charts/year-expenses";
import { GiTeacher } from "react-icons/gi";
import { PiExam } from "react-icons/pi";
import ParentChildTable from "@/components/tables/parents-tables";
import { events, monthlyFinance, parentData } from "@/lib/dummy-data";
import EventsCard from "@/components/cards/events-card";
import DashboardTemplate from "@/components/template/dashboard-template";
import { getAllUsersByRole } from "@/app/api/dashboard";

interface IProps {}

export default async function Page({}: IProps) {
  const g = await getTranslations("global");
  const totalTeachers = await getAllUsersByRole("TEACHER");
  const totalStduents = await getAllUsersByRole("STUDENT");
  const totalParents = await getAllUsersByRole("PARENT");
  const totalUsers = totalTeachers + totalStduents + totalParents;

  return (
    <DashboardTemplate
      overviewData={[
        {
          icon: GiTeacher,
          title: `${g("Teachers")}`,
          currentValue: totalTeachers,
          pastValue: `+3.7% ${g("from last year")}`,
        },
        {
          icon: PiExam,
          title: `${g("Total")} ${g("Users")}`,
          currentValue: totalUsers,
          pastValue: `+13.4% ${g("from last year")}`,
        },
        {
          icon: Users,
          title: g("Students"),
          currentValue: totalStduents,
          pastValue: `+183 ${g("new students this year")}`,
        },
        {
          icon: User,
          title: g("Parents"),
          currentValue: totalParents,
          pastValue: `+141 ${g("new parents this year")}`,
        },
      ]}
      LeftSideChart={<MonthlyFinanceChart data={monthlyFinance} />}
      RithSideChart={<YearsFinancialChart />}
    >
      <section className="w-full grid grid-cols-1 lg:grid-cols-4 gap-4 h-40">
        {/* parend child general info */}
        <div className="lg:col-span-3">
          <ParentChildTable data={parentData} />
        </div>
        {/* coming events */}
        <div className="lg:col-span-1 h-full overflow-auto grid grid-cols-1 gap-4">
          {events.map((event) => (
            <EventsCard key={event.id} event={event} />
          ))}
        </div>
      </section>
    </DashboardTemplate>
  );
}
