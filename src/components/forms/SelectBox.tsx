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
};

export default function SelectBox<T extends FieldValues>({
  name,
  control,
  options,
  placeholder = "Select...",
  isClearable = false,
}: Props<T>) {
  return (
    <Controller
      name={name}
      control={control}
      rules={{ required: `${placeholder} is required` }}
      render={({ field, fieldState: { error } }) => (
        <div>
          <Select
            {...field}
            options={[{ label: placeholder, value: "" }, ...options]}
            placeholder={placeholder}
            isClearable={isClearable}
            onChange={(opt) => field.onChange(opt?.value ?? null)}
            // value={options.find((o) => o.value === field.value) || null}
            value={
              [{ label: placeholder, value: "" }, ...options].find(
                (o) => o.value === field.value
              ) || null
            }
            className="w-full"
            classNamePrefix="react-select"
            theme={(theme) => ({
              ...theme,
              colors: {
                ...theme.colors,
                primary25: "#911717", // red-800 hover
                primary: "#911717", // red-800 focus
              },
            })}
            styles={{
              control: (base, state) => ({
                ...base,
                backgroundColor: "white",
                color: "black",
                borderColor: "#8a93a3", // gray
                borderRadius: "0.375rem", // Tailwind rounded-md
                boxShadow: state.isFocused ? "0 0 0 1px #911717" : "none",
                "&:hover": {
                  borderColor: "#911717",
                },
              }),
              singleValue: (base) => ({
                ...base,
                color: "black",
              }),
              input: (base) => ({
                ...base,
                color: "black",
              }),
              dropdownIndicator: (base) => ({
                ...base,
                color: "#b91c1c", // red-700
              }),
              menu: (base) => ({
                ...base,
                backgroundColor: "white",
                marginTop: 0, // removes dropdown gap
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
                scrollbarColor: "#911717 white", // red-700
                scrollbarWidth: "thin",
              }),
              option: (base, state) => ({
                ...base,
                backgroundColor: state.isFocused ? "#911717" : "white",
                color: state.isFocused ? "white" : "black",
                cursor: "pointer",
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
