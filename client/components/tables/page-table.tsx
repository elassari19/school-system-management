"use client";

import React, { useEffect, useLayoutEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import useIntlTranslations from "@/hooks/use-intl-translations";
import { Button } from "../ui/button";
import { cn } from "@/lib/utils";
import useUrlPath from "@/hooks/use-urlPath";

interface IProps extends React.HTMLAttributes<HTMLDivElement> {
  headCell: string[];
  bodyCell: any[];
  pages: number;
}

const PageTable = ({ headCell, bodyCell, pages, className }: IProps) => {
  const { g } = useIntlTranslations();
  const [page, setPage] = useState(1);
  const [tableData, setTableData] = useState(bodyCell || []);

  const { setParams } = useUrlPath();

  useLayoutEffect(() => {
    setTableData(bodyCell);
  }, [bodyCell]);

  const handlePage = (p: number) => {
    setPage(p);
    setParams("page", p.toString());
  };

  return (
    <div>
      {/* pagination */}
      <div className="w-full flex justify-end items-center gap-2 py-2">
        <Button
          size={"sm"}
          onClick={() => handlePage(page > 0 ? page - 1 : page)}
          disabled={page === 1}
        >
          {"<"}
        </Button>
        <Button size={"sm"} onClick={() => handlePage(1)} disabled={page === 1}>
          1
        </Button>

        {page > 1 && page < pages && <Button disabled> {page} </Button>}

        {pages > 1 && (
          <Button size={"sm"} onClick={() => handlePage(pages)} disabled={page === pages}>
            {pages}
          </Button>
        )}

        <Button
          size={"sm"}
          onClick={() => handlePage(page < pages ? page + 1 : page)}
          disabled={page === pages}
        >
          {">"}
        </Button>
      </div>

      <Table
        className={cn(
          "border border-secondary rounded-md bg-gradient-to-b from-[#fef2eb] to-[#f3f3fc]",
          className
        )}
      >
        <TableHeader>
          <TableRow>
            {headCell.map((item, index) => (
              <TableHead key={index}>{g(item)}</TableHead>
            ))}
          </TableRow>
        </TableHeader>

        <TableBody>
          {tableData.map((item, index) => (
            <TableRow key={index}>
              {headCell.length > 0 ? (
                headCell.map((cell, idx) => {
                  if (item?.[cell] === "Avatart") {
                    return (
                      <TableCell key={idx} className="max-w-16 overflow-scroll text-sm">
                        <Avatar>
                          <AvatarImage src={item.fullname[0]} />
                          <AvatarFallback>{item.fullname[0]}</AvatarFallback>
                        </Avatar>
                      </TableCell>
                    );
                  }
                  return (
                    <TableCell key={idx} className="max-w-28 overflow-scroll text-sm">
                      {item?.[cell.replace(" ", "").toLocaleLowerCase()]}
                    </TableCell>
                  );
                })
              ) : (
                <div className="text-xl w-full h-36 flex justify-center items-center">
                  <p>{g("No Data")}</p>
                </div>
              )}
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {/* pagination */}
      <div className="w-full flex justify-end items-center gap-2 py-2">
        <Button
          size={"sm"}
          onClick={() => handlePage(page > 0 ? page - 1 : page)}
          disabled={page === 1}
        >
          {"<"}
        </Button>
        <Button size={"sm"} onClick={() => handlePage(1)} disabled={page === 1}>
          1
        </Button>

        {page > 1 && page < pages && <Button disabled> {page} </Button>}

        {pages > 1 && (
          <Button size={"sm"} onClick={() => handlePage(pages)} disabled={page === pages}>
            {pages}
          </Button>
        )}

        <Button
          size={"sm"}
          onClick={() => handlePage(page < pages ? page + 1 : page)}
          disabled={page === pages}
        >
          {">"}
        </Button>
      </div>
    </div>
  );
};

export default PageTable;
