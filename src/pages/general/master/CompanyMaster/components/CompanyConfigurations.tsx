import React from "react";
import type { UseFormRegister } from "react-hook-form";
import type { Company } from "../../../../../types/General/companies";

interface CompanyConfigurationsProps {
  register: UseFormRegister<Company>;
  isReadOnly: boolean;
}

const CompanyConfigurations: React.FC<CompanyConfigurationsProps> = ({
  register,
  isReadOnly,
}) => {
  return (
    <div className="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden">
      <div className="bg-red-800 text-white px-6 py-3">
        <h2 className="text-lg font-semibold">Configurations</h2>
      </div>
      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="flex items-center space-x-2">
            <input
              id="mor_selection_enabled"
              type="checkbox"
              {...register("mor_selection_enabled")}
              disabled={isReadOnly}
              className="h-4 w-4 text-red-600 border-gray-300 rounded focus:ring-red-500"
            />
            <label
              htmlFor="mor_selection_enabled"
              className="text-sm font-medium text-gray-700"
            >
              MOR Selection Enabled
            </label>
          </div>

          <div className="flex items-center space-x-2">
            <input
              id="material_selection_enabled"
              type="checkbox"
              {...register("material_selection_enabled")}
              disabled={isReadOnly}
              className="h-4 w-4 text-red-600 border-gray-300 rounded focus:ring-red-500"
            />
            <label
              htmlFor="material_selection_enabled"
              className="text-sm font-medium text-gray-700"
            >
              Material Selection Enabled
            </label>
          </div>

          <div className="flex items-center space-x-2">
            <input
              id="service_selection_enabled"
              type="checkbox"
              {...register("service_selection_enabled")}
              disabled={isReadOnly}
              className="h-4 w-4 text-red-600 border-gray-300 rounded focus:ring-red-500"
            />
            <label
              htmlFor="service_selection_enabled"
              className="text-sm font-medium text-gray-700"
            >
              Service Selection Enabled
            </label>
          </div>

          <div className="flex items-center space-x-2">
            <input
              id="sor_selection_enabled"
              type="checkbox"
              {...register("sor_selection_enabled")}
              disabled={isReadOnly}
              className="h-4 w-4 text-red-600 border-gray-300 rounded focus:ring-red-500"
            />
            <label
              htmlFor="sor_selection_enabled"
              className="text-sm font-medium text-gray-700"
            >
              SOR Selection Enabled
            </label>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompanyConfigurations;
