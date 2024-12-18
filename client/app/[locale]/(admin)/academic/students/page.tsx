import { findStudent, getAllStudent, getStudentByGender } from "@/app/api/academic";
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
  const searchParams = await props.searchParams;
  const { page, q } = searchParams;

  const a = await getTranslations("academic");
  const g = await getTranslations("global");

  const students: any[] = await getAllStudent(page);

  const searchStudent: any[] = await findStudent(page, q || "");
  console.log("searchStudent", searchStudent);

  const maleStudents = await getStudentByGender("male");

  const femaleStudents = await getStudentByGender("female");

  const handleTableData = (data: any[]) => {
    const result = data.map((std: any) => ({
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

    return result;
  };

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
      // student search input + student add
      placeholder={`${g("Search")} ${g("Student")}...`}
      actionTarget="student"
      modalForm={<AddStudentForm />}
      tableData={q?.length! > 2 ? handleTableData(searchStudent) : handleTableData(students)}
      pages={Math.ceil(
        q?.length! > 2
          ? students.length / 5
          : (maleStudents.length + femaleStudents.length) / 5
      )}
    ></PageTemplate>
  );
}
