import React from "react";
import type { FieldErrors, UseFormRegister } from "react-hook-form";
import type { Company } from "../../../../../types/General/companies";

interface CompanyPayrollInfoProps {
  register: UseFormRegister<Company>;
  errors: FieldErrors<Company>;
  isReadOnly: boolean;
}

const CompanyPayrollInfo: React.FC<CompanyPayrollInfoProps> = ({
  register,
  errors,
  isReadOnly,
}) => {
  return (
    <div className="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden">
      <div className="bg-red-800 text-white px-6 py-3">
        <h2 className="text-lg font-semibold">Payroll Information</h2>
      </div>
      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="space-y-2">
            <label
              htmlFor="tan_no"
              className="block text-sm font-medium text-gray-700"
            >
              TAN No
            </label>
            <input
              id="tan_no"
              type="text"
              {...register("tan_no", {
                pattern: {
                  value: /^[A-Z]{4}\d{5}[A-Z]$/,
                  message: "Tan no must be in the format RAJA99999B",
                },
              })}
              readOnly={isReadOnly}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
              placeholder="Enter TAN number (e.g., RAJA99999B)"
            />
            {errors.tan_no && (
              <p className="text-red-500 text-xs mt-1">
                {errors.tan_no.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <div className="flex items-center space-x-2 mb-2">
              <input
                id="pf_applicable"
                type="checkbox"
                {...register("pf_applicable")}
                disabled={isReadOnly}
                className="h-4 w-4 text-red-600 border-gray-300 rounded focus:ring-red-500"
              />
              <label
                htmlFor="pf_applicable"
                className="text-sm font-medium text-gray-700"
              >
                PF Applicable
              </label>
            </div>
            <label
              htmlFor="pf_no"
              className="block text-sm font-medium text-gray-700"
            >
              PF No
            </label>
            <input
              id="pf_no"
              type="text"
              {...register("pf_no", {
                pattern: {
                  value: /^[A-Z0-9]{22}$/,
                  message:
                    "Pf no must be a 22-character alphanumeric code (e.g., TNMAS00451230000012345)",
                },
              })}
              readOnly={isReadOnly}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
              placeholder="Enter PF number (e.g., TNMAS00451230000012345)"
            />
            {errors.pf_no && (
              <p className="text-red-500 text-xs mt-1">
                {errors.pf_no.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <div className="flex items-center space-x-2 mb-2">
              <input
                id="esi_applicable"
                type="checkbox"
                {...register("esi_applicable")}
                disabled={isReadOnly}
                className="h-4 w-4 text-red-600 border-gray-300 rounded focus:ring-red-500"
              />
              <label
                htmlFor="esi_applicable"
                className="text-sm font-medium text-gray-700"
              >
                ESI Applicable
              </label>
            </div>
            <label
              htmlFor="esi_no"
              className="block text-sm font-medium text-gray-700"
            >
              ESI No
            </label>
            <input
              id="esi_no"
              type="text"
              {...register("esi_no", {
                pattern: {
                  value: /^\d{17}$/,
                  message:
                    "Esi no must be a 17-digit number (e.g., 12345678901234567)",
                },
              })}
              readOnly={isReadOnly}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
              placeholder="Enter ESI number (e.g., 12345678901234567)"
            />
            {errors.esi_no && (
              <p className="text-red-500 text-xs mt-1">
                {errors.esi_no.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <label
              htmlFor="salary_calculation"
              className="block text-sm font-medium text-gray-700"
            >
              Salary Calculation
            </label>
            <input
              id="salary_calculation"
              type="text"
              {...register("salary_calculation")}
              readOnly={isReadOnly}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
              placeholder="Enter salary calculation"
            />
          </div>

          <div className="space-y-2">
            <label
              htmlFor="days"
              className="block text-sm font-medium text-gray-700"
            >
              Days
            </label>
            <input
              id="days"
              type="number"
              {...register("days")}
              readOnly={isReadOnly}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
              placeholder="Enter days"
            />
          </div>

          <div className="space-y-2">
            <label
              htmlFor="start_days"
              className="block text-sm font-medium text-gray-700"
            >
              Start Days
            </label>
            <input
              id="start_days"
              type="number"
              {...register("start_days")}
              readOnly={isReadOnly}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
              placeholder="Enter start day"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompanyPayrollInfo;
