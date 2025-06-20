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
  isDisabled?: boolean
};

export default function MultiSelectBox<T extends FieldValues>({
  name,
  control,
  options,
  placeholder = "Select...",
  isClearable = false,
  isDisabled = false,
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
            isMulti
            options={options}
            placeholder={placeholder}
            isClearable={isClearable}
            isDisabled={isDisabled}
            onChange={(selectedOptions) =>
              field.onChange(
                selectedOptions ? selectedOptions.map((opt) => opt.value) : []
              )
            }
            value={
              Array.isArray(field.value)
                ? options.filter((o) => field.value.includes(o.value))
                : []
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
              multiValue: (base) => ({
                ...base,
                backgroundColor: "#e5e7eb", // gray-200 for tags
              }),
              multiValueLabel: (base) => ({
                ...base,
                color: "black", // Always black for tag text
              }),
              singleValue: (base) => ({
                ...base,
                color: "black", // Always black for selected value
              }),
              input: (base) => ({
                ...base,
                color: "black", // Always black for input
              }),
              dropdownIndicator: (base) => ({
                ...base,
                color: isDisabled ? "#d1d5db" : "#b91c1c",
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
