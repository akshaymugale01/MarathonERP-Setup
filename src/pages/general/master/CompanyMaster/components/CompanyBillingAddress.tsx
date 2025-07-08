import React from "react";
import type { Control, FieldErrors, UseFormRegister } from "react-hook-form";
import type { Company } from "../../../../../types/General/companies";
import SelectBox from "../../../../../components/forms/SelectBox";

interface CompanyBillingAddressProps {
  register: UseFormRegister<Company>;
  control: Control<Company>;
  errors: FieldErrors<Company>;
  isReadOnly: boolean;
  countryOptions: Array<{ value: number; label: string }>;
  stateOptions: Array<{ value: number; label: string }>;
  cityOptions: Array<{ value: number; label: string }>;
  locationOptions: Array<{ value: number; label: string }>;
  watchedSameAsOfficeAddress: boolean;
}

const CompanyBillingAddress: React.FC<CompanyBillingAddressProps> = ({
  register,
  control,
  errors,
  isReadOnly,
  countryOptions,
  stateOptions,
  cityOptions,
  locationOptions,
  watchedSameAsOfficeAddress,
}) => {
  return (
    <div className="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden">
      <div className="bg-red-800 text-white px-6 py-3">
        <h2 className="text-lg font-semibold">Billing Address Details</h2>
      </div>
      <div className="p-6">
        <div className="mb-6">
          <div className="flex items-center space-x-2">
            <input
              id="same_as_above_address"
              type="checkbox"
              {...register("same_as_above_address", {
                setValueAs: (value) => {
                  // Handle string "true"/"false" and boolean values
                  if (typeof value === "string") {
                    return value === "true";
                  }
                  return Boolean(value);
                }
              })}
              disabled={isReadOnly}
              className="h-4 w-4 text-red-600 border-gray-300 rounded focus:ring-red-500"
            />
            <label
              htmlFor="same_as_above_address"
              className="text-sm font-medium text-gray-700"
            >
              Same as Office Address
            </label>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="space-y-2">
            <label
              htmlFor="billing_address_line1"
              className="block text-sm font-medium text-gray-700"
            >
              Address Line 1 <span className="text-red-500">*</span>
            </label>
            <input
              {...register("billing_address_attributes.address", {
                required: true,
              })}
              placeholder="Enter billing address line 1"
              className="w-full border px-3 py-2 rounded-md"
              readOnly={isReadOnly || Boolean(watchedSameAsOfficeAddress)}
            />
            {errors.billing_address_attributes?.address && (
              <p className="text-red-500 text-xs mt-1">
                Billing address line 1 is required
              </p>
            )}
          </div>

          <div className="space-y-2">
            <label
              htmlFor="billing_address_line2"
              className="block text-sm font-medium text-gray-700"
            >
              Line 2
            </label>
            <input
              {...register("billing_address_attributes.address_line_two")}
              placeholder="Enter billing address line 2"
              className="w-full border px-3 py-2 rounded-md"
              readOnly={isReadOnly || Boolean(watchedSameAsOfficeAddress)}
            />
          </div>

          <div className="space-y-2">
            <label
              htmlFor="billing_country"
              className="block text-sm font-medium text-gray-700"
            >
              Country <span className="text-red-500">*</span>
            </label>
            <SelectBox
              name="billing_address_attributes.pms_country_id"
              options={countryOptions}
              control={control}
              placeholder="Select Country"
              isDisabled={isReadOnly || Boolean(watchedSameAsOfficeAddress)}
            />
            {errors.billing_address_attributes?.pms_country_id && (
              <p className="text-red-500 text-xs mt-1">
                Country is required
              </p>
            )}
          </div>

          <div className="space-y-2">
            <label
              htmlFor="billing_state"
              className="block text-sm font-medium text-gray-700"
            >
              State/Province <span className="text-red-500">*</span>
            </label>
            <SelectBox
              name="billing_address_attributes.pms_state_id"
              options={stateOptions}
              control={control}
              placeholder="Select State"
              isDisabled={isReadOnly || Boolean(watchedSameAsOfficeAddress)}
            />
            {errors.billing_address_attributes?.pms_state_id && (
              <p className="text-red-500 text-xs mt-1">
                State is required
              </p>
            )}
          </div>

          <div className="space-y-2">
            <label
              htmlFor="billing_city"
              className="block text-sm font-medium text-gray-700"
            >
              City <span className="text-red-500">*</span>
            </label>
            <SelectBox
              name="billing_address_attributes.pms_city_id"
              options={cityOptions}
              control={control}
              placeholder="Select City"
              isDisabled={isReadOnly || Boolean(watchedSameAsOfficeAddress)}
            />
            {errors.billing_address_attributes?.pms_city_id && (
              <p className="text-red-500 text-xs mt-1">
                City is required
              </p>
            )}
          </div>

          <div className="space-y-2">
            <label
              htmlFor="billing_pin_zip"
              className="block text-sm font-medium text-gray-700"
            >
              Pin/Zip <span className="text-red-500">*</span>
            </label>
            <input
              {...register("billing_address_attributes.pin_code", {
                required: true,
              })}
              placeholder="Enter pin code"
              className="w-full border px-3 py-2 rounded-md"
              readOnly={isReadOnly || Boolean(watchedSameAsOfficeAddress)}
            />
            {errors.billing_address_attributes?.pin_code && (
              <p className="text-red-500 text-xs mt-1">
                Pin code is required
              </p>
            )}
          </div>

          <div className="space-y-2">
            <label
              htmlFor="billing_telephone"
              className="block text-sm font-medium text-gray-700"
            >
              Telephone
            </label>
            <input
              {...register("billing_address_attributes.telephone_number")}
              placeholder="Enter telephone number"
              className="w-full border px-3 py-2 rounded-md"
              readOnly={isReadOnly || Boolean(watchedSameAsOfficeAddress)}
            />
          </div>

          <div className="space-y-2">
            <label
              htmlFor="billing_fax"
              className="block text-sm font-medium text-gray-700"
            >
              Fax
            </label>
            <input
              {...register("billing_address_attributes.fax_number")}
              placeholder="Enter fax number"
              className="w-full border px-3 py-2 rounded-md"
              readOnly={isReadOnly || Boolean(watchedSameAsOfficeAddress)}
            />
          </div>

          <div className="space-y-2">
            <label
              htmlFor="billing_location"
              className="block text-sm font-medium text-gray-700"
            >
              Location
            </label>
            <SelectBox
              name="billing_address_attributes.pms_location_id"
              options={locationOptions}
              control={control}
              placeholder="Select Location"
              isDisabled={isReadOnly || Boolean(watchedSameAsOfficeAddress)}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompanyBillingAddress;
