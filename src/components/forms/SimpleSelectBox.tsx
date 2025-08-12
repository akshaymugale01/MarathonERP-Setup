import React from 'react';
import Select from 'react-select';

export interface Option {
  value: string | number;
  label: string;
}

interface SimpleSelectBoxProps {
  value?: string | number | null;
  onChange: (value: string | number | null) => void;
  options: Option[];
  placeholder?: string;
  isClearable?: boolean;
  isDisabled?: boolean;
  className?: string;
}

export default function SimpleSelectBox({
  value,
  onChange,
  options,
  placeholder = "Select...",
  isClearable = false,
  isDisabled = false,
  className = "",
}: SimpleSelectBoxProps) {
  const selectedOption = options.find(option => option.value === value) || null;

  return (
    <div className={className}>
      <Select
        value={selectedOption}
        onChange={(selectedOption) => onChange(selectedOption?.value ?? null)}
        options={options}
        placeholder={placeholder}
        isClearable={isClearable}
        isDisabled={isDisabled}
        className="w-full"
        styles={{
          control: (provided) => ({
            ...provided,
            minHeight: '40px',
            border: '1px solid #d1d5db',
            '&:hover': {
              border: '1px solid #d1d5db',
            },
            '&:focus-within': {
              border: '2px solid #ef4444',
              boxShadow: '0 0 0 0 #ef4444',
            },
          }),
          menu: (provided) => ({
            ...provided,
            zIndex: 9999,
          }),
        }}
      />
    </div>
  );
}
