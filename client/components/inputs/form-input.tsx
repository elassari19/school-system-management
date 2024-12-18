import React from "react";
import { Input } from "../ui/input";
import { cn } from "@/lib/utils";

interface IProps {
  label: string;
  error: string;
  options?: { id: string; value: string }[];
  [key: string]: any;
}

const FormInput = ({ error, label, options, ...rest }: IProps) => {
  return (
    <div>
      {label && (
        <label htmlFor={rest.id} className="block text-start font-semibold">
          {label}:
        </label>
      )}
      {options ? (
        <select
          {...rest}
          className={cn(
            "w-full p-2 bg-white outline-none rounded-md border",
            error ? "border-secondary" : "border-green-400"
          )}
          onChange={(e) => {
            rest.onChange(e);
          }}
          defaultValue={"Select Option"}
        >
          {options.map((option, idx) => (
            <option value={option.id} key={idx}>
              {option.value}
            </option>
          ))}
        </select>
      ) : (
        <Input
          {...rest}
          className={cn("bg-white", error ? "border-secondary" : "border-green-400")}
        />
      )}
      {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
    </div>
  );
};

export default FormInput;
