import React from "react";
import { useForm } from "react-hook-form";

interface RetentionDetailsFormData {
  retentionPercentage: string;
  retentionAmount: string;
  retentionReleaseCondition: string;
  retentionPeriod: string;
  releaseDate: string;
}

export default function RetentionDetails() {
  const {
    register,
    handleSubmit,
  } = useForm<RetentionDetailsFormData>();

  const onSubmit = (data: RetentionDetailsFormData) => {
    console.log("Retention Details:", data);
  };

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">Retention Details</h3>
      
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Retention Percentage (%)
            </label>
            <input
              {...register("retentionPercentage")}
              type="number"
              step="0.01"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
              placeholder="Enter retention percentage"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Retention Amount
            </label>
            <input
              {...register("retentionAmount")}
              type="number"
              step="0.01"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
              placeholder="Calculated retention amount"
              readOnly
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Retention Release Condition
            </label>
            <select
              {...register("retentionReleaseCondition")}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
            >
              <option value="">Select Condition</option>
              <option value="completion">Work Completion</option>
              <option value="defect_liability">Defect Liability Period</option>
              <option value="final_bill">Final Bill Clearance</option>
              <option value="custom">Custom Condition</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Retention Period (Months)
            </label>
            <input
              {...register("retentionPeriod")}
              type="number"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
              placeholder="Enter retention period"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Expected Release Date
            </label>
            <input
              {...register("releaseDate")}
              type="date"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
            />
          </div>
        </div>

        <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-md">
          <h4 className="font-medium text-yellow-800 mb-2">Retention Summary</h4>
          <div className="space-y-2 text-sm text-yellow-700">
            <div className="flex justify-between">
              <span>Work Order Value:</span>
              <span>₹ 0.00</span>
            </div>
            <div className="flex justify-between">
              <span>Retention %:</span>
              <span>0%</span>
            </div>
            <div className="flex justify-between font-semibold">
              <span>Retention Amount:</span>
              <span>₹ 0.00</span>
            </div>
            <div className="flex justify-between">
              <span>Net Payable:</span>
              <span>₹ 0.00</span>
            </div>
          </div>
        </div>

        <div className="mt-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Additional Terms & Conditions
          </label>
          <textarea
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
            rows={4}
            placeholder="Enter any additional terms and conditions for retention"
          />
        </div>
      </form>
    </div>
  );
}
