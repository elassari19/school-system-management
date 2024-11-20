import React from "react";
import { UsersRound, GraduationCap, Users, BookOpen } from "lucide-react";
import { getTranslations } from "next-intl/server";
import { attendanceData, monthlyExamsData, tags } from "@/lib/dummy-data";
import DashboardTemplate from "@/components/template/dashboard-template";
import AttendenceChart from "@/components/charts/attendence-chart";
import GradeChart from "@/components/charts/grade-chart";
import GroupCard from "@/components/cards/group-card";
import userAvatar from "@/app/public/assets/user.png";
import { getCookie } from "@/lib/cookies-handler";
import { DashboardCarousel } from "@/components/ui/carousel";
import RootCard from "@/components/cards/root-card";

const members = [
  { id: "1", name: "John Doe", avatar: userAvatar, role: "TEACHER" },
  { id: "2", name: "Jane Smith", avatar: userAvatar, role: "STUDENT" },
  { id: "2", name: "Jane Smith", avatar: userAvatar, role: "ADMIN" },
  { id: "2", name: "Jane Smith", avatar: userAvatar, role: "PARENT" },
];

const Page = async () => {
  const user = await getCookie("session");
  const g = await getTranslations("global");
  const a = await getTranslations("academic");

  return (
    <DashboardTemplate
      overviewData={[
        {
          icon: GraduationCap,
          title: `${g("Total")} ${g("Students")}`,
          currentValue: "2,634",
          pastValue: `+22 ${a("new Students this year")}`,
        },
        {
          icon: UsersRound,
          title: `${g("Total")} ${g("Teachers")}`,
          currentValue: "89",
          pastValue: `+4 ${a("new Teachers this year")}`,
        },
        {
          icon: Users,
          title: `${g("Total")} ${g("Parents")}`,
          currentValue: "1,745",
          pastValue: `+12 ${a("new Parents this year")}`,
        },
        {
          icon: BookOpen,
          title: `${g("Total")} ${g("Classes")}`,
          currentValue: "45",
          pastValue: `+6 ${a("new Classes this year")}`,
        },
      ]}
      LeftSideChart={
        <AttendenceChart
          data={attendanceData}
          title={a("Monthly Attendance")}
        />
      }
      RithSideChart={
        <GradeChart data={monthlyExamsData} title={a("Monthly Exams")} />
      }
    >
      {/* students groups */}
      <RootCard
        className="w-full"
        title="Student Groups"
        cardContent={
          <DashboardCarousel
            carousel={Array(10)
              .fill(
                <GroupCard
                  groupName="Pixel Crafters"
                  members={members}
                  admin={members.find((u) => u.role === "ADMIN")}
                  user={user}
                  subjectTags={tags}
                />
              )
              .map((item) => item)}
          />
        }
      />
      {/* classes groups */}
      <RootCard
        className="w-full"
        title="Classes Groups"
        cardContent={
          <DashboardCarousel
            carousel={Array(10)
              .fill(
                <GroupCard
                  groupName="Pixel Crafters"
                  members={members}
                  admin={members.find((u) => u.role === "ADMIN")}
                  user={user}
                  subjectTags={tags}
                />
              )
              .map((item) => item)}
          />
        }
      />
      {/* parents groups */}
      <RootCard
        className="w-full"
        title="Teachers and Parents Groups"
        cardContent={
          <DashboardCarousel
            carousel={Array(10)
              .fill(
                <GroupCard
                  groupName="Pixel Crafters"
                  members={members}
                  admin={members.find((u) => u.role === "ADMIN")}
                  user={user}
                  subjectTags={tags}
                />
              )
              .map((item) => item)}
          />
        }
      />
    </DashboardTemplate>
  );
};

export default Page;
