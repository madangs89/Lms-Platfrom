import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import React from "react";

const SelectHandler = ({
  setActiveFilter,
  setPage,
  data,
  label = "Select",
}) => {
  return (
    <Select
      onValueChange={(value) => {
        setActiveFilter(value);
        setPage(1);
      }}
    >
      <SelectTrigger className="w-full max-w-48">
        <SelectValue placeholder={label} />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          {data && data.length > 0 && (
            <>
              {/* <SelectLabel className="mt-4">Departments</SelectLabel> */}
              {data.map((d, i) => (
                <SelectItem key={i} value={d.id}>
                  {d.name}
                </SelectItem>
              ))}
            </>
          )}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
};

export default SelectHandler;
