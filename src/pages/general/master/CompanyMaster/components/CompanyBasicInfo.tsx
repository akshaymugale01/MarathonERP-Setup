import React from "react";
import type { Control, FieldErrors, UseFormRegister } from "react-hook-form";
import type { Company } from "../../../../../types/General/companies";
import SelectBox from "../../../../../components/forms/SelectBox";

interface CompanyBasicInfoProps {
  register: UseFormRegister<Company>;
  control: Control<Company>;
  errors: FieldErrors<Company>;
  isReadOnly: boolean;
  orgOptions: Array<{ value: number; label: string }>;
  currencyOptions: Array<{ value: string; label: string }>;
  accountingOptions: Array<{ value: string; label: string }>;
}

const CompanyBasicInfo: React.FC<CompanyBasicInfoProps> = ({
  register,
  control,
  errors,
  isReadOnly,
  orgOptions,
  currencyOptions,
  accountingOptions,
}) => {
  return (
    <div className="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden">
      <div className="bg-red-800 text-white px-6 py-3">
        <h2 className="text-lg font-semibold">Certifying Company</h2>
      </div>
      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="space-y-2">
            <label
              htmlFor="company_name"
              className="block text-sm font-medium text-gray-700"
            >
              Company Name <span className="text-red-500">*</span>
            </label>
            <input
              id="company_name"
              type="text"
              {...register("company_name", { required: true })}
              readOnly={isReadOnly}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 text-sm"
              placeholder="Enter company name"
            />
            {errors.company_name && (
              <p className="text-red-500 text-xs mt-1">
                Company name is required
              </p>
            )}
          </div>

          <div className="space-y-2">
            <label
              htmlFor="company_code"
              className="block text-sm font-medium text-gray-700"
            >
              Company Code <span className="text-red-500">*</span>
            </label>
            <input
              id="company_code"
              type="text"
              {...register("company_code", { required: true })}
              readOnly={isReadOnly}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 text-sm"
              placeholder="Enter company code"
            />
            {errors.company_code && (
              <p className="text-red-500 text-xs mt-1">
                Company Code is required
              </p>
            )}
          </div>

          <div className="space-y-2">
            <label
              htmlFor="fiscal_year_from"
              className="block text-sm font-medium text-gray-700"
            >
              Fiscal Year From <span className="text-red-500">*</span>
            </label>
            <input
              id="fiscal_year_from"
              type="date"
              {...register("fiscal_year_from", { required: true })}
              readOnly={isReadOnly}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 text-sm"
            />
            {errors.fiscal_year_from && (
              <p className="text-red-500 text-xs mt-1">Select Date</p>
            )}
          </div>

          <div className="space-y-2">
            <label
              htmlFor="fiscal_year_to"
              className="block text-sm font-medium text-gray-700"
            >
              Fiscal Year To <span className="text-red-500">*</span>
            </label>
            <input
              id="fiscal_year_to"
              type="date"
              {...register("fiscal_year_to", { required: true })}
              readOnly={isReadOnly}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 text-sm"
            />
            {errors.fiscal_year_to && (
              <p className="text-red-500 text-xs mt-1">Select Date</p>
            )}
          </div>

          <div className="space-y-2">
            <label
              htmlFor="company_print_name"
              className="block text-sm font-medium text-gray-700"
            >
              Company Print Name <span className="text-red-500">*</span>
            </label>
            <input
              id="company_print_name"
              type="text"
              {...register("company_print_name", { required: true })}
              readOnly={isReadOnly}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 text-sm"
              placeholder="Enter company print name"
            />
            {errors.company_print_name && (
              <p className="text-red-500 text-xs mt-1">
                Company print name is required
              </p>
            )}
          </div>

          <div className="space-y-2">
            <label
              htmlFor="domain_name"
              className="block text-sm font-medium text-gray-700"
            >
              Domain Name
            </label>
            <input
              id="domain_name"
              type="text"
              {...register("domain_name")}
              readOnly={isReadOnly}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 text-sm"
              placeholder="Enter domain name"
            />
          </div>

          <div className="space-y-2">
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700"
            >
              Email
            </label>
            <input
              id="email"
              type="email"
              {...register("email")}
              readOnly={isReadOnly}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 text-sm"
              placeholder="Enter email"
            />
          </div>

          <div className="space-y-2">
            <label
              htmlFor="server_host"
              className="block text-sm font-medium text-gray-700"
            >
              Server Host (IP Address)
            </label>
            <input
              id="server_host"
              type="text"
              {...register("server_host")}
              readOnly={isReadOnly}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 text-sm"
              placeholder="Enter server host"
            />
          </div>

          <div className="space-y-2">
            <label
              htmlFor="accounting_package"
              className="block text-sm font-medium text-gray-700"
            >
              Accounting Package <span className="text-red-500">*</span>
            </label>
            <SelectBox
              name="accounting_package"
              control={control}
              options={accountingOptions}
              placeholder="Select Accounting"
                          isDisabled={isReadOnly}

            />
          </div>

          <div className="space-y-2">
            <label
              htmlFor="corporate_identity_no"
              className="block text-sm font-medium text-gray-700"
            >
              Corporate Identity No(CIN) <span className="text-red-500">*</span>
            </label>
            <input
              id="corporate_identity_no"
              type="text"
              {...register("corporate_identity_no", {
                required: "Corporate identity number is required",
                pattern: {
                  value: /^[A-Z]\d{5}[A-Z]{2}\d{4}[A-Z]{3}\d{6}$/,
                  message:
                    "Corporate identity no must be in the format L17110MH1973PLC019786",
                },
              })}
              readOnly={isReadOnly}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 text-sm"
              placeholder="Enter corporate identity number (e.g., L17110MH1973PLC019786)"
            />
            {errors.corporate_identity_no && (
              <p className="text-red-500 text-xs mt-1">
                {errors.corporate_identity_no.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <label
              htmlFor="tax_deduction_acc_no"
              className="block text-sm font-medium text-gray-700"
            >
              Tax Deduction Acc No <span className="text-red-500">*</span>
            </label>
            <input
              id="tax_deduction_acc_no"
              type="text"
              {...register("tax_deduction_acc_no", {
                required: "Tax deduction account number is required",
                pattern: {
                  value: /^[A-Z]{4}\d{5}[A-Z]$/,
                  message:
                    "Tax deduction acc no is not in the correct format. It should be in the format: AAAA12345A.",
                },
              })}
              readOnly={isReadOnly}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 text-sm"
              placeholder="Enter tax deduction account number (e.g., DELH12345A)"
            />
            {errors.tax_deduction_acc_no && (
              <p className="text-red-500 text-xs mt-1">
                {errors.tax_deduction_acc_no.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <label
              htmlFor="service_tax_no"
              className="block text-sm font-medium text-gray-700"
            >
              Service Tax No
            </label>
            <input
              id="service_tax_no"
              type="text"
              {...register("service_tax_no")}
              readOnly={isReadOnly}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 text-sm"
              placeholder="Enter service tax number"
            />
          </div>

          <div className="space-y-2">
            <label
              htmlFor="pan_number"
              className="block text-sm font-medium text-gray-700"
            >
              PAN No <span className="text-red-500">*</span>
            </label>
            <input
              id="pan_number"
              type="text"
              {...register("pan_number", {
                required: "PAN number is required",
                pattern: {
                  value: /^[A-Z]{5}\d{4}[A-Z]$/,
                  message:
                    "Pan number is invalid. It should be in the format ABCDE1234F.",
                },
              })}
              readOnly={isReadOnly}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 text-sm"
              placeholder="Enter PAN number (e.g., ABCDE1234F)"
            />
            {errors.pan_number && (
              <p className="text-red-500 text-xs mt-1">
                {errors.pan_number.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <label
              htmlFor="vat_no"
              className="block text-sm font-medium text-gray-700"
            >
              VAT No
            </label>
            <input
              id="vat_no"
              type="text"
              {...register("vat_no", {
                pattern: {
                  value: /^IE\d{7}T[W]?$/,
                  message:
                    "Vat no must be in the format IE1234567T or IE1234567TW",
                },
              })}
              readOnly={isReadOnly}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 text-sm"
              placeholder="Enter VAT number (e.g., IE1234567T or IE1234567TW)"
            />
            {errors.vat_no && (
              <p className="text-red-500 text-xs mt-1">
                {errors.vat_no.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <label
              htmlFor="type_of_organization_id"
              className="block text-sm font-medium text-gray-700"
            >
              Constitution Type <span className="text-red-500">*</span>
            </label>
            <SelectBox
              name="type_of_organization_id"
              options={orgOptions}
              control={control}
              placeholder="Select Constitution"
                          isDisabled={isReadOnly}

            />
          </div>

          <div className="space-y-2">
            <label
              htmlFor="currency"
              className="block text-sm font-medium text-gray-700"
            >
              Currency <span className="text-red-500">*</span>
            </label>
            <SelectBox
              name="currency"
              control={control}
              options={currencyOptions}
              placeholder="Select Currency"
                          isDisabled={isReadOnly}

              
            />
          </div>

          <div className="space-y-2">
            <label
              htmlFor="contact_person_name"
              className="block text-sm font-medium text-gray-700"
            >
              Contact Person Name <span className="text-red-500">*</span>
            </label>
            <input
              id="contact_person_name"
              type="text"
              {...register("contact_person_name", { required: true })}
              readOnly={isReadOnly}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 text-sm"
              placeholder="Enter contact person name"
            />
            {errors.contact_person_name && (
              <p className="text-red-500 text-xs mt-1">
                Contact person name is required
              </p>
            )}
          </div>

          <div className="space-y-2">
            <label
              htmlFor="contact_number"
              className="block text-sm font-medium text-gray-700"
            >
              Contact Number <span className="text-red-500">*</span>
            </label>
            <input
              id="contact_number"
              type="text"
              {...register("contact_number", {
                required: "Contact number is required",
                pattern: {
                  value: /^\d{10}$/,
                  message: "Contact number must be exactly 10 digits",
                },
              })}
              readOnly={isReadOnly}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 text-sm"
              placeholder="Enter 10-digit contact number"
            />
            {errors.contact_number && (
              <p className="text-red-500 text-xs mt-1">
                {errors.contact_number.message}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompanyBasicInfo;
