"use client";

import React, { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { parentType } from "@/lib/types";
import { ChevronDown, ChevronRight } from "lucide-react"; // Import icons
import useIntlTranslations from "@/hooks/use-intl-translations";
import { parentData } from "@/lib/dummy-data";
import { getParentsWithChidren } from "@/app/api/dashboard";
import { Button } from "../ui/button";

interface IProps {
  pages: number;
}

const ParentChildTable = ({ pages }: IProps) => {
  const { g } = useIntlTranslations();
  const [expandedRows, setExpandedRows] = useState<Record<string, boolean>>({});
  const [data, setData] = useState([]);
  const [page, setPage] = useState(1);

  const getTableData = async () => {
    const result = await getParentsWithChidren(page - 1);
    setData(result);
  };

  React.useEffect(() => {
    getTableData();
  }, [page]);

  const toggleRow = (id: string) => {
    setExpandedRows((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  return (
    <div>
      {/* add pagination */}
      <div className="w-full flex justify-end items-center gap-2 py-2">
        <Button onClick={() => setPage(page > 0 ? page - 1 : page)} disabled={page === 1}>
          {"<"}
        </Button>
        <Button onClick={() => setPage(1)} disabled={page === 1}>
          1
        </Button>

        {page > 1 && page < pages && <Button disabled> {page} </Button>}
        <Button onClick={() => setPage(pages)} disabled={page === pages}>
          {pages}
        </Button>

        <Button
          onClick={() => setPage(page < pages ? page + 1 : page)}
          disabled={page === pages}
        >
          {">"}
        </Button>
      </div>

      <Table className="border">
        <TableHeader>
          <TableRow>
            <TableHead></TableHead>
            <TableHead>{g("Avatar")}</TableHead>
            <TableHead>{g("Full Name")}</TableHead>
            <TableHead>{g("Gender")}</TableHead>
            <TableHead>{g("Address")}</TableHead>
            <TableHead>{g("Children")}</TableHead>
            <TableHead>{g("Expenses")}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((parent: parentType) => (
            <React.Fragment key={parent.id}>
              <TableRow>
                <TableCell>
                  <button onClick={() => toggleRow(`${parent.id}`)}>
                    {expandedRows[parent.id] ? (
                      <ChevronDown size={20} />
                    ) : (
                      <ChevronRight size={20} />
                    )}
                  </button>
                </TableCell>
                <TableCell>
                  <Avatar>
                    <AvatarImage src={parent.avatar} />
                    <AvatarFallback>{parent.fullname[0]}</AvatarFallback>
                  </Avatar>
                </TableCell>
                <TableCell>{parent.fullname}</TableCell>
                <TableCell>
                  {g(`${parent.gender[0].toUpperCase()}${parent.gender.slice(1)}`)}
                </TableCell>
                <TableCell>{parent.address}</TableCell>
                <TableCell>{parent.parent[0]?.children?.length}</TableCell>
                <TableCell>${(parent.salary * 3).toFixed(2)}</TableCell>
              </TableRow>
              {expandedRows[parent.id] && (
                <>
                  <TableRow className="bg-background">
                    <TableHead>{g("Role")}</TableHead>
                    <TableHead>{g("Avatar")}</TableHead>
                    <TableHead className="min-w-40">{g("Full Name")}</TableHead>
                    <TableHead>{g("Gender")}</TableHead>
                    <TableHead>{g("Class")}</TableHead>
                    <TableHead>{g("Grade")}</TableHead>
                    <TableHead>{g("Attendance")}</TableHead>
                    <TableHead>{g("Status")}</TableHead>
                  </TableRow>
                  {parent.parent[0]?.children?.map((child) => (
                    <TableRow className="p-2 [&>*]:py-1 bg-background">
                      <TableCell>{g("Student")}</TableCell>
                      <TableCell>
                        <Avatar className="w-8 h-8">
                          <AvatarImage src={child.user.image} />
                          <AvatarFallback>{child.user.fullname}</AvatarFallback>
                        </Avatar>
                      </TableCell>
                      <TableCell>{child.user.fullname}</TableCell>
                      <TableCell>
                        {g(
                          `${child.user.gender[0].toUpperCase()}${child.user.gender.slice(1)}`
                        )}
                      </TableCell>
                      <TableCell>{child?.class?.name || "none"}</TableCell>
                      {/* <TableCell>{child.user.grade || "A+"}</TableCell>
                      <TableCell>{child.user?.attendance || 95}%</TableCell>
                      <TableCell>{g(child.user.status) || "Active"}</TableCell> */}
                    </TableRow>
                  ))}
                </>
              )}
            </React.Fragment>
          ))}
        </TableBody>
      </Table>
      {/* add pagination */}
      <div className="w-full flex justify-end items-center gap-2 py-2">
        <Button onClick={() => setPage(page - 1)} disabled={page === 1}>
          {"<"}
        </Button>

        <Button onClick={() => setPage(1)} disabled={page === 1}>
          {1}
        </Button>

        {page > 1 && page < pages && <Button disabled> {page} </Button>}

        <Button onClick={() => setPage(pages)} disabled={page === pages}>
          {pages}
        </Button>
        <Button onClick={() => setPage(page + 1)} disabled={page === pages}>
          {">"}
        </Button>
      </div>
    </div>
  );
};

export default ParentChildTable;
