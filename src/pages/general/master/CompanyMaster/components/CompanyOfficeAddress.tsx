import React from "react";
import type { Control, FieldErrors, UseFormRegister } from "react-hook-form";
import type { Company } from "../../../../../types/General/companies";
import SelectBox from "../../../../../components/forms/SelectBox";

interface CompanyOfficeAddressProps {
  register: UseFormRegister<Company>;
  control: Control<Company>;
  errors: FieldErrors<Company>;
  isReadOnly: boolean;
  countryOptions: Array<{ value: number; label: string }>;
  stateOptions: Array<{ value: number; label: string }>;
  cityOptions: Array<{ value: number; label: string }>;
  locationOptions: Array<{ value: number; label: string }>;
  watchedCountryId: number;
  watchedStateId: number;
  watchedCityId: number;
}

const CompanyOfficeAddress: React.FC<CompanyOfficeAddressProps> = ({
  register,
  control,
  errors,
  isReadOnly,
  countryOptions,
  stateOptions,
  cityOptions,
  locationOptions,
  watchedCountryId,
  watchedStateId,
  watchedCityId,
}) => {
  return (
    <div className="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden">
      <div className="bg-red-800 text-white px-6 py-3">
        <h2 className="text-lg font-semibold">
          Registered Office Address Details
        </h2>
      </div>
      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="space-y-2">
            <label
              htmlFor="addressLine1"
              className="block text-sm font-medium text-gray-700"
            >
              Address Line 1 <span className="text-red-500">*</span>
            </label>
            <input
              {...register("office_address_attributes.address", {
                required: true,
              })}
              placeholder="Enter address line 1"
              className="w-full border px-3 py-2 rounded-md"
              readOnly={isReadOnly}
            />
            {errors.office_address_attributes?.address && (
              <p className="text-red-500 text-xs mt-1">
                Address line 1 is required
              </p>
            )}
          </div>

          <div className="space-y-2">
            <label
              htmlFor="addressLine2"
              className="block text-sm font-medium text-gray-700"
            >
              Line 2 <span className="text-red-500">*</span>
            </label>
            <input
              {...register("office_address_attributes.address_line_two", {
                required: true,
              })}
              placeholder="Enter address line 2"
              className="w-full border px-3 py-2 rounded-md"
              readOnly={isReadOnly}
            />
            {errors.office_address_attributes?.address_line_two && (
              <p className="text-red-500 text-xs mt-1">
                Address line 2 is required
              </p>
            )}
          </div>

          <div className="space-y-2">
            <label
              htmlFor="country"
              className="block text-sm font-medium text-gray-700"
            >
              Country <span className="text-red-500">*</span>
            </label>
            <SelectBox
              name="office_address_attributes.pms_country_id"
              options={countryOptions}
              control={control}
              placeholder="Select Country"
              isDisabled={isReadOnly}

            />
            {errors.office_address_attributes?.pms_country_id && (
              <p className="text-red-500 text-xs mt-1">
                Country is required
              </p>
            )}
          </div>

          <div className="space-y-2">
            <label className="block mb-2 font-medium">
              State <span className="text-red-500">*</span>
            </label>
            <SelectBox
              placeholder="Select State"
              name="office_address_attributes.pms_state_id"
              control={control}
              options={stateOptions}
              isDisabled={!watchedCountryId || isReadOnly}

            />
            {errors.office_address_attributes?.pms_state_id && (
              <span className="text-red-500 text-sm mt-1 block">
                State is required
              </span>
            )}
          </div>

          <div className="space-y-2">
            <label className="block mb-2 font-medium">
              City <span className="text-red-500">*</span>
            </label>
            <SelectBox
              placeholder="Select City"
              name="office_address_attributes.pms_city_id"
              control={control}
              options={cityOptions}
              isDisabled={!watchedStateId || isReadOnly}
            />
            {errors.office_address_attributes?.pms_city_id && (
              <span className="text-red-500 text-sm mt-1 block">
                City is required
              </span>
            )}
          </div>

          <div className="space-y-2">
            <label
              htmlFor="pinZip"
              className="block text-sm font-medium text-gray-700"
            >
              Pin/Zip <span className="text-red-500">*</span>
            </label>
            <input
              {...register("office_address_attributes.pin_code", {
                required: true,
              })}
              placeholder="Enter pin code"
              className="w-full border px-3 py-2 rounded-md"
              readOnly={isReadOnly}
            />
            {errors.office_address_attributes?.pin_code && (
              <p className="text-red-500 text-xs mt-1">
                Pin code is required
              </p>
            )}
          </div>

          <div className="space-y-2">
            <label
              htmlFor="telephone"
              className="block text-sm font-medium text-gray-700"
            >
              Telephone
            </label>
            <input
              {...register("office_address_attributes.telephone_number")}
              placeholder="Enter telephone number"
              className="w-full border px-3 py-2 rounded-md"
              readOnly={isReadOnly}
            />
          </div>

          <div className="space-y-2">
            <label
              htmlFor="fax"
              className="block text-sm font-medium text-gray-700"
            >
              Fax
            </label>
            <input
              {...register("office_address_attributes.fax_number")}
              placeholder="Enter fax number"
              className="w-full border px-3 py-2 rounded-md"
              readOnly={isReadOnly}
            />
          </div>

          <div>
            <div className="space-y-2 md:col-span-2">
              <label
                htmlFor="location"
                className="block text-sm font-medium text-gray-700"
              >
                Location
              </label>
              <SelectBox
                name="office_address_attributes.pms_location_id"
                placeholder="Select Location"
                control={control}
                options={locationOptions}
                isDisabled={!watchedCityId || isReadOnly}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompanyOfficeAddress;
