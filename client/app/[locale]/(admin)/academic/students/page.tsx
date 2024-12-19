import { getAllStudent, getStudentByGender } from "@/app/api/academic";
import AddStudentForm from "@/components/forms/student-form";
import PageTemplate from "@/components/template/page-template";
import { ChartLine, GraduationCap } from "lucide-react";
import { getTranslations } from "next-intl/server";
import React from "react";

interface IProps {
  searchParams: Promise<{
    page: number;
    q?: string;
  }>;
}

export default async function page(props: IProps) {
  const { page, q = "" } = await props.searchParams;
  const [a, g] = await Promise.all([getTranslations("academic"), getTranslations("global")]);

  const [maleStudents, femaleStudents, searchStudent] = await Promise.all([
    getStudentByGender("male"),
    getStudentByGender("female"),
    getAllStudent(page, q),
  ]);

  const handleTableData = (data: any[]) =>
    data.map((std: any) => ({
      avatar: std.user.image,
      fullname: std.user.fullname,
      age: std.user.age,
      gender: std.user.gender,
      parents: std.parent.user.fullname,
      email: std.user.email,
      phone: std.user.phone,
      attendance: std.attendence,
      class: std.class.name,
      status: std.status,
    }));

  return (
    <PageTemplate
      overviewData={[
        {
          icon: GraduationCap,
          title: `${g("Male")} ${g("Students")}`,
          currentValue: maleStudents.length,
          pastValue: `+17% ${a("new Students this year")}`,
        },
        {
          icon: GraduationCap,
          title: `${g("Female")} ${g("Students")}`,
          currentValue: femaleStudents.length,
          pastValue: `+13% ${a("new Students this year")}`,
        },
        {
          icon: ChartLine,
          title: `${g("Male")} ${g("Average")} ${g("Age")}`,
          currentValue: maleStudents.average.toFixed(4),
          pastValue: `+0.28% ${a("Students average age this year")}`,
        },
        {
          icon: ChartLine,
          title: `${g("Female")} ${g("Average")} ${g("Age")}`,
          currentValue: femaleStudents.average.toFixed(4),
          pastValue: `-0.03% ${a("Students average age this year")}`,
        },
      ]}
      placeholder={`${g("Search")} ${g("Student")}...`}
      actionTarget="student"
      modalForm={<AddStudentForm />}
      tableData={handleTableData(searchStudent.student)}
      pages={Math.ceil(searchStudent.count / 5)}
    />
  );
}
