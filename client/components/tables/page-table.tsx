"use client";

import React, { useLayoutEffect, useState } from "react";
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
import { Modal } from "../ui/dialog";
import { TbEdit } from "react-icons/tb";
import { RiDeleteBin6Line } from "react-icons/ri";
import { BiMessageDetail } from "react-icons/bi";
import Image from "next/image";

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

  if (tableData.length === 0) {
    return (
      <div className="gradient text-xl w-full h-36 flex justify-center items-center">
        <p className="font-bold">{g("No Data")}</p>
      </div>
    );
  }

  return (
    <div className="-mt-14">
      {/* pagination */}
      <div className="w-full flex justify-center items-center gap-2 py-2">
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

      <Table className={cn("gradient", className)}>
        <TableHeader>
          <TableRow>
            {headCell.map((item, index) => (
              <TableHead key={index}>{g(item)}</TableHead>
            ))}
            <TableHead>{g("More")}</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {tableData &&
            tableData.map((item, index) => (
              <TableRow key={index}>
                {headCell.map((cell, idx) => {
                  if (item?.[cell] === "Avatart") {
                    return (
                      <TableCell key={idx} className="max-w-16 overflow-scroll text-sm">
                        <Image src={item.avatar} alt="avatar" width={30} height={30} />
                      </TableCell>
                    );
                  }
                  return (
                    <TableCell key={idx} className="max-w-28 overflow-scroll text-sm">
                      {item?.[cell.replace(" ", "").toLocaleLowerCase()]}
                    </TableCell>
                  );
                })}

                {headCell.length > 0 && (
                  <TableCell className="overflow-scroll text-sm flex items-center gap-2">
                    <Modal
                      modalTitle={`Edit ${item.fullname} Data`}
                      modalTrigger={<TbEdit size={14} />}
                      modalContent={<div className="flex flex-col gap-2"></div>}
                    />
                    <Modal
                      modalTitle={`Delete ${item.fullname} Data`}
                      modalTrigger={<RiDeleteBin6Line size={14} />}
                      modalContent={<div className="flex flex-col gap-2"></div>}
                    />
                    <Modal
                      modalTitle={`Send Message to ${item.fullname}`}
                      modalTrigger={<BiMessageDetail size={14} />}
                      modalContent={<div className="flex flex-col gap-2"></div>}
                    />
                  </TableCell>
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
