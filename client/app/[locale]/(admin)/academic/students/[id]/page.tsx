import { getUsers } from "@/app/api/dashboard";
import React from "react";

interface IProps {
  params: Promise<{
    id: string;
  }>;
}

async function page(props: IProps) {
  const params = await props.params;
  console.log("params", params);

  const student = await getUsers({
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
  });

  return <div>page</div>;
}

export default page;
