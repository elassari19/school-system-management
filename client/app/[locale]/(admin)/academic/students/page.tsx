import { getUsers } from "@/app/api/dashboard";
import AddStudentForm from "@/components/forms/student-form";
import PageTemplate from "@/components/template/page-template";
import { ChartLine, GraduationCap } from "lucide-react";
import { getTranslations } from "next-intl/server";
import React from "react";

interface IProps {
  params: Promise<{
    page: number;
  }>;
}

export default async function page(props: IProps) {
  const params = await props.params;
  const { page } = params;

  const a = await getTranslations("academic");
  const g = await getTranslations("global");

  const student: any[] = await getUsers({
    where: {
      role: "STUDENT",
    },
    include: {
      student: {
        include: {
          class: true,
          grade: true,
          parent: true,
        },
      },
    },
    skip: page ? 10 * page : 0,
    take: 5,
  });

  const maleStudents: any[] = await getUsers({
    where: {
      role: "STUDENT",
      gender: "male",
    },
    select: {
      age: true,
    },
  });

  const femaleStudents: any[] = await getUsers({
    where: {
      role: "STUDENT",
      gender: "female",
    },
    select: {
      age: true,
    },
  });

  const maleAverageAge =
    maleStudents.reduce((a: number, b: any) => a + b.age, 0) / maleStudents.length;
  const femaleAverageAge =
    femaleStudents.reduce((a: number, b: any) => a + b.age, 0) / femaleStudents.length;

  // console.log("student", femaleStudents);

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
          currentValue: maleAverageAge.toFixed(4),
          pastValue: `+0.28% ${a("Students average age this year")}`,
        },
        {
          icon: ChartLine,
          title: `${g("Female")} ${g("Average")} ${g("Age")}`,
          currentValue: femaleAverageAge.toFixed(4),
          pastValue: `-0.03% ${a("Students average age this year")}`,
        },
      ]}
      // student search input + student add
      placeholder={`${g("Search")} ${g("Student")}...`}
      actionTarget="student"
      modalForm={<AddStudentForm />}
    >
      {/* 
      table
      - student name
      - student parents
      - student class
      - student age
      - student average grade
      - student average attendance
      - student messages
      - student subscription bill
      - student reviews
      - student status
      - student profile
      - student edit
      - student delete
      - student print
      - student pagination
     */}
    </PageTemplate>
  );
}
