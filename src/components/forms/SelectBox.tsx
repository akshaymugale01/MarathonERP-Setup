import Select from "react-select";
import {
  Controller,
  type Control,
  type FieldValues,
  type Path,
} from "react-hook-form";

export interface Option {
  value: string | number;
  label: string;
}

type Props<T extends FieldValues> = {
  name: Path<T>;
  control: Control<T>;
  options: Option[];
  placeholder?: string;
  isClearable?: boolean;
  isDisabled?: boolean;
  required?: boolean;
};

export default function SelectBox<T extends FieldValues>({
  name,
  control,
  options,
  placeholder = "Select...",
  isClearable = false,
  isDisabled,
  required = true, // Default to true for backward compatibility
}: Props<T>) {
  return (
    <Controller
      name={name}
      control={control}
      rules={required ? { required: `${placeholder} is required` } : {}}
      render={({ field, fieldState: { error } }) => (
        <div>
          <Select
            {...field}
            options={[{ label: placeholder, value: "" }, ...options]}
            placeholder={placeholder}
            isClearable={isClearable}
            isDisabled={isDisabled}
            onChange={(opt) => field.onChange(opt?.value ?? null)}
            value={
              // [{ label: placeholder, value: "" }, ...options].find(
              //   (o) => o.value === (field.value ?? "" )
              // ) || null
              field.value
                ? [{ label: placeholder, value: "" }, ...options].find(
                    (o) => o.value === field.value
                  ) ?? null
                : null
            }
            className="w-full"
            classNamePrefix="react-select"
            theme={(theme) => ({
              ...theme,
              colors: {
                ...theme.colors,
                primary25: "#911717",
                primary: "#911717",
              },
            })}
            styles={{
              control: (base, state) => ({
                ...base,
                backgroundColor: isDisabled ? "#f3f4f6" : "white", // gray-100 if disabled
                borderColor: "#8a93a3",
                borderRadius: "0.375rem",
                boxShadow: state.isFocused ? "0 0 0 1px #911717" : "none",
                cursor: isDisabled ? "not-allowed" : "pointer",
                "&:hover": {
                  borderColor: "#911717",
                },
              }),
              singleValue: (base) => ({
                ...base,
                color: "black", // Always black, even if disabled
              }),
              input: (base) => ({
                ...base,
                color: "black", // Always black, even if disabled
              }),
              dropdownIndicator: (base) => ({
                ...base,
                color: isDisabled ? "#d1d5db" : "#b91c1c", // gray-300 if disabled
              }),
              menu: (base) => ({
                ...base,
                backgroundColor: "white",
                marginTop: 0,
                borderRadius: "0.375rem",
                overflow: "hidden",
                zIndex: 50,
              }),
              menuList: (base) => ({
                ...base,
                paddingTop: 0,
                paddingBottom: 0,
                maxHeight: "200px",
                overflowY: "auto",
                scrollbarColor: "#911717 white",
                scrollbarWidth: "thin",
              }),
              option: (base, state) => ({
                ...base,
                backgroundColor: state.isFocused ? "#911717" : "white",
                color: state.isFocused ? "white" : "black",
                cursor: isDisabled ? "not-allowed" : "pointer",
              }),
            }}
          />

          {error && <p className="text-red-600 mt-1">{error.message}</p>}
        </div>
      )}
    />
  );
}

//     import React from "react";
// import Select from "react-select";
// import { Controller, Control } from "react-hook-form";

// export interface Option {
//   value: string | number;
//   label: string;
// }

// type Props = {
//   name: string;
//   control: Control<any>;
//   options: Option[];
//   placeholder?: string;
//   isClearable?: boolean;
// };

// export default function SelectBox({
//   name,
//   control,
//   options,
//   placeholder = "Select...",
//   isClearable = false,
// }: Props) {
//   return (
//     <Controller
//       name={name}
//       control={control}
//       rules={{ required: `${placeholder} is required` }}
//       render={({ field, fieldState: { error } }) => (
//         <div>
//           <Select
//             {...field}
//             options={options}
//             placeholder={placeholder}
//             isClearable={isClearable}
//             onChange={(opt) => field.onChange(opt?.value ?? null)}
//             value={options.find((o) => o.value === field.value) || null}
//             className="w-full"
//           />
//           {error && <p className="text-red-600 mt-1">{error.message}</p>}
//         </div>
//       )}
//     />
//   );
// }
