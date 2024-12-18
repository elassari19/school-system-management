"use client";

import { cn } from "@/lib/utils";
import { SearchIcon } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useDebouncedCallback } from "use-debounce";

interface Props extends React.InputHTMLAttributes<HTMLInputElement> {}

const SearchInput = ({ placeholder, className, ...rest }: Props) => {
  // get search params
  const searchParams = useSearchParams();
  const { replace } = useRouter();
  // get current url pathname
  const pathname = usePathname();

  // useDebouncedCallback using for delay
  const handleSearch = useDebouncedCallback((e: any) => {
    // update search params immediately
    const params = new URLSearchParams(searchParams);

    if (e.target.value) {
      e.target.value.length > 2 && params.set("q", e.target.value);
    } else {
      params.delete("q");
    }
    replace(`${pathname}?${params}`);
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
