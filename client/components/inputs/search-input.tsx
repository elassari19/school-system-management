"use client";

import useUrlPath from "@/hooks/use-urlPath";
import { cn } from "@/lib/utils";
import { SearchIcon } from "lucide-react";
import { useDebouncedCallback } from "use-debounce";

interface Props extends React.InputHTMLAttributes<HTMLInputElement> {}

const SearchInput = ({ placeholder, className, ...rest }: Props) => {
  const { setParams, removeParam } = useUrlPath();

  const handleSearch = useDebouncedCallback((e: any) => {
    e?.target.value.length > 1 ? setParams("q", e.target.value) : removeParam("q");
  }, 1000);

  return (
    <div
      className={cn(
        "flex-1 flex justify-between items-center border border-secondary rounded-md p-2",
        className
      )}
    >
      <input
        placeholder={placeholder}
        onChange={handleSearch}
        {...rest}
        className="flex-1 outline-none ring-0 border-0"
      />
      <button type="submit">
        <SearchIcon size={20} className="text-secondary mx-2 cursor-pointer" />
      </button>
    </div>
  );
};

export default SearchInput;
